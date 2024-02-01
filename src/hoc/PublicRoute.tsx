import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import React from 'react';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAppSelector((state) => state.userInfo.isAuth);

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
