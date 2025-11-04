import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  icon: CustomIcon
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastConfig = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      border: 'border-green-400',
      icon: Check,
      textColor: 'text-white',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      border: 'border-red-400',
      icon: AlertCircle,
      textColor: 'text-white',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      border: 'border-blue-400',
      icon: Info,
      textColor: 'text-white',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      border: 'border-amber-400',
      icon: AlertCircle,
      textColor: 'text-white',
    },
  };

  const config = toastConfig[type];
  const IconComponent = CustomIcon || config.icon;

  return (
    <div 
      className={`
        fixed bottom-8 right-8 z-50
        ${config.bg} ${config.textColor}
        px-6 py-4 rounded-xl shadow-2xl
        border-l-4 ${config.border}
        flex items-center gap-3
        animate-in slide-in-from-bottom-5
        backdrop-blur-sm
        max-w-sm
      `}
    >
      <div className="flex-shrink-0">
        <IconComponent className="w-5 h-5" />
      </div>
      <p className="font-semibold text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
