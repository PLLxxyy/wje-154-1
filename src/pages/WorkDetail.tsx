import React, { useState } from 'react';
import type { Work, Author, CurrentUser } from '../types';
import { AuthorCard } from '../components/AuthorCard';
import { CommentSection } from '../components/CommentSection';

interface Props {
  work: Work;
  author: Author | undefined;
  currentUser: CurrentUser | null;
  onBack: () => void;
  onToggleLike: (workId: string) => void;
  onToggleFavorite: (workId: string) => void;
  onFollow: (authorId: string) => void;
  onAddComment: (workId: string, text: string) => void;
  onAddReply: (workId: string, commentId: string, text: string) => void;
  onRate: (workId: string, score: number) => void;
}

function getAvgRating(ratings: Work['ratings']): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
}

function getUserRating(ratings: Work['ratings'], userId: string | undefined): number {
  if (!userId) return 0;
  const r = ratings.find((x) => x.userId === userId);
  return r ? r.score : 0;
}

export const WorkDetail: React.FC<Props> = ({
  work, author, currentUser, onBack, onToggleLike, onToggleFavorite, onFollow, onAddComment, onAddReply, onRate,
}) => {
  const isLiked = currentUser ? work.likes.includes(currentUser.id) : false;
  const isFavorited = currentUser ? work.favorites.includes(currentUser.id) : false;
  const avgRating = getAvgRating(work.ratings);
  const myRating = getUserRating(work.ratings, currentUser?.id);
  const [hoverRating, setHoverRating] = useState(0);

  const diffClass = work.difficulty === '简单' ? 'easy' : work.difficulty === '中等' ? 'medium' : 'hard';

  const renderStaticStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(score)) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i - score < 1 && i - score > 0) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star">☆</span>);
      }
    }
    return stars;
  };

  const renderInteractiveStars = () => {
    const displayScore = hoverRating || myRating;
    return (
      <div
        className="interactive-stars"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`star interactive ${i <= displayScore ? 'filled' : ''}`}
            onMouseEnter={() => setHoverRating(i)}
            onClick={() => currentUser && onRate(work.id, i)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="back-link" onClick={onBack}>← 返回列表</div>
      <div className="detail-page">
        <div className="detail-main">
          <h1 className="detail-title">{work.title}</h1>
          <div className="detail-info">
            <span className="tag">{work.category}</span>
            <span className={`difficulty-badge difficulty-${diffClass}`}>{work.difficulty}</span>
            <span>{work.steps.length} 个步骤</span>
          </div>
          <div className="detail-rating">
            <div className="rating-display">
              <span className="rating-stars-big">{renderStaticStars(avgRating)}</span>
              <span className="rating-avg">{work.ratings.length > 0 ? avgRating.toFixed(1) : '暂无评分'}</span>
              <span className="rating-count">({work.ratings.length} 条评价)</span>
            </div>
            <div className="rating-action">
              <span className="rating-label">{myRating > 0 ? `你的评分：${myRating}星` : '给这个教程打分：'}</span>
              {renderInteractiveStars()}
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 16 }}>{work.description}</p>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>制作步骤</h3>
          <div className="step-list">
            {work.steps.map((step, idx) => (
              <div key={idx} className="step-item">
                <div className="step-num">{idx + 1}</div>
                <img className="step-img" src={step.image} alt={`步骤${idx + 1}`} />
                <p className="step-text">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="action-bar">
            <button
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => onToggleLike(work.id)}
            >
              {isLiked ? '❤️' : '🤍'} {work.likes.length}
            </button>
            <button
              className={`action-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(work.id)}
            >
              {isFavorited ? '⭐' : '☆'} 收藏 {work.favorites.length}
            </button>
          </div>

          <CommentSection
            comments={work.comments}
            currentUserId={currentUser?.id}
            currentUser={currentUser}
            onAddComment={(text) => onAddComment(work.id, text)}
            onAddReply={(commentId, text) => onAddReply(work.id, commentId, text)}
          />
        </div>

        <div className="sidebar">
          {author && (
            <AuthorCard
              author={author}
              currentUserId={currentUser?.id}
              onFollow={onFollow}
            />
          )}

          <div className="sidebar-card">
            <h3>材料清单</h3>
            {work.materials.map((m, i) => (
              <div key={i} className="material-item">
                <span>{m.name}</span>
                <span style={{ color: '#b8860b' }}>{m.amount}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-card">
            <h3>难度等级</h3>
            <span className={`difficulty-badge difficulty-${diffClass}`}>{work.difficulty}</span>
          </div>

          {work.tips && (
            <div className="sidebar-card">
              <h3>小贴士</h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{work.tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
