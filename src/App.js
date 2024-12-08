import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingCar from './pages/BookingCar';
import UserBookings from './pages/UserBookings';
import AddCar from './pages/AddCar';
import AdminHome from './pages/AdminHome';
import EditCar from './pages/EditCar';

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem('user')) {
    // user is authenticated
    return children;
  }
  return <Navigate to="/login" />;
};

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/booking/:id",
    element: (
      <ProtectedRoute>
        <BookingCar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/userbookings",
    element: (
      <ProtectedRoute>
        <UserBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addcar",
    element: (
      <ProtectedRoute>
        <AddCar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/editcar/:id",
    element: (
      <ProtectedRoute>
        <EditCar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminHome />
      </ProtectedRoute>
    ),
  },
]);

// App Component
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
