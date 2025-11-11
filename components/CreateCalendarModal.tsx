import React, { useState } from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./Dialog";

interface CreateCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateCalendarModal({
  visible,
  onClose,
  onCreate,
}: CreateCalendarModalProps) {
  const { theme } = useTheme();
  const [calendarName, setCalendarName] = useState("");

  const handleCreate = () => {
    if (calendarName.trim()) {
      onCreate(calendarName.trim());
      setCalendarName("");
      onClose();
    }
  };

  const handleClose = () => {
    setCalendarName("");
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Create New Calendar</DialogTitle>
        </DialogHeader>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.input,
              color: theme.colors.foreground,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Calendar name"
          placeholderTextColor={theme.colors.mutedForeground}
          value={calendarName}
          onChangeText={setCalendarName}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          >
            <Text
              style={[
                styles.cancelButtonText,
                { color: theme.colors.foreground },
              ]}
            >
              Cancel
            </Text>
          </Button>
          <Button
            variant="default"
            onPress={handleCreate}
            disabled={!calendarName.trim()}
            style={styles.createButton}
          >
            <Text
              style={[
                styles.createButtonText,
                { color: theme.colors.primaryForeground },
              ]}
            >
              Create
            </Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
