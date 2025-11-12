import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  calendarTitle: string;
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  calendarTitle,
}: DeleteConfirmationDialogProps) {
  const { theme } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          maxWidth: 340,
          width: "90%",
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Calendar</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{calendarTitle}"? This action
            cannot be undone and all events in this calendar will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onPress={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
