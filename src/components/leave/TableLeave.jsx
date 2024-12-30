import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const TableLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8000/request", {
        withCredentials: true,
      });
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching leave requests:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    if (!loading && window.$.fn.dataTable.isDataTable("#table1")) {
      window.$("#table1").DataTable().destroy();
    }
    if (!loading) {
      window.$("#table1").DataTable({
        responsive: true,
      });
    }
  }, [loading]);

  const deleteLeaveRequest = async (uuid) => {
    try {
      await axios.delete(`http://localhost:8000/request/${uuid}`, {
        withCredentials: true,
      });
      setModalVisible(false);
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  const handleDeleteClick = (uuid) => {
    setRequestToDelete(uuid);
    setModalVisible(true);
  };

  const handleApproveClick = async (uuid) => {
    try {
      await axios.patch(`http://localhost:8000/approve-request/${uuid}`, null, {
        withCredentials: true,
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error approving leave request:", error);
    }
  };

  const handleRejectClick = async (uuid) => {
    try {
      await axios.patch(`http://localhost:8000/reject-request/${uuid}`, null, {
        withCredentials: true,
      });
      fetchLeaveRequests(); 
    } catch (error) {
      console.error("Error rejecting leave request:", error);
    }
  };

  const getBadgeClass = (status) => {
    if (status === "Pending") {
      return "bg-warning";
    } else if (status === "Approved") {
      return "bg-success";
    } else if (status === "Rejected") {
      return "bg-danger";
    }
    return "";
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Leave Requests</h3>
            <p className="text-subtitle text-muted">
              Manage employee leave requests.
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
                  Leave Requests
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header">
            <a href="add-leave" className="btn btn-primary">
              Add Leave Request
            </a>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <table className="table table-hover" id="table1">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Approved By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request, index) => (
                      <tr key={request.uuid}>
                        <td>{index + 1}</td>
                        <td>{request.user.name}</td>
                        <td>{request.leave_type}</td>
                        <td>
                          {format(new Date(request.start_date), "yyyy-MM-dd")}
                        </td>
                        <td>
                          {format(new Date(request.end_date), "yyyy-MM-dd")}
                        </td>

                        <td>{request.reason}</td>
                        <td>
                          <span
                            className={`badge ${getBadgeClass(request.status)}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td>{request.approved_by}</td>
                        <td>
                          {request.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApproveClick(request.uuid)}
                                className="btn btn-sm btn-success me-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClick(request.uuid)}
                                className="btn btn-sm btn-danger me-2"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteClick(request.uuid)}
                            className="btn btn-sm btn-danger"
                          >
                            <i className="bi bi-trash-fill"></i>
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
                Are you sure you want to delete this leave request?
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
                  onClick={() => deleteLeaveRequest(requestToDelete)}
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

export default TableLeave;
