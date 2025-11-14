import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Platform,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface TimePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (time: Date) => void;
  onClose: () => void;
  title?: string;
}

export function TimePickerModal({
  visible,
  value,
  onChange,
  onClose,
  title = "Select Time",
}: TimePickerModalProps) {
  const { theme } = useTheme();
  const [tempTime, setTempTime] = useState<Date>(value);
  const [renderPicker, setRenderPicker] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setTempTime(value);
      setRenderPicker(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderPicker(false);
      });
    }
  }, [visible, value, opacity, scale]);

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
      // iOS: update temp time as user spins
      if (selectedTime) {
        setTempTime(selectedTime);
        onChange(selectedTime); // Update parent's temp time
      }
    }
  };

  const handleDone = () => {
    onChange(tempTime);
    onClose();
  };

  if (!renderPicker) return null;

  const styles = StyleSheet.create({
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
  });

  return (
    <Animated.View
      style={[
        styles.timePickerWrapper,
        {
          opacity,
          transform: [
            {
              scaleY: scale.interpolate({
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
        <CardContent style={{ padding: 0 }}>
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
          {Platform.OS === "ios" && (
            <View style={styles.iosTimePickerActions}>
              <Button
                variant="outline"
                onPress={handleDone}
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
  );
}
