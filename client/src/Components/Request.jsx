import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests,removeRequest } from "../utils/requestSlice";
import axios from "axios";
import { BASE_URL } from "../utils/Constant";

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests); // Accessing requests from Redux store

  const reviewRequest = async(status,_id)=>{
    try{
      await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{withCredentials:true});
      dispatch(removeRequest(_id));
    }catch(err){
      console.error("ERROR:"+ err.message)
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data)); // Updating Redux store
    } catch (err) {
      console.error("Error fetching requests:", err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests || requests.length === 0)
    return (
      <h2 className="text-center text-lg font-semibold mt-5">
        No Connection Requests Found!
      </h2>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-base-200 shadow-lg rounded-lg">
      <h1 className="text-center font-bold text-3xl mb-6">Connection Requests</h1>

      <ul className="space-y-4">
        {requests.map((request) => (
          <li
            key={request._id}
            className="flex items-center gap-6 p-4 bg-base-300 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            {/* User Profile Image */}
            <img
              src={
                request.fromUserId.photoUrl ||
                "https://via.placeholder.com/80"
              }
              alt={request.fromUserId.firstName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />

            {/* User Info */}
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {request.fromUserId.firstName} {request.fromUserId.lastName}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {request.fromUserId.about || "No bio available"}
              </p>
              <p className="text-sm mt-2">
                <strong>Skills:</strong>{" "}
                {request.fromUserId.skills.length > 0
                  ? request.fromUserId.skills.join(", ")
                  : "Not listed"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="btn btn-sm btn-primary" onClick={()=>reviewRequest("accepted",request._id)}>Accept</button>
              <button className="btn btn-sm btn-outline" onClick={()=>reviewRequest("rejected",request._id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Request;
