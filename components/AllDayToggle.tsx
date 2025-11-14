import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Switch } from "./ui/switch";

interface AllDayToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function AllDayToggle({ value, onValueChange }: AllDayToggleProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    allDayRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.lg,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    allDayLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    clockIcon: {
      marginRight: theme.spacing.md,
    },
    allDayText: {
      fontSize: 15,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.allDayRow}>
      <View style={styles.allDayLeft}>
        <Ionicons
          name="time-outline"
          size={20}
          color={theme.colors.foreground}
          style={styles.clockIcon}
        />
        <Text style={[styles.allDayText, { color: theme.colors.foreground }]}>
          All-day
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
