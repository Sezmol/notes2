import * as z from 'zod';
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateNewUser } from '../lib/react-query';
import { SignUpValidation } from '../lib/validation';
import { useAppDispatch } from '../redux/store';
import { authenticateUser } from '../redux/slices/userInfoSlice';
import { getCurrentUser, signInUser } from '../lib/appwrite/api';

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

  const { mutateAsync: createNewUser } = useCreateNewUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validationResult = SignUpValidation.safeParse(formData);

      if (validationResult.success) {
        await createNewUser(formData);

        const session = await signInUser({
          email: formData.email,
          password: formData.password,
        });

        const currentUser = await getCurrentUser();
        console.log(currentUser);

        if (currentUser) {
          dispatch(
            authenticateUser({
              user: {
                id: currentUser.$id,
                email: currentUser.email,
                username: currentUser.name,
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
      setFormErrors((prev) => [...prev, error]);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col justify-center items-center gap-3"
      >
        <h1 className="font-bold text-lg">
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
          <h2>Логин</h2>
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
          {formErrors.map((error) => (
            <p key={error} className="text-red-600">
              {error}
            </p>
          ))}
        </div>
        <button className="mt-2 py-2 px-3 bg-violet-500 rounded-md">
          Зарегистрироваться
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
