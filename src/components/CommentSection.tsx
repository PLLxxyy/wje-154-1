import React, { useState } from 'react';
import type { Comment as CommentType } from '../types';

interface Props {
  comments: CommentType[];
  currentUserId: string | undefined;
  currentUser: { name: string; avatar: string } | null;
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
}

export const CommentSection: React.FC<Props> = ({ comments, currentUserId, currentUser, onAddComment, onAddReply }) => {
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const topComments = comments.filter((c) => !c.replyToId);
  const getReplies = (parentId: string) =>
    comments
      .filter((c) => c.replyToId === parentId)
      .sort((a, b) => a.createdAt - b.createdAt);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;
    onAddReply(commentId, replyText.trim());
    setReplyText('');
    setReplyingTo(null);
  };

  const formatTime = (ts: number): string => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const renderComment = (c: CommentType, isReply?: boolean) => (
    <div key={c.id} className="comment-item" style={isReply ? { marginLeft: 48, marginTop: 8 } : undefined}>
      <img src={c.userAvatar} alt="" />
      <div className="comment-body">
        <div className="comment-author">{c.userName}</div>
        <div className="comment-time">{formatTime(c.createdAt)}</div>
        <div className="comment-text">{c.text}</div>
        {currentUserId && currentUser && !isReply && (
          <button
            className="reply-btn"
            onClick={() => {
              setReplyingTo(replyingTo === c.id ? null : c.id);
              setReplyText('');
            }}
          >
            回复
          </button>
        )}
        {replyingTo === c.id && (
          <div className="reply-input-wrap">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`回复 ${c.userName}...`}
            />
            <button className="comment-submit" onClick={() => handleReplySubmit(c.id)}>回复</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="comments-section">
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        评论 ({comments.length})
      </h3>
      {currentUserId && currentUser && (
        <div className="comment-input-wrap">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下你的想法..."
          />
          <button className="comment-submit" onClick={handleSubmit}>发表</button>
        </div>
      )}
      {!currentUserId && (
        <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>登录后可以发表评论</p>
      )}
      {topComments.slice().sort((a, b) => b.createdAt - a.createdAt).map((c) => (
        <React.Fragment key={c.id}>
          {renderComment(c)}
          {getReplies(c.id).map((r) => renderComment(r, true))}
        </React.Fragment>
      ))}
      {comments.length === 0 && (
        <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '20px 0' }}>暂无评论，来抢沙发吧</p>
      )}
    </div>
  );
};
