import React, { useState, useMemo } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CalendarCard from "../components/CalendarCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { CreateCalendarModal } from "../components/CreateCalendarModal";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Theme } from "../constants/theme";

interface Calendar {
  id: number;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const { theme, colorScheme, setColorScheme } = useTheme();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

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
        <View style={styles.header}>
          <Text style={styles.title}>My Calendars</Text>
          <Button
            variant="ghost"
            size="icon"
            style={styles.themeButton}
            onPress={toggleTheme}
          >
            <Ionicons
              name={colorScheme === "light" ? "moon" : "sunny"}
              size={22}
              color={theme.colors.foreground}
            />
          </Button>
        </View>
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
      gap: 16,
      padding: 16,
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
      marginLeft: 8,
    },
    calendarCard: {
      width: "100%",
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
    },
    noCalendarsText: {
      fontSize: 16,
      textAlign: "center",
      padding: 16,
      color: theme.colors.foreground,
    },
  });
