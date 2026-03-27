import React, { useState } from 'react';

interface StarRatingProps {
  rating?: number;
  onRate?: (star: number) => void;
  readonly?: boolean;
}

function StarRating({
  rating = 0,
  onRate,
  readonly = false,
}: StarRatingProps): React.ReactElement {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default StarRating;
