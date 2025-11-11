import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import Calendar from "../../components/ui/calendar";
import { Theme } from "../../constants/theme";

// Mock data - this would be fetched from DB based on calendar ID
const calendarEvents: Record<
  number,
  Array<{ title: string; from: string; to: string }>
> = {
  1: [
    {
      title: "Family Dinner",
      from: "2025-11-11T18:00:00",
      to: "2025-11-11T20:00:00",
    },
    {
      title: "Birthday Party",
      from: "2025-11-15T14:00:00",
      to: "2025-11-15T17:00:00",
    },
    {
      title: "Thanksgiving",
      from: "2025-11-27T12:00:00",
      to: "2025-11-27T18:00:00",
    },
  ],
  2: [
    {
      title: "Coffee with Friends",
      from: "2025-11-11T10:00:00",
      to: "2025-11-11T11:00:00",
    },
    {
      title: "Game Night",
      from: "2025-11-14T19:00:00",
      to: "2025-11-14T22:00:00",
    },
  ],
  3: [
    {
      title: "Team Sync Meeting",
      from: "2025-11-11T09:00:00",
      to: "2025-11-11T10:00:00",
    },
    {
      title: "Design Review",
      from: "2025-11-12T11:30:00",
      to: "2025-11-12T12:30:00",
    },
    {
      title: "Client Presentation",
      from: "2025-11-13T14:00:00",
      to: "2025-11-13T15:00:00",
    },
  ],
};

const calendarTitles: Record<number, string> = {
  1: "Family",
  2: "Friends",
  3: "Work",
};

export default function CalendarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const calendarId = parseInt(id || "1", 10);
  const events = calendarEvents[calendarId] || [];
  const calendarTitle = calendarTitles[calendarId] || "Calendar";
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
        <Text style={styles.headerTitle}>{calendarTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Calendar events={events} />
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
      paddingHorizontal: theme.spacing.lg, // 16pt - standard horizontal padding
      paddingVertical: theme.spacing.md, // 12pt - medium vertical padding
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.foreground,
    },
    headerSpacer: {
      width: 40,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing.lg, // 16pt - standard padding
      alignItems: "center",
    },
  });
