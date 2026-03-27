import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '../types';
import './TitleCard.css';

interface TitleCardProps {
  title: Title;
}

function TitleCard({ title }: TitleCardProps): React.ReactElement {
  const id = title.title_id?.toString?.() || title.title_id;
  const [imgError, setImgError] = React.useState(false);

  return (
    <Link to={`/title/${id}`} className="title-card">
      <div className="title-card-poster">
        {title.poster_url && !imgError ? (
          <img
            src={title.poster_url}
            alt={title.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="title-card-placeholder">
            <span>{title.title?.[0] || '?'}</span>
            <span className="title-card-placeholder-title">{title.title}</span>
          </div>
        )}
        <div className="title-card-overlay">
          <div className="title-card-info">
            <h3>{title.title}</h3>
            <div className="title-card-meta">
              {title.year && <span>{title.year}</span>}
              {title.avg_rating != null && title.avg_rating > 0 && (
                <span>&#9733; {typeof title.avg_rating === 'number' ? title.avg_rating.toFixed(1) : title.avg_rating}</span>
              )}
              {title.type && <span className="title-type">{title.type}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TitleCard;
