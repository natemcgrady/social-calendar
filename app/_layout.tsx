import React from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { SIDEBAR_WIDTH } from "../components/ui/sidebar";
import { useTheme } from "../contexts/ThemeContext";
import SideNav from "../components/SideNav";

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, closeSidebar } = useSidebar();
  const { theme } = useTheme();
  const contentTranslateX = React.useRef(new Animated.Value(0)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
    ]).start();
  }, [isOpen, contentTranslateX, overlayOpacity]);

  return (
    <View style={styles.container}>
      <SideNav isOpen={isOpen} closeSidebar={closeSidebar} />
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.background,
            transform: [{ translateX: contentTranslateX }],
          },
        ]}
        pointerEvents={isOpen ? "none" : "auto"}
      >
        {children}
      </Animated.View>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={isOpen ? closeSidebar : undefined}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
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
