import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Constant";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const payload = isLoginForm ? { emailId, password } : { emailId, password, firstName, lastName };
      const endpoint = isLoginForm ? "/login" : "/signup"; 

      const res = await axios.post(BASE_URL + endpoint, payload, { withCredentials: true });
      dispatch(addUser(res?.data?.data));
       return navigate("/")

    } catch (err) {
      setError(err?.response?.data || "Something went wrong!")
      setTimeout(()=>{
        setError(null);
      },3000)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card bg-base-300 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold">{isLoginForm ? "Login" : "Sign Up"}</h2>
        <p className="text-center text-gray-500">{isLoginForm ? "Sign in to continue" : "Create an account"}</p>

        <form className="mt-6 space-y-4">
          {!isLoginForm && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Lav"
                  className="input input-bordered w-full mt-1 p-2 rounded-lg"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Kushwaha"
                  className="input input-bordered w-full mt-1 p-2 rounded-lg"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="your@email.com"
              className="input input-bordered w-full mt-1 p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input input-bordered w-full mt-1 p-2 rounded-lg"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="button"
            onClick={handleAuth}
            className="w-full btn btn-primary mt-4 p-3 rounded-lg"
          >
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-5">
          <p>
            {isLoginForm ? "New user?" : "Already have an account?"}  
            <span 
              className="font-semibold cursor-pointer hover:underline ml-1"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {isLoginForm ? "Sign up here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
