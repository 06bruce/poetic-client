import React from 'react';

export default function Avatar({ src, alt, size = 48 }) {
  return (
    <img
      src={src || '/default-avatar.png'}
      alt={alt || 'User avatar'}
      width={size}
      height={size}
      className="rounded-full object-cover border border-gray-700 bg-gray-800"
      style={{ width: size, height: size }}
    />
  );
}
