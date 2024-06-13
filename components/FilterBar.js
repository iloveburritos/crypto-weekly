// components/FilterBar.js
import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Add more years as needed

  return (
    <div className="filter-bar flex flex-col items-start">
      <select onChange={(e) => onFilterChange(e.target.value)} defaultValue="" className="mb-2 bg-transparent">
        <option value="">All</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;