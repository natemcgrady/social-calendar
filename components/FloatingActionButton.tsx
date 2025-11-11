import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

interface FloatingActionButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export function FloatingActionButton({
  onPress,
  style,
}: FloatingActionButtonProps) {
  const { theme, colorScheme } = useTheme();

  // Glassmorphism colors based on theme
  const glassBg = colorScheme === "dark" 
    ? "rgba(255, 255, 255, 0.15)" 
    : "rgba(255, 255, 255, 0.25)";
  const glassBorder = colorScheme === "dark"
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.1)";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: glassBg,
          borderColor: glassBorder,
          shadowColor: colorScheme === "dark" ? "#000" : theme.colors.foreground,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons
        name="add"
        size={28}
        color={theme.colors.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    // Glassmorphism effect
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});

