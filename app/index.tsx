import React, { useState, useMemo } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CalendarCard from "../components/CalendarCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { CreateCalendarModal } from "../components/CreateCalendarModal";
import { useTheme } from "../contexts/ThemeContext";
import { useCalendars, Calendar } from "../contexts/CalendarContext";
import { Theme } from "../constants/theme";
import AppHeader from "../components/AppHeader";

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const { calendars, addCalendar } = useCalendars();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleCreateCalendar = (name: string) => {
    const newCalendar: Calendar = {
      id: Date.now(), // Simple ID generation - in production, use proper ID generation
      title: name,
    };
    addCalendar(newCalendar);
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
              calendarId={calendar.id}
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
      gap: theme.spacing.lg,
      padding: theme.spacing.lg,
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
      marginLeft: theme.spacing.sm,
    },
    calendarCard: {
      width: "100%",
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing["2xl"],
      right: theme.spacing["2xl"],
    },
    noCalendarsText: {
      fontSize: 16,
      textAlign: "center",
      padding: theme.spacing.lg,
      color: theme.colors.foreground,
    },
  });
