import React from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search...', glass = false }) {
  return (
    <div className="position-relative w-100">
      <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-secondary">
        <FiSearch size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control rounded-pill py-2.5 ps-5 pe-4 ${glass ? 'glass-effect bg-white bg-opacity-50' : 'bg-light border-0'}`}
        style={{ fontSize: '0.875rem' }}
      />
    </div>
  );
}
