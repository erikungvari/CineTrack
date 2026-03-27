export interface Title {
  title_id: string;
  title: string;
  type?: string;
  genre?: string;
  year?: number;
  director?: string;
  cast_list?: string[];
  description?: string;
  poster_url?: string;
  duration_s?: number;
  avg_rating?: number;
  rating_count?: number;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface WatchHistoryItem {
  user_id: string;
  title_id: string;
  title: string;
  genre: string;
  progress_s: number;
  completed: boolean;
  watched_at: string;
}

export interface WatchlistItem {
  user_id: string;
  title_id: string;
  title: string;
  genre: string;
  added_at: string;
}

export interface Review {
  title_id: string;
  user_id: string;
  username: string;
  review_text: string;
  rating: number;
  created_at: string;
}

export interface Rating {
  avg_rating: number;
  count: number;
}

export interface TitlesResponse {
  titles: Record<string, Title[]> | Title[];
}

export interface HistoryResponse {
  history: WatchHistoryItem[];
  page_state?: string;
}

export interface WatchlistResponse {
  watchlist: WatchlistItem[];
}

export interface ReviewsResponse {
  reviews: Review[];
  page_state?: string;
}

export interface TrendingResponse {
  trending: Title[];
}

export interface RecommendationsResponse {
  recommendations: Title[];
  strategy?: string;
  top_genres?: string[];
}

export interface UserRatingResponse {
  rating: number | null;
}

export interface SubmitRatingResponse {
  avg_rating: number;
}

export interface ProgressResponse {
  progress_s: number;
  completed: boolean;
}
