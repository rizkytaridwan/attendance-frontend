import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getMe,LogOut,reset} from "../../features/authSlice";
import TableUser from "../../components/user/TableUser";

function UserList() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarActive, setSidebarActive] = useState(true);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(
    localStorage.getItem("mainMenuState") === "open"
  );
  const [isTubuhMenuOpen, setIsTubuhMenuOpen] = useState(
    localStorage.getItem("tubuhMenuState") === "open"
  );
  
  const currentPath = window.location.pathname;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  const checkScreenSize = () => {
    if (window.innerWidth >= 1200) {
      setSidebarActive(true);
    } else {
      setSidebarActive(false);
    }
  };

 

  useEffect(() => {
     // Fetch hanya sekali saat komponen dimuat
    document.documentElement.setAttribute("data-bs-theme", theme);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [theme]);

  
   
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleSidebar = () => {
    setSidebarActive((prevState) => !prevState);
  };

  const toggleMainMenu = () => {
    const newMainMenuState = !isMainMenuOpen;
    setIsMainMenuOpen(newMainMenuState);
    localStorage.setItem("mainMenuState", newMainMenuState ? "open" : "closed");
  };

  const toggleTubuhMenu = () => {
    const newTubuhMenuState = !isTubuhMenuOpen;
    setIsTubuhMenuOpen(newTubuhMenuState);
    localStorage.setItem(
      "tubuhMenuState",
      newTubuhMenuState ? "open" : "closed"
    );
  };

  const isActive = (path) => currentPath === path;

  const isParentActive = (subPaths) => {
    return subPaths.some((subPath) => currentPath.includes(subPath));
  };

  return (
    <div id="app">
      <div id="sidebar" className={isSidebarActive ? "active" : "inactive"}>
        <div className="sidebar-wrapper active">
          <div className="sidebar-header position-relative">
            <div className="d-flex justify-content-between align-items-center">
              <div className="logo">Logo</div>
              <div className="theme-toggle d-flex gap-2 align-items-center mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 21 21"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M10.5 14.5c2.219 0 4-1.763 4-3.982a4.003 4.003 0 0 0-4-4.018c-2.219 0-4 1.781-4 4c0 2.219 1.781 4 4 4zM4.136 4.136L5.55 5.55m9.9 9.9l1.414 1.414M1.5 10.5h2m14 0h2M4.135 16.863L5.55 15.45m9.899-9.9l1.414-1.415M10.5 19.5v-2m0-14v-2"
                      opacity=".3"
                    ></path>
                  </g>
                </svg>
                <div className="form-check form-switch fs-6">
                  <input
                    className="form-check-input me-0"
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                    id="toggle-dark"
                  />
                  <label className="form-check-label"></label>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3m3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95l2.06.05m-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31Z"
                  ></path>
                </svg>
              </div>
              <div className="sidebar-toggler x">
                <a
                  href="#"
                  className="sidebar-hide d-xl-none d-block"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-x bi-middle"></i>
                </a>
              </div>
            </div>
          </div>
          {/* Menu and sidebar content */}
          <div className="sidebar-menu">
            <ul className="menu">
              <li className="sidebar-title">Forms &amp; Tables</li>
              <li className="sidebar-item">
                <a href="table.html" className="sidebar-link">
                  <i className="bi bi-grid-1x2-fill"></i>
                  <span>Table</span>
                </a>
              </li>
              <li
                className={`sidebar-item has-sub ${
                  isParentActive(["/product", "/users"]) ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="sidebar-link"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMainMenu();
                  }}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Main Menu</span>
                </a>
                <ul
                  className={`submenu ${
                    isMainMenuOpen ? "submenu-open" : "submenu-closed"
                  }`}
                >
                  <li
                    className={`submenu-item ${
                      isActive("/product") ? "active" : ""
                    }`}
                  >
                    <a href="/product" className="submenu-link">
                      Product
                    </a>
                  </li>
                  <li
                    className={`submenu-item ${
                      isActive("/users") ? "active" : ""
                    }`}
                  >
                    <a href="/users" className="submenu-link">
                      User
                    </a>
                  </li>
                </ul>
              </li>
              <li
                className={`sidebar-item has-sub ${
                  isParentActive(["/badan", "/telinga"]) ? "active" : ""
                }`}
              >
                <a
                  href="#"
                  className="sidebar-link"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleTubuhMenu();
                  }}
                >
                  <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                  <span>Tubuh</span>
                </a>
                <ul
                  className={`submenu ${
                    isTubuhMenuOpen ? "submenu-open" : "submenu-closed"
                  }`}
                >
                  <li
                    className={`submenu-item ${
                      isActive("/badan") ? "active" : ""
                    }`}
                  >
                    <a href="/badan" className="submenu-link">
                      Badan
                    </a>
                  </li>
                  <li
                    className={`submenu-item ${
                      isActive("/telinga") ? "active" : ""
                    }`}
                  >
                    <a href="/telinga" className="submenu-link">
                      Telinga
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div id="main">
        <header className="mb-3 d-flex align-items-center">
          <a
            href="#"
            className="burger-btn d-block d-xl-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-justify fs-3"></i>
          </a>

          <div className="dropdown ms-auto">
            <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="user-menu d-flex">
                <div className="user-name text-end me-3">
                  <h6 className="mb-0 text-gray-600">John Ducky</h6>
                  <p className="mb-0 text-sm text-gray-600">Administrator</p>
                </div>
                <div className="user-img d-flex align-items-center">
                  <div className="avatar avatar-md">
                    <img src="./assets/compiled/jpg/1.jpg" alt="User Profile" />
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
                <h6 className="dropdown-header">Hello, John!</h6>
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
                <button
                  className="dropdown-item"
                  href="#"
                  onClick={logout}
                >
                  <i className="icon-mid bi bi-box-arrow-left me-2"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </header>
        <div className="mt-2"></div>

        {/* Page heading */}
        <TableUser />
      </div>
    </div>
  );
}

export default UserList;
