import { Link } from 'react-router-dom';
import { signOutUser } from '../lib/appwrite/api';
import { unauthenticateUser } from '../redux/slices/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearActiveNote, toggleListsMenu } from '../redux/slices/noteSlice';
import QuitSvg from '../svg/QuitSvg';

const Header = () => {
  const { user, isAuth, sessionId } = useAppSelector((state) => state.userInfo);

  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(unauthenticateUser());
      dispatch(clearActiveNote());
      await signOutUser(sessionId);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleToggleListsMenu = () => {
    dispatch(toggleListsMenu());
  };

  return (
    <header className="flex justify-between items-center h-20 px-6 py-4 border-b border-b-slate-800">
      <div
        onClick={handleToggleListsMenu}
        className="flex cursor-pointer flex-col justify-center items-center h-5 mdMin:hidden"
      >
        <span className="w-6 h-1 bg-slate-200"></span>
        <span className="w-6 mt-1 h-1 bg-slate-200"></span>
        <span className="w-6 mt-1 h-1 bg-slate-200"></span>
      </div>
      <h1 className="font-bold flex-1 text-center sm:hidden text-4xl">
        {user.username}
      </h1>
      <div className="flex items-center gap-4">
        <div>
          {isAuth ? (
            <button
              onClick={handleSignOut}
              className="flex cursor-pointer gap-1"
            >
              <p>Выйти</p>
              <QuitSvg className="h-6 w-6" />
            </button>
          ) : (
            <Link to="sign-in">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
