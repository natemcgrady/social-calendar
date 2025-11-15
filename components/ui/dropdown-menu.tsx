import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface DropdownMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  triggerRef?: React.RefObject<View>;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  contentStyle?: StyleProp<ViewStyle>;
}

function DropdownMenu({
  open,
  onOpenChange,
  children,
  triggerRef,
  align = "end",
  side = "bottom",
  contentStyle,
}: DropdownMenuProps) {
  const [triggerLayout, setTriggerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (open && triggerRef?.current) {
      // Use a small timeout to ensure the view is fully laid out
      const timer = setTimeout(() => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
          setTriggerLayout({
            x,
            y,
            width,
            height,
          });
        });
      }, 100);
      return () => clearTimeout(timer);
    } else if (!open) {
      setTriggerLayout(null);
    }
  }, [open, triggerRef]);

  if (!open) return null;

  return (
    <DropdownMenuContent
      triggerLayout={triggerLayout}
      align={align}
      side={side}
      onOpenChange={onOpenChange}
      style={contentStyle}
    >
      {children}
    </DropdownMenuContent>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  triggerLayout: { x: number; y: number; width: number; height: number } | null;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  onOpenChange: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

function DropdownMenuContent({
  children,
  triggerLayout,
  align = "end",
  side = "bottom",
  onOpenChange,
  style,
}: DropdownMenuContentProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 30,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);


  if (!triggerLayout) return null;

  // Extract width from style prop if provided, otherwise use default
  const styleObj = StyleSheet.flatten(style);
  const menuWidth = (styleObj?.minWidth as number) || (styleObj?.width as number) || 160;
  const menuHeight = 50; // Approximate height for single item
  const spacing = 4;

  let left = triggerLayout.x;
  if (align === "end") {
    left = triggerLayout.x + triggerLayout.width - menuWidth;
  } else if (align === "center") {
    left = triggerLayout.x + triggerLayout.width / 2 - menuWidth / 2;
  }

  // Ensure menu stays within screen bounds
  left = Math.max(8, Math.min(left, SCREEN_WIDTH - menuWidth - 8));

  const top =
    side === "bottom"
      ? triggerLayout.y + triggerLayout.height + spacing
      : triggerLayout.y - menuHeight - spacing;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => onOpenChange(false)}
      />
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.popover || theme.colors.card,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
            left,
            top,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            zIndex: 9999,
          },
          style,
        ]}
        pointerEvents="box-none"
      >
        <View pointerEvents="auto">{children}</View>
      </Animated.View>
    </Modal>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onPress?: () => void;
}

function DropdownMenuTrigger({
  children,
  onPress,
}: DropdownMenuTriggerProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  variant?: "default" | "destructive";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

function DropdownMenuItem({
  children,
  onSelect,
  variant = "default",
  style,
  textStyle,
}: DropdownMenuItemProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    onSelect?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: pressed
            ? variant === "destructive"
              ? theme.colors.destructive + "20"
              : theme.colors.muted
            : "transparent",
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          {
            color:
              variant === "destructive"
                ? theme.colors.destructive || "#ef4444"
                : theme.colors.foreground,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

interface DropdownMenuSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

function DropdownMenuSeparator({ style }: DropdownMenuSeparatorProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: theme.colors.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    position: "absolute",
    minWidth: 160,
    padding: 4,
    borderWidth: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    minHeight: 36,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    marginVertical: 4,
    marginHorizontal: 4,
  },
});

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
};

