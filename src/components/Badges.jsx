import React from 'react';

const BADGE_LABELS = {
  'first-poem': 'First Poem',
  '100-likes': '100 Likes',
  'popular': 'Popular Poet',
  // Add more badge keys and labels as needed
};

export default function Badges({ badges }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map(badge => (
        <span key={badge} className="px-2 py-1 rounded bg-indigo-800 text-xs text-indigo-100 font-semibold">
          {BADGE_LABELS[badge] || badge}
        </span>
      ))}
    </div>
  );
}
