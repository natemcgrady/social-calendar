import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DeleteCalendarConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  calendarTitle: string;
  asOverlay?: boolean; // If true, renders as View overlay instead of Modal
}

export function DeleteCalendarConfirmationDialog({
  open,
  onClose,
  onConfirm,
  calendarTitle,
  asOverlay = false,
}: DeleteCalendarConfirmationDialogProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: open ? 0 : SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: open ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, slideAnim, overlayOpacity]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const content = (
    <View style={asOverlay ? styles.overlayContainer : styles.container}>
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: theme.radius.lg,
            borderTopRightRadius: theme.radius.lg,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
          {/* Question Text */}
          <View style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: theme.colors.foreground }]}>
              Are you sure you want to delete this calendar?
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.deleteButton,
                {
                  backgroundColor: pressed
                    ? theme.colors.destructive + "20"
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.deleteButtonText,
                  { color: theme.colors.destructive || "#ef4444" },
                ]}
              >
                Delete calendar
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: pressed
                    ? theme.colors.muted
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.primary || "#3b82f6" },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );

  if (asOverlay) {
    if (!open) return null;
    return content;
  }

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
    elevation: 10000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    paddingBottom: 0,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  questionContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 12,
  },
  deleteButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

