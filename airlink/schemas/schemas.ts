import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: z.string().min(9, "Teléfono inválido").max(15),
  nif: z.string().length(9, "NIF inválido"),
  nombre_usuario: z.string().min(4, "Mínimo 4 caracteres"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  usuarioOEmail: z.string().min(4, "Mínimo 4 caracteres"),
  contraseña: z.string().min(8, "Mínimo 8 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>
