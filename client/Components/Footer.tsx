import React from "react";

function Footer() {
  return (
    <footer className="relative py-16 bg-gradient-to-t from-gray-100 via-white to-white border-t border-gray-200">
      <div className="mx-auto px-4 text-center">
        <p className="text-sm md:text-base font-medium text-gray-600 tracking-wide transition-colors duration-300 hover:text-gray-900">
          &copy; {new Date().getFullYear()} NextHire. All rights reserved.
        </p>
      </div>

      
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </footer>
  );
}

export default Footer;
