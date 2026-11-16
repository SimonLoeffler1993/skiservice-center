import { useEffect, useRef, useState, useCallback } from 'react';

// sekunden: Dauer des Countdowns
export default function useTimer(sekunden = 10) {
    const [countdown, setCountdown] = useState(sekunden);
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
        setCountdown(sekunden);
        setPause(false);
        startTimer();
    }, [startTimer, sekunden]);

    return { countdown, pause, setPause, resetTimer };
}