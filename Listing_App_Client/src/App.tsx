import {Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import About from './pages/About/About'
import ContactUs from './pages/Contact/Contact';
import CreateList from './pages/CreateList/CreateList'
import UserDashboard from './pages/UserDashboard/UserDashboard'
import UserListDetails from './pages/ListDestails/userListDetails'
import GeneralListDetails from './pages/ListDestails/GeneralListDetails'
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register/Register';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { setCredentials } from './features/auth/authSlice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import UpdatePage from './pages/UpdatePage/UpdatePage';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      dispatch(setCredentials({
        token: storedToken,
        user: JSON.parse(storedUser),
      }));
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/general/:id" element={<GeneralListDetails />} />
          <Route path="/listings/user/:userId/:listingId" element={<UserListDetails />} />
          <Route path="/listings/update/:id" element={<UpdatePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateList />
              </ProtectedRoute>
            }
          />
        </Routes>
      <Footer />
    </>
  );
}

export default App;
