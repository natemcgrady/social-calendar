import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

