import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone"; // Import moment-timezone

const TableAbsent = () => {
  const [absentUsers, setAbsentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch absent user data
  const fetchAbsent = async () => {
    try {
      const response = await axios.get("http://localhost:8000/absent", {
        withCredentials: true,
      });
      setAbsentUsers(response.data.data); // assuming response is structured as {data: [...]}
      setLoading(false);
    } catch (error) {
      console.error("Error fetching absent user data:", error);
    }
  };

  useEffect(() => {
    fetchAbsent();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (window.$.fn.dataTable.isDataTable("#table1")) {
        window.$("#table1").DataTable().destroy();
      }
      window.$("#table1").DataTable({
        responsive: true,
      });
    }
  }, [loading]);

  // Delete absent user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/user/${id}`, {
        withCredentials: true,
      });
      setModalVisible(false);
      fetchAbsent(); // Re-fetch absent users after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setModalVisible(true);
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Absent Users</h3>
            <p className="text-subtitle text-muted">
              View and manage users who are absent today
            </p>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header">
            <a href="add-user" className="btn btn-primary">
              Add User
            </a>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <p>Loading absent user data...</p>
              ) : absentUsers.length === 0 ? (
                <p>No absent users found.</p>
              ) : (
                <table className="table table-hover" id="table1">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absentUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.departement}</td>
                        <td>{user.position}</td>
                        <td>
                          <a
                            href={`/edit-user/${user.id}`}
                            className="btn btn-sm btn-warning"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </a>
                          &nbsp;
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="btn btn-sm btn-danger"
                            aria-label="Delete user"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {modalVisible && (
        <div
          className="modal fade show"
          id="deleteModal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white">Delete Confirmation</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setModalVisible(false)}
                >
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this absent user record?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setModalVisible(false)}
                >
                  <span className="d-none d-sm-block">Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-1"
                  onClick={() => deleteUser(userToDelete)}
                >
                  <span className="d-none d-sm-block">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAbsent;
