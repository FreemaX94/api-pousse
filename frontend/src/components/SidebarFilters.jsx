import React from "react";

const SidebarFilters = ({ filters, onFilterChange }) => {
  const handleCheckbox = (type, value) => {
    const current = filters[type] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange(type, updated);
  };

  const heightOptions = ["0-50", "50-100", "100+"];
  const diameterOptions = ["10", "15", "21", "30"];
  const priceOptions = ["<10", "10-30", ">30"];

  return (
    <aside className="w-full p-4 bg-white border rounded shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>

      <div className="mb-4">
        <p className="font-medium">Hauteur (cm)</p>
        {heightOptions.map(option => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.height?.includes(option)}
              onChange={() => handleCheckbox("height", option)}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-medium">Diamètre pot (cm)</p>
        {diameterOptions.map(option => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.diameter?.includes(option)}
              onChange={() => handleCheckbox("diameter", option)}
            />
            {option} cm
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-medium">Prix (€)</p>
        {priceOptions.map(option => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.price?.includes(option)}
              onChange={() => handleCheckbox("price", option)}
            />
            {option}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-medium">Tags</p>
        {(filters.availableTags || []).map(tag => (
          <label key={tag} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.tags?.includes(tag)}
              onChange={() => handleCheckbox("tags", tag)}
            />
            <span className="bg-gray-200 px-2 rounded">{tag}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default SidebarFilters;
