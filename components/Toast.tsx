'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X, LucideIcon } from 'lucide-react';
import { toastAnimation } from '@/lib/utils/animations';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  icon?: LucideIcon;
}

export default function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  icon: CustomIcon
}: ToastProps) {
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
    <motion.div
      className={`
        fixed bottom-8 right-8 z-50
        ${config.bg} ${config.textColor}
        px-6 py-4 rounded-xl shadow-2xl
        border-l-4 ${config.border}
        flex items-center gap-3
        backdrop-blur-sm
        max-w-sm
      `}
      variants={toastAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="flex-shrink-0"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <IconComponent className="w-5 h-5" />
      </motion.div>
      <p className="font-semibold text-sm flex-1">{message}</p>
      <motion.button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

