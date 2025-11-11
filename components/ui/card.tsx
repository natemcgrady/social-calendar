import { useTheme } from "../../contexts/ThemeContext";
import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CardContent({ children, style }: CardContentProps) {
  const { theme } = useTheme();
  return <View style={[{ padding: theme.spacing.lg }, style]}>{children}</View>; // 16pt - standard padding
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CardFooter({ children, style }: CardFooterProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          paddingTop: theme.spacing.lg, // 16pt - standard padding
          paddingHorizontal: theme.spacing.lg, // 16pt - standard padding
          paddingBottom: theme.spacing.lg, // 16pt - standard padding
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
});
