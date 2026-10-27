import React from 'react';

// Renders the first letter as a clear serif capital, since the script font's capitals can read as lowercase.
export const CoupleName: React.FC<{ name: string }> = ({ name }) => (
  <span className="whitespace-nowrap">
    <span className="font-playfair italic font-medium">{name.charAt(0).toUpperCase()}</span>
    {name.slice(1)}
  </span>
);
