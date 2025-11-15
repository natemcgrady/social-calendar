import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Theme } from "../constants/theme";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profile: { name: string; email: string }) => void;
  initialName: string;
  initialEmail?: string;
}

export function EditProfileModal({
  visible,
  onClose,
  onSave,
  initialName,
  initialEmail = "",
}: EditProfileModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setEmail(initialEmail);
    }
  }, [visible, initialName, initialEmail]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        email: email.trim(),
      });
      onClose();
    }
  };

  const handleClose = () => {
    setName(initialName);
    setEmail(initialEmail);
    onClose();
  };

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button variant="ghost" size="icon" onPress={handleClose}>
            <Ionicons
              name="close"
              size={24}
              color={theme.colors.foreground}
            />
          </Button>
          <Text style={[styles.headerTitle, { color: theme.colors.foreground }]}>
            Edit Profile
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text
              style={[
                styles.saveButtonText,
                {
                  color: name.trim()
                    ? theme.colors.primary
                    : theme.colors.mutedForeground,
                },
              ]}
            >
              Save
            </Text>
          </Button>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <Avatar size="xl">
              <AvatarImage source={require("../assets/avatar.png")} />
            </Avatar>
            <Pressable
              style={({ pressed }) => [
                styles.changeAvatarButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text
                style={[
                  styles.changeAvatarText,
                  { color: theme.colors.primary },
                ]}
              >
                Change Avatar
              </Text>
            </Pressable>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: theme.colors.foreground }]}
              >
                Display Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[styles.label, { color: theme.colors.foreground }]}
              >
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.foreground,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
    },
    avatarSection: {
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    changeAvatarButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    changeAvatarText: {
      fontSize: 16,
      fontWeight: "500",
    },
    formSection: {
      gap: theme.spacing.lg,
    },
    inputGroup: {
      gap: theme.spacing.sm,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
    },
    input: {
      fontSize: 16,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
    },
  });

