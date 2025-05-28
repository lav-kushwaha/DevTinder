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
      <div className="flex flex-col items-center justify-center mt-20 px-4 text-center min-h-[60vh]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-gray-400 mb-4 animate-bounce"
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
     <div className="min-h-[80vh] flex flex-col px-4">
    <div className="flex-grow flex justify-center items-start mt-6">
      <div className="w-full max-w-xl">
        {feed[0] && <UserCard user={feed[0]} />}
      </div>
    </div>
  </div>
  );
};

export default Feed;
