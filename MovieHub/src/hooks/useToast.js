import { useState, useCallback } from 'react';

export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback(
    (message) => {
      setToast({ show: true, message });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, duration);
    },
    [duration]
  );

  return { toast, showToast };
};
