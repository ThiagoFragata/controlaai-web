import { InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FloatingInput({
  label,
  className,
  type,
  ...props
}: FloatingInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        placeholder=" "
        className={cn(
          "peer w-full px-3 py-3 border border-[#D1D5DB] rounded-lg bg-white text-sm",
          "focus:border-[#007AFF] focus:ring-0 transition-all duration-200 ease-[cubic-bezier(.32,.72,0,1)]",
          isPassword && "pr-10", // espaço pro ícone
          className
        )}
      />

      {/* LABEL FLUTUANTE */}
      <label
        className={cn(
          "absolute left-3 top-3 text-gray-500 text-sm pointer-events-none bg-white px-1",
          "transition-all duration-200 ease-[cubic-bezier(.32,.72,0,1)]",
          "peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500",
          "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#007AFF]",
          "peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs"
        )}
      >
        {label}
      </label>

      {/* TOGGLE VISIBILIDADE DA SENHA */}
      {isPassword && (
        <button
          type="button"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007AFF] transition-colors icon-ios"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
