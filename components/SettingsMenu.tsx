import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { BottomDrawer } from "./ui/bottom-drawer";

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
  onDeletePress: () => void;
  calendarTitle: string;
}

export function SettingsMenu({
  open,
  onClose,
  onDeletePress,
  calendarTitle,
}: SettingsMenuProps) {
  const { theme } = useTheme();

  const handleDeletePress = () => {
    onClose();
    onDeletePress();
  };

  return (
    <BottomDrawer open={open} onClose={onClose} height={200}>
      <View style={[styles.container, { padding: theme.spacing.lg }]}>
        <Text style={[styles.title, { color: theme.colors.foreground }]}>
          Calendar Settings
        </Text>
        <Pressable
          onPress={handleDeletePress}
          style={({ pressed }) => [
            styles.option,
            {
              backgroundColor: pressed
                ? theme.colors.muted
                : "transparent",
            },
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color="#ef4444"
            style={styles.icon}
          />
          <Text style={[styles.optionText, { color: "#ef4444" }]}>
            Delete Calendar
          </Text>
        </Pressable>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

