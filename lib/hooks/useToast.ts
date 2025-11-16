'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/types';

export const useToast = () => {
  const [toasts, setToasts] = useState<(Toast & { id: number; duration: number })[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

