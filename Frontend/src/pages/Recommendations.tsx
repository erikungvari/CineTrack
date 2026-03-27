import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../api';
import TitleCard from '../components/TitleCard';
import { RecommendationsResponse } from '../types';
import './Recommendations.css';

interface RecommendationsProps {
  userId: string;
}

function Recommendations({ userId }: RecommendationsProps): React.ReactElement {
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        const result = await getRecommendations(userId);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) return <div className="loading">Nacitani doporuceni...</div>;

  return (
    <div className="recommendations container">
      <h1>Doporuceni pro vas</h1>
      {data?.strategy && (
        <p className="rec-strategy">
          Strategie: {data.strategy === 'genre-based' ? 'Na zaklade vasich oblibenych zanru' : 'Popularni tituly'}
          {data.top_genres && data.top_genres.length > 0 && (
            <span className="rec-genres"> ({data.top_genres.join(', ')})</span>
          )}
        </p>
      )}

      <div className="rec-grid">
        {data?.recommendations && data.recommendations.length > 0 ? (
          data.recommendations.map((t) => (
            <TitleCard key={t.title_id?.toString()} title={t} />
          ))
        ) : (
          <p className="empty-text">
            Zatim nemame dostatek dat pro doporuceni. Sledujte vice titulu!
          </p>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
