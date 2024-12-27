import React, { useState ,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {LoginUser,reset} from "../features/authSlice"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/users");
    }
    dispatch(reset());
  }, [user,  isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };


  return (
    <div id="auth">
      <div className="row h-100">
        <div className="col-lg-5 col-12">
          <div id="auth-left">
            <div className="auth-logo">Logo</div>
            <h1 className="auth-title">Log in.</h1>
            <p className="auth-subtitle mb-5">
              Log in with your data that you entered during registration.
            </p>
            {isError && <div className="alert alert-danger">{message}</div>} {/* Perbaiki penggunaan error */}
            <form onSubmit={Auth}> {/* Perbaiki penggunaan handleLogin */}
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="text"
                  className="form-control form-control-xl"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="form-control-icon">
                  <i className="bi bi-person"></i>
                </div>
              </div>
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="password"
                  className="form-control form-control-xl"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="form-control-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>
              </div>
              <div className="form-check form-check-lg d-flex align-items-end">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <label
                  className="form-check-label text-gray-600"
                  htmlFor="flexCheckDefault"
                >
                  Keep me logged in
                </label>
              </div>
              <button
                className="btn btn-primary btn-block btn-lg shadow-lg mt-5"
                type="submit"
              >
                {isLoading ? "Loading..." : "Log in"}
              </button>
            </form>
            <div className="text-center mt-5 text-lg fs-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="font-bold">
                  Sign up
                </a>
                .
              </p>
              <p>
                <a className="font-bold" href="/forgot-password">
                  Forgot password?
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-7 d-none d-lg-block">
          <div id="auth-right"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
