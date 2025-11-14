import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { BottomDrawer } from "./ui/bottom-drawer";

interface EventActionsMenuProps {
  open: boolean;
  onClose: () => void;
  onDeletePress: () => void;
}

export function EventActionsMenu({
  open,
  onClose,
  onDeletePress,
}: EventActionsMenuProps) {
  const { theme } = useTheme();

  const handleDeletePress = () => {
    onClose();
    onDeletePress();
  };

  return (
    <BottomDrawer open={open} onClose={onClose} height={150}>
      <View style={[styles.container, { padding: theme.spacing.lg }]}>
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
            Delete Event
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

