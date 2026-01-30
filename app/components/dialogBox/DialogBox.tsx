import { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";

export const DialogBox = ({
  content,
  title,

  footer,
  onOpenChange,
  open,
}: {
  content?: string | ReactElement;
  title?: string | ReactElement;
  trigger?: ReactElement;
  footer?: ReactElement;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-gradient-to-br from-purple-100 to-purple-50"
        showCloseButton={false}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogDescription>{content}</DialogDescription>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
