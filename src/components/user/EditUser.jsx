import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams(); // Mendapatkan id pengguna dari URL
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    role: "user",
    departement: "",
    position: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil data pengguna berdasarkan id dari parameter URL
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${id}`, {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data pengguna.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("confPassword", userData.confPassword);
    formData.append("role", userData.role);
    formData.append("departement", userData.departement);
    formData.append("position", userData.position);
    if (userData.image) {
      formData.append("image", userData.image);
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await axios.put(
        `http://localhost:8000/users/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess("User updated successfully!");
        setTimeout(() => navigate("/users"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Edit User</h3>
            <p className="text-subtitle text-muted">Edit user details.</p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item" aria-current="page">
                  <a href="/users">User Page</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confPassword"
                  className="form-control"
                  value={userData.confPassword}
                  onChange={(e) => setUserData({ ...userData, confPassword: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  id="role"
                  className="form-control"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="departement" className="form-label">Departement</label>
                <input
                  type="text"
                  id="departement"
                  className="form-control"
                  value={userData.departement}
                  onChange={(e) => setUserData({ ...userData, departement: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">Position</label>
                <input
                  type="text"
                  id="position"
                  className="form-control"
                  value={userData.position}
                  onChange={(e) => setUserData({ ...userData, position: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image</label>
                {userData.image && (
                  <div>
                    <img
                      src={`http://localhost:8000${userData.image}`}
                      alt="User"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <p className="mt-2">Current Image</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  className="form-control"
                  onChange={(e) => setUserData({ ...userData, image: e.target.files[0] })}
                />
              </div>
              <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                {loading ? "Loading..." : "Update"}
              </button>
              <a href="/users" className="btn btn-secondary">Back</a>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditUser;
