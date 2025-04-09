
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <Link to="/" className="text-xl font-bold text-primary">
            S Corp Tax Calculator
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Calculator
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Resources
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Mobile menu button - simplified for now */}
          <button className="md:hidden p-2 rounded-md hover:bg-muted">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
