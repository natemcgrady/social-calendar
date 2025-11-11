import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CalendarCard from "../components/CalendarCard";
import { Button } from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";

// mock data - this would get fetched from DB
const calendars = [
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
];

export default function Home() {
  const router = useRouter();
  const { theme, colorScheme, setColorScheme } = useTheme();

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
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
            onPress={toggleTheme}
            style={styles.themeButton}
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
});
