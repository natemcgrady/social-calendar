import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { format } from "date-fns";

interface DateTimeRowProps {
  date?: Date;
  time?: Date;
  onDatePress?: () => void;
  onTimePress?: () => void;
  showTime?: boolean;
}

export function DateTimeRow({
  date,
  time,
  onDatePress,
  onTimePress,
  showTime = false,
}: DateTimeRowProps) {
  const { theme } = useTheme();

  const formatDateDisplay = (date: Date | undefined): string => {
    if (!date) return "Select date";
    return format(date, "EEEE, MMM d");
  };

  const formatTimeDisplay = (time: Date): string => {
    return format(time, "h a");
  };

  const styles = StyleSheet.create({
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.lg,
      marginTop: theme.spacing.xs,
      minHeight: 56,
    },
    dateTimeRowPressed: {
      opacity: 0.7,
    },
    dateTimeSection: {
      flex: 1,
      paddingVertical: theme.spacing.xs,
    },
    dateTimeValue: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.foreground,
    },
    dateTimeValuePlaceholder: {
      color: theme.colors.mutedForeground,
    },
  });

  return (
    <View style={styles.dateTimeRow}>
      {onDatePress && (
        <Pressable
          onPress={onDatePress}
          style={({ pressed }) => [
            styles.dateTimeSection,
            pressed && styles.dateTimeRowPressed,
          ]}
        >
          <View>
            <Text
              style={[
                styles.dateTimeValue,
                !date && styles.dateTimeValuePlaceholder,
              ]}
            >
              {formatDateDisplay(date)}
            </Text>
          </View>
        </Pressable>
      )}
      {showTime && time && onTimePress && (
        <Pressable
          onPress={onTimePress}
          style={({ pressed }) => [
            styles.dateTimeSection,
            pressed && styles.dateTimeRowPressed,
          ]}
        >
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.dateTimeValue}>{formatTimeDisplay(time)}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
