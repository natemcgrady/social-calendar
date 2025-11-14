import React from "react";
import { TextInput, StyleSheet, View, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Ionicons } from "@expo/vector-icons";
import { DatePickerModal } from "./ui/date-picker-modal";
import { TimePickerModal } from "./ui/time-picker-modal";
import { DateTimeRow } from "./DateTimeRow";
import { AllDayToggle } from "./AllDayToggle";
import { useEventForm } from "../hooks/useEventForm";

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
  const form = useEventForm({ visible, initialDate, eventToEdit });

  const handleAdd = () => {
    const eventData = form.formatEventData();
    if (eventData) {
      if (eventToEdit && onEdit) {
        onEdit(eventData);
      } else {
        onAdd(eventData);
      }
      form.resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  const closeAllPickers = () => {
    form.setShowStartDatePicker(false);
    form.setShowEndDatePicker(false);
    form.setShowFromTimePicker(false);
    form.setShowToTimePicker(false);
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    titleInput: {
      fontSize: 32,
      fontWeight: "600",
      color: theme.colors.foreground,
      paddingHorizontal: theme.spacing.lg,
      letterSpacing: -0.5,
    },
    dateTimeContainer: {
      marginTop: theme.spacing.md,
    },
  });

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView
          style={styles.container}
          edges={["top", "left", "right", "bottom"]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Button variant="ghost" size="icon" onPress={handleClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.foreground}
                />
              </Button>
            </View>
            <View style={styles.headerRight}>
              <Button
                variant="ghost"
                size="icon"
                onPress={handleAdd}
                disabled={!form.isValid}
              >
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={
                    form.isValid
                      ? theme.colors.primary
                      : theme.colors.mutedForeground
                  }
                />
              </Button>
            </View>
          </View>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Add title"
              placeholderTextColor={theme.colors.mutedForeground}
              value={form.title}
              onChangeText={form.setTitle}
              autoFocus={!eventToEdit}
            />

            <View style={styles.dateTimeContainer}>
              <AllDayToggle
                value={form.isAllDay}
                onValueChange={form.setIsAllDay}
              />

              {!form.isAllDay && (
                <>
                  <DateTimeRow
                    date={form.startDate}
                    time={form.fromTime}
                    showTime={!!form.startDate}
                    onDatePress={() => {
                      closeAllPickers();
                      form.setShowStartDatePicker(true);
                    }}
                    onTimePress={() => {
                      closeAllPickers();
                      form.setShowFromTimePicker(true);
                    }}
                  />

                  <DatePickerModal
                    visible={form.showStartDatePicker && !form.isAllDay}
                    selectedDate={form.startDate}
                    onDateSelect={form.handleStartDateSelect}
                    onClose={() => form.setShowStartDatePicker(false)}
                  />

                  <TimePickerModal
                    visible={form.showFromTimePicker}
                    value={form.fromTime}
                    onChange={form.setTempFromTime}
                    onClose={form.handleFromTimeDone}
                  />

                  <DateTimeRow
                    date={form.endDate}
                    time={form.toTime}
                    showTime={!!form.endDate}
                    onDatePress={() => {
                      closeAllPickers();
                      form.setShowEndDatePicker(true);
                    }}
                    onTimePress={() => {
                      closeAllPickers();
                      form.setShowToTimePicker(true);
                    }}
                  />

                  <DatePickerModal
                    visible={form.showEndDatePicker}
                    selectedDate={form.endDate}
                    onDateSelect={form.handleEndDateSelect}
                    onClose={() => form.setShowEndDatePicker(false)}
                  />

                  <TimePickerModal
                    visible={form.showToTimePicker}
                    value={form.toTime}
                    onChange={form.setTempToTime}
                    onClose={form.handleToTimeDone}
                  />
                </>
              )}

              {form.isAllDay && (
                <>
                  <DateTimeRow
                    date={form.startDate}
                    onDatePress={() => {
                      closeAllPickers();
                      form.setShowStartDatePicker(true);
                    }}
                  />

                  <DatePickerModal
                    visible={form.showStartDatePicker && form.isAllDay}
                    selectedDate={form.startDate}
                    onDateSelect={form.handleStartDateSelect}
                    onClose={() => form.setShowStartDatePicker(false)}
                  />

                  <DateTimeRow
                    date={form.endDate}
                    onDatePress={() => {
                      closeAllPickers();
                      form.setShowEndDatePicker(true);
                    }}
                  />

                  <DatePickerModal
                    visible={form.showEndDatePicker && form.isAllDay}
                    selectedDate={form.endDate}
                    onDateSelect={form.handleEndDateSelect}
                    onClose={() => form.setShowEndDatePicker(false)}
                  />
                </>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
