
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
    title: string;
    description: string;
    open: boolean;
    toggle: () => void;
    onConfirm: () => void;
}

const ConfirmDialog = ({ title, description, open, toggle, onConfirm }: ConfirmDialogProps) => {
    const confirm = () => {
        onConfirm();
        toggle();
    }

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={toggle}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={ confirm }>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog;