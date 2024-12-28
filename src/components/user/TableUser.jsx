import React, { useEffect, useState } from "react";
import axios from "axios";

const TableUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
    if (!loading && window.$.fn.dataTable.isDataTable("#table1")) {
      window.$("#table1").DataTable().destroy();
    }
    if (!loading) {
      window.$("#table1").DataTable({
        responsive: true,
      });
    }
  }, [loading]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/users/${id}`, {
        withCredentials: true,
      });
      setModalVisible(false); // Close the modal
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id); // Set the user ID to delete
    setModalVisible(true); // Show the modal
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>DATA USER</h3>
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
                <table className="table table-striped" id="table1">
                  <thead>
                    <tr>
                      <td>No</td>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user,index) => (
                      <tr key={user.uuid}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="avatar avatar-md">
                            <img
                              src={user.image ? `http://localhost:8000${user.image}` : "http://localhost:8000/uploads/basic1.jpg"}
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
                        <td>
                          <a
                            href={`/edit-user/${user.uuid}`}
                            className="btn btn-sm btn-warning"
                          >
                           <i className="bi bi-pencil-fill"></i>
                          </a>
                          &nbsp;
                          <button onClick={() => handleDeleteClick(user.uuid)} className="btn btn-sm btn-danger">
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
        <div className="modal fade show" id="deleteModal" tabIndex="-1" role="dialog" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white">Delete Confirmation</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setModalVisible(false)}>
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this user?
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

export default TableUser;
