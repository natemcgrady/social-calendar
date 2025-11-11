import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | "sm" | "lg";
  onPress?: () => void;
  style?: ViewStyle;
  title?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  onPress,
  style,
  title,
  disabled = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    size === "icon" && styles.iconButton,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    size === "icon" && styles.iconText,
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
      disabled={disabled}
    >
      {children || <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  default: {
    backgroundColor: "#000",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconButton: {
    width: 24,
    height: 24,
    padding: 0,
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  defaultText: {
    color: "#fff",
  },
  ghostText: {
    color: "#000",
  },
  outlineText: {
    color: "#000",
  },
  iconText: {
    fontSize: 16,
  },
});
