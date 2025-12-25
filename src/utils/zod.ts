import { object, string, literal, TypeOf } from 'zod'

function passwordValidation() {
  return string()
    .min(1, 'Pole jest wymagane')
    .min(8, 'Hasło musi składać się z co najmniej 8 znaków')
    .max(64, 'Hasło nie może przekraczać 64 znaki')
    .regex(/[a-zA-Z]/, 'Hasło musi zawierać literę alfabetu')
    .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .regex(/[^a-zA-Z0-9]/, 'Hasło musi zawierać znak specjalny')
}

export const loginUserSchema = object({
  email: string().min(1, 'Pole jest wymagane'),
  password: string().min(1, 'Pole jest wymagane'),
})

export const registerUserSchema = object({
  email: string().min(1, 'Pole jest wymagane').email('Podany adres e-mail jest nieprawidłowy'),
  password: passwordValidation(),
  passwordConfirm: string().min(1, 'Pole jest wymagane'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Podane hasła nie są identyczne',
})

export const userDataSchema = object({
  name: string()
    .min(3, 'Nazwa musi składać się z co najmniej 3 znaków')
    .max(100, 'Nazwa nie może przekraczać 100 znaków')
    .regex(/^[^\s]+/, 'Nazwa nie może zaczynać się od spacji')
    .regex(/[a-zA-Z]/, 'Nazwa musi zawierać literę alfabetu')
    .regex(/[^0-9]/, 'Nazwa nie może zawierać cyfr')
    .optional()
    .or(literal('')),
  username: string()
    .toLowerCase()
    .min(1, 'Pole jest wymagane')
    .min(3, 'Nazwa musi składać się z co najmniej 3 znaków')
    .max(32, 'Nazwa nie może przekraczać 32 znaki')
    .regex(/^[^\s]+$/, 'Nazwa nie może zawierać spacji')
    .regex(/[a-z]/, 'Nazwa musi zawierać literę alfabetu')
    .regex(/^[a-z0-9._]+$/, `Nazwa nie może posiadać innych znaków specjalnych niż "." oraz "_"`),
  password: passwordValidation().optional().or(literal('')),
  passwordConfirm: string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Podane hasła nie są identyczne',
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>
export type RegisterUserInput = TypeOf<typeof registerUserSchema>
export type userDataInput = TypeOf<typeof userDataSchema>
