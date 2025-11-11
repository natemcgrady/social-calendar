import React from "react";
import { Card, CardContent } from "./Card";
import { Text, StyleSheet, StyleProp, ViewStyle, Pressable } from "react-native";

interface CalendarCardProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CalendarCard = ({ title, style, onPress }: CalendarCardProps) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={style as ViewStyle}>
        <CardContent>
          <Text style={styles.title}>{title}</Text>
        </CardContent>
      </Card>
    </Pressable>
  );
};

export default CalendarCard;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.7,
  },
});
