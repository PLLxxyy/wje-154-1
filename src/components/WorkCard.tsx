import React from 'react';
import type { Work, Author } from '../types';

interface Props {
  work: Work;
  author: Author | undefined;
  onClick: (id: string) => void;
}

function getAvgRating(ratings: Work['ratings']): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
}

function renderStars(avg: number): string {
  const full = Math.floor(avg);
  const half = avg - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

export const WorkCard: React.FC<Props> = ({ work, author, onClick }) => {
  const avgRating = getAvgRating(work.ratings);
  return (
    <div className="work-card" onClick={() => onClick(work.id)}>
      <img className="card-cover" src={work.cover} alt={work.title} style={{ height: 200 + (parseInt(work.id.replace(/\D/g, ''), 10) % 4) * 30 }} />
      <div className="card-body">
        <div className="card-title">{work.title}</div>
        <div className="card-rating">
          <span className="rating-stars">{renderStars(avgRating)}</span>
          {work.ratings.length > 0 && (
            <span className="rating-score">{avgRating.toFixed(1)}</span>
          )}
        </div>
        <div className="card-meta">
          <div className="card-author">
            {author && <img src={author.avatar} alt={author.name} />}
            <span>{author?.name || '匿名'}</span>
          </div>
          <div className="card-likes">
            <span className="heart">♥</span>
            <span>{work.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
