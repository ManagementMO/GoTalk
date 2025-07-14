// 1. Import necessary modules from the express library
import express, { Express, Request, Response } from 'express';

// 2. Initialize the Express application
const app: Express = express();

// 3. Define a port number. It's good practice to use a variable.
const port = 4000;

// 4. Create a basic route for the root URL ('/')
// This handles GET requests to http://localhost:4000/
app.get('/', (req: Request, res: Response) => {
  // 5. Send a response back to the client
  res.send('Hello from the Nexus Server!');
});

// 6. Start the server and make it listen for connections on the specified port
app.listen(port, () => {
  // 7. Log a message to the console once the server is running
  console.log(`[server]: Server is running at http://localhost:${port}`);
});