import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/Constant';

const NavBar = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const HandleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("ERROR: " + err);
    }
  };

  const handleDevTinderClick = () => {
    if (userData) {
      navigate("/feed");
    } else {
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMenuOpen(false); // close menu on login click
  };

  return (
    <nav className="bg-base-300 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <div className="flex-1">
          {/* Logo / Title */}
          <span
            className="btn btn-ghost normal-case text-2xl cursor-pointer text-primary font-bold"
            onClick={handleDevTinderClick}
          >
            DevTinder
          </span>
        </div>

        {/* Hamburger button for mobile */}
        <button
          className="btn btn-square btn-ghost md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Right side: either Login button or user info */}
        <div className="hidden md:flex items-center gap-6">
          {!userData ? (
            <div className="flex-none">
              <button
                onClick={handleLoginClick}
                className="btn btn-outline btn-primary"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex-none gap-2 flex items-center">
              <span className="mr-2">Welcome, <b>{userData.firstName}</b></span>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar mx-2"
                >
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img alt="User Avatar" src={userData.photoUrl} />
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
                  <li><Link to="/connections">Connections</Link></li>
                  <li><Link to="/requests">Requests</Link></li>
                  <li><Link to="/premium">Premium</Link></li>
                  <li>
                    <button onClick={HandleLogout} className="w-full text-left">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-base-200 border-t border-base-300 shadow-inner">
          <div className="flex flex-col p-4 space-y-3">
            {!userData ? (
              <button
                onClick={handleLoginClick}
                className="btn btn-primary btn-block"
              >
                Login
              </button>
            ) : (
              <>
                <span className="text-center font-semibold mb-2">Welcome, <b>{userData.firstName}</b></span>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost btn-block"
                >
                  Profile
                </Link>
                <Link
                  to="/connections"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost btn-block"
                >
                  Connections
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost btn-block"
                >
                  Requests
                </Link>
                <Link
                  to="/premium"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost btn-block"
                >
                  Premium
                </Link>
                <button
                  onClick={() => {
                    HandleLogout();
                    setMenuOpen(false);
                  }}
                  className="btn btn-outline btn-error btn-block"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
