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
  const [positions, setPositions] = useState([]); // Dynamic positions list
  const [image, setImage] = useState(null); // State untuk gambar
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departmentPositions = {
    Finance: [
      "Chief Financial Officer (CFO)",
      "Finance Manager",
      "Accountant",
      "Financial Analyst",
      "Treasury Specialist",
    ],
    "Human Resources - HR": [
      "HR Manager",
      "Recruitment Specialist",
      "Training and Development Officer",
      "Payroll Officer",
      "Employee Relations Specialist",
    ],
    Operations: [
      "Chief Operating Officer (COO)",
      "Operations Manager",
      "Logistics Coordinator",
      "Quality Control Specialist",
      "Production Supervisor",
    ],
    Marketing: [
      "Chief Marketing Officer (CMO)",
      "Marketing Manager",
      "Digital Marketing Specialist",
      "Brand Manager",
      "Content Creator",
    ],
    Sales: [
      "Sales Manager",
      "Account Executive",
      "Sales Representative",
      "Business Development Manager",
    ],
    "Information Technology - IT": [
      "Chief Technology Officer (CTO)",
      "IT Manager",
      "Software Engineer",
      "Network Administrator",
      "IT Support Specialist",
    ],
    "Research and Development - R&D": [
      "R&D Manager",
      "Product Developer",
      "Research Analyst",
    ],
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartement(selectedDepartment);
    setPositions(departmentPositions[selectedDepartment] || []); // Update positions
    setPosition(""); // Reset position
  };

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
      formData.append("image", image);
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await axios.post(
        "http://localhost:8000/users",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSuccess(
          "Registrasi Berhasil! Anda akan diarahkan ke halaman pengguna."
        );
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
            <h3>Create New User</h3>
            <p className="text-subtitle text-muted">
              Powerful interactive tables with datatables (jQuery required).
            </p>
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
                  Create User
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
            <form onSubmit={handleRegister}>
              <div className="row">
                {/* Kolom Kiri */}
                <div className="col-md-6">
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label htmlFor="confPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confPassword"
                      className="form-control"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="col-md-6">
                  {/* Department */}
                  <div className="mb-3">
                    <label htmlFor="departement" className="form-label">
                      Departement
                    </label>
                    <select
                      id="departement"
                      className="form-control"
                      value={departement}
                      onChange={handleDepartmentChange}
                      required
                    >
                      <option disabled value="">
                        Select Department
                      </option>
                      {Object.keys(departmentPositions).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Position */}
                  <div className="mb-3">
                    <label htmlFor="position" className="form-label">
                      Position
                    </label>
                    <select
                      id="position"
                      className="form-control"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    >
                      <option disabled value="">
                        Select Position
                      </option>
                      {positions.map((pos, index) => (
                        <option key={index} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Role */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
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
                  {/* Image */}
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Register"}
                </button>
                <a href="/users" className="btn btn-secondary">
                  Back
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddUser;
