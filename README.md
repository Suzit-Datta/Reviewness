
# Reviewness

Reviewness is a product review platform where users can share their experiences and ratings, helping others make better purchasing decisions. Companies can manage their products and receive customer feedback.

## Features

- User registration and login
- Product and company management
- Customer reviews and ratings
- Comments on reviews
- Company dashboard
- Real-time notifications
- Role-based access for users, companies, employees, and admins

## Technologies Used

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, DaisyUI, Axios

**Backend:** NestJS, Node.js, TypeScript

**Database:** PostgreSQL

**Other Tools:** Git, GitHub, Pusher

## Project Structure

Reviewness/
├── frontend/
├── backend/
└── README.md

## Getting Started

### 1. Clone the repository

bash:
git clone YOUR_GITHUB_REPOSITORY_URL
cd Reviewness

### 2. Set up the backend

bash:
cd backend
npm install

Create a .env file with the required database and environment variables.

Start the backend:

bash:
npm run start:dev

### 3. Set up the frontend

Open another terminal:

bash:
cd frontend
npm install

Create a .env.local file and configure the backend API URL:

env
NEXT_PUBLIC_API_URL=http://localhost:7000

Start the frontend:

bash:
npm run dev

Open **http://localhost:3000** in your browser.

## Environment Variables

Configure the required environment variables for the database, authentication, and other services before running the project.

Do not commit .env or .env.local files containing secrets.

