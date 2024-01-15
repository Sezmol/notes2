import { Link } from 'react-router-dom';
import { signOutUser } from '../lib/appwrite/api';
import { unauthenticateUser } from '../redux/slices/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearActiveNote, toggleListsMenu } from '../redux/slices/noteSlice';

const Header = () => {
  const { user, isAuth, sessionId } = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const signOut = async () => {
    dispatch(unauthenticateUser());
    dispatch(clearActiveNote());
    await signOutUser(sessionId);
  };

  const handleToggleListsMenu = () => {
    dispatch(toggleListsMenu());
  };

  return (
    <header className="flex justify-between items-center h-20 px-6 py-4 border-b border-b-slate-800">
      <div
        onClick={handleToggleListsMenu}
        className="cursor-pointer flex-col justify-center items-center h-5 mdMin:hidden"
      >
        <div className="w-6 h-1 bg-slate-200"></div>
        <div className="w-6 mt-1 h-1 bg-slate-200"></div>
        <div className="w-6 mt-1 h-1 bg-slate-200"></div>
      </div>
      <h1 className="font-bold flex-1 text-center sm:hidden text-4xl">
        Мои заметки
      </h1>
      <div className="flex items-center gap-4">
        <h2 className="text-lg">{user.username}</h2>
        <div>
          {isAuth ? (
            <div onClick={signOut} className="flex cursor-pointer gap-1">
              <p>Выйти</p>
              <svg
                fill="#ffffff"
                width="24px"
                height="24px"
                viewBox="0 0 16.00 16.00"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                strokeWidth="0.00016"
              >
                <g strokeWidth="0">
                  <g
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#CCCCCC"
                    strokeWidth="0.096"
                  />
                  <path
                    d="M12.207 9H5V7h7.136L11.05 5.914 12.464 4.5 16 8.036l-3.536 3.535-1.414-1.414L12.207 9zM10 4H8V2H2v12h6v-2h2v4H0V0h10v4z"
                    fillRule="evenodd"
                  />
                </g>
              </svg>
            </div>
          ) : (
            <Link to="sign-in">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
