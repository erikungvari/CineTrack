import React, { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  getTitle,
  getTitleRating,
  getTitleReviews,
  getUserRating,
  getUserProgress,
  submitRating,
  submitReview,
  recordWatch,
  addToWatchlist,
} from '../api';
import StarRating from '../components/StarRating';
import { Title, Rating, Review, ProgressResponse } from '../types';
import './TitleDetail.css';

interface TitleDetailProps {
  userId: string;
}

function TitleDetail({ userId }: TitleDetailProps): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<Title | null>(null);
  const [avgRating, setAvgRating] = useState<Rating>({ avg_rating: 0, count: 0 });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        const [titleData, ratingData, reviewsData, userRatingData, progressData] =
          await Promise.all([
            getTitle(id!),
            getTitleRating(id!),
            getTitleReviews(id!, 10),
            getUserRating(userId, id!).catch(() => ({ rating: null })),
            getUserProgress(userId, id!).catch(() => ({ progress_s: 0, completed: false })),
          ]);
        setTitle(titleData);
        setAvgRating(ratingData);
        setReviews(reviewsData.reviews || []);
        setUserRating(userRatingData.rating);
        setProgress(progressData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, userId]);

  const handleRate = async (rating: number): Promise<void> => {
    try {
      const result = await submitRating({ user_id: userId, title_id: id!, rating });
      setUserRating(rating);
      setAvgRating((prev) => ({ ...prev, avg_rating: result.avg_rating }));
      showMessage('Hodnoceni ulozeno!');
    } catch (err) {
      showMessage('Chyba pri hodnoceni: ' + (err as Error).message);
    }
  };

  const handleReview = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      await submitReview({
        title_id: id!,
        user_id: userId,
        username: 'user',
        review_text: reviewText,
        rating: userRating || 0,
      });
      setReviewText('');
      const reviewsData = await getTitleReviews(id!, 10);
      setReviews(reviewsData.reviews || []);
      showMessage('Recenze pridana!');
    } catch (err) {
      showMessage('Chyba: ' + (err as Error).message);
    }
  };

  const handleWatch = async (): Promise<void> => {
    try {
      await recordWatch({
        user_id: userId,
        title_id: id!,
        title: title!.title,
        genre: title!.genre || '',
        progress_s: Math.min((progress?.progress_s || 0) + 600, title!.duration_s || 9999),
        completed: (progress?.progress_s || 0) + 600 >= (title!.duration_s || 9999),
      });
      const progressData = await getUserProgress(userId, id!);
      setProgress(progressData);
      showMessage('Progress aktualizovan!');
    } catch (err) {
      showMessage('Chyba: ' + (err as Error).message);
    }
  };

  const handleAddWatchlist = async (): Promise<void> => {
    try {
      await addToWatchlist(userId, {
        title_id: id!,
        title: title!.title,
        genre: title!.genre || '',
      });
      showMessage('Pridano do watchlistu!');
    } catch (err) {
      showMessage('Chyba: ' + (err as Error).message);
    }
  };

  const showMessage = (msg: string): void => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="loading">Nacitani...</div>;
  if (!title) return <div className="error">Titul nenalezen</div>;

  const progressPercent: number = title.duration_s
    ? Math.min(100, Math.round(((progress?.progress_s || 0) / title.duration_s) * 100))
    : 0;

  return (
    <div className="title-detail">
      <div
        className="title-hero"
        style={{
          backgroundImage: title.poster_url ? `url(${title.poster_url})` : 'none',
        }}
      >
        <div className="title-hero-overlay">
          <div className="container title-hero-content">
            <h1>{title.title}</h1>
            <div className="title-meta">
              <span>{title.year}</span>
              <span className="title-type-badge">{title.type}</span>
              <span>{Math.floor((title.duration_s || 0) / 60)} min</span>
              <span>&#9733; {avgRating.avg_rating?.toFixed?.(1) || '0.0'} ({avgRating.count} hodnoceni)</span>
            </div>
            {title.director && <p className="title-director">Rezie: {title.director}</p>}
            {title.cast_list && title.cast_list.length > 0 && (
              <p className="title-cast">Obsazeni: {title.cast_list.join(', ')}</p>
            )}
            <p className="title-description">{title.description}</p>

            <div className="title-actions">
              <button className="btn btn-primary" onClick={handleWatch}>
                &#9654; Sledovat
              </button>
              <button className="btn btn-secondary" onClick={handleAddWatchlist}>
                + Watchlist
              </button>
            </div>

            {progress && progress.progress_s > 0 && (
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="progress-text">
                  {progressPercent}% {progress.completed ? '(Dokonceno)' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {message && <div className="toast">{message}</div>}

      <div className="container title-body">
        <div className="rating-section">
          <h3>Vase hodnoceni</h3>
          <StarRating rating={userRating || 0} onRate={handleRate} />
          {userRating && <span className="your-rating">{userRating}/5</span>}
        </div>

        <div className="reviews-section">
          <h3>Recenze ({reviews.length})</h3>

          <form onSubmit={handleReview} className="review-form">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Napiste recenzi..."
              rows={3}
            />
            <button type="submit" className="btn btn-primary">
              Odeslat recenzi
            </button>
          </form>

          <div className="reviews-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <strong>{r.username}</strong>
                  <span className="review-date">
                    {new Date(r.created_at).toLocaleDateString('cs-CZ')}
                  </span>
                  {r.rating > 0 && (
                    <span className="review-rating">&#9733; {r.rating}</span>
                  )}
                </div>
                <p>{r.review_text}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="no-reviews">Zatim zadne recenze.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitleDetail;
