import React, { useEffect, useState } from 'react';
import { getTitles, getTrending } from '../api';
import TitleRow from '../components/TitleRow';
import TitleCard from '../components/TitleCard';
import { Title } from '../types';
import './Home.css';

interface HomeProps {
  userId: string;
}

function Home({ userId }: HomeProps): React.ReactElement {
  const [titlesByGenre, setTitlesByGenre] = useState<Record<string, Title[]>>({});
  const [trending, setTrending] = useState<Title[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        const [titlesData, trendingData] = await Promise.all([
          getTitles(null, 20),
          getTrending('Action', 1).catch(() => ({ trending: [] })),
        ]);
        setTitlesByGenre((titlesData.titles as Record<string, Title[]>) || {});
        setTrending(trendingData.trending || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Nacitani...</div>;
  if (error) return <div className="error">Chyba: {error}</div>;

  const genres = Object.keys(titlesByGenre);
  const heroTitle = genres.length > 0 ? titlesByGenre[genres[0]]?.[0] : null;

  return (
    <div className="home">
      {heroTitle && (
        <div
          className="hero"
          style={{
            backgroundImage: heroTitle.poster_url
              ? `url(${heroTitle.poster_url})`
              : 'none',
          }}
        >
          <div className="hero-overlay">
            <div className="hero-content container">
              <h1>{heroTitle.title}</h1>
              <p className="hero-description">{heroTitle.description}</p>
              <div className="hero-meta">
                <span>{heroTitle.year}</span>
                <span>{heroTitle.type}</span>
                {heroTitle.avg_rating != null && heroTitle.avg_rating > 0 && (
                  <span>&#9733; {heroTitle.avg_rating?.toFixed?.(1)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container home-content">
        {trending.length > 0 && (
          <div className="title-row">
            <h2 className="section-title">Trending - Action</h2>
            <div className="title-row-scroll">
              {trending.map((t) => (
                <TitleCard key={t.title_id} title={t} />
              ))}
            </div>
          </div>
        )}

        {genres.map((genre) => (
          <TitleRow
            key={genre}
            title={genre}
            titles={titlesByGenre[genre]}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
