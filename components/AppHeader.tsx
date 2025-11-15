import React, { useMemo, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSidebar } from "../contexts/SidebarContext";
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu";

const TITLE = "My Calendars";

const AppHeader = () => {
  const { theme } = useTheme();
  const { openSidebar } = useSidebar();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const inboxButtonRef = useRef<View>(null);

  // Mock notifications - in a real app, this would come from a context or API
  const notifications: string[] = [];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          gap: theme.spacing.lg,
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
        dropdownContent: {
          width: 300,
          maxHeight: 400,
        },
        notificationsContainer: {
          maxHeight: 400,
        },
        notificationsList: {
          maxHeight: 400,
        },
        notificationText: {
          fontSize: 14,
        },
        emptyState: {
          padding: theme.spacing.lg,
          alignItems: "center",
          justifyContent: "center",
        },
        emptyText: {
          fontSize: 14,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.header}>
      <Button variant="ghost" size="icon" onPress={openSidebar}>
        <Avatar>
          <AvatarImage source={require("../assets/avatar.png")} />
        </Avatar>
      </Button>
      <Text style={[styles.title, { color: theme.colors.foreground }]}>
        {TITLE}
      </Text>
      <View ref={inboxButtonRef} collapsable={false}>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setIsNotificationsOpen(!isNotificationsOpen)}
        >
          <Ionicons
            name="mail-outline"
            size={24}
            color={theme.colors.foreground}
          />
        </Button>
      </View>
      <DropdownMenu
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
        triggerRef={inboxButtonRef}
        align="end"
        side="bottom"
        contentStyle={styles.dropdownContent}
      >
        <View style={styles.notificationsContainer}>
          {notifications.length > 0 ? (
            <ScrollView
              style={styles.notificationsList}
              showsVerticalScrollIndicator={false}
            >
              {notifications.map((notification, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => {
                    // Handle notification tap
                    setIsNotificationsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.notificationText,
                      { color: theme.colors.foreground },
                    ]}
                  >
                    {notification}
                  </Text>
                </DropdownMenuItem>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.mutedForeground },
                ]}
              >
                No notifications
              </Text>
            </View>
          )}
        </View>
      </DropdownMenu>
    </View>
  );
};

export default AppHeader;
