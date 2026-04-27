import { useEffect, useState } from "react";

interface ToastProps {
  id: string;
  state: string;
  onClose: () => void;
}

export default function Toast({ id, state, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-lg p-4 transition-all duration-300 transform z-50 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${state === 'success' || state === 'completed' ? 'bg-green-500' : state === 'failed' || state === 'error' ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`}></div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Transaction Updated</h4>
          <p className="text-sm text-gray-500">ID: <span className="font-mono text-xs">{id}</span> is now <span className="font-bold text-gray-800">{state}</span></p>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 ml-4 font-bold">
          ✕
        </button>
      </div>
    </div>
  );
}
