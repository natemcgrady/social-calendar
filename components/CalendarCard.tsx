import React, { useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { AvatarStack, CalendarMember } from "./ui/avatar-stack";
import membersData from "../db/members.json";

// Map avatar paths from JSON to require() calls
const avatarPathMap: Record<string, number> = {
  "../assets/avatar.png": require("../assets/avatar.png"),
  "../assets/mel.jpg": require("../assets/mel.jpg"),
};

interface CalendarCardProps {
  title: string;
  calendarId: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CalendarCard = ({
  title,
  calendarId,
  style,
  onPress,
}: CalendarCardProps) => {
  const { theme } = useTheme();

  // Filter members to only include those who are members of this calendar
  const membersForCalendar: CalendarMember[] = useMemo(() => {
    return membersData.members
      .filter((member) => member.calendarIds?.includes(calendarId))
      .map((member) => ({
        id: member.id,
        name: member.name,
        avatarUrl: member.avatarUrl
          ? avatarPathMap[member.avatarUrl] || undefined
          : undefined,
      }));
  }, [calendarId]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Card style={style as ViewStyle}>
        <CardContent style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.cardForeground }]}>
            {title}
          </Text>
          <AvatarStack members={membersForCalendar} />
        </CardContent>
      </Card>
    </Pressable>
  );
};

export default CalendarCard;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.7,
  },
});
