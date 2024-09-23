import React from "react";
import logo from "./logo.png";


const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] dark:bg-[#121212]">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        
        <hr className="border-gray-300 dark:border-gray-700 w-full" />
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <img
              src={logo}
              className="mr-3 h-8 sm:h-12" // Increased logo size
              alt="Logo"
            />
            <p className="text-md font-bold text-gray-900 dark:text-white">UPTIME FURY</p> {/* Added text */}
          </div>
          <p className="text-md text-gray-500 dark:text-gray-400 text-center flex-1">
            &copy; 2024 Uptime Fury. All rights reserved.
          </p>
          <div className="flex space-x-4 text-md text-gray-500 dark:text-gray-400">
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
