import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Theme } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

const AppHeader = () => {
  const { theme, colorScheme, setColorScheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>My Calendars</Text>
      <Button
        variant="ghost"
        size="icon"
        style={styles.themeButton}
        onPress={toggleTheme}
      >
        <Ionicons
          name={colorScheme === "light" ? "moon" : "sunny"}
          size={22}
          color={theme.colors.foreground}
        />
      </Button>
    </View>
  );
};

export default AppHeader;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      color: theme.colors.foreground,
    },
    themeButton: {
      marginLeft: 8,
    },
  });
