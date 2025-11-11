import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  size?: "default" | "icon" | "icon-sm" | "icon-lg" | "sm" | "lg";
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
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.radius.md,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
      gap: 8,
    };

    // Size-specific styles
    if (size === "icon" || size === "icon-sm" || size === "icon-lg") {
      // Icon buttons have fixed square dimensions
      const iconSize = size === "icon-sm" ? 32 : size === "icon-lg" ? 40 : 36;
      return {
        ...baseStyle,
        width: iconSize,
        height: iconSize,
        padding: 0,
        minWidth: iconSize,
        minHeight: iconSize,
      };
    }

    // Regular button sizes
    const sizeStyles = {
      default: { paddingHorizontal: 16, paddingVertical: 8 },
      sm: { paddingHorizontal: 12, paddingVertical: 6 },
      lg: { paddingHorizontal: 24, paddingVertical: 10 },
    };

    const padding = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default;

    if (variant === "default") {
      return {
        ...baseStyle,
        ...padding,
        backgroundColor: theme.colors.primary,
      };
    } else if (variant === "outline") {
      return {
        ...baseStyle,
        ...padding,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    } else if (variant === "secondary") {
      return {
        ...baseStyle,
        ...padding,
        backgroundColor: theme.colors.secondary,
      };
    } else if (variant === "destructive") {
      return {
        ...baseStyle,
        ...padding,
        backgroundColor: theme.colors.destructive,
      };
    } else {
      // ghost, link
      return {
        ...baseStyle,
        ...padding,
        backgroundColor: "transparent",
      };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: 14,
      fontWeight: "500" as const,
    };

    if (variant === "default") {
      return {
        ...baseStyle,
        color: theme.colors.primaryForeground,
      };
    } else if (variant === "secondary") {
      return {
        ...baseStyle,
        color: theme.colors.secondaryForeground,
      };
    } else if (variant === "destructive") {
      return {
        ...baseStyle,
        color: theme.colors.destructiveForeground,
      };
    } else {
      return {
        ...baseStyle,
        color: theme.colors.foreground,
      };
    }
  };

  const buttonStyle = [
    getButtonStyle(),
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    getTextStyle(),
    (size === "icon" || size === "icon-sm" || size === "icon-lg") && styles.iconText,
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
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  iconText: {
    fontSize: 16,
  },
});
