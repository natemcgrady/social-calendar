import React from "react";
import { Text, TextInput, StyleSheet, View, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { BottomDrawer } from "./ui/bottom-drawer";
import { DatePickerModal } from "./ui/date-picker-modal";
import { TimePickerModal } from "./ui/time-picker-modal";
import { DateTimeRow } from "./DateTimeRow";
import { AllDayToggle } from "./AllDayToggle";
import { EventFormHeader } from "./EventFormHeader";
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
    drawerContent: {
      flex: 1,
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
      paddingHorizontal: theme.spacing["4xl"],
    },
    titleDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      width: "100%",
    },
    dateTimeContainer: {
      paddingHorizontal: theme.spacing["4xl"],
    },
  });

  return (
    <BottomDrawer open={visible} onClose={handleClose}>
      <View style={styles.drawerContent}>
        <EventFormHeader
          onCancel={handleClose}
          onSave={handleAdd}
          isValid={form.isValid}
          isEditing={!!eventToEdit}
        />

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.titleInput}
            placeholder="Add title"
            placeholderTextColor={theme.colors.mutedForeground}
            value={form.title}
            onChangeText={form.setTitle}
            autoFocus={!eventToEdit}
          />
          <View style={styles.titleDivider} />

          <View style={styles.dateTimeContainer}>
            <AllDayToggle
              value={form.isAllDay}
              onValueChange={form.setIsAllDay}
            />

            {!form.isAllDay && (
              <>
                <DateTimeRow
                  label="Start"
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
                  title="Start Time"
                />

                <DateTimeRow
                  label="End"
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
                  title="End Time"
                />
              </>
            )}

            {form.isAllDay && (
              <>
                <DateTimeRow
                  label="Start"
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
                  label="End"
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
      </View>
    </BottomDrawer>
  );
}
