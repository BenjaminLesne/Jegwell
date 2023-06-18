import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/AlertDialog/alert-dialog";

type Props = {
  open: boolean;
  title: string;
  content: JSX.Element;
};

export const Modal = ({ open, title, content }: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-5 text-center">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="my-9">
            {content}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-secondary text-primary">
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
