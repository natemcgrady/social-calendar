import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  Dimensions,
  PanResponder,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const SIDEBAR_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const SWIPE_DISTANCE_THRESHOLD = SIDEBAR_WIDTH * 0.3;

interface SidebarProps {
  open: boolean;
  children: React.ReactNode;
  side?: "left" | "right";
  onClose?: () => void;
  dragTranslateX?: Animated.Value; // Optional animated value from parent for synchronized dragging
}

export function Sidebar({ open, children, side = "left", onClose, dragTranslateX }: SidebarProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(
    new Animated.Value(side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH)
  ).current;
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const currentTranslateX = useRef(side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH);

  // If dragTranslateX is provided, derive sidebar position from it
  const sidebarPosition = useMemo(() => {
    if (dragTranslateX) {
      // For left sidebar: when contentTranslateX is 0, sidebar is at -SIDEBAR_WIDTH (hidden)
      // When contentTranslateX is SIDEBAR_WIDTH, sidebar is at 0 (visible)
      return dragTranslateX.interpolate({
        inputRange: [0, SIDEBAR_WIDTH],
        outputRange: side === "left" ? [-SIDEBAR_WIDTH, 0] : [SIDEBAR_WIDTH, 0],
        extrapolate: 'clamp',
      });
    }
    return slideAnim;
  }, [dragTranslateX, side, slideAnim]);

  useEffect(() => {
    // Only animate if we're not using the dragTranslateX (which handles its own animation)
    if (!isDragging.current && !dragTranslateX) {
      const targetValue = open ? 0 : side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH;
      Animated.timing(slideAnim, {
        toValue: targetValue,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        currentTranslateX.current = targetValue;
      });
    }
  }, [open, side, slideAnim, dragTranslateX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => open, // Only allow dragging when open
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!open) return false;
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (!open) return;
        isDragging.current = true;
        dragStartX.current = currentTranslateX.current;
        slideAnim.stopAnimation((value) => {
          currentTranslateX.current = value;
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isDragging.current || !open) return;
        
        let newTranslateX = dragStartX.current + gestureState.dx;
        
        // Clamp the translation based on side
        if (side === "left") {
          // For left sidebar, only allow dragging left (negative dx)
          newTranslateX = Math.max(-SIDEBAR_WIDTH, Math.min(0, newTranslateX));
        } else {
          // For right sidebar, only allow dragging right (positive dx)
          newTranslateX = Math.max(0, Math.min(SIDEBAR_WIDTH, newTranslateX));
        }
        
        currentTranslateX.current = newTranslateX;
        slideAnim.setValue(newTranslateX);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!isDragging.current || !open) return;
        isDragging.current = false;
        
        const shouldClose = (() => {
          if (side === "left") {
            // For left sidebar, close if dragged left past threshold
            return gestureState.dx < -SWIPE_DISTANCE_THRESHOLD || 
                   gestureState.vx < -SWIPE_VELOCITY_THRESHOLD;
          } else {
            // For right sidebar, close if dragged right past threshold
            return gestureState.dx > SWIPE_DISTANCE_THRESHOLD || 
                   gestureState.vx > SWIPE_VELOCITY_THRESHOLD;
          }
        })();

        if (shouldClose && onClose) {
          onClose();
        } else {
          // Snap back to open state
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            currentTranslateX.current = 0;
          });
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          backgroundColor: theme.colors.sidebar || theme.colors.card,
          [side]: 0,
          transform: [{ translateX: sidebarPosition }],
        },
      ]}
      {...(open && !dragTranslateX ? panResponder.panHandlers : {})}
    >
      <SafeAreaView
        edges={
          side === "left"
            ? ["top", "bottom", "left"]
            : ["top", "bottom", "right"]
        }
        style={styles.sidebarContent}
      >
        {children}
      </SafeAreaView>
    </Animated.View>
  );
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarHeader({ children, style }: SidebarHeaderProps) {
  const { theme } = useTheme();
  return <View style={[{ padding: theme.spacing.lg }, style]}>{children}</View>;
}

interface SidebarContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarContent({ children, style }: SidebarContentProps) {
  const { theme } = useTheme();
  return (
    <View style={[{ flex: 1, padding: theme.spacing.lg }, style]}>
      {children}
    </View>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarFooter({ children, style }: SidebarFooterProps) {
  const { theme } = useTheme();
  return <View style={[{ padding: theme.spacing.lg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    maxWidth: SCREEN_WIDTH * 0.85,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebarContent: {
    flex: 1,
  },
});
