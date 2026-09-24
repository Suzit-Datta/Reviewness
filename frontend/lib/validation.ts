import { z } from 'zod';

export const loginSchema = z.object({
  role: z.enum(['USER', 'COMPANY', 'EMPLOYEE', 'ADMIN']),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const adminRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(1, 'Phone is required'),
});


export const userRegisterSchema = z.object({
  userName: z.string().min(1, 'Username is required').max(24, 'Max 24 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  gender: z.enum(['male', 'female', 'other']),
});

export const companyRegisterSchema = z.object({
  companyName: z.string().min(2, 'Company name is required').max(100, 'Max 100 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  industryId: z.string().min(1, 'Industry is required'),
});

export const employeeRegisterSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(1, 'Phone is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;