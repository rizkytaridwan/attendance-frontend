import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe, LogOut, reset } from "../../features/authSlice";
import AddUser from "../../components/user/CreateUser";
import Header from "../Header";
import Sidebar from "../Sidebar";

function UserCreatePage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarActive, setSidebarActive] = useState(true);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(
    localStorage.getItem("mainMenuState") === "open"
  );
  const [isOvertimeMenuOpen, setIsOvertimeMenuOpen] = useState(
    localStorage.getItem("OvertimeMenuState") === "open"
  );

  const currentPath = window.location.pathname;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  const checkScreenSize = () => {
    if (window.innerWidth >= 1200) {
      setSidebarActive(true);
    } else {
      setSidebarActive(false);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError) {
      navigate("/");
      dispatch(reset());
      return;
    }
    if (!user) {
      dispatch(getMe());
      return;
    }
    if (user.role !== "admin") {
      dispatch(LogOut());
      dispatch(reset());
      navigate("/forbidden");
      return;
    }
  }, [isError, user, navigate, dispatch]);

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

  const toggleOvertimeMenu = () => {
    const newOvertimeMenuState = !isOvertimeMenuOpen;
    setIsOvertimeMenuOpen(newOvertimeMenuState);
    localStorage.setItem(
      "OvertimeMenuState",
      newOvertimeMenuState ? "open" : "closed"
    );
  };

  const isActive = (path) => currentPath === path;

  const isParentActive = (subPaths) => {
    return subPaths.some((subPath) => currentPath.includes(subPath));
  };

  return (
    <div id="app">
      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        isSidebarActive={isSidebarActive}
        toggleSidebar={toggleSidebar}
        isMainMenuOpen={isMainMenuOpen}
        toggleMainMenu={toggleMainMenu}
        isOvertimeMenuOpen={isOvertimeMenuOpen}
        toggleOvertimeMenu={toggleOvertimeMenu}
        isActive={isActive}
        isParentActive={isParentActive}
      />
      <div id="main">
        <header className="mb-3 d-flex align-items-center">
          <a
            href="#"
            className="burger-btn d-block d-xl-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-justify fs-3"></i>
          </a>
          <Header />
        </header>
        <div className="mt-2"></div>
        <AddUser />
      </div>
    </div>
  );
}

export default UserCreatePage;
