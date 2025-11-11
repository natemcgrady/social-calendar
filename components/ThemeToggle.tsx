import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Theme } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, colorScheme, setColorScheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const toggleTheme = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  };
  return (
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
  );
};

export default ThemeToggle;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    themeButton: {
      marginLeft: 8,
    },
  });
