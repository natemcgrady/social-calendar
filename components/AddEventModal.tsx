import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "./ui/button";
import { BottomDrawer } from "./ui/bottom-drawer";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (event: { title: string; from: string; to: string }) => void;
  onEdit?: (event: { title: string; from: string; to: string }) => void;
  initialDate?: string; // YYYY-MM-DD format
  eventToEdit?: { title: string; from: string; to: string } | null;
}

export function AddEventModal({
  visible,
  onClose,
  onAdd,
  onEdit,
  initialDate,
  eventToEdit,
}: AddEventModalProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialDate
      ? (() => {
          const [year, month, day] = initialDate.split("-").map(Number);
          return new Date(year, month - 1, day);
        })()
      : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
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
  // Local state for iOS time pickers to track current selection
  const [tempFromTime, setTempFromTime] = useState<Date>(new Date());
  const [tempToTime, setTempToTime] = useState<Date>(() => {
    const defaultToTime = new Date();
    defaultToTime.setHours(defaultToTime.getHours() + 1);
    return defaultToTime;
  });
  const [isAllDay, setIsAllDay] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [renderFromTimePicker, setRenderFromTimePicker] = useState(false);
  const [renderToTimePicker, setRenderToTimePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Track if modal just opened to set default 1-hour difference only once
  const isInitialMount = useRef(true);

  // Animation values
  const fromTimePickerOpacity = useRef(new Animated.Value(0)).current;
  const fromTimePickerScale = useRef(new Animated.Value(0)).current;
  const toTimePickerOpacity = useRef(new Animated.Value(0)).current;
  const toTimePickerScale = useRef(new Animated.Value(0)).current;

  // Initialize dates and times when modal opens
  React.useEffect(() => {
    if (visible) {
      if (eventToEdit) {
        // Populate form with event data for editing
        const fromDate = new Date(eventToEdit.from);
        const toDate = new Date(eventToEdit.to);
        setTitle(eventToEdit.title);
        setStartDate(fromDate);
        setEndDate(toDate);
        setFromTime(fromDate);
        setToTime(toDate);
        setTempFromTime(fromDate);
        setTempToTime(toDate);
        
        // Check if it's an all-day event
        const fromTimeStr = format(fromDate, "HH:mm");
        const toTimeStr = format(toDate, "HH:mm");
        setIsAllDay(fromTimeStr === "00:00" && toTimeStr === "23:59");
      } else if (initialDate) {
        const [year, month, day] = initialDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        setStartDate(date);
        setEndDate(date);
        // Set default 1-hour difference only on initial open
        if (isInitialMount.current) {
          const defaultFromTime = new Date();
          const defaultToTime = new Date();
          defaultToTime.setHours(defaultToTime.getHours() + 1);
          setFromTime(defaultFromTime);
          setToTime(defaultToTime);
          isInitialMount.current = false;
        }
      } else {
        const now = new Date();
        setStartDate(now);
        setEndDate(now);
        // Set default 1-hour difference only on initial open
        if (isInitialMount.current) {
          const defaultFromTime = new Date();
          const defaultToTime = new Date();
          defaultToTime.setHours(defaultToTime.getHours() + 1);
          setFromTime(defaultFromTime);
          setToTime(defaultToTime);
          isInitialMount.current = false;
        }
      }
    } else {
      // Reset flag when modal closes
      isInitialMount.current = true;
    }
  }, [visible, initialDate, eventToEdit]);

  // Animate from time picker
  useEffect(() => {
    if (showFromTimePicker) {
      // Initialize temp time when picker opens
      setTempFromTime(fromTime);
      setRenderFromTimePicker(true);
      Animated.parallel([
        Animated.timing(fromTimePickerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fromTimePickerScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fromTimePickerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fromTimePickerScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderFromTimePicker(false);
      });
    }
  }, [showFromTimePicker, fromTimePickerOpacity, fromTimePickerScale, fromTime]);

  // Animate to time picker
  useEffect(() => {
    if (showToTimePicker) {
      // Initialize temp time when picker opens
      setTempToTime(toTime);
      setRenderToTimePicker(true);
      Animated.parallel([
        Animated.timing(toTimePickerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toTimePickerScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(toTimePickerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toTimePickerScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderToTimePicker(false);
      });
    }
  }, [showToTimePicker, toTimePickerOpacity, toTimePickerScale, toTime]);

  const handleDateSelect = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    setStartDate(new Date(year, month - 1, dayNum));
    setShowDatePicker(false);
  };

  const handleStartDateSelect = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    const newStartDate = new Date(year, month - 1, dayNum);
    setStartDate(newStartDate);

    // Validate: if end date is before new start date, or if same date but end time is before start time
    if (endDate) {
      const startDateTime = new Date(newStartDate);
      startDateTime.setHours(fromTime.getHours());
      startDateTime.setMinutes(fromTime.getMinutes());
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(toTime.getHours());
      endDateTime.setMinutes(toTime.getMinutes());
      endDateTime.setSeconds(0);
      endDateTime.setMilliseconds(0);

      // If end is before or equal to start, adjust end time
      if (endDateTime <= startDateTime) {
        // Set end time to be 1 hour after start time
        const newToTime = new Date(fromTime);
        newToTime.setHours(newToTime.getHours() + 1);
        setToTime(newToTime);
      }
    }

    setShowStartDatePicker(false);
  };

  const handleEndDateSelect = (day: DateData) => {
    const [year, month, dayNum] = day.dateString.split("-").map(Number);
    const newEndDate = new Date(year, month - 1, dayNum);
    setEndDate(newEndDate);

    // Validate: if end date is before start date, or if same date but end time is before start time
    if (startDate) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(fromTime.getHours());
      startDateTime.setMinutes(fromTime.getMinutes());
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);

      const endDateTime = new Date(newEndDate);
      endDateTime.setHours(toTime.getHours());
      endDateTime.setMinutes(toTime.getMinutes());
      endDateTime.setSeconds(0);
      endDateTime.setMilliseconds(0);

      // If end is before or equal to start, adjust end time
      if (endDateTime <= startDateTime) {
        // Set end time to be 1 hour after start time
        const newToTime = new Date(fromTime);
        newToTime.setHours(newToTime.getHours() + 1);
        setToTime(newToTime);
      }
    }

    setShowEndDatePicker(false);
  };

  const handleFromTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowFromTimePicker(false);
      if (event.type === "dismissed") {
        return; // User cancelled
      }
    }
    if (selectedTime) {
      if (Platform.OS === "ios") {
        // On iOS, just update temp state as user spins
        setTempFromTime(selectedTime);
      } else {
        // On Android, update immediately
        setFromTime(selectedTime);
        // Validate: if end time is before new start time, adjust end time
        if (startDate && endDate) {
          // Create full date+time objects for comparison
          const startDateTime = new Date(startDate);
          startDateTime.setHours(selectedTime.getHours());
          startDateTime.setMinutes(selectedTime.getMinutes());
          startDateTime.setSeconds(0);
          startDateTime.setMilliseconds(0);

          const endDateTime = new Date(endDate);
          endDateTime.setHours(toTime.getHours());
          endDateTime.setMinutes(toTime.getMinutes());
          endDateTime.setSeconds(0);
          endDateTime.setMilliseconds(0);

          // If end is before start, adjust end time
          if (endDateTime <= startDateTime) {
            // Set end time to be 1 hour after start time
            const newToTime = new Date(selectedTime);
            newToTime.setHours(newToTime.getHours() + 1);
            setToTime(newToTime);
          }
        }
      }
    }
  };

  const handleFromTimeDone = () => {
    // Update actual time from temp time when Done is clicked
    setFromTime(tempFromTime);
    // Validate: if end time is before new start time, adjust end time
    if (startDate && endDate) {
      // Create full date+time objects for comparison
      const startDateTime = new Date(startDate);
      startDateTime.setHours(tempFromTime.getHours());
      startDateTime.setMinutes(tempFromTime.getMinutes());
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(toTime.getHours());
      endDateTime.setMinutes(toTime.getMinutes());
      endDateTime.setSeconds(0);
      endDateTime.setMilliseconds(0);

      // If end is before start, adjust end time
      if (endDateTime <= startDateTime) {
        // Set end time to be 1 hour after start time
        const newToTime = new Date(tempFromTime);
        newToTime.setHours(newToTime.getHours() + 1);
        setToTime(newToTime);
      }
    }
    setShowFromTimePicker(false);
  };

  const handleToTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowToTimePicker(false);
      if (event.type === "dismissed") {
        return; // User cancelled
      }
    }
    if (selectedTime) {
      if (Platform.OS === "ios") {
        // On iOS, just update temp state as user spins
        setTempToTime(selectedTime);
      } else {
        // On Android, update immediately
        // Validate: end time should not be before start time
        if (startDate && endDate) {
          // Create full date+time objects for comparison
          const startDateTime = new Date(startDate);
          startDateTime.setHours(fromTime.getHours());
          startDateTime.setMinutes(fromTime.getMinutes());
          startDateTime.setSeconds(0);
          startDateTime.setMilliseconds(0);

          const endDateTime = new Date(endDate);
          endDateTime.setHours(selectedTime.getHours());
          endDateTime.setMinutes(selectedTime.getMinutes());
          endDateTime.setSeconds(0);
          endDateTime.setMilliseconds(0);

          // If end is before or equal to start, don't allow it
          if (endDateTime <= startDateTime) {
            // Don't allow end time to be before start time
            // Set it to be 1 hour after start time instead
            const newToTime = new Date(fromTime);
            newToTime.setHours(newToTime.getHours() + 1);
            setToTime(newToTime);
            return;
          }
        }
        setToTime(selectedTime);
      }
    }
  };

  const handleToTimeDone = () => {
    // Update actual time from temp time when Done is clicked
    // Validate: end time should not be before start time
    if (startDate && endDate) {
      // Create full date+time objects for comparison
      const startDateTime = new Date(startDate);
      startDateTime.setHours(fromTime.getHours());
      startDateTime.setMinutes(fromTime.getMinutes());
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);

      const endDateTime = new Date(endDate);
      endDateTime.setHours(tempToTime.getHours());
      endDateTime.setMinutes(tempToTime.getMinutes());
      endDateTime.setSeconds(0);
      endDateTime.setMilliseconds(0);

      // If end is before or equal to start, don't allow it
      if (endDateTime <= startDateTime) {
        // Don't allow end time to be before start time
        // Set it to be 1 hour after start time instead
        const newToTime = new Date(fromTime);
        newToTime.setHours(newToTime.getHours() + 1);
        setToTime(newToTime);
      } else {
        setToTime(tempToTime);
      }
    } else {
      setToTime(tempToTime);
    }
    setShowToTimePicker(false);
  };

  const handleAdd = () => {
    if (title.trim() && startDate) {
      // Format dates as YYYY-MM-DD
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = endDate ? format(endDate, "yyyy-MM-dd") : startDateStr;

      let from: string;
      let to: string;

      if (isAllDay) {
        // All-day events: start at 00:00 and end at 23:59
        from = `${startDateStr}T00:00:00`;
        to = `${endDateStr}T23:59:59`;
      } else {
        // Format time as HH:MM
        const formattedFromTime = format(fromTime, "HH:mm");
        const formattedToTime = format(toTime, "HH:mm");
        from = `${startDateStr}T${formattedFromTime}:00`;
        to = `${endDateStr}T${formattedToTime}:00`;
      }

      const eventData = {
        title: title.trim(),
        from,
        to,
      };

      if (eventToEdit && onEdit) {
        onEdit(eventData);
      } else {
        onAdd(eventData);
      }

      // Reset form
      setTitle("");
      setStartDate(undefined);
      setEndDate(undefined);
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
    setStartDate(undefined);
    setEndDate(undefined);
    setIsAllDay(false);
    const resetFromTime = new Date();
    setFromTime(resetFromTime);
    const resetToTime = new Date();
    resetToTime.setHours(resetToTime.getHours() + 1);
    setToTime(resetToTime);
    setShowDatePicker(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowFromTimePicker(false);
    setShowToTimePicker(false);
    setRenderFromTimePicker(false);
    setRenderToTimePicker(false);
    fromTimePickerOpacity.setValue(0);
    fromTimePickerScale.setValue(0);
    toTimePickerOpacity.setValue(0);
    toTimePickerScale.setValue(0);
    onClose();
  };

  const isValid = title.trim() && startDate;

  const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : "";
  const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : "";
  const today = format(new Date(), "yyyy-MM-dd");

  const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    topBarButton: {
      fontSize: 15,
      fontWeight: "500",
      letterSpacing: 0.1,
    },
    form: {
      flex: 1,
    },
    titleInput: {
      fontSize: 28,
      fontWeight: "600",
      color: theme.colors.foreground,
      paddingVertical: theme.spacing.lg,
      minHeight: 64,
      letterSpacing: -0.3,
    },
    section: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    allDayRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.muted,
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
    dateTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.muted,
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
    dateTimeLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    dateTimeLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xs,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    dateTimeText: {
      fontSize: 15,
      fontWeight: "500",
    },
    dateTimeValue: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.foreground,
    },
    dateTimeValuePlaceholder: {
      color: theme.colors.mutedForeground,
    },
    calendarContainer: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.sm,
    },
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
    iosTimePickerActions: {
      marginTop: theme.spacing.md,
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    timePickerButton: {
      minWidth: 80,
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    timePickerContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    timePickerWrapper: {
      overflow: "hidden",
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
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
              {eventToEdit ? "Save" : "Add"}
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
            autoFocus={!eventToEdit}
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
              <View style={styles.dateTimeRow}>
                <Pressable
                  onPress={() => {
                    setShowEndDatePicker(false);
                    setShowToTimePicker(false);
                    setShowFromTimePicker(false);
                    setShowStartDatePicker(true);
                  }}
                  style={({ pressed }) => [
                    styles.dateTimeSection,
                    pressed && styles.dateTimeRowPressed,
                  ]}
                >
                  <View>
                    <Text style={styles.dateTimeLabel}>Start</Text>
                    <Text
                      style={[
                        styles.dateTimeValue,
                        !startDate && styles.dateTimeValuePlaceholder,
                      ]}
                    >
                      {formatDateDisplay(startDate)}
                    </Text>
                  </View>
                </Pressable>
                {startDate && (
                  <Pressable
                    onPress={() => {
                      setShowEndDatePicker(false);
                      setShowToTimePicker(false);
                      setShowStartDatePicker(false);
                      setShowFromTimePicker(true);
                    }}
                    style={({ pressed }) => [
                      styles.dateTimeSection,
                      pressed && styles.dateTimeRowPressed,
                    ]}
                  >
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.dateTimeLabel}>Time</Text>
                      <Text style={styles.dateTimeValue}>
                        {formatTimeDisplay(fromTime)}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>

              {/* Start Date Picker */}
              {showStartDatePicker && (
                <Card style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text
                      style={[
                        styles.datePickerTitle,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Select Date
                    </Text>
                    <Pressable
                      onPress={() => setShowStartDatePicker(false)}
                      style={styles.datePickerCloseButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                  <CardContent style={styles.calendarContainer}>
                    <RNCalendar
                      current={startDateString || today}
                      onDayPress={(day) => {
                        handleStartDateSelect(day);
                      }}
                      markedDates={
                        startDateString
                          ? {
                              [startDateString]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor:
                                  theme.colors.primaryForeground,
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
              )}

              {/* Start Time Picker */}
              {renderFromTimePicker && (
                <Animated.View
                  style={[
                    styles.timePickerWrapper,
                    {
                      opacity: fromTimePickerOpacity,
                      transform: [
                        {
                          scaleY: fromTimePickerScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Card style={styles.timePickerContainer}>
                    <View style={styles.datePickerHeader}>
                      <Text
                        style={[
                          styles.datePickerTitle,
                          { color: theme.colors.foreground },
                        ]}
                      >
                        Start Time
                      </Text>
                      <Pressable
                        onPress={() => setShowFromTimePicker(false)}
                        style={styles.datePickerCloseButton}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={theme.colors.mutedForeground}
                        />
                      </Pressable>
                    </View>
                    <CardContent style={{ padding: 0 }}>
                      <DateTimePicker
                        value={tempFromTime}
                        mode="time"
                        is24Hour={false}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleFromTimeChange}
                      />
                      {Platform.OS === "ios" && (
                        <View style={styles.iosTimePickerActions}>
                          <Button
                            variant="outline"
                            onPress={handleFromTimeDone}
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
                    </CardContent>
                  </Card>
                </Animated.View>
              )}

              {/* End Date/Time */}
              <View style={styles.dateTimeRow}>
                <Pressable
                  onPress={() => {
                    setShowStartDatePicker(false);
                    setShowFromTimePicker(false);
                    setShowToTimePicker(false);
                    setShowEndDatePicker(true);
                  }}
                  style={({ pressed }) => [
                    styles.dateTimeSection,
                    pressed && styles.dateTimeRowPressed,
                  ]}
                >
                  <View>
                    <Text style={styles.dateTimeLabel}>End</Text>
                    <Text
                      style={[
                        styles.dateTimeValue,
                        !endDate && styles.dateTimeValuePlaceholder,
                      ]}
                    >
                      {formatDateDisplay(endDate)}
                    </Text>
                  </View>
                </Pressable>
                {endDate && (
                  <Pressable
                    onPress={() => {
                      setShowStartDatePicker(false);
                      setShowFromTimePicker(false);
                      setShowEndDatePicker(false);
                      setShowToTimePicker(true);
                    }}
                    style={({ pressed }) => [
                      styles.dateTimeSection,
                      pressed && styles.dateTimeRowPressed,
                    ]}
                  >
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.dateTimeLabel}>Time</Text>
                      <Text style={styles.dateTimeValue}>
                        {formatTimeDisplay(toTime)}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>

              {/* End Date Picker */}
              {showEndDatePicker && (
                <Card style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text
                      style={[
                        styles.datePickerTitle,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Select Date
                    </Text>
                    <Pressable
                      onPress={() => setShowEndDatePicker(false)}
                      style={styles.datePickerCloseButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                  <CardContent style={styles.calendarContainer}>
                    <RNCalendar
                      current={endDateString || today}
                      onDayPress={(day) => {
                        handleEndDateSelect(day);
                      }}
                      markedDates={
                        endDateString
                          ? {
                              [endDateString]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor:
                                  theme.colors.primaryForeground,
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
              )}

              {/* End Time Picker */}
              {renderToTimePicker && (
                <Animated.View
                  style={[
                    styles.timePickerWrapper,
                    {
                      opacity: toTimePickerOpacity,
                      transform: [
                        {
                          scaleY: toTimePickerScale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Card style={styles.timePickerContainer}>
                    <View style={styles.datePickerHeader}>
                      <Text
                        style={[
                          styles.datePickerTitle,
                          { color: theme.colors.foreground },
                        ]}
                      >
                        End Time
                      </Text>
                      <Pressable
                        onPress={() => setShowToTimePicker(false)}
                        style={styles.datePickerCloseButton}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={theme.colors.mutedForeground}
                        />
                      </Pressable>
                    </View>
                    <CardContent style={{ padding: 0 }}>
                      <DateTimePicker
                        value={tempToTime}
                        mode="time"
                        is24Hour={false}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleToTimeChange}
                      />
                      {Platform.OS === "ios" && (
                        <View style={styles.iosTimePickerActions}>
                          <Button
                            variant="outline"
                            onPress={handleToTimeDone}
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
                    </CardContent>
                  </Card>
                </Animated.View>
              )}
            </>
          )}

          {/* All-day Date Selection */}
          {isAllDay && (
            <>
              {/* Start Date */}
              <View style={styles.dateTimeRow}>
                <Pressable
                  onPress={() => {
                    setShowEndDatePicker(false);
                    setShowStartDatePicker(true);
                  }}
                  style={({ pressed }) => [
                    styles.dateTimeSection,
                    pressed && styles.dateTimeRowPressed,
                  ]}
                >
                  <View>
                    <Text style={styles.dateTimeLabel}>Start</Text>
                    <Text
                      style={[
                        styles.dateTimeValue,
                        !startDate && styles.dateTimeValuePlaceholder,
                      ]}
                    >
                      {formatDateDisplay(startDate)}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Start Date Picker */}
              {showStartDatePicker && (
                <Card style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text
                      style={[
                        styles.datePickerTitle,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Select Date
                    </Text>
                    <Pressable
                      onPress={() => setShowStartDatePicker(false)}
                      style={styles.datePickerCloseButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                  <CardContent style={styles.calendarContainer}>
                    <RNCalendar
                      current={startDateString || today}
                      onDayPress={(day) => {
                        handleStartDateSelect(day);
                      }}
                      markedDates={
                        startDateString
                          ? {
                              [startDateString]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor:
                                  theme.colors.primaryForeground,
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
              )}

              {/* End Date */}
              <View style={styles.dateTimeRow}>
                <Pressable
                  onPress={() => {
                    setShowStartDatePicker(false);
                    setShowEndDatePicker(true);
                  }}
                  style={({ pressed }) => [
                    styles.dateTimeSection,
                    pressed && styles.dateTimeRowPressed,
                  ]}
                >
                  <View>
                    <Text style={styles.dateTimeLabel}>End</Text>
                    <Text
                      style={[
                        styles.dateTimeValue,
                        !endDate && styles.dateTimeValuePlaceholder,
                      ]}
                    >
                      {formatDateDisplay(endDate)}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* End Date Picker */}
              {showEndDatePicker && (
                <Card style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <Text
                      style={[
                        styles.datePickerTitle,
                        { color: theme.colors.foreground },
                      ]}
                    >
                      Select Date
                    </Text>
                    <Pressable
                      onPress={() => setShowEndDatePicker(false)}
                      style={styles.datePickerCloseButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                  <CardContent style={styles.calendarContainer}>
                    <RNCalendar
                      current={endDateString || today}
                      onDayPress={(day) => {
                        handleEndDateSelect(day);
                      }}
                      markedDates={
                        endDateString
                          ? {
                              [endDateString]: {
                                selected: true,
                                selectedColor: theme.colors.primary,
                                selectedTextColor:
                                  theme.colors.primaryForeground,
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
              )}
            </>
          )}
        </ScrollView>
      </View>
    </BottomDrawer>
  );
}
