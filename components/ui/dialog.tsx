import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../ui/button";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      {children}
    </Modal>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  onPress?: () => void;
}

function DialogTrigger({ children, onPress }: DialogTriggerProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

interface DialogOverlayProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

function DialogOverlay({ style, onPress }: DialogOverlayProps) {
  return (
    <Pressable
      style={[styles.overlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }, style]}
      onPress={onPress}
    />
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function DialogContent({
  children,
  style,
  showCloseButton = true,
  onClose,
}: DialogContentProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.contentContainer}>
      <DialogOverlay onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={[styles.centeredContent, {
          paddingHorizontal: theme.spacing.lg, // 16pt - standard horizontal padding
          paddingVertical: theme.spacing.xl, // 20pt - comfortable vertical padding
        }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.content,
                {
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.radius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing["2xl"], // 24pt - comfortable padding for dialog content
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 5,
                },
                style,
              ]}
            >
              {children}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={onClose}
                  style={[styles.closeButton, {
                    top: theme.spacing.lg, // 16pt - standard spacing
                    right: theme.spacing.lg, // 16pt - standard spacing
                  }]}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme.colors.foreground}
                  />
                </Button>
              )}
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function DialogHeader({ children, style }: DialogHeaderProps) {
  const { theme } = useTheme();
  return <View style={[{ marginBottom: theme.spacing.lg }, styles.header, style]}>{children}</View>; // 16pt - standard spacing
}

interface DialogFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function DialogFooter({ children, style }: DialogFooterProps) {
  const { theme } = useTheme();
  return <View style={[{
    gap: theme.spacing.md, // 12pt - medium spacing between footer buttons
    marginTop: theme.spacing.lg, // 16pt - standard spacing
  }, styles.footer, style]}>{children}</View>;
}

interface DialogTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

function DialogTitle({ children, style }: DialogTitleProps) {
  const { theme } = useTheme();
  return (
    <Text style={[styles.title, { color: theme.colors.foreground }, style]}>
      {children}
    </Text>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

function DialogDescription({ children, style }: DialogDescriptionProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.description,
        {
          color: theme.colors.mutedForeground,
          marginTop: theme.spacing.xs, // 4pt - tight spacing for description
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function DialogClose({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  content: {
    maxWidth: 600,
    minWidth: 320,
    width: "100%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
  },
  header: {
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};
