import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, CardContent } from "./card";

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  title?: string;
}

export function DatePickerModal({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
  title = "Select Date",
}: DatePickerModalProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const today = format(new Date(), "yyyy-MM-dd");

  const handleDateSelect = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    onDateSelect(new Date(year, month - 1, dayNum));
    onClose();
  };

  const styles = StyleSheet.create({
    datePickerContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    datePickerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.muted,
    },
    datePickerTitle: {
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: 0.1,
    },
    datePickerCloseButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.radius.md,
    },
    calendarContainer: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.sm,
    },
  });

  return (
    <Card style={styles.datePickerContainer}>
      <View style={styles.datePickerHeader}>
        <Text
          style={[styles.datePickerTitle, { color: theme.colors.foreground }]}
        >
          {title}
        </Text>
        <Pressable onPress={onClose} style={styles.datePickerCloseButton}>
          <Ionicons
            name="close"
            size={20}
            color={theme.colors.mutedForeground}
          />
        </Pressable>
      </View>
      <CardContent style={styles.calendarContainer}>
        <RNCalendar
          current={dateString || today}
          onDayPress={handleDateSelect}
          markedDates={
            dateString
              ? {
                  [dateString]: {
                    selected: true,
                    selectedColor: theme.colors.primary,
                    selectedTextColor: theme.colors.primaryForeground,
                  },
                }
              : {}
          }
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: theme.colors.mutedForeground,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.primaryForeground,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.foreground,
            textDisabledColor: theme.colors.mutedForeground,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.primaryForeground,
            arrowColor: theme.colors.foreground,
            monthTextColor: theme.colors.foreground,
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 15,
            textMonthFontSize: 17,
            textDayHeaderFontSize: 13,
          }}
        />
      </CardContent>
    </Card>
  );
}
