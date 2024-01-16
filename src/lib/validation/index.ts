import * as z from 'zod';

export const SignUpValidation = z.object({
  email: z.string().email({
    message: 'Неверная почта',
  }),

  username: z
    .string()
    .min(2, {
      message: 'Слишком короткое имя пользователя',
    })
    .max(20, {
      message: 'Слишком длинное имя пользователя',
    }),

  password: z
    .string()
    .min(8, {
      message: 'Для пароля нужно минимум 8 символов',
    })
    .max(30, { message: 'Для пароля нужно максимум 30 символов' }),
});

export const SignInValidation = z.object({
  email: z.string().email({
    message: 'Неверный email',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Для пароля нужно минимум 8 символов',
    })
    .max(30, { message: 'Для пароля нужно максимум 30 символов' }),
});
