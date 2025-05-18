import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/Constant';
import { addFeed } from '../utils/feedSlice';
import { useDispatch, useSelector } from 'react-redux';
import UserCard from './UserCard';

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    // if (feed?.length) return; // Prevent re-fetching if data already exists
    try {
      const feedData = await axios.get(BASE_URL + '/feed', {
        withCredentials: true,
      });

      dispatch(addFeed(feedData?.data));
    } catch (err) {
      console.error('ERROR: ' + err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-40 text-center">
        {/* Custom SVG for a user placeholder */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-gray-400 mb-4 animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
        </svg>

        <h1 className="text-2xl font-semibold text-gray-700">
          No Users Available in Feed
        </h1>
        <p className="text-gray-500 mt-2">
          Try again later or refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-5 gap-5">
      {feed[0] && <UserCard user={feed[0]} />}
    </div>
  );
};

export default Feed;
