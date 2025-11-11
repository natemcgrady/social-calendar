import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Calendar from "../../components/Calendar";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";

// Mock data - this would be fetched from DB based on calendar ID
const calendarEvents: Record<
  number,
  Array<{ title: string; from: string; to: string }>
> = {
  1: [
    {
      title: "Family Dinner",
      from: "2025-06-12T18:00:00",
      to: "2025-06-12T20:00:00",
    },
    {
      title: "Birthday Party",
      from: "2025-06-15T14:00:00",
      to: "2025-06-15T17:00:00",
    },
  ],
  2: [
    {
      title: "Coffee with Friends",
      from: "2025-06-12T10:00:00",
      to: "2025-06-12T11:00:00",
    },
    {
      title: "Game Night",
      from: "2025-06-14T19:00:00",
      to: "2025-06-14T22:00:00",
    },
  ],
  3: [
    {
      title: "Team Sync Meeting",
      from: "2025-06-12T09:00:00",
      to: "2025-06-12T10:00:00",
    },
    {
      title: "Design Review",
      from: "2025-06-12T11:30:00",
      to: "2025-06-12T12:30:00",
    },
    {
      title: "Client Presentation",
      from: "2025-06-12T14:00:00",
      to: "2025-06-12T15:00:00",
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
  const calendarId = parseInt(id || "1", 10);
  const events = calendarEvents[calendarId] || [];
  const calendarTitle = calendarTitles[calendarId] || "Calendar";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#000" />
        </Button>
        <Calendar events={events} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
});
