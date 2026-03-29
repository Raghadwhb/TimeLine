import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Timeline({ user, setUser }) {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [error, setError] = useState('');

  const fetchPosts = () => {
    axios.get('http://localhost:5000/timeline', { withCredentials: true })
      .then(res => {
        if (res.data.success) setPosts(res.data.posts);
      })
      .catch(err => console.log(err));
  };

  const handlePost = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/new-post', { post: postText }, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setPostText('');
          fetchPosts();
        } else {
          setError(res.data.error);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Server error'));
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      {user && (
        <div className="enter-post">
          <form onSubmit={handlePost}>
            <input type="text" className="post-input" placeholder="Enter your post" value={postText} onChange={e => setPostText(e.target.value)} />
            <input type="submit" className="postbtn" value="Post" />
          </form>
        </div>
      )}
      {error && <div className="error-msg"><h3 style={{ color: 'red' }}>{error}</h3></div>}

      {posts.map(post => (
        <div className="post-container" key={post._id}>
          <p className="name-date">{post.user ? post.user.firstName + ' ' + post.user.lastName : 'Unknown'}</p>
          <div className="msg">{post.post}</div>
          {user && (
            <div className="post-buttons">
              <button onClick={() => axios.get(`http://localhost:5000/delete/post/${post._id}`, { withCredentials: true }).then(fetchPosts)}>delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}