import React from "react";

const ErrorPage = () => {
  return (
    <div id="error">
      <div className="error-page container">
        <div className="col-md-8 col-12 offset-md-2">
          <div className="text-center">
            <img
              className="img-error"
              src="./assets/compiled/svg/error-403.svg"
              alt="Forbidden"
              style={{ width: "60%", height: "auto" }}
            />
            <h1 className="error-title">Forbidden</h1>
            <p className="fs-5 text-gray-600">
              You are unauthorized to see this page.
            </p>
            <a href="/" className="btn btn-lg btn-outline-primary mt-3">
              Go Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
