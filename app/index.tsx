import React from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CalendarCard from "../components/CalendarCard";

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Calendars</Text>
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
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    gap: 16,
    padding: 16,
  },
  calendarCard: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
