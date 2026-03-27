import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser, getUserHistory, getWatchlist, removeFromWatchlist } from '../api';
import { User, WatchHistoryItem, WatchlistItem } from '../types';
import './Profile.css';

interface ProfileProps {
  userId: string;
}

function Profile({ userId }: ProfileProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        const [userData, historyData, watchlistData] = await Promise.all([
          getUser(userId),
          getUserHistory(userId, 20),
          getWatchlist(userId),
        ]);
        setUser(userData);
        setHistory(historyData.history || []);
        setWatchlist(watchlistData.watchlist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  const handleRemoveWatchlist = async (titleId: string): Promise<void> => {
    try {
      await removeFromWatchlist(userId, titleId);
      setWatchlist((prev) => prev.filter((w) => w.title_id?.toString() !== titleId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Nacitani...</div>;

  return (
    <div className="profile container">
      <div className="profile-header">
        <div className="profile-avatar">{user?.username?.[0]?.toUpperCase() || '?'}</div>
        <div>
          <h1>{user?.username || 'Uzivatel'}</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">
            Clen od: {user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ') : 'N/A'}
          </p>
        </div>
      </div>

      <section className="profile-section">
        <h2>Historie sledovani ({history.length})</h2>
        {history.length === 0 ? (
          <p className="empty-text">Zatim jste nic nesledovali.</p>
        ) : (
          <div className="history-list">
            {history.map((h, i) => (
              <Link
                to={`/title/${h.title_id}`}
                key={i}
                className="history-item"
              >
                <div className="history-info">
                  <strong>{h.title}</strong>
                  <span className="history-genre">{h.genre}</span>
                </div>
                <div className="history-meta">
                  <span>{h.completed ? 'Dokonceno' : `${Math.floor((h.progress_s || 0) / 60)} min`}</span>
                  <span className="history-date">
                    {new Date(h.watched_at).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2>Watchlist ({watchlist.length})</h2>
        {watchlist.length === 0 ? (
          <p className="empty-text">Watchlist je prazdny.</p>
        ) : (
          <div className="watchlist-list">
            {watchlist.map((w, i) => (
              <div key={i} className="watchlist-item">
                <Link to={`/title/${w.title_id}`} className="watchlist-info">
                  <strong>{w.title}</strong>
                  <span className="watchlist-genre">{w.genre}</span>
                </Link>
                <div className="watchlist-actions">
                  <span className="watchlist-date">
                    {new Date(w.added_at).toLocaleDateString('cs-CZ')}
                  </span>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveWatchlist(w.title_id?.toString())}
                  >
                    Odebrat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
