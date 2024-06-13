// components/Sidebar.js
import Link from 'next/link';
import React from 'react';

const Sidebar = ({ onSelectYear }) => {
  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  return (
    <aside className="sidebar flex flex-col items-start w-full">
      <ul>
        {years.map(year => (
          <li key={year}>
            <button onClick={() => onSelectYear(year)} className="year-filter">
              {year}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
