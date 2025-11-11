import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  Dimensions,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export const SIDEBAR_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SidebarProps {
  open: boolean;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sidebar({
  open,
  children,
  side = "left",
}: SidebarProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(
    new Animated.Value(side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH)
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : (side === "left" ? -SIDEBAR_WIDTH : SIDEBAR_WIDTH),
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, side, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          backgroundColor: theme.colors.sidebar || theme.colors.card,
          borderRightWidth: side === "left" ? 1 : 0,
          borderLeftWidth: side === "right" ? 1 : 0,
          borderColor: theme.colors.sidebarBorder || theme.colors.border,
          [side]: 0,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <SafeAreaView
        edges={side === "left" ? ["top", "bottom", "left"] : ["top", "bottom", "right"]}
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
  return <View style={[{ padding: theme.spacing.lg }, style]}>{children}</View>; // 16pt - standard padding
}

interface SidebarContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarContent({ children, style }: SidebarContentProps) {
  const { theme } = useTheme();
  return <View style={[{ flex: 1, padding: theme.spacing.lg }, style]}>{children}</View>; // 16pt - standard padding
}

interface SidebarFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SidebarFooter({ children, style }: SidebarFooterProps) {
  const { theme } = useTheme();
  return <View style={[{ padding: theme.spacing.lg }, style]}>{children}</View>; // 16pt - standard padding
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

