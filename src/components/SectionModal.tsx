import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

interface SectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const SectionModal: React.FC<SectionModalProps> = ({ open, onOpenChange, title, children }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium tracking-tight">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SectionModal;
