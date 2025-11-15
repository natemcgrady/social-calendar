import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { Theme } from "../constants/theme";

export default function Settings() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
        <Text style={[styles.headerTitle, { color: theme.colors.foreground }]}>
          Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            Appearance
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={theme.colors.foreground}
              />
              <Text
                style={[styles.settingLabel, { color: theme.colors.foreground }]}
              >
                Theme
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.foreground }]}
          >
            About
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingItem,
              pressed && { backgroundColor: theme.colors.muted },
            ]}
          >
            <View style={styles.settingContent}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.foreground}
              />
              <Text
                style={[styles.settingLabel, { color: theme.colors.foreground }]}
              >
                App Version
              </Text>
            </View>
            <Text
              style={[styles.settingValue, { color: theme.colors.mutedForeground }]}
            >
              1.0.0
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
    },
    headerSpacer: {
      width: 40,
    },
    scrollContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.spacing.xs,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      gap: theme.spacing.md,
    },
    settingContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
    },
    settingValue: {
      fontSize: 16,
    },
  });

