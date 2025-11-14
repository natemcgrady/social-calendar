import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { format, eachDayOfInterval } from "date-fns";
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
  onEventPress?: (event: Event) => void;
}

function formatDateRange(from: Date, to: Date): string {
  const fromTime = format(from, "h:mm a");
  const toTime = format(to, "h:mm a");
  return `${fromTime} - ${toTime}`;
}

// Helper function to check if an event is all-day
function isAllDayEvent(event: Event): boolean {
  const fromDate = new Date(event.from);
  const toDate = new Date(event.to);
  const fromTimeStr = format(fromDate, "HH:mm");
  const toTimeStr = format(toDate, "HH:mm");
  return fromTimeStr === "00:00" && toTimeStr === "23:59";
}

// Format event time display based on whether it's multi-day and/or all-day
function formatEventTimeDisplay(event: Event): string {
  const fromDate = new Date(event.from);
  const toDate = new Date(event.to);
  const isMultiDay = isMultiDateEvent(event);
  const isAllDay = isAllDayEvent(event);

  if (isAllDay) {
    // All-day event
    const fromDateStr = format(fromDate, "EEEE, MMM d");
    if (isMultiDay) {
      const toDateStr = format(toDate, "EEEE, MMM d");
      return `${fromDateStr} - ${toDateStr}`;
    } else {
      return fromDateStr;
    }
  } else {
    // Event with specific times
    if (isMultiDay) {
      const fromDateStr = format(fromDate, "EEEE, MMM d 'at' h:mm a");
      const toDateStr = format(toDate, "EEEE, MMM d 'at' h:mm a");
      return `${fromDateStr} - ${toDateStr}`;
    } else {
      // Single day event with times - use the original format
      return formatDateRange(fromDate, toDate);
    }
  }
}

// Helper function to get all dates between start and end (inclusive)
function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  return dates.map((date) => format(date, "yyyy-MM-dd"));
}

// Helper function to check if an event spans multiple days
function isMultiDateEvent(event: Event): boolean {
  const startDate = new Date(event.from);
  const endDate = new Date(event.to);
  const startDateString = format(startDate, "yyyy-MM-dd");
  const endDateString = format(endDate, "yyyy-MM-dd");
  return startDateString !== endDateString;
}

export default function Calendar({
  events = [],
  onAddEventPress,
  onSelectedDateChange,
  onEventPress,
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

  // Filter events for the selected date (including multi-date events)
  const dayEvents = React.useMemo(() => {
    return events.filter((event) => {
      const startDate = new Date(event.from);
      const endDate = new Date(event.to);
      const selectedDateObj = date
        ? (() => {
            const [year, month, day] = date.split("-").map(Number);
            return new Date(year, month - 1, day);
          })()
        : null;

      if (!selectedDateObj) return false;

      // Check if selected date falls within the event range
      const eventStartDate = format(startDate, "yyyy-MM-dd");
      const eventEndDate = format(endDate, "yyyy-MM-dd");
      const selectedDateStr = format(selectedDateObj, "yyyy-MM-dd");

      return (
        selectedDateStr >= eventStartDate && selectedDateStr <= eventEndDate
      );
    });
  }, [events, date]);

  // Build marked dates object with dots for events
  const markedDates = React.useMemo(() => {
    const marked: Record<string, any> = {};

    events.forEach((event) => {
      const startDate = new Date(event.from);
      const endDate = new Date(event.to);
      const startDateString = format(startDate, "yyyy-MM-dd");
      const endDateString = format(endDate, "yyyy-MM-dd");

      if (isMultiDateEvent(event)) {
        // Multi-date event: mark all days in range with red dot
        const datesInRange = getDatesInRange(startDate, endDate);
        datesInRange.forEach((dateStr) => {
          if (!marked[dateStr]) {
            marked[dateStr] = {
              hasBlueDot: false,
              hasRedDot: false,
            };
          }

          // Mark that this day has a red dot
          marked[dateStr].hasRedDot = true;
        });
      } else {
        // Single-day event: mark with blue dot
        if (!marked[startDateString]) {
          marked[startDateString] = {
            hasBlueDot: false,
            hasRedDot: false,
          };
        }

        // Mark that this day has a blue dot
        marked[startDateString].hasBlueDot = true;
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

  // Custom day component to render overlapping dots
  const renderDayComponent = (day: any) => {
    const dateStr = day.date?.dateString;
    const marking = dateStr ? markedDates[dateStr] : null;
    const isSelected = marking?.selected;
    const isToday = dateStr === today;
    const isDisabled = day.state === "disabled";
    const hasBlueDot = marking?.hasBlueDot;
    const hasRedDot = marking?.hasRedDot;

    return (
      <Pressable
        onPress={() => {
          if (!isDisabled && day.date) {
            handleDayPress(day.date);
          }
        }}
        style={[
          styles.dayContainer,
          isSelected && {
            backgroundColor: theme.colors.primary,
            borderRadius: 16,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isSelected
                ? theme.colors.primaryForeground
                : isToday
                ? theme.colors.primary
                : isDisabled
                ? theme.colors.mutedForeground
                : theme.colors.foreground,
              fontWeight: isToday && !isSelected ? "600" : "400",
            },
          ]}
        >
          {day.date?.day}
        </Text>
        {(hasBlueDot || hasRedDot) && (
          <View style={styles.dotsContainer}>
            {hasBlueDot && (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primaryForeground
                      : theme.colors.primary,
                  },
                ]}
              />
            )}
            {hasRedDot && (
              <View
                style={[
                  styles.dot,
                  styles.redDot,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primaryForeground
                      : "#ef4444",
                  },
                ]}
              />
            )}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Card style={styles.card}>
      <CardContent style={styles.cardContent}>
        <RNCalendar
          current={date}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          dayComponent={renderDayComponent}
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
              <Pressable
                key={event.title}
                onPress={() => onEventPress?.(event)}
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
                    {formatEventTimeDisplay(event)}
                  </Text>
                </View>
              </Pressable>
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
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 40,
    width: "100%",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "400",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  redDot: {
    marginLeft: -2,
  },
});
