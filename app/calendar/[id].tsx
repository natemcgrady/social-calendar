import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { useCalendars } from "../../contexts/CalendarContext";
import { useToast } from "../../contexts/ToastContext";
import Calendar from "../../components/ui/calendar";
import { Theme } from "../../constants/theme";
import { AddEventModal } from "../../components/AddEventModal";
import { ViewEventModal } from "../../components/ViewEventModal";
import { SettingsMenu } from "../../components/SettingsMenu";
import { DeleteConfirmationDialog } from "../../components/DeleteConfirmationDialog";
import { Event } from "../../components/ui/calendar";
import eventsData from "../../db/events.json";

// Convert string keys to numbers for type compatibility
const calendarEvents: Record<
  number,
  Array<{ title: string; from: string; to: string }>
> = Object.fromEntries(
  Object.entries(eventsData.calendarEvents).map(([key, value]) => [
    parseInt(key, 10),
    value,
  ])
) as Record<number, Array<{ title: string; from: string; to: string }>>;

export default function CalendarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { calendars, deleteCalendar } = useCalendars();
  const { showToast } = useToast();
  const calendarId = parseInt(id || "1", 10);
  const initialEvents = calendarEvents[calendarId] || [];
  const [events, setEvents] = useState(initialEvents);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [isViewEventModalVisible, setIsViewEventModalVisible] = useState(false);
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const calendar = calendars.find((cal) => cal.id === calendarId);
  const calendarTitle = calendar?.title || "Calendar";
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleAddEvent = (event: {
    title: string;
    from: string;
    to: string;
  }) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventModalVisible(true);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setEventToEdit(selectedEvent);
      setIsViewEventModalVisible(false);
      setIsAddEventModalVisible(true);
    }
  };

  const handleUpdateEvent = (updatedEvent: {
    title: string;
    from: string;
    to: string;
  }) => {
    if (eventToEdit) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.title === eventToEdit.title &&
          event.from === eventToEdit.from &&
          event.to === eventToEdit.to
            ? updatedEvent
            : event
        )
      );
      setEventToEdit(null);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddEventModalVisible(false);
    setEventToEdit(null);
  };

  const handleDeleteCalendar = () => {
    deleteCalendar(calendarId);
    showToast(`${calendarTitle} was deleted`, "success");
    router.back();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            !(
              event.title === selectedEvent.title &&
              event.from === selectedEvent.from &&
              event.to === selectedEvent.to
            )
        )
      );
      showToast(`${selectedEvent.title} was deleted`, "success");
      setSelectedEvent(null);
      setIsViewEventModalVisible(false);
    }
  };

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
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setIsSettingsMenuVisible(true)}
          style={styles.addButton}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          events={events}
          onAddEventPress={() => setIsAddEventModalVisible(true)}
          onSelectedDateChange={setSelectedDate}
          onEventPress={handleEventPress}
        />
      </ScrollView>
      <AddEventModal
        visible={isAddEventModalVisible}
        onClose={handleCloseAddModal}
        onAdd={handleAddEvent}
        onEdit={handleUpdateEvent}
        initialDate={selectedDate}
        eventToEdit={eventToEdit}
      />
      <ViewEventModal
        visible={isViewEventModalVisible}
        onClose={() => {
          setIsViewEventModalVisible(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        calendarTitle={calendarTitle}
        createdBy="You"
      />
      <SettingsMenu
        open={isSettingsMenuVisible}
        onClose={() => setIsSettingsMenuVisible(false)}
        onDeletePress={() => setIsDeleteDialogVisible(true)}
        calendarTitle={calendarTitle}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onConfirm={handleDeleteCalendar}
        calendarTitle={calendarTitle}
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
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
    addButton: {
      width: 40,
      height: 40,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: "center",
    },
  });
