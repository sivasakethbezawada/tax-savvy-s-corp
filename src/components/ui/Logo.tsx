
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6" />
        <path d="M12 18v2" />
        <path d="M12 4v2" />
      </svg>
    </div>
  );
};

export default Logo;
