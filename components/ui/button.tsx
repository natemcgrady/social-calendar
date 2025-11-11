import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { cva, type VariantProps } from "class-variance-authority";
import type { Theme } from "../../constants/theme";

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  title?: string;
  disabled?: boolean;
}

const buttonVariants = cva(
  "base", // Base class name (not used in RN, but required by cva)
  {
    variants: {
      variant: {
        default: "default",
        destructive: "destructive",
        outline: "outline",
        secondary: "secondary",
        ghost: "ghost",
        link: "link",
      },
      size: {
        default: "default",
        sm: "sm",
        lg: "lg",
        icon: "icon",
        "icon-sm": "icon-sm",
        "icon-lg": "icon-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Helper function to get React Native styles from buttonVariants
function getButtonStyles(
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
  size: NonNullable<VariantProps<typeof buttonVariants>["size"]>,
  theme: Theme
): { button: ViewStyle; text: TextStyle } {
  const baseButtonStyle: ViewStyle = {
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  };

  // Size-specific styles
  const sizeConfig = {
    default: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, minHeight: 36 }, // 16pt/8pt
    sm: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, minHeight: 32 }, // 12pt/4pt
    lg: { paddingHorizontal: theme.spacing["2xl"], paddingVertical: theme.spacing.sm, minHeight: 40 }, // 24pt/8pt
    icon: { width: 36, height: 36, padding: 0, minWidth: 36, minHeight: 36 },
    "icon-sm": {
      width: 32,
      height: 32,
      padding: 0,
      minWidth: 32,
      minHeight: 32,
    },
    "icon-lg": {
      width: 40,
      height: 40,
      padding: 0,
      minWidth: 40,
      minHeight: 40,
    },
  };

  const sizeStyle = sizeConfig[size || "default"] || sizeConfig.default;

  // Variant-specific styles
  const variantConfig = {
    default: {
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: theme.colors.destructive,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    link: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
  };

  const variantStyle =
    variantConfig[variant || "default"] || variantConfig.default;

  // Text color based on variant
  const textColorConfig = {
    default: theme.colors.primaryForeground,
    destructive: theme.colors.destructiveForeground,
    outline: theme.colors.foreground,
    secondary: theme.colors.secondaryForeground,
    ghost: theme.colors.foreground,
    link: theme.colors.primary,
  };

  const textColor =
    textColorConfig[variant || "default"] || textColorConfig.default;

  return {
    button: {
      ...baseButtonStyle,
      ...sizeStyle,
      ...variantStyle,
    },
    text: {
      fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
      fontWeight: "500" as const,
      color: textColor,
      ...(variant === "link" && { textDecorationLine: "underline" }),
    },
  };
}

export function Button({
  children,
  variant,
  size,
  onPress,
  style,
  title,
  disabled = false,
}: ButtonProps) {
  const { theme } = useTheme();

  // Apply defaults from buttonVariants
  // buttonVariants ensures type safety and applies defaultVariants
  const actualVariant = variant ?? "default";
  const actualSize = size ?? "default";

  const { button: baseButtonStyle, text: baseTextStyle } = getButtonStyles(
    actualVariant,
    actualSize,
    theme
  );

  const finalButtonStyle: ViewStyle[] = [
    baseButtonStyle,
    ...(disabled ? [styles.disabled] : []),
    ...(style ? (Array.isArray(style) ? style : [style]) : []),
  ];

  const finalTextStyle: TextStyle[] = [
    baseTextStyle,
    ...(((actualSize === "icon" ||
      actualSize === "icon-sm" ||
      actualSize === "icon-lg") && [styles.iconText]) ||
      []),
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        ...finalButtonStyle,
        ...(pressed && !disabled ? [styles.pressed] : []),
      ]}
      disabled={disabled}
    >
      {children || <Text style={finalTextStyle}>{title}</Text>}
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
