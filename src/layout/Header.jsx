import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, reset, getMe } from "../features/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  const logout = async () => {
    try {
        await dispatch(LogOut()).unwrap();
        localStorage.clear(); // Tambahkan ini
        dispatch(reset());
        navigate("/");
    } catch (error) {
        console.error("Logout error:", error);
    }
};

  return (
    <div className="dropdown ms-auto">
      <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
        <div className="user-menu d-flex">
          <div className="user-name text-end me-3">
            <h6 className="mb-0 text-gray-600">
              {user ? user.name : "John Ducky"}
            </h6>
            <p className="mb-0 text-sm text-gray-600">
              {user ? user.departement : "Administrator"}
            </p>
          </div>
          <div className="user-img d-flex align-items-center">
            <div className="avatar avatar-md">
              <img
                src={
                  user
                    ? `http://localhost:8000${user.image}`
                    : "./assets/compiled/jpg/1.jpg"
                }
                alt="User Profile"
              />
            </div>
          </div>
        </div>
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="dropdownMenuButton"
        style={{ minWidth: "11rem" }}
      >
        <li>
          <h6 className="dropdown-header">
            Hello, {user ? user.name : "John!"}
          </h6>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            <i className="icon-mid bi bi-person me-2"></i> My Profile
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            <i className="icon-mid bi bi-gear me-2"></i> Settings
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            <i className="icon-mid bi bi-wallet me-2"></i> Wallet
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button className="dropdown-item" onClick={logout}>
            <i className="icon-mid bi bi-box-arrow-left me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Header;
