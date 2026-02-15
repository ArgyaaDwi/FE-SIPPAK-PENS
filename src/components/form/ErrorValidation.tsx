"use client";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";

interface AlertErrorProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

const ErrorValidation: React.FC<AlertErrorProps> = ({
  message,
  onClose,
  duration = 2000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="relative my-2 mt-3 rounded-lg border border-red-500 bg-red-100 p-4 text-red-700 text-sm font-medium">
      <button
        onClick={handleClose}
        className="absolute top-4 right-2 text-red-700 hover:text-red-900"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>
      {message}
    </div>
  );
};

export default ErrorValidation;
