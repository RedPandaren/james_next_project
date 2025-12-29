import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AlertFade = (message: string, error?: boolean | false) => {
  const variant = error ? "destructive" : "default";
  const textColor = error ? "!text-red-600" : "!text-green-600";

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <Alert
        variant={variant}
        className="w-full max-w-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      >
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          <span className={textColor}>{message}</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};
