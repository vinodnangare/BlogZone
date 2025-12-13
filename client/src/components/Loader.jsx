import React from 'react';

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <style>{`
        @keyframes spinnerRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinnerRotateReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .spinner-outer {
          animation: spinnerRotate 3s linear infinite;
        }
        .spinner-inner {
          animation: spinnerRotateReverse 2s linear infinite;
        }
        .dot {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
      
      <div className="flex flex-col items-center gap-8">
        {/* Unique Double Ring Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="spinner-outer absolute inset-0 rounded-full border-4 border-transparent border-t-black border-r-black"></div>
          
          {/* Inner rotating ring (opposite direction) */}
          <div className="spinner-inner absolute inset-2 rounded-full border-3 border-transparent border-b-black border-l-black"></div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex items-center gap-1">
          <p className="text-black font-medium text-lg">Loading</p>
          <div className="flex gap-1">
            <span className="dot w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="dot w-1.5 h-1.5 bg-black rounded-full"></span>
            <span className="dot w-1.5 h-1.5 bg-black rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
