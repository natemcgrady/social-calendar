import React, { useState, useMemo } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CalendarCard from "../components/CalendarCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { CreateCalendarModal } from "../components/CreateCalendarModal";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/theme";
import AppHeader from "../components/AppHeader";

interface Calendar {
  id: number;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [calendars, setCalendars] = useState<Calendar[]>([
    { id: 1, title: "Family" },
    { id: 2, title: "Friends" },
    { id: 3, title: "Work" },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreateCalendar = (name: string) => {
    const newCalendar: Calendar = {
      id: Date.now(), // Simple ID generation - in production, use proper ID generation
      title: name,
    };
    setCalendars([...calendars, newCalendar]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader />
        {calendars.length > 0 ? (
          calendars.map((calendar) => (
            <CalendarCard
              key={calendar.id}
              style={styles.calendarCard}
              title={calendar.title}
              onPress={() => router.push(`/calendar/${calendar.id}`)}
            />
          ))
        ) : (
          <Text style={styles.noCalendarsText}>
            Create a new calendar to get started!
          </Text>
        )}
      </ScrollView>
      <FloatingActionButton
        onPress={() => setIsModalVisible(true)}
        style={styles.fab}
      />
      <CreateCalendarModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreate={handleCreateCalendar}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      gap: theme.spacing.lg, // 16pt - standard spacing between items
      padding: theme.spacing.lg, // 16pt - screen edge margin
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      flex: 1,
      color: theme.colors.foreground,
    },
    themeButton: {
      marginLeft: theme.spacing.sm, // 8pt - small spacing
    },
    calendarCard: {
      width: "100%",
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing["2xl"], // 24pt - comfortable spacing from edges
      right: theme.spacing["2xl"], // 24pt - comfortable spacing from edges
    },
    noCalendarsText: {
      fontSize: 16,
      textAlign: "center",
      padding: theme.spacing.lg, // 16pt - standard padding
      color: theme.colors.foreground,
    },
  });
