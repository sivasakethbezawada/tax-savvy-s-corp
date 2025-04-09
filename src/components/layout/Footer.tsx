
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">S Corp Tax Calculator</h3>
            <p className="text-muted-foreground text-sm">
              Simplifying tax planning for S Corporation owners.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="text-muted-foreground text-sm">
              This calculator provides estimates only. Consult with a tax professional for advice.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-muted-foreground text-sm">
            © {currentYear} S Corp Tax Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
