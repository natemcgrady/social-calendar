import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { format } from "date-fns";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Event } from "./ui/calendar";

interface ViewEventModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: () => void;
}

export function ViewEventModal({
  visible,
  onClose,
  event,
  onEdit,
}: ViewEventModalProps) {
  const { theme } = useTheme();

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
    return format(date, "h:mm a");
  };

  const styles = StyleSheet.create({
    content: {
      padding: theme.spacing.lg,
    },
    eventTitle: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.lg,
      flexShrink: 1,
    },
    detailRow: {
      marginBottom: theme.spacing.md,
      flexShrink: 1,
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
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.foreground,
      flexShrink: 1,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: theme.spacing.md,
    },
  });

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent onClose={onClose} style={styles.content}>
        <DialogHeader>
          <DialogTitle style={styles.eventTitle}>{event.title}</DialogTitle>
        </DialogHeader>

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

        <DialogFooter style={styles.footer}>
          <Button variant="outline" onPress={onClose}>
            <Text style={{ color: theme.colors.foreground }}>Close</Text>
          </Button>
          <Button onPress={onEdit}>
            <Text style={{ color: theme.colors.primaryForeground }}>Edit</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

