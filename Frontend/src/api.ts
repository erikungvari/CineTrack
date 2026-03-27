import {
  Title,
  TitlesResponse,
  HistoryResponse,
  WatchlistResponse,
  ReviewsResponse,
  TrendingResponse,
  RecommendationsResponse,
  Rating,
  UserRatingResponse,
  SubmitRatingResponse,
  ProgressResponse,
  User,
  Review,
} from './types';

const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Titles
export const getTitles = (
  genre?: string | null,
  limit?: number,
  pageState?: string
): Promise<TitlesResponse> => {
  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (limit) params.set('limit', String(limit));
  if (pageState) params.set('page_state', pageState);
  return request<TitlesResponse>(`/titles?${params}`);
};

export const getTitle = (id: string): Promise<Title> =>
  request<Title>(`/titles/${id}`);

export const createTitle = (data: Partial<Title>): Promise<Title> =>
  request<Title>('/titles', { method: 'POST', body: JSON.stringify(data) });

// Users
export const registerUser = (username: string, email: string): Promise<User> =>
  request<User>('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, email }),
  });

export const getUser = (id: string): Promise<User> =>
  request<User>(`/users/${id}`);

export const getUserHistory = (
  id: string,
  limit?: number,
  pageState?: string
): Promise<HistoryResponse> => {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (pageState) params.set('page_state', pageState);
  return request<HistoryResponse>(`/users/${id}/history?${params}`);
};

export const getUserProgress = (
  userId: string,
  titleId: string
): Promise<ProgressResponse> =>
  request<ProgressResponse>(`/users/${userId}/progress/${titleId}`);

export const getRecommendations = (
  userId: string
): Promise<RecommendationsResponse> =>
  request<RecommendationsResponse>(`/users/${userId}/recommendations`);

// Watch
interface RecordWatchData {
  user_id: string;
  title_id: string;
  title: string;
  genre: string;
  progress_s: number;
  completed: boolean;
}

export const recordWatch = (data: RecordWatchData): Promise<void> =>
  request<void>('/watch', { method: 'POST', body: JSON.stringify(data) });

// Ratings
interface SubmitRatingData {
  user_id: string;
  title_id: string;
  rating: number;
}

export const submitRating = (data: SubmitRatingData): Promise<SubmitRatingResponse> =>
  request<SubmitRatingResponse>('/ratings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getTitleRating = (titleId: string): Promise<Rating> =>
  request<Rating>(`/titles/${titleId}/rating`);

export const getUserRating = (
  userId: string,
  titleId: string
): Promise<UserRatingResponse> =>
  request<UserRatingResponse>(`/ratings/user/${userId}/${titleId}`);

// Reviews
interface SubmitReviewData {
  title_id: string;
  user_id: string;
  username: string;
  review_text: string;
  rating: number;
}

export const submitReview = (data: SubmitReviewData): Promise<Review> =>
  request<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getTitleReviews = (
  titleId: string,
  limit?: number,
  pageState?: string
): Promise<ReviewsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (pageState) params.set('page_state', pageState);
  return request<ReviewsResponse>(`/reviews/${titleId}?${params}`);
};

// Watchlist
export const getWatchlist = (userId: string): Promise<WatchlistResponse> =>
  request<WatchlistResponse>(`/users/${userId}/watchlist`);

interface AddToWatchlistData {
  title_id: string;
  title: string;
  genre: string;
}

export const addToWatchlist = (
  userId: string,
  data: AddToWatchlistData
): Promise<void> =>
  request<void>(`/users/${userId}/watchlist`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const removeFromWatchlist = (
  userId: string,
  titleId: string
): Promise<void> =>
  request<void>(`/users/${userId}/watchlist/${titleId}`, { method: 'DELETE' });

// Analytics
export const getTrending = (
  genre: string,
  months?: number
): Promise<TrendingResponse> => {
  const params = new URLSearchParams({ genre });
  if (months) params.set('months', String(months));
  return request<TrendingResponse>(`/analytics/trending?${params}`);
};
