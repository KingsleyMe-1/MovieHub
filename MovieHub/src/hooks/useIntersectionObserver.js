import { useEffect, useRef, useState, useCallback } from 'react';
 
 export const useIntersectionObserver = (callback, { threshold = 0.1 } = {}) => {
  const callbackRef = useRef(callback);
  const [target, setTarget] = useState(null);
 
   useEffect(() => {
     callbackRef.current = callback;
   }, [callback]);
 
   useEffect(() => {
    if (!target) return;

     const observer = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting) {
           callbackRef.current();
         }
       },
       { threshold }
     );

    observer.observe(target);
 
     return () => {
      observer.unobserve(target);
     };
  }, [target, threshold]);
 
  const targetRef = useCallback((node) => {
    setTarget(node);
  }, []);

  return targetRef;
 };