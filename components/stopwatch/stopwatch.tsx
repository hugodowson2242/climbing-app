import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface StopwatchProps {
  duration: number; // Duration in tenths of seconds
  onComplete?: () => void; // Callback when timer reaches the duration
}

export default function Stopwatch({ duration, onComplete }: StopwatchProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration); // Time remaining in tenths of seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Convert time (in tenths of seconds) to minutes:seconds:tenths format
  const formatTime = (timeInTenths: number) => {
    const totalSeconds = Math.floor(timeInTenths / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = timeInTenths % 10;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${tenths}`;
  };

  // Start the stopwatch
  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  // Stop the stopwatch
  const stop = () => {
    setIsRunning(false);
  };

  // Reset the stopwatch
  const reset = () => {
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  // Effect to handle the timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;

          // Check if we've reached zero
          if (newTime <= 0) {
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0; // Stop at zero
          }

          return newTime;
        });
      }, 100); // Update every 100ms (tenths of seconds)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, duration, onComplete]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeRemaining(duration);
    setIsRunning(false);
  }, [duration]);

  // Calculate progress percentage (how much time has elapsed)
  const progressPercentage = Math.max(((duration - timeRemaining) / duration) * 100, 0);

  return (
    <View style={{
      backgroundColor: '#f8f9fa',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      marginVertical: 16
    }}>
      {/* Timer Display */}
      <Text style={{
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: timeRemaining <= 0 ? '#dc3545' : '#212529',
        marginBottom: 16
      }}>
        {formatTime(timeRemaining)}
      </Text>

      {/* Progress Bar */}
      <View style={{
        width: '100%',
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        marginBottom: 20,
        overflow: 'hidden'
      }}>
        <View style={{
          width: `${progressPercentage}%`,
          height: '100%',
          backgroundColor: timeRemaining <= 0 ? '#dc3545' : '#007AFF',
          borderRadius: 4
        }} />
      </View>

      {/* Target Duration Display */}
      <Text style={{
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 20
      }}>
        Target: {formatTime(duration)}
      </Text>

      {/* Control Buttons */}
      <View style={{
        flexDirection: 'row',
        gap: 12
      }}>
        <TouchableOpacity
          onPress={start}
          disabled={isRunning || timeRemaining <= 0}
          style={{
            backgroundColor: (isRunning || timeRemaining <= 0) ? '#6c757d' : '#28a745',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            Start
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stop}
          disabled={!isRunning}
          style={{
            backgroundColor: !isRunning ? '#6c757d' : '#dc3545',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            Stop
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={reset}
          style={{
            backgroundColor: '#6f42c1',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
          }}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <Text style={{
        marginTop: 16,
        fontSize: 14,
        color: '#6c757d',
        fontStyle: 'italic'
      }}>
        {timeRemaining <= 0 ? 'Time Complete!' :
         isRunning ? 'Counting down...' :
         timeRemaining < duration ? 'Paused' : 'Ready to start'}
      </Text>
    </View>
  );
}
