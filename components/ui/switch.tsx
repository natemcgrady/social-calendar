import React from "react";
import { Switch as RNSwitch, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  style,
}: SwitchProps) {
  const { theme } = useTheme();

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: theme.colors.input,
        true: theme.colors.primary,
      }}
      thumbColor={
        value
          ? theme.colors.primaryForeground
          : theme.colors.foreground
      }
      ios_backgroundColor={theme.colors.input}
      style={style}
    />
  );
}

