import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone"; // Import moment-timezone

const TableAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);

  // Fetch attendance data
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

  useEffect(() => {
      fetchAttendance();
      if (!loading && window.$.fn.dataTable.isDataTable("#table1")) {
        window.$("#table1").DataTable().destroy();
      }
      if (!loading) {
        window.$("#table1").DataTable({
          responsive: true,
        });
      }
    }, [loading]);


  // Delete attendance
  const deleteAttendance = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/attendance/${id}`, {
        withCredentials: true,
      });
      setModalVisible(false);
      fetchAttendance(); // Re-fetch attendance after deletion
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setAttendanceToDelete(id);
    setModalVisible(true);
  };

  // Convert to local time (Asia/Jakarta)
  const formatTime = (time) => {
    return moment(time).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
  };

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
            <a href="add-attendance" className="btn btn-primary">
              Add Attendance
            </a>
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
                        <td>{formatTime(attendance.check_out_time)}</td>
                        <td>{attendance.status}</td>
                        <td>
                          <a
                            href={`/edit-attendance/${attendance.uuid}`}
                            className="btn btn-sm btn-warning"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </a>
                          &nbsp;
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
                Are you sure you want to delete this attendance record?
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
                  onClick={() => deleteAttendance(attendanceToDelete)}
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

export default TableAttendance;
