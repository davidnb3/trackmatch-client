import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PropTypes } from "prop-types";
import { Button } from "@/components/ui/button";

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  onAddToPlaylist: PropTypes.func,
};

export function ConfirmDialog({ open, onOpenChange, onAddToPlaylist }) {
  const closeDialog = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Already added</DialogTitle>
          <DialogDescription>
            This is already in your playlist.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onAddToPlaylist} variant="outline">
            Add anyway
          </Button>
          <Button onClick={closeDialog}>Don&apos;t add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
