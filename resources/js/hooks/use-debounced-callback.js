// resources/js/hooks/use-debounced-callback.js
import { useCallback, useRef, useEffect } from 'react';

export const useDebouncedCallback = (callback, delay) => {
    const timeoutRef = useRef();

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
};
