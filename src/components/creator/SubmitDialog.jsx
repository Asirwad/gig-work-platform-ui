import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SubmitDialog({ show, onClose, onConfirm }) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-white/75">
        <DialogHeader>
          <DialogTitle>Submit Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit this job?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={onClose} variant="outline" className="border-2 border-black">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
