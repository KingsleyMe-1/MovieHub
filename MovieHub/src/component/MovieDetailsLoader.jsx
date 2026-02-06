import "../styles/MovieDetailsLoader.css"

const MovieDetailsLoader = () => {
  return (
    <div className="details-page">
        <div className="skeleton-back-btn"></div>

        <div className="skeleton-backdrop">
            <div className="bakcdrop-overlay"></div>
        </div>

        <div className="details-container">
            <div className="details-header skeleton-header">
                <div className="poster-section">
                    <div className="skeleton-poster"></div>
                </div>

                <div className="info-section">
                    <div className="skeleton-title"></div>

                    <div className="action-buttons">
                        <div className="skeleton-action-btn"></div>
                        <div className="skeleton-action-btn"></div>
                    </div>

                    <div className="basic-info">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="info-item skeleton-info-item">
                                <div className="skeleton-label"></div>
                                <div className="skeleton-value"></div>
                            </div>
                        ))}
                    </div>

                    <div className="skeleton-genres">
                        <div className="skeleton-label-full"></div>
                        <div className="genres-list">
                            {Array.from({ length: 3 }, (_, i) => (
                                <div key={i} className="skeleton-genre-tag"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overview-section skeleton-section">
                <div className="skeleton-section-title"></div>
                <div className="skeleton-paragraph-line"></div>
                <div className="skeleton-paragraph-line"></div>
                <div className="skeleton-paragraph-line short"></div>
            </div>

            <div className="cast-section skeleton-section">
                <div className="skeleton-section-title"></div>
                <div className="cast-list">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="skeleton-cast-item">
                            <div className="skeleton-cast-image"></div>
                            <div className="skeleton-cast-name"></div>
                            <div className="skeleton-cast-role"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    </div>
  )
}

export default MovieDetailsLoader