import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, CardContent } from "./card";

interface TimePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (time: Date) => void;
  onClose: () => void;
}

export function TimePickerModal({
  visible,
  value,
  onChange,
  onClose,
}: TimePickerModalProps) {
  const { theme } = useTheme();

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        onClose();
        return;
      }
      if (selectedTime) {
        onChange(selectedTime);
      }
      onClose();
    } else {
      // iOS: update time automatically as user scrolls
      if (selectedTime) {
        onChange(selectedTime);
      }
    }
  };

  if (!visible) return null;

  const styles = StyleSheet.create({
    timePickerContainer: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.xl,
      borderWidth: 0,
      backgroundColor: "transparent",
      shadowColor: "transparent",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    timePickerWrapper: {
      overflow: "hidden",
    },
    cardContent: {
      padding: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    pickerContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  });

  return (
    <View style={styles.timePickerWrapper}>
      <Card style={styles.timePickerContainer}>
        <CardContent style={styles.cardContent}>
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
