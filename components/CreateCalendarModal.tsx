import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { Ionicons } from "@expo/vector-icons";

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Card style={styles.modal}>
              <CardContent>
                <View style={styles.header}>
                  <Text
                    style={[styles.title, { color: theme.colors.foreground }]}
                  >
                    Create New Calendar
                  </Text>
                  <Button variant="ghost" size="icon-sm" onPress={handleClose}>
                    <Ionicons
                      name="close"
                      size={20}
                      color={theme.colors.foreground}
                    />
                  </Button>
                </View>
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
                <View style={styles.actions}>
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
                </View>
              </CardContent>
            </Card>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  keyboardView: {
    width: "100%",
    maxWidth: 400,
  },
  modal: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
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
