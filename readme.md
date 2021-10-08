# Getting Started:

This repo serves as a backbone template for NodeJS with the following features:

- CORS, cookies and validators setup.
- Auth and OAuth^2 (Google) using JWT with access and refresh tokens generated.
- Both tokens are stored as cookies in client; refresh tokens are also stored on server for verification purposes.
- Database connection to NoSQL (MongoDB) and SQL (using Sequelize library).
- Sever port listens on 8080.

Current setup is for MySQL.

# Setup:

- Add .env file with necessary configuration for database connection.
- In app.js, to delete database callback functions where appropriate.
- For MongoDB, to change collection names accordingly.
