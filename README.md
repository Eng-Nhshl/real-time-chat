# Real-Time Chat App

A modern, real-time chatting application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io for instant messaging.

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Real-Time Messaging**: Instant message delivery using Socket.io
- **Profile Management**: Update name, bio, and profile picture
- **User Search**: Find and chat with other users
- **Unread Message Badges**: Visual indicators for new messages
- **Browser Notifications**: Desktop notifications for messages when not in chat
- **Responsive Design**: Works on desktop and mobile devices
- **Online Status**: See when users are online

## Tech Stack

### Frontend

- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Socket.io client for real-time features
- Tailwind CSS for styling

### Backend

- Node.js with Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
real-time-chat/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Socket)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── utils/             # Utilities and config
│   ├── app.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Eng-Nhshl/real-time-chat
   cd real-time-chat
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_jwt_secret_here
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

7. **Start the frontend (in a new terminal)**

   ```bash
   cd client
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### Users

- `GET /api/user` - Get all users (except current)

### Messages

- `GET /api/messages/:userId` - Get messages with a specific user
- `POST /api/messages/send/:receiverId` - Send a message

## Usage

1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **Update Profile**: Click the menu icon to edit your profile
4. **Start Chatting**: Select a user from the sidebar to begin messaging
5. **Real-Time Updates**: Messages appear instantly without page refresh
6. **Notifications**: Receive browser notifications for new messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Socket.io for real-time communication
- Tailwind CSS for styling
- React community for excellent documentation
