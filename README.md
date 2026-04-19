# GolfConnect

A modern, emotional golf application with authentication, user dashboard, and charity draws.
<img width="1760" height="916" alt="Screenshot 2026-03-26 005325" src="https://github.com/user-attachments/assets/412d1503-9e17-44c0-9306-9a773db9e2db" />
<img width="1861" height="906" alt="Screenshot 2026-03-26 005333" src="https://github.com/user-attachments/assets/66380f98-4182-48bd-92be-b205fd7f2b98" />
<img width="1530" height="934" alt="Screenshot 2026-03-26 005358" src="https://github.com/user-attachments/assets/cc36b5f4-1742-4b9a-bb3a-cfde1e94ed84" />
<img width="1646" height="848" alt="Screenshot 2026-03-26 005410" src="https://github.com/user-attachments/assets/818a595c-769f-4b54-9e1d-6239c427ee26" />


## Features

- User registration and login with JWT authentication
- Role-based access control (User/Admin).
- Comprehensive user dashboard with:
  - Subscription status and premium upgrade CTA
  - Score entry and performance analytics
  - Charity selection and support
  - Draw participation and winnings tracking
- Modern, clean UI with smooth animations
- Emotional design focused on the golfing experience
- Fully responsive design

## Design Philosophy

- **Modern & Clean**: Contemporary design avoiding traditional golf aesthetics
- **Emotional**: Focus on the passion and community of golf
- **Smooth Animations**: Subtle transitions and hover effects
- **Strong CTAs**: Prominent subscription upgrade prompts
- **Responsive**: Optimized for all device sizes

## Tech Stack

- Backend: Node.js, Express, MySQL, JWT
- Frontend: React, React Router, Axios, CSS3

## Color Palette

- Primary: Deep green (#2d5a27) - representing golf courses
- Secondary: Sky blue (#4a90e2) - representing the sky
- Accent: Golden (#f5a623) - representing achievement
- Background: Gradient from purple to blue - emotional depth

## Setup

### Prerequisites

- Node.js
- MySQL
- npm

### Database Setup

1. Create a MySQL database named `auth_db`
2. Run the `backend/schema.sql` file to create tables and insert sample data

### Backend Setup

1. Navigate to backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   JWT_SECRET=your_secret_key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=auth_db
   PORT=5000
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/refresh - Refresh access token
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user info

### Dashboard
- GET /api/dashboard - Get user dashboard data
- POST /api/dashboard/scores - Add golf score
- POST /api/dashboard/charity - Select charity
- POST /api/dashboard/draws/:drawId/join - Join a draw

## Usage

1. Start both backend and frontend servers
2. Visit http://localhost:3000
3. Register a new account or login
4. Explore the modern dashboard with subscription prompts
5. Enter scores, select charities, join draws

## Security Notes

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Passwords are hashed with bcrypt
- CORS enabled for frontend communication
