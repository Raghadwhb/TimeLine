import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPost({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postText, setPostText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/timeline', { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          const post = res.data.posts.find(p => p._id === id);
          if (!post) {
            setError('Post not found');
          } else if (user._id !== post.user?._id?.toString()) {
            navigate('/');
          } else {
            setPostText(post.post);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Server error');
        setLoading(false);
      });
  }, [id]);

  const handleEdit = e => {
    e.preventDefault();
    setError('');

    axios.put(
      `http://localhost:5000/edit-post/${id}`,
      { post: postText },
      { withCredentials: true }
    )
      .then(res => {
        if (res.data.success) {
          navigate('/'); 
        } else {
          setError(res.data.error);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Server error'));
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="signlog_container">
      <div className="login">
        <h1>Edit Post</h1>

        {error && <h3 style={{ color: 'red' }}>{error}</h3>}

        <form onSubmit={handleEdit}>
          <textarea
            rows="5"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
            placeholder="Edit your post (min 25 characters)"
            value={postText}
            onChange={e => setPostText(e.target.value)}
            required
          />
          <button type="submit" style={{ marginTop: '10px' }}>Save Changes</button>
        </form>

        <p style={{ marginTop: '10px' }}>
          <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/')}
          >
            ← Back to Timeline
          </span>
        </p>
      </div>
    </div>
  );
}
