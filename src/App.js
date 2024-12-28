import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './layout/userPage/UserList';
import UserCreate from './layout/userPage/UserCreatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/add-user" element={<UserCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
