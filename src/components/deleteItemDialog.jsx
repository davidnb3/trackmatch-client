import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { Button } from "@/components/ui/button";

DeleteItemDialog.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }),
  apiPath: PropTypes.string,
  children: PropTypes.node,
};

export function DeleteItemDialog({ item, apiPath, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const deleteItem = async () => {
    const response = await fetch(
      `http://localhost:3001/${apiPath}/${item._id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    closeDialog();

    if (apiPath === "playlists") {
      navigate("/");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Delete {item.name}?</DialogTitle>
          <DialogDescription>
            This will delete <span className="font-bold">{item.name}</span> from
            your library and <span className="font-bold">cannot be undone</span>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeDialog} variant="outline">
            Cancel
          </Button>
          <Button onClick={deleteItem}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
