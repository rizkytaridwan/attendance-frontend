import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './layout/userPage/UserList';
import UserCreate from './layout/userPage/UserCreatePage';
import UserEditPage from './layout/userPage/UserEditPage';
import ErrorPage from './403';
import NotFoundPage from './404';
import OvertimeListPage from './layout/overtimePage/OvertimeListPage';
import AttendanceListPage from './layout/attendancePage/AttendanceListPage';
import AbsentListPage from './layout/attendancePage/AbsentListPage';
import LeaveListPage from './layout/leavePage/LeaveListPage';
import AttendancePage from './components/attendance/CreateAttendance';
import PayrollListPage from './layout/payrollPage/PayrollListPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forbidden" element={<ErrorPage />} />
        <Route path="/" element={<Login />} />
        //user
        <Route path="/users" element={<UserList />} />
        <Route path="/add-user" element={<UserCreate />} />
        <Route path="/edit-user/:id" element={<UserEditPage />} />

        //overtime
        <Route path="/overtimelist" element={<OvertimeListPage />} />

        //attendance
        <Route path="/attendancelist" element={<AttendanceListPage />} />
        <Route path="/absentlist" element={<AbsentListPage />} />
        <Route path="/attendance" element={<AttendancePage />} />

        //leave
        <Route path="/leavelist" element={<LeaveListPage />} />

        //payroll
        <Route path="/payroll" element={<PayrollListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
