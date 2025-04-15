import React, { useEffect } from 'react';
import { BASE_URL } from "../utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { addConnections } from '../utils/connectionsSlice';

const Connections = () => {
  const dispatch = useDispatch();
  const connectionsData = useSelector((store) => store.connections);

  const fetchData = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!connectionsData) return null;
  if (connectionsData.length === 0) return <h2 className="text-center text-lg font-semibold mt-5">No Connections Found!</h2>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-base-200 shadow-lg rounded-lg">
      <h1 className="text-center font-bold text-3xl mb-6">Your Connections</h1>
      
      <ul className="space-y-4">
        {connectionsData.map((user) => (
          <li key={user._id} className="flex items-center gap-6 p-4 bg-base-300 rounded-lg  shadow-md hover:shadow-lg transition duration-200">
            {/* User Profile Image */}
            <img src={user.photoUrl || "https://via.placeholder.com/80"} alt={user.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-gray-300" />
            
            {/* User Info */}
            <div className="flex-1">
              <p className="font-semibold text-lg">{user.firstName} {user.lastName} <span className="text-sm text-gray-500">({user.age} years old)</span></p>
              <p className="text-sm text-gray-500">{user.gender}</p>
              <p className="text-gray-600 text-sm mt-1">{user.about || "No bio available"}</p>
              <p className="text-sm mt-2"><strong>Skills:</strong> {user.skills || "Not listed"}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="btn btn-sm btn-primary">Message</button>
              <button className="btn btn-sm btn-outline">View Profile</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Connections;
