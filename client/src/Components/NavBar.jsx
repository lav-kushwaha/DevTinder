import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/Constant';

const NavBar = () => {
    const navigate = useNavigate();
    const userData = useSelector((store)=>store.user);//selecting data from userStore
    const dispatch = useDispatch();
    
    const HandleLogout = async()=>{
      try{
        await axios.post(BASE_URL + "/logout",{},{withCredentials:true});
        dispatch(removeUser());
        return navigate("/login");
      }catch(err){
        console.error("ERROR"+ err);
      }
    }

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">DevTinder</Link>
      </div>
      {userData && (<div className="flex-none gap-2">
        <span className='mr-2'>Welcome, <b>{userData.firstName}</b></span>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar mx-2"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={userData.photoUrl}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections">Connections</Link>
            </li>
            <li>
              <Link to="/requests">Requests</Link>
            </li>
            <li>
              <a onClick={HandleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>)}
    </div>
  )
}

export default NavBar;
