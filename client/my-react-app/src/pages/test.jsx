import React from 'react'; 
import { Link } from "react-router-dom";

export default function TestPage() {
  return (
    <div className="flex flex-wrap gap-4 p-6">
      <Link to="/intro">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Intro 
        </button>
      </Link>
      <Link to="/about">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          About Us
        </button>
      </Link>
      <Link to="/trend">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Trend Forecasting
        </button>
      </Link>
      <Link to="/color">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Color Forecasting
        </button>
      </Link>
      <Link to="/collage">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Collage Creator
        </button>
      </Link>
      <Link to="/market">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Market Research
        </button>
      </Link>
      <Link to="/fashion">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          Fashion Week Review
        </button>
      </Link>

    </div>
  );
}
