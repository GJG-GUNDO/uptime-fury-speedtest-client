import React from "react";
import logo from "./logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] dark:bg-[#121212]">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-8 sm:px-6 lg:space-y-16 lg:px-8">
        
        <hr className="border-gray-300 dark:border-gray-700 w-full" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:space-y-0 space-y-4">
          <div className="flex items-center justify-center sm:justify-start">
            <img
              src={logo}
              className="mr-3 h-8 sm:h-12" // Responsive logo size
              alt="Logo"
            />
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">UPTIME FURY</p>
          </div>
          <p className="text-center text-sm sm:text-md lg:text-md text-gray-500 dark:text-gray-400">
            &copy; 2024 Uptime Fury. All rights reserved.
          </p>
          <div className="flex justify-center sm:justify-end space-x-4 text-sm sm:text-md text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:underline">Terms</a>
            <span>|</span>
            <a href="#" className="hover:underline">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
