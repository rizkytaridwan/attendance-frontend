import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Choices from "choices.js";

const TableAttendance = () => {
  const [attendances, setAttendances] = useState([]); // General attendance
  const [monthlyAttendances, setMonthlyAttendances] = useState([]); // Monthly attendance data
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [attendanceInput, setAttendanceInput] = useState({
    userId: "",
    month: "",
    year: "",
  });
  const [users, setUsers] = useState([]); // List of users

  // Fetch all users (with caching to avoid re-fetching)
  const fetchUsers = async () => {
    if (users.length === 0) {
      try {
        const response = await axios.get("http://localhost:8000/users", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  // Fetch all attendances
  const fetchAttendance = async () => {
    try {
      const response = await axios.get("http://localhost:8000/attendance", {
        withCredentials: true,
      });
      setAttendances(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Fetch monthly attendance
  const fetchAttendanceInMonth = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/attendance-in-month",
        attendanceInput,
        {
          withCredentials: true,
        }
      );
      setMonthlyAttendances(response.data.data); // Set monthly attendance data
      setInputModalVisible(false);
    } catch (error) {
      console.error("Error fetching attendance in month:", error);
    }
  };

  // Handle delete attendance
  const deleteAttendance = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/attendance/${id}`, {
        withCredentials: true,
      });
      setModalVisible(false);
      fetchAttendance();
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setAttendanceToDelete(id);
    setModalVisible(true);
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return "N/A";
    const momentTime = moment(time);
    if (!momentTime.isValid()) return "N/A";
    return momentTime.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  useEffect(() => {
    fetchAttendance();
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

  // Initialize Choices.js after users are fetched and select elements are rendered
  useEffect(() => {
    if (users.length > 0) {
      const element = document.querySelector("#user-select");
      if (element) {
        new Choices(element, {
          searchEnabled: true,
          itemSelectText: "Press to select",
        });
      }
    }
  }, [users]);

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Attendance Records</h3>
            <p className="text-subtitle text-muted">
              View and manage attendance data
            </p>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header">
            <button
              className="btn btn-primary"
              onClick={() => setInputModalVisible(true)}
            >
              Get Attendance In Month
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <p>Loading attendance data...</p>
              ) : (
                <table className="table table-hover" id="table1">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Check-in Time</th>
                      <th>Check-out Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendances.map((attendance, index) => (
                      <tr key={attendance.uuid}>
                        <td>{index + 1}</td>
                        <td>{attendance.user.name}</td>
                        <td>{attendance.user.departement}</td>
                        <td>{attendance.user.position}</td>
                        <td>{formatTime(attendance.check_in_time)}</td>
                        <td>
                          {formatTime(attendance.check_out_time) || "N/A"}
                        </td>
                        <td>{attendance.status}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteClick(attendance.uuid)}
                            className="btn btn-sm btn-danger"
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

      {/* Monthly Attendance Data */}
      {monthlyAttendances.length > 0 && (
        <section className="section">
          <div className="card">
            <div className="card-header">
              <h4>
                Attendance for {attendanceInput.month}/{attendanceInput.year}
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Check-in Time</th>
                      <th>Check-out Time</th>
                      <th>Lateness Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyAttendances.map((attendance, index) => (
                      <tr key={attendance.id}>
                        <td>{index + 1}</td>
                        <td>{formatTime(attendance.check_in_time)}</td>
                        <td>
                          {formatTime(attendance.check_out_time) || "N/A"}
                        </td>
                        <td>{attendance.lateness_minutes || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal for confirming deletion */}
      {modalVisible && (
        <div
          className="modal fade show"
          tabIndex="-1"
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
                Are you sure you want to delete this attendance record?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-1"
                  onClick={() => deleteAttendance(attendanceToDelete)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for getting attendance by month */}
      {inputModalVisible && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Get Attendance In Month</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setInputModalVisible(false)}
                >
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>User</label>
                  <select
                    id="user-select" // ID for Choices.js
                    className="choices form-control"
                    value={attendanceInput.userId}
                    onChange={(e) => {
                      const selectedUserId = e.target.value;
                      setAttendanceInput({
                        ...attendanceInput,
                        userId: selectedUserId,
                      });
                    }}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Month</label>
                  <select
                    className="form-control"
                    value={attendanceInput.month}
                    onChange={(e) =>
                      setAttendanceInput({
                        ...attendanceInput,
                        month: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Month</option>
                    {[...Array(12).keys()].map((i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select
                    className="form-control"
                    value={attendanceInput.year}
                    onChange={(e) =>
                      setAttendanceInput({
                        ...attendanceInput,
                        year: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Year</option>
                    {[2024, 2025, 2026].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setInputModalVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchAttendanceInMonth}
                >
                  Get Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAttendance;
