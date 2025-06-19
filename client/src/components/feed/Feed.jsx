import React, { useContext } from 'react'
import './feed.css'
import Share from '../share/Share'
import Post from '../post/Post'
// import {Posts} from '../../dummyData'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

export default function Feed() {

  const { currentUser } = useContext(AuthContext);

  const [post, setPost] = useState([]);
  const [refresh, setRefresh] = useState(true);



  const fetchPosts = async () => {
    try {
      let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";

      const res = await axios.get(`${backend_url}/posts/feed/allposts`);
      console.log("what is this", res.data)
      setPost(res.data);

    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {

    fetchPosts();
    setRefresh(false);

  }, [refresh]);


  return (
    <>
      <div className="feed">
        <div className="feedWrapper">
          <Share triggerRefresh={setRefresh} />
          {post?.map((p) => (
            <Post key={p._id} post={p} triggerRefresh={setRefresh} />
          ))}
        </div>
      </div>
    </>
  )
}
