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

interface DeleteEventConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
}

export function DeleteEventConfirmationDialog({
  open,
  onClose,
  onConfirm,
  eventTitle,
}: DeleteEventConfirmationDialogProps) {
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
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{eventTitle}"? This action cannot
            be undone.
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

