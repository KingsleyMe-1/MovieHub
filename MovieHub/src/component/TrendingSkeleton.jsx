import React from 'react';
import '../styles/TrendingSkeleton.css';

const TrendingSkeleton = ({ count = 5 }) => {
  return (
    <ul>
      {Array.from({ length: count }).map((_, index) => (
        <li key={`trending-skeleton-${index}`}>
          <p className='skeleton-number'>{index + 1}</p>
          <div className='skeleton-trending-poster'></div>
        </li>
      ))}
    </ul>
  );
};

export { TrendingSkeleton };
export default TrendingSkeleton;
