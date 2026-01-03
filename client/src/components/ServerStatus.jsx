import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function ServerStatus() {
  const [isChecking, setIsChecking] = useState(true);
  const [countdown, setCountdown] = useState(50);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasChecked.current) return;
    hasChecked.current = true;

    let countdownInterval = null;
    let retryInterval = null;
    let timeoutId = null;

    const checkServer = async () => {
      try {
        const apiBase = import.meta.env.VITE_DB_URL || '';
        const response = await axios.get(`${apiBase}/`, { timeout: 5000 });
        
        // Server is up
        setIsChecking(false);
        toast.success('Server is ready!', {
          duration: 2000,
          position: 'top-center',
        });
      } catch (error) {
        // Server is down or starting up
        const toastId = toast.loading(
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">Server is waking up...</span>
            <span className="text-sm">Starting in ~{countdown}s</span>
            <span className="text-xs text-gray-500">Free tier cold start</span>
          </div>,
          {
            duration: Infinity,
            position: 'top-center',
          }
        );

        // Countdown timer
        let currentCountdown = countdown;
        countdownInterval = setInterval(() => {
          currentCountdown -= 1;
          setCountdown(currentCountdown);

          if (currentCountdown <= 0) {
            clearInterval(countdownInterval);
          }

          toast.loading(
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold">Server is waking up...</span>
              <span className="text-sm">Starting in ~{currentCountdown}s</span>
              <span className="text-xs text-gray-500">Free tier cold start</span>
            </div>,
            {
              id: toastId,
              duration: Infinity,
            }
          );
        }, 1000);

        // Retry server check every 3 seconds
        retryInterval = setInterval(async () => {
          try {
            await axios.get(`${apiBase}/`, { timeout: 5000 });
            clearInterval(retryInterval);
            clearInterval(countdownInterval);
            toast.dismiss(toastId);
            toast.success('Server is ready!', {
              duration: 3000,
              position: 'top-center',
            });
            setIsChecking(false);
          } catch (err) {
            // Still waiting...
          }
        }, 3000);

        // Cleanup after 60 seconds
        timeoutId = setTimeout(() => {
          clearInterval(countdownInterval);
          clearInterval(retryInterval);
          if (isChecking) {
            toast.dismiss(toastId);
            toast.error('Server startup taking longer than expected. Please refresh.', {
              duration: 5000,
              position: 'top-center',
            });
            setIsChecking(false);
          }
        }, 60000);
      }
    };

    checkServer();

    // Cleanup function
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (retryInterval) clearInterval(retryInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        success: {
          iconTheme: {
            primary: '#14b8a6',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

export default ServerStatus;
