import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import React from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector((state) => state.userInfo.isAuth);

  if (!isAuth) return <Navigate to={'/sign-in'} />;

  return children;
};

export default PrivateRoute;
