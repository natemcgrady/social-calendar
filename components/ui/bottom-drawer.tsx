import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomDrawerProps {
  open: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  height?: number; // Height of the drawer (defaults to 80% of screen)
}

export function BottomDrawer({
  open,
  children,
  onClose,
  height = SCREEN_HEIGHT * 0.92,
}: BottomDrawerProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: open ? 0 : height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: open ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, height, slideAnim, overlayOpacity]);

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
          pointerEvents={open ? "auto" : "none"}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            pointerEvents={open ? "auto" : "none"}
          />
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              height,
              backgroundColor: theme.colors.card,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView edges={["bottom"]} style={styles.drawerContent}>
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View
                style={[
                  styles.dragHandle,
                  { backgroundColor: theme.colors.muted },
                ]}
              />
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.content}
            >
              {children}
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 16,
    minHeight: 44,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
