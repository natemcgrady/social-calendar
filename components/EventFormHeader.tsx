import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";

interface EventFormHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  isValid: boolean;
  isEditing?: boolean;
}

export function EventFormHeader({
  onCancel,
  onSave,
  isValid,
  isEditing = false,
}: EventFormHeaderProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing["4xl"],
    },
    topBarButton: {
      fontSize: 15,
      fontWeight: "500",
      letterSpacing: 0.1,
    },
  });

  return (
    <View style={styles.topBar}>
      <Button variant="ghost" onPress={onCancel}>
        <Text
          style={[
            styles.topBarButton,
            { color: theme.colors.mutedForeground },
          ]}
        >
          Cancel
        </Text>
      </Button>
      <Pressable onPress={onSave} disabled={!isValid}>
        <Text
          style={[
            styles.topBarButton,
            {
              color: isValid
                ? theme.colors.primary
                : theme.colors.mutedForeground,
            },
          ]}
        >
          {isEditing ? "Save" : "Add"}
        </Text>
      </Pressable>
    </View>
  );
}

