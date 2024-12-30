import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './layout/userPage/UserList';
import UserCreate from './layout/userPage/UserCreatePage';
import UserEditPage from './layout/userPage/UserEditPage';
import ErrorPage from './403';
import NotFoundPage from './404';
import OvertimeListPage from './layout/overtimePage/OvertimeListPage';

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
        {/* <Route path="/add-user" element={<UserCreate />} />
        <Route path="/edit-user/:id" element={<UserEditPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
