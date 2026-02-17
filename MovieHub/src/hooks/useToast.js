import { useState, useCallback, useRef, useEffect } from 'react';
 
 export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);
 
   const showToast = useCallback(
     (message) => {
      clearTimeout(timerRef.current);
      setToast({ show: true, message });
      timerRef.current = setTimeout(() => {
         setToast({ show: false, message: '' });
       }, duration);
      },
      [duration]
     );
 
   return { toast, showToast };
 };