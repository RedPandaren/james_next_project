import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AlertFade = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  const getVariant = () => {
    switch (type) {
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "!text-green-700";
      case "error":
        return "!text-red-600";
      default:
        return "!text-blue-700";
    }
  };

  return (
    <div className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <Alert
        variant={getVariant()}
        className="w-full max-w-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
      >
        {getIcon()}
        <AlertDescription>
          <span className={getTextColor()}>{message}</span>
        </AlertDescription>
      </Alert>
    </div>
  );
};
