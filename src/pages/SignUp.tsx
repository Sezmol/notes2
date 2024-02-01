import * as z from 'zod';
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateNewUser } from '../lib/react-query';
import { SignUpValidation } from '../lib/validation';
import { useAppDispatch } from '../redux/store';
import { authenticateUser } from '../redux/slices/userInfoSlice';
import { getCurrentUser, signInUser } from '../lib/appwrite/api';
import { OneEightyRing } from 'react-svg-spinners';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [zodErrors, setZodErrors] = useState<z.ZodIssue[]>();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const { mutateAsync: createNewUser, isPending } = useCreateNewUser();

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
      const validationResult = SignUpValidation.safeParse(formData);

      if (validationResult.success) {
        const newUser = await createNewUser(formData);

        if (!newUser) throw new Error('Не удалось создать пользвателя');

        const session = await signInUser({
          email: formData.email,
          password: formData.password,
        });

        if (!session) throw new Error('Не удалось войти');

        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error('Не удалось получить пользователя');

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
      setFormErrors((prev) => {
        return [
          ...prev,
          error?.message ===
          'A user with the same id, email, or phone already exists in this project.'
            ? 'Пользователь с данной почтой уже существует'
            : error?.message ===
              ' Rate limit for the current endpoint has been exceeded. Please try again after some time.'
            ? 'Вы превысили лимит запросов, пожалуйста, попробуйте позднее'
            : 'Произошла ошибка при входе, попробуйте еще раз позднее',
        ];
      });
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col justify-center items-center gap-3"
      >
        <h1 className="font-bold text-center text-lg">
          Зарегистрируйтесь, пожалуйста, чтобы пользоваться сайтом
        </h1>
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
          <h2>Имя пользователя</h2>
          <input
            value={formData.username}
            onChange={(e) => handleChange(e)}
            className="text-slate-950 py-2 px-3 rounded-md"
            type="text"
            name="username"
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
          {Array.from(new Set(formErrors)).map((error) => (
            <p key={error} className="text-red-600">
              {error}
            </p>
          ))}
        </div>
        <button
          disabled={isPending}
          className="flex gap-2 mt-2 py-2 px-3 bg-violet-500 rounded-md"
        >
          Зарегистрироваться {isPending && <OneEightyRing />}
        </button>
        <p>
          Уже есть аккаунт?
          <Link className="text-violet-500 ml-2" to={'/sign-in'}>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
