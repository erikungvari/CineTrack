import React from 'react';
import TitleCard from './TitleCard';
import { Title } from '../types';
import './TitleRow.css';

interface TitleRowProps {
  title: string;
  titles: Title[];
}

function TitleRow({ title, titles }: TitleRowProps): React.ReactElement | null {
  if (!titles || titles.length === 0) return null;

  return (
    <div className="title-row">
      <h2 className="section-title">{title}</h2>
      <div className="title-row-scroll">
        {titles.map((t) => (
          <TitleCard key={t.title_id?.toString?.()} title={t} />
        ))}
      </div>
    </div>
  );
}

export default TitleRow;
