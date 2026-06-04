import { useEffect, useRef, useState, useCallback } from 'react';

export default function useTimer() {
    const [countdown, setCountdown] = useState(10);
    const [pause, setPause] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearTimer]);

    useEffect(() => {
        if (pause) {
            clearTimer();
            return;
        }

        startTimer();
        return () => clearTimer();
    }, [pause, clearTimer, startTimer]);

    const resetTimer = useCallback(() => {
        setCountdown(10);
        setPause(false);
        startTimer();
    }, [startTimer]);

    return { countdown, pause, setPause, resetTimer };
}