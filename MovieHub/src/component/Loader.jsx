import { SkeletonCard } from './SkeletonCard';

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <ul>
      {Array.from({ length: count }).map((_, index) => (
        <li key={`skeleton-${index}`}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
};

export { SkeletonLoader };
export default SkeletonLoader;
