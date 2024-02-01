import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PublicRoute from './hoc/PublicRoute';
import PrivateRoute from './hoc/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="sign-up"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="sign-in"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default App;
