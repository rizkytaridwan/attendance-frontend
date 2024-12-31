import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AttendanceInMonth = () => {
    const [userId, setUserId] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleUserIdChange = (e) => setUserId(e.target.value);
    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleYearChange = (e) => setYear(e.target.value);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi input bulan dan tahun (userId hanya dibutuhkan untuk request data spesifik pengguna)
        if ((!userId && !month && !year) || !month || !year) {
          setError('Month and Year are required');
          return;
        }
      
        setLoading(true);
        try {
          let url = 'http://localhost:8000/attendance-in-month';
          let requestBody = { month, year };
      
          if (userId) {
            requestBody.userId = userId; // Include userId if available
          }
      
          const response = await axios.post(url, requestBody);
          setAttendanceData(response.data);
          setError('');
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Error fetching data: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      
  
    return (
      <div className="page-heading">
        <div className="page-title">
          <h3>Attendance Data</h3>
          <p className="text-subtitle text-muted">Manage attendance records by month.</p>
        </div>
  
        <section className="section">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>User ID</label>
                      <input
                        type="number"
                        className="form-control"
                        value={userId}
                        onChange={handleUserIdChange}
                        placeholder="Enter User ID"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Month</label>
                      <input
                        type="number"
                        className="form-control"
                        value={month}
                        onChange={handleMonthChange}
                        placeholder="Enter month (1-12)"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={handleYearChange}
                        placeholder="Enter year"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary mt-4">Get Attendance</button>
                  </div>
                </div>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {loading ? (
                <p>Loading data...</p>
              ) : (
                <div className="table-responsive mt-4">
                  {attendanceData.length > 0 ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Position</th>
                          <th>Check-In Time</th>
                          <th>Check-Out Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((item, index) => (
                          <tr key={item.uuid}>
                            <td>{index + 1}</td>
                            <td>{item.user ? item.user.name : 'No Name'}</td>
                            <td>{item.user ? item.user.departement : 'No Department'}</td>
                            <td>{item.user ? item.user.position : 'No Position'}</td>
                            <td>{format(new Date(item.check_in_time), 'yyyy-MM-dd HH:mm:ss')}</td>
                            <td>{format(new Date(item.check_out_time), 'yyyy-MM-dd HH:mm:ss')}</td>
                            <td>{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No attendance data found for this period.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  };

export default AttendanceInMonth;
