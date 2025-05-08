import React from 'react';
import { FaBars, FaGlobe, FaHeart } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2  shadow-sm bg-white">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3">
        {/* Menu Icon */}
        <button className="text-primary text-lg">
          <FaBars />
        </button>

        {/* Logo & Text */}
        <div>
          <h1 className="text-primary font-bold leading-tight text-center ">
            Al Farooq Islamic<br />Research Center
          </h1>
          <p className="text-[10px] text-gray-600 mt-[-2px] text-center ">
            Founded And Supervised By:<br />
            Shaykh Ahmad Bin Ihtisham
          </p>
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3">
        {/* Contribute Button */}
        <a
          href="https://contribution.islamqa.info"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary transition"
        >
          <FaHeart className="text-white" /> Contribute
        </a>

        {/* Language Button */}
        <button className="flex items-center gap-2 bg-blue-100 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
          <FaGlobe /> English
        </button>
      </div>
    </header>
  );
};

export default Header;
