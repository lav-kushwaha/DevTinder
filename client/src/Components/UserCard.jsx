import React from "react";
import {BASE_URL} from "../utils/Constant"
import axios from 'axios'
import { removeUserFromFeed } from "../utils/feedSlice";
import {useDispatch} from "react-redux"

const UserCard = ({ user, showActions = true }) => {
  // console.log(user)
  const {_id, firstName, lastName, photoUrl, about, age, gender, skills } = user;
  const dispatch = useDispatch()

  const handleSendRequest = async(status,userId)=>{
    try{
       const res = await axios.post(BASE_URL+"/request/send/"+status+"/"+ userId,{},{withCredentials:true});
       dispatch(removeUserFromFeed(userId));
        
     }catch(err){
        console.error("ERROR"+ err.message);
     }
  }

  return (
    <div className="flex justify-center items-center my-5">
      <div className="card bg-base-300 w-96 shadow-xl rounded-2xl overflow-hidden">
        <figure className="px-10 pt-10">
          <img
            src={photoUrl || "https://via.placeholder.com/150"}
            alt={`${firstName} ${lastName}`}
            className="rounded-xl w-40 h-40 object-cover"
          />
        </figure>

        <div className="card-body items-center text-center">
          <h2 className="card-title text-xl font-bold">
            {firstName || "First Name"} {lastName || "Last Name"}
          </h2>

          {(age || gender) && (
            <p className="text-sm text-gray-500">
              {age && `Age: ${age}`} {gender && `| Gender: ${gender}`}
            </p>
          )}

          <p className="mt-2 text-gray-400">
            <strong>About:</strong> {about || "No information provided."}
          </p>

          <p className="mt-1 text-gray-400">
            <strong>Skills:</strong> {skills || "No skills added yet."}
          </p>

          <div className="card-actions mt-4 flex gap-4">
          {showActions && (
            <div className="card-actions mt-4 flex gap-4">
              <button className="btn btn-error px-6" onClick={() => handleSendRequest("ignored", _id)}>
                Ignore
              </button>
              <button className="btn btn-success px-6" onClick={() => handleSendRequest("interested", _id)}>
                Interested
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
