import React from 'react';
import PoemCard from './PoemCard';

export default function FavoritePoems({ poems }) {
  if (!poems || poems.length === 0) {
    return (
      <div className="p-4 rounded-xl glass text-center text-gray-400 mt-4">
        <h4 className="text-base font-medium mb-2">No favorite poems yet</h4>
        <p>Like poems to add them to your favorites.</p>
      </div>
    );
  }
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold text-white mb-2">Favorite Poems</h3>
      <div className="space-y-4">
        {poems.map(poem => (
          <PoemCard key={poem._id} poem={poem} />
        ))}
      </div>
    </div>
  );
}
