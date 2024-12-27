import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const TableUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        withCredentials: true,
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchUsers();
    if (!loading && window.$.fn.dataTable.isDataTable("#table2")) {
      window.$("#table2").DataTable().destroy();
    }
    if (!loading) {
      window.$("#table2").DataTable({
        responsive: true,
      });
    }
  }, [loading]);
  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>DataTable jQuery</h3>
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
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User Page
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header">
            <a href="add-user" className="btn btn-primary">Add User</a>
          </div>
          <div className="card-body">
            <div className="table-responsive datatable-minimal">
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <table className="table" id="table2">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.uuid}>
                        <td>
                          <div className="avatar avatar-md">
                            <img
                              src={
                                user.image
                                  ? `http://localhost:8000${user.image}`
                                  : "http://localhost:8000/uploads/basic1.jpg"
                              }
                              alt="User"
                            />
                          </div>
                          &nbsp;
                          {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.departement}</td>
                        <td>{user.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TableUser;
