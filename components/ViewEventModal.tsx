import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Event } from "./ui/calendar";
import { Ionicons } from "@expo/vector-icons";
import { EventActionsMenu } from "./EventActionsMenu";

interface ViewEventModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: () => void;
  onDelete?: () => void;
  calendarTitle?: string;
  createdBy?: string;
}

export function ViewEventModal({
  visible,
  onClose,
  event,
  onEdit,
  onDelete,
  calendarTitle,
  createdBy,
}: ViewEventModalProps) {
  const { theme } = useTheme();
  const [isActionsMenuVisible, setIsActionsMenuVisible] = useState(false);

  if (!event) return null;

  const startDate = new Date(event.from);
  const endDate = new Date(event.to);
  const isAllDay =
    format(startDate, "HH:mm") === "00:00" &&
    format(endDate, "HH:mm") === "23:59";

  const formatDateDisplay = (date: Date): string => {
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const formatTimeDisplay = (date: Date): string => {
    const minutes = date.getMinutes();
    const isRoundHour = minutes === 0;

    if (isRoundHour) {
      return format(date, "h a");
    } else {
      return format(date, "h:mm a");
    }
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
    eventTitle: {
      fontSize: 32,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.xl,
      letterSpacing: -0.5,
    },
    detailRow: {
      marginBottom: theme.spacing.lg,
    },
    detailLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xs,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.foreground,
    },
  });

  const handleDeletePress = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView
          style={styles.container}
          edges={["top", "left", "right", "bottom"]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Button variant="ghost" size="icon" onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.foreground}
                />
              </Button>
            </View>
            <View style={styles.headerRight}>
              <Button variant="ghost" size="icon" onPress={onEdit}>
                <Ionicons
                  name="pencil"
                  size={20}
                  color={theme.colors.foreground}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setIsActionsMenuVisible(true)}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={theme.colors.foreground}
                />
              </Button>
            </View>
          </View>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {formatDateDisplay(startDate)}
                {startDate.toDateString() !== endDate.toDateString()
                  ? ` - ${formatDateDisplay(endDate)}`
                  : ""}
              </Text>
            </View>

            {!isAllDay && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {formatTimeDisplay(startDate)} - {formatTimeDisplay(endDate)}
                </Text>
              </View>
            )}

            {isAllDay && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>All day</Text>
              </View>
            )}

            {createdBy && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Created by</Text>
                <Text style={styles.detailValue}>{createdBy}</Text>
              </View>
            )}

            {calendarTitle && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Calendar</Text>
                <Text style={styles.detailValue}>{calendarTitle}</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
      {onDelete && (
        <EventActionsMenu
          open={isActionsMenuVisible}
          onClose={() => setIsActionsMenuVisible(false)}
          onDeletePress={handleDeletePress}
        />
      )}
    </>
  );
}
