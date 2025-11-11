import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CalendarCard from "../components/CalendarCard";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { CreateCalendarModal } from "../components/CreateCalendarModal";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";

interface Calendar {
  id: number;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const { theme, colorScheme, setColorScheme } = useTheme();
  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: 1,
      title: "Family",
    },
    {
      id: 2,
      title: "Friends",
    },
    {
      id: 3,
      title: "Work",
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.foreground }]}>
            My Calendars
          </Text>
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
        {calendars.map((calendar) => (
          <CalendarCard
            key={calendar.id}
            style={styles.calendarCard}
            title={calendar.title}
            onPress={() => router.push(`/calendar/${calendar.id}`)}
          />
        ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
