import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
