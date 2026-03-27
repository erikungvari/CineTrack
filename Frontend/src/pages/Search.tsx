import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTitles } from '../api';
import TitleCard from '../components/TitleCard';
import { Title } from '../types';
import './Search.css';

const GENRES: string[] = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Documentary'];

function Search(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setLoading(true);
        if (selectedGenre) {
          const data = await getTitles(selectedGenre, 50);
          let results = (data.titles as Title[]) || [];
          if (query) {
            results = results.filter((t) =>
              t.title?.toLowerCase().includes(query.toLowerCase())
            );
          }
          setTitles(results);
        } else {
          const data = await getTitles(null, 50);
          const allTitles = Object.values(
            (data.titles as Record<string, Title[]>) || {}
          ).flat();
          if (query) {
            setTitles(
              allTitles.filter((t) =>
                t.title?.toLowerCase().includes(query.toLowerCase())
              )
            );
          } else {
            setTitles(allTitles);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedGenre, query]);

  return (
    <div className="search-page container">
      <h1>Katalog titulu</h1>
      {query && <p className="search-query">Vysledky pro: "{query}"</p>}

      <div className="genre-filters">
        <button
          className={`genre-btn ${!selectedGenre ? 'active' : ''}`}
          onClick={() => setSelectedGenre('')}
        >
          Vse
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-btn ${selectedGenre === g ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Nacitani...</div>
      ) : (
        <div className="search-results">
          {titles.length === 0 ? (
            <p className="empty-text">Zadne tituly nenalezeny.</p>
          ) : (
            <div className="titles-grid">
              {titles.map((t) => (
                <TitleCard key={t.title_id?.toString()} title={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
