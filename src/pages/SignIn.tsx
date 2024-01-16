import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInUser } from '../lib/react-query';
import { useAppDispatch } from '../redux/store';
import { authenticateUser } from '../redux/slices/userInfoSlice';
import { getCurrentUser } from '../lib/appwrite/api';
import { z } from 'zod';
import { SignInValidation } from '../lib/validation';
import { OneEightyRing } from 'react-svg-spinners';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[]>();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { mutateAsync: signInUser, isPending } = useSignInUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setZodErrors([]);
    setFormErrors([]);

    try {
      const validationResult = SignInValidation.safeParse(formData);

      if (validationResult.success) {
        const session = await signInUser(formData);

        if (!session) throw new Error('Не удалось войти');

        const currentUser = await getCurrentUser();

        console.log(currentUser);

        if (currentUser) {
          dispatch(
            authenticateUser({
              user: {
                id: currentUser.$id,
                email: currentUser.email,
                username: currentUser.username,
              },
              sessionId: session.$id,
            })
          );
        } else {
          throw new Error('Не удалось зарегистрироваться');
        }

        navigate('/');
      } else {
        setZodErrors(validationResult.error.issues);
      }
    } catch (error: any) {
      setFormErrors((prev) => [
        ...prev,
        error.message ||
          'Произошла ошибка при входе, попробуйте еще раз позднее',
      ]);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col justify-center items-center gap-3"
      >
        <h1 className="font-bold text-lg">Введите свои данные, чтобы войти</h1>
        <div>
          <h2>Почта</h2>
          <input
            value={formData.email}
            onChange={(e) => handleChange(e)}
            className="text-slate-950 py-2 px-3 rounded-md"
            type="email"
            name="email"
          />
        </div>
        <div>
          <h2>Пароль</h2>
          <input
            value={formData.password}
            onChange={(e) => handleChange(e)}
            className="text-slate-950 py-2 px-3 rounded-md"
            type="password"
            name="password"
          />
        </div>
        <div>
          {zodErrors?.map((error) => (
            <p key={error.message} className="text-red-600">
              {error.message}
            </p>
          ))}
          {formErrors.map((error) => (
            <p key={error} className="text-red-600">
              {error ===
              'Invalid credentials. Please check the email and password.'
                ? 'Неправильная почта или пароль'
                : ''}
            </p>
          ))}
        </div>
        <button className="flex gap-2 mt-2 py-2 px-3 bg-violet-500 rounded-md">
          Войти {isPending && <OneEightyRing />}
        </button>
        <p>
          Нету аккаунта?
          <Link className="text-violet-500 ml-2" to={'/sign-up'}>
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
