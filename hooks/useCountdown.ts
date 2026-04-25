"use client";

import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialMinutes: number = 10) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const reset = useCallback(() => {
    setSeconds(initialMinutes * 60);
  }, [initialMinutes]);

  return {
    minutes,
    seconds: secs,
    totalSeconds: seconds,
    isFinished: seconds <= 0,
    display: `${minutes}:${String(secs).padStart(2, "0")}`,
    reset,
  };
}
