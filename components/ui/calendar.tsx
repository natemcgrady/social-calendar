import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

export interface Event {
  title: string;
  from: string;
  to: string;
}

interface CalendarProps {
  events?: Event[];
  onAddEventPress?: () => void;
  onSelectedDateChange?: (date: string) => void; // YYYY-MM-DD format
}

function formatDateRange(from: Date, to: Date): string {
  const fromTime = format(from, "h:mm a");
  const toTime = format(to, "h:mm a");
  return `${fromTime} - ${toTime}`;
}

export default function Calendar({
  events = [],
  onAddEventPress,
  onSelectedDateChange,
}: CalendarProps) {
  const { theme } = useTheme();
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = React.useState<string>(today);

  // Notify parent when selected date changes
  React.useEffect(() => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    }
  }, [date, onSelectedDateChange]);

  // Parse date string as local date to avoid timezone issues
  const selectedDate = date
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : new Date();

  // Filter events for the selected date
  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.from);
    // Parse event date as local date to avoid timezone issues
    const eventDateString = format(eventDate, "yyyy-MM-dd");
    return eventDateString === date;
  });

  // Build marked dates object with dots for days that have events
  const markedDates = React.useMemo(() => {
    const marked: Record<string, any> = {};

    // Mark all days with events
    events.forEach((event) => {
      const eventDate = new Date(event.from);
      const eventDateString = format(eventDate, "yyyy-MM-dd");
      if (!marked[eventDateString]) {
        marked[eventDateString] = {
          marked: true,
          dotColor: theme.colors.primary,
        };
      }
    });

    // Mark the selected date
    if (date) {
      marked[date] = {
        ...marked[date],
        selected: true,
        selectedColor: theme.colors.primary,
        selectedTextColor: theme.colors.primaryForeground,
      };
    }

    return marked;
  }, [events, date, theme.colors.primary, theme.colors.primaryForeground]);

  const handleDayPress = (day: DateData) => {
    setDate(day.dateString);
  };

  return (
    <Card style={styles.card}>
      <CardContent style={styles.cardContent}>
        <RNCalendar
          current={date}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: theme.colors.mutedForeground,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.primaryForeground,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.foreground,
            textDisabledColor: theme.colors.mutedForeground,
            dotColor: theme.colors.primary,
            selectedDotColor: theme.colors.primaryForeground,
            arrowColor: theme.colors.foreground,
            monthTextColor: theme.colors.foreground,
            textDayFontWeight: "400",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
        />
      </CardContent>
      <CardFooter style={styles.cardFooter}>
        <View style={styles.headerRow}>
          <Text style={[styles.dateText, { color: theme.colors.foreground }]}>
            {selectedDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Button
            variant="ghost"
            size="icon"
            onPress={onAddEventPress}
            style={styles.addButton}
          >
            <Ionicons name="add" size={16} color={theme.colors.foreground} />
          </Button>
        </View>
        <ScrollView style={styles.eventsContainer}>
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => (
              <View
                key={event.title}
                style={[
                  styles.eventItem,
                  { backgroundColor: theme.colors.muted },
                ]}
              >
                <View
                  style={[
                    styles.eventIndicator,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <View style={styles.eventContent}>
                  <Text
                    style={[
                      styles.eventTitle,
                      { color: theme.colors.foreground },
                    ]}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[
                      styles.eventTime,
                      { color: theme.colors.mutedForeground },
                    ]}
                  >
                    {formatDateRange(new Date(event.from), new Date(event.to))}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.noEventsText,
                { color: theme.colors.mutedForeground },
              ]}
            >
              No events for this day
            </Text>
          )}
        </ScrollView>
      </CardFooter>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
    paddingVertical: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  cardFooter: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    width: 24,
    height: 24,
  },
  eventsContainer: {
    width: "100%",
    maxHeight: 200,
  },
  eventItem: {
    flexDirection: "row",
    borderRadius: 6,
    padding: 8,
    paddingLeft: 24,
    marginBottom: 8,
    position: "relative",
  },
  eventIndicator: {
    position: "absolute",
    left: 8,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
  },
  noEventsText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
});
