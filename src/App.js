import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './layout/userPage/UserList';
import UserCreate from './layout/userPage/UserCreatePage';
import UserEditPage from './layout/userPage/UserEditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/add-user" element={<UserCreate />} />
        <Route path="/edit-user/:id" element={<UserEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
