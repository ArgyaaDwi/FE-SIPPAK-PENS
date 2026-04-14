"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  type: string;
  name?: string;
  placeholder: string;
  isPassword?: boolean;
  isDisabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
}

const Input = ({
  label,
  type,
  name,
  placeholder,
  isDisabled = false,
  isPassword = false,
  value,
  onChange,
  isRequired = false,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full mb-3">
      <h3 className="text-black text-base self-start font-medium mb-1">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}{" "}
      </h3>
      <div className="flex items-center border bg-inputColor text-black border-borderInput rounded-xl focus-within:border-black transition duration-300">
        <input
          type={isPassword && showPassword ? "text" : type}
          {...(name && { name })}
          placeholder={placeholder}
          className="p-3 flex-1 bg-transparent outline-none"
          value={value ?? ""}
          onChange={onChange}
          disabled={isDisabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="p-3 text-gray-600"
          >
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
