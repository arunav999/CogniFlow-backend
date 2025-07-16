# CogniFlow - Backend

CogniFlow is a modular task management backend built with Node.js, Express, and MongoDB. It supports workspaces, projects, tickets, user authentication, and file uploads, designed for scalable team collaboration.

## Features

- User authentication (JWT, sessions, refresh tokens)
- Role-based access control (Admin, Manager, Developer)
- Workspaces, Projects, and Tickets management
- File uploads (Cloudinary, Multer)
- Custom error handling and validation
- Modular controllers, routes, and models

## Folder Structure

```
backend/
├── config/           # Database configuration
├── constants/        # Enums, roles, status codes, regex
├── controllers/      # Route controllers (Auth, Projects, Workspaces, Tickets)
├── errors/           # Custom error classes and handlers
├── middlewares/      # Auth, upload, and token verification
├── models/           # Mongoose models (User, Project, Ticket, Workspace, Tokens)
├── routes/           # Express route definitions
├── services/         # Business logic/services
├── uploads/          # Uploaded files
├── utils/            # Utility functions (hashing, token generation)
├── validations/      # Request body validators
├── server.js         # Main Express server entrypoint
├── package.json      # Project dependencies and scripts
└── README.md         # Project documentation
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLOUDINARY_URL=your_cloudinary_url
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Overview

- **Auth**: Register, login, logout, session/refresh token
- **Projects**: Create, update, delete, list projects
- **Workspaces**: Create, update, delete, list workspaces
- **Tickets**: Create, update, delete, list tickets, manage attachments

## Technologies Used

- Node.js
- Express
- MongoDB & Mongoose
- JWT & bcrypt
- Multer & Cloudinary

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
