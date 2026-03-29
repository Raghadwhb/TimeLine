import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Timeline({ user, setUser }) {

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = () => {
    axios.get('http://localhost:5000/timeline', { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setPosts(res.data.posts);
        } else {
          localStorage.removeItem("user");
          setUser(null);
          navigate("/login");
        }
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          setUser(null);
          navigate("/login");
        } else {
          setError(err.response?.data?.error || 'Server error');
        }
      });
  };

  
  const handlePost = e => {
    e.preventDefault();
    setError('');
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

  
  const handleDeletePost = id => {
    setError('');
    axios.delete(`http://localhost:5000/delete/post/${id}`, { withCredentials: true })
      .then(res => {
        if (res.data.success) fetchPosts();
        else setError(res.data.error);
      })
      .catch(err => setError(err.response?.data?.error || 'Server error'));
  };

 
  const handleEditPost = id => {
    navigate(`/edit-post/${id}`);
  };

  
  const handleComment = (e, postId) => {
    e.preventDefault();
    setError('');
    axios.post(
      `http://localhost:5000/new-comment/${postId}`,
      { body: commentText[postId] || '' },
      { withCredentials: true }
    )
      .then(res => {
        if (res.data.success) {
          setCommentText(prev => ({ ...prev, [postId]: '' }));
          fetchPosts();
        } else {
          setError(res.data.error);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Server error'));
  };

  
  const handleDeleteComment = (commentId, postId) => {
    setError('');
    axios.delete(`http://localhost:5000/delete/comment/${commentId}/${postId}`, { withCredentials: true })
      .then(res => {
        if (res.data.success) fetchPosts();
        else setError(res.data.error);
      })
      .catch(err => setError(err.response?.data?.error || 'Server error'));
  };

  
  const handleLogout = () => {
    axios.get('http://localhost:5000/user/logout', { withCredentials: true })
      .then(() => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      })
      .catch(err => console.log(err));
  };


  const isOwner = (ownerId) => {
    return user && ownerId && user._id?.toString() === ownerId?.toString();
  };

  return (
    <div>

     
      {user && (
        <div className="header-user-logout">
          <h2>Welcome {user.firstName} {user.lastName}</h2>
          <button onClick={handleLogout} className="logoutbtn">Logout</button>
        </div>
      )}

      <div className="line"></div>

     
      {user && (
        <div className="enter-post">
          <form onSubmit={handlePost}>
            <input
              type="text"
              className="post-input"
              placeholder="Enter your post (min 25 characters)"
              value={postText}
              onChange={e => setPostText(e.target.value)}
            />
            <input type="submit" className="postbtn" value="Post" />
          </form>
        </div>
      )}


      {error && (
        <div className="error-msg">
          <h3>{error}</h3>
        </div>
      )}

    
      {posts.map(post => (
        <div key={post._id}>
          <div className="post-container">

            {isOwner(post.user?._id) && (
              <div className="post-buttons">
                <button onClick={() => handleEditPost(post._id)}>edit</button>
                <button onClick={() => handleDeletePost(post._id)}>delete</button>
              </div>
            )}

            <p className="name-date">
              {post.user ? post.user.firstName + " " + post.user.lastName : 'Unknown'} —{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>

            <div className="msg">{post.post}</div>
          </div>

          {/* Comment Form */}
          {user && (
            <div className="commentform">
              <form onSubmit={e => handleComment(e, post._id)}>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Enter your comment (min 25 characters)"
                  value={commentText[post._id] || ''}
                  onChange={e => setCommentText(prev => ({
                    ...prev,
                    [post._id]: e.target.value
                  }))}
                />
                <input type="submit" className="commentbtn" value="Comment" />
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="comment_sec">
            {post.comments.length > 0 && <h3>Comments</h3>}
            {post.comments.map(comment => (
              <div className="commentslist" key={comment._id}>
                <p>
                  <strong>
                    {comment.user
                      ? comment.user.firstName + " " + comment.user.lastName
                      : 'Unknown'}
                  </strong>{" "}
                  <small style={{ color: 'gray' }}>
                    ({new Date(comment.createdAt).toLocaleString()})
                  </small>
                  : {comment.body}
                </p>

                {isOwner(comment.user?._id) && (
                  <div className="comment-buttons">
                    <button onClick={() => handleDeleteComment(comment._id, post._id)}>
                      delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}