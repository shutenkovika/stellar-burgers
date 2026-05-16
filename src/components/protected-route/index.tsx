import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // true = только для НЕавторизованных (login, register)
  children: React.ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);

  // Пока не проверили токен — показываем лоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Страница только для НЕавторизованных (login/register)
  // Если уже залогинен — отправляем туда, откуда пришли, или на главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  // Страница только для авторизованных
  // Если не залогинен — отправляем на login, запоминаем откуда пришли
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
