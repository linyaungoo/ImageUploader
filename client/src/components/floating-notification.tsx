import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface FloatingNotificationProps {
  show: boolean;
  onDismiss: () => void;
  message: string;
  description: string;
}

export default function FloatingNotification({ 
  show, 
  onDismiss, 
  message, 
  description 
}: FloatingNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white rounded-lg shadow-xl border-l-4 border-success p-4 transform transition-transform duration-300 ease-out ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      data-testid="notification-container"
    >
      <div className="flex items-center">
        <CheckCircle className="text-success mr-3 w-5 h-5" />
        <div className="flex-1">
          <p className="font-semibold text-gray-dark" data-testid="text-notification-message">
            {message}
          </p>
          <p className="text-sm text-gray-medium" data-testid="text-notification-description">
            {description}
          </p>
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-medium hover:text-gray-dark"
          data-testid="button-dismiss-notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
