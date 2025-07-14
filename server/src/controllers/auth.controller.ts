// We are in: /server/src/controllers/
// We need to go to: /server/prisma/
// So we go up two directories (../..) and then down into prisma
import prisma from '../../prisma/prisma'; // <--- THE KEY IMPORT

import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Define the shape of the input data using Zod
const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate the request body against our schema
    const { email, username, password } = registerSchema.parse(req.body);

    // 2. Check if a user with the same email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      // 409 Conflict is a more specific status code for this case
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // 5. Send back a success response. NEVER send the password back, even the hash.
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    // Handle validation errors from Zod specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    // Handle other potential errors
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};