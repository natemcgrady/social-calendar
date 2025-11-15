import React from "react";
import { View, Text, ViewStyle, TextStyle, Pressable } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  onRemove?: () => void;
  style?: ViewStyle;
}

export function Badge({
  children,
  variant = "default",
  onRemove,
  style,
}: BadgeProps) {
  const { theme } = useTheme();

  const getVariantStyles = (): {
    container: ViewStyle;
    text: TextStyle;
  } => {
    switch (variant) {
      case "secondary":
        return {
          container: {
            backgroundColor: theme.colors.muted,
          },
          text: {
            color: theme.colors.foreground,
          },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
          text: {
            color: theme.colors.foreground,
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.primaryForeground,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 9999, // Fully rounded
    ...variantStyles.container,
    ...style,
  };

  const textStyle: TextStyle = {
    fontSize: 14,
    fontWeight: "500",
    ...variantStyles.text,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{children}</Text>
      {onRemove && (
        <Pressable
          onPress={onRemove}
          style={{
            marginLeft: theme.spacing.xs,
            padding: 2,
          }}
        >
          <Text style={[textStyle, { fontSize: 16, lineHeight: 16 }]}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

