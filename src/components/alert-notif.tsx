import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const AlertNotif = ({ type, title, message }: { type: 'destructive' | 'default', title: string, message: string}) => (
    <Alert variant={ type }>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{ title }</AlertTitle>
      <AlertDescription>
        { message }
      </AlertDescription>
    </Alert>
)

export default AlertNotif;