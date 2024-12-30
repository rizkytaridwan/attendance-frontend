import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const TableOvertime = () => {
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [overtimeToDelete, setOvertimeToDelete] = useState(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [overtimeToApprove, setOvertimeToApprove] = useState(null);
  const [overtimeToReject, setOvertimeToReject] = useState(null);

  const fetchOvertimes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/overtime", {
        withCredentials: true,
      });
      setOvertimes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching overtime data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchOvertimes();
    if (!loading && window.$.fn.dataTable.isDataTable("#table1")) {
      window.$("#table1").DataTable().destroy();
    }
    if (!loading) {
      window.$("#table1").DataTable({
        responsive: true,
      });
    }
  }, [loading]);

  const deleteOvertime = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/overtime/${id}`, {
        withCredentials: true,
      });
      setModalVisible(false);
      fetchOvertimes();
    } catch (error) {
      console.error("Error deleting overtime:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setOvertimeToDelete(id);
    setModalVisible(true);
  };

  const approveOvertime = async (id) => {
    try {
      await axios.put(`http://localhost:8000/approve-overtime/${id}`, {
        withCredentials: true,
      });
      fetchOvertimes();
    } catch (error) {
      console.error("Error approving overtime:", error);
    }
  };

  const rejectOvertime = async (id) => {
    try {
      await axios.put(`http://localhost:8000/reject-overtime/${id}`, {
        withCredentials: true,
      });
      fetchOvertimes();
    } catch (error) {
      console.error("Error rejecting overtime:", error);
    }
  };

  const handleApproveClick = (id) => {
    setOvertimeToApprove(id);
    setApproveModalVisible(true);
  };

  const handleRejectClick = (id) => {
    setOvertimeToReject(id);
    setRejectModalVisible(true);
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Overtime Data</h3>
            <p className="text-subtitle text-muted">
              Manage overtime records with datatables.
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
                  Overtime Page
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <table className="table table-hover" id="table1">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Date</th>
                      <th>Hours</th>
                      <th>Description</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Approved By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overtimes.map((overtime, index) => (
                      <tr key={overtime.uuid}>
                        <td>{index + 1}</td>
                        <td>{format(new Date(overtime.date), 'yyyy-MM-dd')}</td>
                        <td>{overtime.hours}</td>
                        <td>{overtime.description}</td>
                        <td>{`Rp ${overtime.overtime_payment.toLocaleString()}`}</td>
                        <td>{overtime.status}</td>
                        <td>{overtime.approved_by || "Pending"}</td>
                        <td>
                          {overtime.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApproveClick(overtime.uuid)}
                                className="btn btn-sm btn-success"
                              >
                                Approve
                              </button>
                              &nbsp;
                              <button
                                onClick={() => handleRejectClick(overtime.uuid)}
                                className="btn btn-sm btn-danger"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          &nbsp;
                          <button
                            onClick={() => handleDeleteClick(overtime.uuid)}
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

      {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete this overtime record?
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
                  onClick={() => deleteOvertime(overtimeToDelete)}
                >
                  <span className="d-none d-sm-block">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveModalVisible && (
        <div
          className="modal fade show"
          id="approveModal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success">
                <h5 className="modal-title text-white">Approve Confirmation</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setApproveModalVisible(false)}
                >
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to approve this overtime record?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setApproveModalVisible(false)}
                >
                  <span className="d-none d-sm-block">Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn btn-success ms-1"
                  onClick={() => {
                    approveOvertime(overtimeToApprove);
                    setApproveModalVisible(false);
                  }}
                >
                  <span className="d-none d-sm-block">Approve</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalVisible && (
        <div
          className="modal fade show"
          id="rejectModal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white">Reject Confirmation</h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setRejectModalVisible(false)}
                >
                  <i data-feather="x"></i>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to reject this overtime record?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setRejectModalVisible(false)}
                >
                  <span className="d-none d-sm-block">Cancel</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-1"
                  onClick={() => {
                    rejectOvertime(overtimeToReject);
                    setRejectModalVisible(false);
                  }}
                >
                  <span className="d-none d-sm-block">Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOvertime;
