import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "./ui/button";
import { BottomDrawer } from "./ui/bottom-drawer";
import { Switch } from "./ui/switch";

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (event: { title: string; from: string; to: string }) => void;
  initialDate?: string; // YYYY-MM-DD format
}

export function AddEventModal({
  visible,
  onClose,
  onAdd,
  initialDate,
}: AddEventModalProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
      ? (() => {
          const [year, month, day] = initialDate.split("-").map(Number);
          return new Date(year, month - 1, day);
        })()
      : undefined
  );
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>(() => {
    const defaultToTime = new Date();
    defaultToTime.setHours(defaultToTime.getHours() + 1);
    return defaultToTime;
  });
  const [isAllDay, setIsAllDay] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);

  // Update selected date when initialDate changes or modal opens
  React.useEffect(() => {
    if (visible && initialDate) {
      const [year, month, day] = initialDate.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [visible, initialDate]);

  const handleDateSelect = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    setSelectedDate(new Date(year, month - 1, dayNum));
    setShowDatePicker(false);
  };

  const handleFromTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowFromTimePicker(false);
      if (event.type === "dismissed") {
        return; // User cancelled
      }
    }
    if (selectedTime) {
      setFromTime(selectedTime);
      // Update end time to be 1 hour after start time
      const newToTime = new Date(selectedTime);
      newToTime.setHours(newToTime.getHours() + 1);
      setToTime(newToTime);
    }
  };

  const handleToTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowToTimePicker(false);
      if (event.type === "dismissed") {
        return; // User cancelled
      }
    }
    if (selectedTime) {
      setToTime(selectedTime);
    }
  };

  const handleAdd = () => {
    if (title.trim() && selectedDate) {
      // Format date as YYYY-MM-DD
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      let from: string;
      let to: string;

      if (isAllDay) {
        // All-day events: start at 00:00 and end at 23:59
        from = `${dateStr}T00:00:00`;
        to = `${dateStr}T23:59:59`;
      } else {
        // Format time as HH:MM
        const formattedFromTime = format(fromTime, "HH:mm");
        const formattedToTime = format(toTime, "HH:mm");
        from = `${dateStr}T${formattedFromTime}:00`;
        to = `${dateStr}T${formattedToTime}:00`;
      }

      onAdd({
        title: title.trim(),
        from,
        to,
      });

      // Reset form
      setTitle("");
      setSelectedDate(undefined);
      setIsAllDay(false);
      const resetFromTime = new Date();
      setFromTime(resetFromTime);
      const resetToTime = new Date();
      resetToTime.setHours(resetToTime.getHours() + 1);
      setToTime(resetToTime);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setSelectedDate(undefined);
    setIsAllDay(false);
    const resetFromTime = new Date();
    setFromTime(resetFromTime);
    const resetToTime = new Date();
    resetToTime.setHours(resetToTime.getHours() + 1);
    setToTime(resetToTime);
    setShowDatePicker(false);
    setShowFromTimePicker(false);
    setShowToTimePicker(false);
    onClose();
  };

  const isValid = title.trim() && selectedDate;

  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const today = format(new Date(), "yyyy-MM-dd");

  const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    topBarButton: {
      fontSize: 16,
      fontWeight: "500",
    },
    form: {
      flex: 1,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.foreground,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      minHeight: 56,
    },
    allDayRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: theme.spacing.sm,
    },
    allDayLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    clockIcon: {
      marginRight: theme.spacing.sm,
    },
    allDayText: {
      fontSize: 16,
    },
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dateTimeText: {
      fontSize: 16,
    },
    calendarContainer: {
      paddingVertical: theme.spacing.md,
    },
    datePickerContainer: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      overflow: "hidden",
    },
    datePickerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    datePickerTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    iosTimePickerActions: {
      marginTop: theme.spacing.sm,
      alignItems: "flex-end",
    },
    timePickerButton: {
      minWidth: 80,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
  });

  // Format date as "Tuesday, Nov 11"
  const formatDateDisplay = (date: Date | undefined): string => {
    if (!date) return "Select date";
    return format(date, "EEEE, MMM d");
  };

  // Format time as "5 PM"
  const formatTimeDisplay = (time: Date): string => {
    return format(time, "h a");
  };

  return (
    <BottomDrawer open={visible} onClose={handleClose}>
      <View style={styles.drawerContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={handleClose}>
            <Text
              style={[
                styles.topBarButton,
                { color: theme.colors.mutedForeground },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
          <Pressable onPress={handleAdd} disabled={!isValid}>
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
              Save
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Add title"
            placeholderTextColor={theme.colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          {/* All-day Toggle */}
          <View style={styles.allDayRow}>
            <View style={styles.allDayLeft}>
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.foreground}
                style={styles.clockIcon}
              />
              <Text
                style={[styles.allDayText, { color: theme.colors.foreground }]}
              >
                All-day
              </Text>
            </View>
            <Switch value={isAllDay} onValueChange={setIsAllDay} />
          </View>

          {/* Date and Time Fields */}
          {!isAllDay && (
            <>
              {/* Start Date/Time */}
              <Pressable
                onPress={() => {
                  if (!selectedDate) {
                    setShowDatePicker(true);
                  } else {
                    setShowFromTimePicker(true);
                  }
                }}
              >
                <View style={styles.dateTimeRow}>
                  <Text
                    style={[
                      styles.dateTimeText,
                      { color: theme.colors.foreground },
                    ]}
                  >
                    {formatDateDisplay(selectedDate)}
                  </Text>
                  {selectedDate && (
                    <Text
                      style={[
                        styles.dateTimeText,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      {formatTimeDisplay(fromTime)}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* End Date/Time */}
              <Pressable
                onPress={() => {
                  if (!selectedDate) {
                    setShowDatePicker(true);
                  } else {
                    setShowToTimePicker(true);
                  }
                }}
              >
                <View style={styles.dateTimeRow}>
                  <Text
                    style={[
                      styles.dateTimeText,
                      { color: theme.colors.foreground },
                    ]}
                  >
                    {formatDateDisplay(selectedDate)}
                  </Text>
                  {selectedDate && (
                    <Text
                      style={[
                        styles.dateTimeText,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      {formatTimeDisplay(toTime)}
                    </Text>
                  )}
                </View>
              </Pressable>
            </>
          )}

          {/* All-day Date Selection */}
          {isAllDay && (
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View style={styles.dateTimeRow}>
                <Text
                  style={[
                    styles.dateTimeText,
                    { color: theme.colors.foreground },
                  ]}
                >
                  {formatDateDisplay(selectedDate)}
                </Text>
              </View>
            </Pressable>
          )}

          {/* Date Picker - Inline when open */}
          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text
                  style={[
                    styles.datePickerTitle,
                    { color: theme.colors.foreground },
                  ]}
                >
                  Select Date
                </Text>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.foreground}
                  />
                </Pressable>
              </View>
              <View style={styles.calendarContainer}>
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
                    textDayFontWeight: "400",
                    textMonthFontWeight: "600",
                    textDayHeaderFontWeight: "500",
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 12,
                  }}
                />
              </View>
            </View>
          )}
          {/* Time Pickers (hidden, triggered by date/time row presses) */}
          {showFromTimePicker && (
            <>
              <DateTimePicker
                value={fromTime}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleFromTimeChange}
              />
              {Platform.OS === "ios" && (
                <View style={styles.iosTimePickerActions}>
                  <Button
                    variant="outline"
                    onPress={() => setShowFromTimePicker(false)}
                    style={styles.timePickerButton}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Done
                    </Text>
                  </Button>
                </View>
              )}
            </>
          )}

          {showToTimePicker && (
            <>
              <DateTimePicker
                value={toTime}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleToTimeChange}
              />
              {Platform.OS === "ios" && (
                <View style={styles.iosTimePickerActions}>
                  <Button
                    variant="outline"
                    onPress={() => setShowToTimePicker(false)}
                    style={styles.timePickerButton}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Done
                    </Text>
                  </Button>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </BottomDrawer>
  );
}
