import React from "react";
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

const MEMBERS: CalendarMember[] = [
  {
    id: 1,
    name: "Nate McGrady",
    avatarUrl: require("../assets/avatar.png"),
  },
  {
    id: 2,
    name: "Amelia McGrady",
    avatarUrl: require("../assets/mel.jpg"),
  },
];

interface CalendarCardProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CalendarCard = ({ title, style, onPress }: CalendarCardProps) => {
  const { theme } = useTheme();

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
          <AvatarStack members={MEMBERS} />
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
