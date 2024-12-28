import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [departement, setDepartement] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState(null); // State untuk gambar
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State untuk pesan sukses
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confPassword", confPassword);
    formData.append("role", role);
    formData.append("departement", departement);
    formData.append("position", position);
    if (image) {
      formData.append("image", image); // Tambahkan file gambar ke formData
    }

    try {
      setLoading(true);
      setError(null); // Reset error
      setSuccess(null); // Reset success
      const response = await axios.post("http://localhost:8000/users", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Wajib untuk file upload
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess("Registrasi Berhasil! Anda akan diarahkan ke halaman pengguna.");
        setTimeout(() => navigate("/users"), 2000); // Redirect setelah 2 detik
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Register User</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confPassword"
            className="form-control"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            value={departement}
            onChange={(e) => setDepartement(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="position" className="form-label">Position</label>
          <input
            type="text"
            id="position"
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            id="image"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
