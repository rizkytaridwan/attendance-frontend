import React, { useState, useEffect } from "react";
import axios from "axios";

const TableAbsent = () => {
  const [absentUsers, setAbsentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch absent user data
  const fetchAbsent = async () => {
    try {
      const response = await axios.get("http://localhost:8000/absent", {
        withCredentials: true,
      });
      setAbsentUsers(response.data.data);
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
                    </tr>
                  </thead>
                  <tbody>
                    {absentUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
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

export default TableAbsent;
