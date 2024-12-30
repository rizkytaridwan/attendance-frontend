import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate(); // Inisialisasi hook navigate

  const handleGoBack = () => {
    navigate(-1); // Navigasi kembali ke halaman sebelumnya
  };

  return (
    <div id="error">
      <div className="error-page container">
        <div className="col-md-8 col-12 offset-md-2">
          <div className="text-center">
            <img
              className="img-error"
              src="./assets/compiled/svg/error-404.svg"
              alt="Not Found"
              style={{ width: "60%", height: "auto" }}
            />
            <h1 className="error-title">Not Found</h1>
            <p className="fs-5 text-gray-600">
              The page you are looking for is not found.
            </p>
            <button
              onClick={handleGoBack} // Menambahkan fungsi untuk tombol kembali
              className="btn btn-lg btn-outline-primary mt-3"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
