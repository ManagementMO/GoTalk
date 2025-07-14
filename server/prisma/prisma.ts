// This file is typically named `prisma.ts` or `db.ts` and placed in a `lib` or `utils` directory.

// Import necessary modules from Prisma Client and the Accelerate extension.
// The '@prisma/client/edge' import is specifically for Serverless and Edge environments.
// If you are in a long-running Node.js environment, you would use '@prisma/client'.
import { PrismaClient } from '@prisma/client/edge'; // For Serverless/Edge environments
// import { PrismaClient } from '@prisma/client'; // Uncomment this line for Long-running environments

import { withAccelerate } from '@prisma/extension-accelerate';

// Initialize the Prisma Client instance.
// Then, extend it with the withAccelerate() function.
// This makes sure that all your database queries will go through Prisma Accelerate,
// benefiting from its connection pooling and caching capabilities.
const prisma = new PrismaClient().$extends(withAccelerate());

// Export the prisma client instance so you can import it and use it throughout your application.
// For example, in your API routes or server-side functions:
// import prisma from '../lib/prisma'; // Assuming this file is in 'lib'
// const users = await prisma.user.findMany();
export default prisma;
