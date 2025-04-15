import React, { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/Constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [error, setError] = useState("");
  const [showtoast, setShowtoast] = useState(false);
  const dispatch = useDispatch();

  const SaveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowtoast(true);
      setTimeout(() => setShowtoast(false), 3000);
    } catch (err) {
      setError(err?.response?.data);
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-5 gap-10">
        <div className="mb-20 flex items-center justify-center">
          <div className="card bg-base-300 w-full md:w-96 shadow-xl p-10">
            <h2 className="text-center font-bold text-xl mb-4">Edit Profile</h2>
            <div className="flex justify-center">
              <form className="w-full">
                <div className="mb-4">
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Photo URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input input-bordered w-full mt-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">About</label>
                  <input
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium">Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="input input-bordered w-full mt-2 p-3"
                    required
                  />
                </div>

                {error && <span className="text-red-400">{error}</span>}

                <div className="card-actions justify-center my-4 mt-10">
                  <button
                    type="button"
                    className="btn btn-primary w-full p-3"
                    onClick={SaveProfile}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <UserCard
            user={{ firstName, lastName, photoUrl, about, age, gender, skills }}
            showActions={false} 
          />
        </div>
      </div>

      {showtoast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Saved Successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
