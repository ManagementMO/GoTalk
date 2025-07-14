import { PrismaClient } from '@prisma/client'; // <--- IMPORT DIRECTLY FROM THE PACKAGE
import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient(); // <--- INSTANTIATE IT HERE

// Define the shape of the input data using Zod
const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// The rest of the file is EXACTLY THE SAME as above...
export const register = async (req: Request, res: Response) => {
  // ... same logic as Option 1
  try {
    const { email, username, password } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};