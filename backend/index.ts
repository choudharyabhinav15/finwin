import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const saltRounds = 10;

interface FinancialData {
  goal: string;
  goalAmount: number;
  saved: number;
  monthlySpending: number;
  monthsLeft: number;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  financial?: FinancialData;
}

const usersPath = path.join(__dirname, 'users.json');
let users: User[] = [];

try {
  // Check if the file exists before trying to read it
  if (fs.existsSync(usersPath)) {
    const fileContent = fs.readFileSync(usersPath, 'utf8');
    // Ensure the file is not empty and is valid JSON before parsing
    if (fileContent) {
      const parsedData = JSON.parse(fileContent);
      if (Array.isArray(parsedData)) {
        users = parsedData as User[];
        // Assign unique IDs to users who don't have one (for backward compatibility)
        let usersModified = false;
        users.forEach((user: Partial<User>) => {
          if (!user.id) {
            user.id = randomUUID();
            usersModified = true;
          }
        });

        if (usersModified) {
          fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        }
      }
    }
  }
} catch (error) {
  console.error('Error loading or parsing users.json, starting with an empty list.', error);
}

function calculateFinancialIndex(financial: FinancialData): number {
  const { goalAmount, monthsLeft, saved, monthlySpending } = financial;

  // If goal is met or not set, index is max.
  if (saved >= goalAmount || goalAmount <= 0) {
    return 9;
  }
  // If time is up and goal not met, index is min.
  if (monthsLeft <= 0) {
    return 0;
  }

  const requiredMonthlySaving = (goalAmount - saved) / monthsLeft;

  // If no more savings are needed, index is max.
  if (requiredMonthlySaving <= 0) {
    return 9;
  }

  const progressRatio = saved / goalAmount;

  // Handle division by zero for spendingEfficiency.
  // If spending is 0, it's impossible to gauge efficiency. Let's treat it as highly efficient (capped).
  const spendingEfficiency = monthlySpending > 0 ? requiredMonthlySaving / monthlySpending : 2.0;

  const index = Math.floor((progressRatio + spendingEfficiency) * 4.5);
  return Math.min(Math.max(index, 0), 9);
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '' ||
      !password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ message: 'Email and password are required and cannot be blank.' });
  }

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  if (!user.financial) {
    return res.json({ id: user.id, name: user.name, email: user.email, index: null });
  }

  const index = calculateFinancialIndex(user.financial);
  return res.json({ id: user.id, name: user.name, email: user.email, index });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (typeof name !== 'string' || name.trim() === '' ||
      typeof email !== 'string' || email.trim() === '' ||
      typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ message: 'Fields cannot be blank.' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser: User = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  return res.status(201).json({ message: 'User is successfully registered.' });
});

app.put('/api/financial-data', (req, res) => {
  const { email, financialData }: { email: string, financialData: FinancialData } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '' || !financialData) {
    return res.status(400).json({ message: 'Email and financial data are required.' });
  }

  // Validate financialData properties
  const { goal, goalAmount, saved, monthlySpending, monthsLeft } = financialData;
  if (
    typeof goal !== 'string' || goal.trim() === '' ||
    typeof goalAmount !== 'number' ||
    typeof saved !== 'number' ||
    typeof monthlySpending !== 'number' ||
    typeof monthsLeft !== 'number' ||
    goalAmount < 0 || saved < 0 || monthlySpending < 0
  ) {
    return res.status(400).json({ message: 'Invalid financial data provided.' });
  }

  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  users[userIndex].financial = financialData;

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  const index = calculateFinancialIndex(users[userIndex].financial);
  return res.status(200).json({ message: 'Financial data updated successfully.', index });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));

export default app;