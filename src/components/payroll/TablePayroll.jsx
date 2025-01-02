import React, { useState, useEffect } from "react";
import axios from "axios";

const TablePayroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayroll = async () => {
    try {
      const response = await axios.get("http://localhost:8000/payroll", {
        withCredentials: true,
      });
      // Mengurutkan data berdasarkan periode (tahun dan bulan)
      const sortedData = response.data.sort((a, b) => {
        // Membandingkan tahun terlebih dahulu
        if (b.year === a.year) {
          // Jika tahun sama, bandingkan bulan
          return b.month - a.month;
        }
        return b.year - a.year;
      });
      setPayrollData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  };
  

  useEffect(() => {
    fetchPayroll();
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

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Payroll Data</h3>
            <p className="text-subtitle text-muted">
              View and manage employee payroll information
            </p>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
        <div className="card-header">
            <button
              className="btn btn-primary"
            >
              Generate Payroll
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loading ? (
                <p>Loading payroll data...</p>
              ) : payrollData.length === 0 ? (
                <p>No payroll data found.</p>
              ) : (
                <table className="table table-hover" id="table1">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Base Salary</th>
                      <th>Total Deductions</th>
                      <th>Total Overtime</th>
                      <th>Final Salary</th>
                      <th>Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map((payroll, index) => (
                      <tr key={payroll.uuid}>
                        <td>{index + 1}</td>
                        <td>{payroll.user.name}</td>
                        <td>{formatCurrency(payroll.base_salary)}</td>
                        <td>{formatCurrency(payroll.total_deductions)}</td>
                        <td>{formatCurrency(payroll.total_overtime_payment)}</td>
                        <td>{formatCurrency(payroll.final_salary)}</td>
                        <td>{`${payroll.month}-${payroll.year}`}</td>
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

export default TablePayroll;