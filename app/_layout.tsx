import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  PanResponder,
} from "react-native";
import { Stack, useSegments } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { CalendarProvider } from "../contexts/CalendarContext";
import { ToastProvider } from "../contexts/ToastContext";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { SIDEBAR_WIDTH } from "../components/ui/sidebar";
import { useTheme } from "../contexts/ThemeContext";
import SideNav from "../components/SideNav";

const EDGE_SWIPE_THRESHOLD = 20; // Distance from left edge to trigger swipe
const SWIPE_VELOCITY_THRESHOLD = 0.5; // Minimum velocity to trigger swipe
const SWIPE_DISTANCE_THRESHOLD = SIDEBAR_WIDTH * 0.3; // 30% of sidebar width

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, closeSidebar, openSidebar } = useSidebar();
  const { theme } = useTheme();
  const segments = useSegments();
  const contentTranslateX = React.useRef(new Animated.Value(0)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const isDragging = React.useRef(false);
  const dragStartX = React.useRef(0);
  const currentTranslateX = React.useRef(0);

  // Check if we're on the calendar screen
  const isCalendarScreen = segments[0] === "calendar";

  // Close sidebar when navigating to calendar screen
  React.useEffect(() => {
    if (isCalendarScreen && isOpen) {
      closeSidebar();
    }
  }, [isCalendarScreen, isOpen, closeSidebar]);

  // Update current translate value when animation completes
  React.useEffect(() => {
    if (!isDragging.current) {
      currentTranslateX.current = isOpen ? SIDEBAR_WIDTH : 0;
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isDragging.current) {
      Animated.parallel([
        Animated.timing(contentTranslateX, {
          toValue: isOpen ? SIDEBAR_WIDTH : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: isOpen ? 0.5 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        currentTranslateX.current = isOpen ? SIDEBAR_WIDTH : 0;
      });
    }
  }, [isOpen, contentTranslateX, overlayOpacity]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          // Disable sidebar gestures on calendar screen
          if (isCalendarScreen) return false;

          // Allow pan responder when sidebar is open (to close it)
          if (isOpen) return true;

          // Allow pan responder when starting from left edge (to open sidebar)
          const { locationX } = evt.nativeEvent;
          return locationX < EDGE_SWIPE_THRESHOLD;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // Disable sidebar gestures on calendar screen
          if (isCalendarScreen) return false;

          // If sidebar is open, allow horizontal swipes to close
          if (isOpen && Math.abs(gestureState.dx) > 10) {
            return true;
          }
          // If sidebar is closed, allow swipes from left edge
          const { locationX } = evt.nativeEvent;
          if (locationX < EDGE_SWIPE_THRESHOLD && gestureState.dx > 10) {
            return true;
          }
          return false;
        },
        onPanResponderGrant: (evt, gestureState) => {
          isDragging.current = true;
          // Set initial drag start position from current value
          dragStartX.current = currentTranslateX.current;
          // Stop any ongoing animations and sync the current value
          contentTranslateX.stopAnimation((value) => {
            currentTranslateX.current = value;
            dragStartX.current = value; // Update in case animation was in progress
          });
        },
        onPanResponderMove: (evt, gestureState) => {
          if (!isDragging.current) return;

          let newTranslateX = dragStartX.current + gestureState.dx;

          // Clamp the translation
          if (isOpen) {
            // When open, only allow dragging left (negative dx)
            newTranslateX = Math.max(0, Math.min(SIDEBAR_WIDTH, newTranslateX));
          } else {
            // When closed, only allow dragging right (positive dx)
            newTranslateX = Math.max(0, Math.min(SIDEBAR_WIDTH, newTranslateX));
          }

          currentTranslateX.current = newTranslateX;

          // Update animations
          contentTranslateX.setValue(newTranslateX);
          overlayOpacity.setValue((newTranslateX / SIDEBAR_WIDTH) * 0.5);
        },
        onPanResponderRelease: (evt, gestureState) => {
          isDragging.current = false;

          if (isOpen) {
            // If sidebar is open, close if dragged left past threshold or with sufficient leftward velocity
            const shouldClose =
              gestureState.dx < -SWIPE_DISTANCE_THRESHOLD ||
              gestureState.vx < -SWIPE_VELOCITY_THRESHOLD;

            if (shouldClose) {
              closeSidebar();
            } else {
              // Snap back to open state
              Animated.parallel([
                Animated.timing(contentTranslateX, {
                  toValue: SIDEBAR_WIDTH,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                  toValue: 0.5,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                currentTranslateX.current = SIDEBAR_WIDTH;
              });
            }
          } else {
            // If sidebar is closed, open if dragged right past threshold or with sufficient rightward velocity
            const shouldOpen =
              gestureState.dx > SWIPE_DISTANCE_THRESHOLD ||
              gestureState.vx > SWIPE_VELOCITY_THRESHOLD;

            if (shouldOpen) {
              openSidebar();
            } else {
              // Snap back to closed state
              Animated.parallel([
                Animated.timing(contentTranslateX, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                currentTranslateX.current = 0;
              });
            }
          }
        },
      }),
    [
      isOpen,
      closeSidebar,
      openSidebar,
      contentTranslateX,
      overlayOpacity,
      isCalendarScreen,
    ]
  );

  return (
    <View style={styles.container}>
      {!isCalendarScreen && (
        <SideNav
          isOpen={isOpen}
          closeSidebar={closeSidebar}
          dragTranslateX={contentTranslateX}
        />
      )}
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.background,
            transform: [
              { translateX: isCalendarScreen ? 0 : contentTranslateX },
            ],
          },
        ]}
        pointerEvents={
          isOpen && !isDragging.current && !isCalendarScreen ? "none" : "auto"
        }
        {...(!isOpen && !isCalendarScreen ? panResponder.panHandlers : {})}
      >
        {children}
      </Animated.View>
      {!isCalendarScreen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
          {...(isOpen ? panResponder.panHandlers : {})}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            // onPress={isOpen && !isDragging.current ? closeSidebar : undefined}
            pointerEvents={isOpen && !isDragging.current ? "auto" : "none"}
            hitSlop={0}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CalendarProvider>
        <ToastProvider>
          <SidebarProvider>
            <SidebarLayout>
              <Stack
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                  animation: "slide_from_right",
                }}
              />
            </SidebarLayout>
          </SidebarProvider>
        </ToastProvider>
      </CalendarProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 999,
  },
});
