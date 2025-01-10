import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const COMPANY_INFO = {
  name: "PT Maju Terus",
  address: "Jl. Sukajadi No.10, Bandung, Jawa Barat",
  phone: "(022) 1234567"
};

const TablePayroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [lastGenerated, setLastGenerated] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [exportType, setExportType] = useState(""); // "pdf" or "excel"

  // Fetch payroll data
  const fetchPayroll = async () => {
    try {
      const response = await axios.get("http://localhost:8000/payroll", {
        withCredentials: true,
      });
      const sortedData = response.data.sort((a, b) => {
        if (b.year === a.year) {
          return b.month - a.month;
        }
        return b.year - a.year;
      });
      setPayrollData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      setError("Failed to fetch payroll data");
    }
  };
  const generatePayslip = async (employee) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header with company logo (assuming a simple box as logo)
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(COMPANY_INFO.name, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(COMPANY_INFO.address, pageWidth / 2, 30, { align: 'center' });
    doc.text(COMPANY_INFO.phone, pageWidth / 2, 38, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Title
    doc.setFontSize(18);
    doc.text('SLIP GAJI KARYAWAN', pageWidth / 2, 55, { align: 'center' });
    doc.line(20, 58, pageWidth - 20, 58);

    // Period
    doc.setFontSize(12);
    doc.text(`Periode: ${MONTHS[employee.month - 1]} ${employee.year}`, pageWidth / 2, 65, { align: 'center' });

    // Employee Information Section
    doc.setFontSize(11);
    const employeeInfo = [
      ['Nama Karyawan', ':', employee.user.name],
      ['ID Karyawan', ':', employee.user.uuid],
      ['Jabatan', ':', employee.user.position || 'Staff'],
      ['Departemen', ':', employee.user.department || 'General']
    ];

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 75, pageWidth - 40, 30, 'F');
    let yPos = 82;
    employeeInfo.forEach(([label, separator, value]) => {
      doc.text(label, 30, yPos);
      doc.text(separator, 80, yPos);
      doc.text(value, 85, yPos);
      yPos += 6;
    });

    // Salary Details
    const salaryDetails = [
      ['PENGHASILAN', '', ''],
      ['Gaji Pokok', ':', formatCurrency(employee.base_salary)],
      ['Lembur', ':', formatCurrency(employee.total_overtime_payment)],
      ['POTONGAN', '', ''],
      ['Total Potongan', ':', formatCurrency(employee.total_deductions)],
      ['', '', ''],
      ['TOTAL GAJI BERSIH', ':', formatCurrency(employee.final_salary)]
    ];

    doc.autoTable({
      startY: 115,
      head: [],
      body: salaryDetails,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 10 },
        2: { cellWidth: 80, halign: 'right' }
      },
      didParseCell: function(data) {
        // Style for section headers
        if (data.row.cells[0].text === 'PENGHASILAN' || data.row.cells[0].text === 'POTONGAN') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
        // Style for total
        if (data.row.cells[0].text === 'TOTAL GAJI BERSIH') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 11;
        }
      }
    });

    // Footer
    const footerY = doc.autoTable.previous.finalY + 30;
    doc.line(20, footerY - 10, 80, footerY - 10); // Line for signature
    doc.text('Finance Manager', 35, footerY);
    
    // Current date
    const currentDate1 = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Dicetak pada: ${currentDate1}`, pageWidth - 30, footerY, { align: 'right' });

    doc.save(`Slip_Gaji_${employee.user.name}_${MONTHS[employee.month - 1]}_${employee.year}.pdf`);
  };
  
  // Export to Excel
  const exportToExcel = () => {
    const filteredData = getFilteredData();
    const workbook = XLSX.utils.book_new();
    
    const exportData = filteredData.map((row, index) => ({
      'No': index + 1,
      'Name': row.user.name,
      'Base Salary': formatCurrency(row.base_salary),
      'Total Deductions': formatCurrency(row.total_deductions),
      'Total Overtime': formatCurrency(row.total_overtime_payment),
      'Final Salary': formatCurrency(row.final_salary),
      'Period': `${getMonthName(row.month)} ${row.year}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Style the worksheet
    const cols = [
      { wch: 5 },  // No
      { wch: 20 }, // Name
      { wch: 15 }, // Base Salary
      { wch: 15 }, // Total Deductions
      { wch: 15 }, // Total Overtime
      { wch: 15 }, // Final Salary
      { wch: 10 }, // Period
    ];
    worksheet['!cols'] = cols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Data');
    XLSX.writeFile(workbook, `Payroll_${exportDateRange.startDate}_to_${exportDateRange.endDate}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    const filteredData = getFilteredData();
    const doc = new jsPDF();

    // Add company header
    doc.setFontSize(20);
    doc.text('Company Payroll Report', 105, 15, { align: 'center' });
    
    // Add period info
    doc.setFontSize(12);
    doc.text(`Period: ${exportDateRange.startDate} to ${exportDateRange.endDate}`, 105, 25, { align: 'center' });

    // Create table
    const tableColumn = ['No', 'Name', 'Base Salary', 'Deductions', 'Overtime', 'Final Salary', 'Period'];
    const tableRows = filteredData.map((row, index) => [
      index + 1,
      row.user.name,
      formatCurrency(row.base_salary),
      formatCurrency(row.total_deductions),
      formatCurrency(row.total_overtime_payment),
      formatCurrency(row.final_salary),
      `${getMonthName(row.month)} ${row.year}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`Payroll_${exportDateRange.startDate}_to_${exportDateRange.endDate}.pdf`);
  };

  const getFilteredData = () => {
    const startDay = new Date(exportDateRange.startDate);
    startDay.setHours(0, 0, 0, 0); // Set start of day
    const endDay = new Date(exportDateRange.endDate);
    endDay.setHours(23, 59, 59, 999); // Set end of day
  
    return payrollData.filter((item) => {
      const itemDate = new Date(item.year, item.month - 1, 1); // Assuming the data has month and year fields
      return itemDate >= startDay && itemDate <= endDay;
    });
  };
  

  // Handle export
  const handleExport = () => {
    if (!exportDateRange.startDate || !exportDateRange.endDate) {
      alert('Please select date range');
      return;
    }

    if (exportType === 'excel') {
      exportToExcel();
    } else if (exportType === 'pdf') {
      exportToPDF();
    }

    setShowExportModal(false);
  };

  
  const generatePayroll = async () => {
    setGenerating(true);
    setError("");
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();

    try {
      await axios.post(
        "http://localhost:8000/generate-payroll",
        {
          month: currentMonth,
          year: currentYear
        },
        {
          withCredentials: true
        }
      );
      
      // Set last generated time
      setLastGenerated(new Date());
      
      // Save to localStorage
      localStorage.setItem('lastPayrollGenerated', new Date().toISOString());
      await fetchPayroll();
      alert(`Payroll for ${currentMonth}-${currentYear} generated successfully!`);
    } catch (error) {
      console.error("Error generating payroll:", error);
      setError(error.response?.data?.message || "Failed to generate payroll");
    } finally {
      setGenerating(false);
    }
  };
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const getMonthName = (monthNumber) => {
    return monthNames[monthNumber - 1]; // subtract 1 to account for array indexing starting at 0
  };
  // Load last generated time from localStorage on component mount
  useEffect(() => {
    const lastGen = localStorage.getItem('lastPayrollGenerated');
    if (lastGen) {
      setLastGenerated(new Date(lastGen));
    }
  }, []);

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

  // Function to format date and time
  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
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
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <button
                  className="btn btn-primary me-2"
                  onClick={generatePayroll}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate Payroll"}
                </button>
                {lastGenerated && (
                  <small className="text-muted">
                    Last generated: {formatDateTime(lastGenerated)}
                  </small>
                )}
              </div>
              <div>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowExportModal(true)}
                >
                  <i className="bi bi-download me-2"></i>
                  Export Data
                </button>
              </div>
            </div>
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
                      <th>Actions</th>
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
                        <td>{`${getMonthName(payroll.month)} ${payroll.year}`}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => generatePayslip(payroll)}
                          >
                            <i className="bi bi-download me-1"></i>
                            Slip Gaji
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {/* Export Modal */}
          {showExportModal && (
            <div className="modal fade show" style={{ display: 'block' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Export Payroll Data</h5>
                    <button 
                      type="button" 
                      className="btn-close"
                      onClick={() => setShowExportModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Date Range</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Calendar size={18} />
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          value={exportDateRange.startDate}
                          onChange={(e) => setExportDateRange(prev => ({
                            ...prev,
                            startDate: e.target.value
                          }))}
                        />
                        <span className="input-group-text">to</span>
                        <input
                          type="date"
                          className="form-control"
                          value={exportDateRange.endDate}
                          onChange={(e) => setExportDateRange(prev => ({
                            ...prev,
                            endDate: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Export Format</label>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn ${exportType === 'pdf' ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                          onClick={() => setExportType('pdf')}
                        >
                          <i className="bi bi-file-pdf me-2"></i>
                          PDF
                        </button>
                        <button
                          className={`btn ${exportType === 'excel' ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`}
                          onClick={() => setExportType('excel')}
                        >
                          <i className="bi bi-file-excel me-2"></i>
                          Excel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowExportModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleExport}
                      disabled={!exportDateRange.startDate || !exportDateRange.endDate || !exportType}
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal Backdrop */}
          {showExportModal && (
            <div 
              className="modal-backdrop fade show"
              onClick={() => setShowExportModal(false)}
            ></div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TablePayroll;