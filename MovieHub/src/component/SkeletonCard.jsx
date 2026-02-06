import "../styles/SkeletonCard.css"

export const SkeletonCard = () => {
  return (
    <div>
        <div className="skeleton-poster"></div>
        <div className="skeleton-title"></div>
        <div className="content">
            <div className="skeleton-rating">
                <div className="skeleton-star"></div>
                <span className="skeleton-dot"></span>
                <div className="skeleton-text-small"></div>
                <span className="skeleton-dot"></span>
                <div className="skeleton-text-small"></div>
            </div>
        </div>
    </div>
  )
}
