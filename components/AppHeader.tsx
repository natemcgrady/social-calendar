import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const TITLE = "My Calendars";

const AppHeader = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.foreground }]}>
        {TITLE}
      </Text>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
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
});
