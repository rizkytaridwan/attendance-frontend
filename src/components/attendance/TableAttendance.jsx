import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Choices from "choices.js";

const TableAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [monthlyAttendances, setMonthlyAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [attendanceInput, setAttendanceInput] = useState({
    userId: "",
    month: "",
    year: "",
  });
  const [users, setUsers] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [attendanceDetail, setAttendanceDetail] = useState(null);

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
  const fetchAttendanceByUser = async () => {
    try {
      if (!attendanceInput.userId) {
        const response = await axios.post(
          "http://localhost:8000/attendance-in-month",
          {
            month: attendanceInput.month,
            year: attendanceInput.year,
          },
          {
            withCredentials: true,
          }
        );
        setMonthlyAttendances(response.data.data);
      } else {
        const response = await axios.post(
          "http://localhost:8000/attendance-by-user",
          attendanceInput,
          {
            withCredentials: true,
          }
        );
        setMonthlyAttendances(response.data.data);
      }
      setInputModalVisible(false);
    } catch (error) {
      console.error("Error fetching attendance in month or by user:", error);
    }
  };

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
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDetailModalVisible(false);
        setModalVisible(false);
        setInputModalVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleModalKeyDown = (event) => {
      if (modalVisible) {
        if (event.key === "Escape") {
          setModalVisible(false);
        } else if (event.key === "Enter" && attendanceToDelete) {
          deleteAttendance(attendanceToDelete);
        }
      }
    };

    document.addEventListener("keydown", handleModalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleModalKeyDown);
    };
  }, [modalVisible, attendanceToDelete]);

  const handleNameClick = (attendance) => {
    setAttendanceDetail(attendance);
    setDetailModalVisible(true);
  };

  useEffect(() => {
    if (inputModalVisible) {
      const userSelectElement = document.getElementById("user-select");
      new Choices(userSelectElement, {
        removeItemButton: true,
        searchEnabled: true,
        itemSelectText: "",
      });
    }
  }, [inputModalVisible]);

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Attendance Page</h3>
            <p className="text-subtitle text-muted">
              View and manage attendance data
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
                  Attendance Page
                </li>
              </ol>
            </nav>
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
                      <tr key={`${attendance.uuid}-${index}`}>
                        <td>{index + 1}</td>
                        <td>
                          <button
                            className="btn btn-link"
                            onClick={() => handleNameClick(attendance)}
                          >
                            {attendance.user.name}
                          </button>
                        </td>
                        <td>{attendance.user.departement}</td>
                        <td>{attendance.user.position}</td>
                        <td>
                          <div className="avatar avatar-md me-1">
                            <img
                              src={
                                attendance.check_in_image
                                  ? `http://localhost:8000/${attendance.check_in_image}`
                                  : "http://localhost:8000/uploads/nodata.jpg"
                              }
                              alt="Attendance"
                            />
                          </div>
                          {formatTime(attendance.check_in_time)}
                        </td>
                        <td>
                          <div className="avatar avatar-md me-1">
                            <img
                              src={
                                attendance.check_out_image
                                  ? `http://localhost:8000/${attendance.check_out_image}`
                                  : "http://localhost:8000/uploads/nodata.jpg"
                              }
                              alt="Attendance"
                            />
                          </div>
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
      {/* Monthly Attendance Data */}
      {monthlyAttendances.length > 0 && (
        <section className="section">
          <div className="card">
            <div className="card-header">
              <h4>
                Attendance for{" "}
                {attendanceInput.userId
                  ? users.find(
                      (user) => user.id === parseInt(attendanceInput.userId)
                    )?.name || "Unknown User"
                  : "All Users"}{" "}
                {attendanceInput.month}/{attendanceInput.year}
              </h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Check-in Time</th>
                      <th>Check-out Time</th>
                      <th>Lateness Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyAttendances.map((attendance1, no) => (
                      <tr key={attendance1.id}>
                        <td>{no + 1}</td>
                        <td>{formatTime(attendance1.check_in_time)}</td>
                        <td>
                          {formatTime(attendance1.check_out_time) || "N/A"}
                        </td>
                        <td>{attendance1.lateness_minutes || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {detailModalVisible && attendanceDetail && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Attendance Details</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setDetailModalVisible(false)}
                >
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 text-center">
                    <h6>Check-in Image</h6>
                    <img
                      src={
                        attendanceDetail.check_in_image
                          ? `http://localhost:8000/${attendanceDetail.check_in_image}`
                          : "http://localhost:8000/uploads/basic1.jpg"
                      }
                      alt="Check-in"
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-6 text-center">
                    <h6>Check-out Image</h6>
                    <img
                      src={
                        attendanceDetail.check_out_image
                          ? `http://localhost:8000/${attendanceDetail.check_out_image}`
                          : "http://localhost:8000/uploads/basic1.jpg"
                      }
                      alt="Check-out"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
                <hr />
                {/* Tabel untuk menampilkan detail */}
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>:</td>
                      <td>{attendanceDetail.user.name}</td>
                    </tr>
                    <tr>
                      <th>Department</th>
                      <td>:</td>
                      <td>{attendanceDetail.user.departement}</td>
                    </tr>
                    <tr>
                      <th>Position</th>
                      <td>:</td>
                      <td>{attendanceDetail.user.position}</td>
                    </tr>
                    <tr>
                      <th>Check-in Time</th>
                      <td>:</td>
                      <td>{formatTime(attendanceDetail.check_in_time)}</td>
                    </tr>
                    <tr>
                      <th>Check-out Time</th>
                      <td>:</td>
                      <td>
                        {formatTime(attendanceDetail.check_out_time) || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDetailModalVisible(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label>Nama User</label>
                  <select
                    id="user-select"
                    className="choices form-select"
                    value={attendanceInput.userId}
                    onChange={(e) =>
                      setAttendanceInput({
                        ...attendanceInput,
                        userId: e.target.value,
                      })
                    }
                  >
                    <option value="">Get All Data</option>
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
                  onClick={fetchAttendanceByUser}
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
