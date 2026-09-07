# Clean & Modern Authentication System

This is a clean, readable, and highly sophisticated authentication application created for Task 4.

## How Login Authentication Works 🧠

1. **Registration (The Setup):** When a user fills out the Registration form, the frontend validates the email formatting and password length locally. Then, it sends the data to the Node.js backend (`/api/auth/register`). The backend uses **`bcrypt`** to "hash" (scramble) the password into unreadable characters before saving the User document into the MongoDB database. 
2. **Login (The Verification):** When the user logs in, the backend finds the user's email in MongoDB. It then mathematically compares the user's typed password against the scrambled hash in the database. If it's a match, the backend generates a **JSON Web Token (JWT)**.
3. **Session & Dashboard (The VIP Pass):** The JWT is uniquely signed using a secret configuration key (`JWT_SECRET`). It acts like a temporary digital "VIP Pass." The frontend saves this token in `localStorage`. Automatically, the frontend tries to load the Dashboard by sending this token in the Authorization Header to the backend `/api/user/dashboard`. If the `authenticateToken` middleware verifies the VIP pass is authentic and not expired, the user connects successfully to the dashboard, rendering their securely stored personal data (like their username)!

---

## Steps to Run the Project 🚀

### 1. Requirements
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en/)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Running locally on the default port `27017`)

### 2. Startup Instructions
Open your terminal (PowerShell, Command Prompt, or VS Code Terminal) and navigate to this folder:
\`\`\`bash
cd c:\Users\Admin\OneDrive\Desktop\internship\task4
\`\`\`

Install the Node.js dependencies:
\`\`\`bash
npm install
\`\`\`

Start the backend server (using Nodemon for auto-restarts):
\`\`\`bash
npm run dev
\`\`\`

### 3. Usage
Once the terminal reads: \`✅ Connected to MongoDB!\` & \`🚀 Server running on http://localhost:3000\`

1. Open up your web browser (Chrome, Edge, Firefox, etc.).
2. Navigate to: **http://localhost:3000**
3. Register a new user account!
4. Log into the application and check out the protected Dashboard!
