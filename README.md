## Local Development Setup

### Prerequisites

Make sure the following are installed:

- Git
- Node.js
- npm
- Docker Desktop

The application uses:

- **MongoDB 8** running in Docker
- **Express + TypeScript** backend
- **React + TypeScript + Vite** frontend

## 1. Clone the Repository

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd habit-tracker
```

## 2. Start MongoDB with Docker

The application uses MongoDB locally through Docker.

Start a MongoDB 8 container:

```bash
docker run -d \
  --name habit-tracker-mongodb \
  -p 27017:27017 \
  -v habit-tracker-mongo-data:/data/db \
  mongo:8
```

Check that MongoDB is running:

```bash
docker ps
```

The container should expose:

```text
localhost:27017
```

### If the container already exists

If Docker reports that `habit-tracker-mongodb` already exists, start it with:

```bash
docker start habit-tracker-mongodb
```

Check the running container again:

```bash
docker ps
```

### Stop MongoDB

```bash
docker stop habit-tracker-mongodb
```

### Start MongoDB again later

```bash
docker start habit-tracker-mongodb
```

The named Docker volume keeps the MongoDB data between container restarts.

## 3. Configure the Backend

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit_tracker
JWT_SECRET="YOUR_JWT_SECRET"
```

Use a strong development secret for `JWT_SECRET`.

Do not commit the real `.env` file or any real secrets to Git.

## 4. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

The development command uses `tsx watch`, so backend source changes are automatically reloaded.

## 5. Optional: Seed the Database

The backend provides a seed command:

```bash
npm run db:seed
```

This can be used when sample database data is required.

For testing user-specific authentication, it is also possible to create a new account directly through the application's Sign Up flow.

## 6. Start the Frontend

Open a second terminal window and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend runs on the Vite development server, normally:

```text
http://localhost:5173
```

Open that address in a browser.

## 7. Test the Application

A complete manual assessment flow can be performed as follows.

### Authentication

1. Open the frontend.
2. Select **Sign Up**.
3. Create a new user account.
4. Confirm that the application creates the account successfully.
5. Log in with the newly created account.
6. Confirm that the dashboard displays the authenticated user's name.
7. Log out.
8. Log in again.
9. Confirm that the user's dashboard data is still available.

### User Data Isolation

Create or use a second account.

Verify that:

- The second user has their own dashboard.
- The second user cannot see the first user's habit logs.
- Habit data remains associated with the authenticated user.

### Habit Logging

Test all supported habits:

- Water
- Sleep
- Exercise

For each habit:

1. Log a value for today.
2. Verify that the dashboard updates.
3. Select a previous date.
4. Log a value for that date.
5. Verify that the historical log appears in recent activity.
6. Log the same habit again for the same date with a different value.
7. Verify that the existing log is updated rather than creating a duplicate.

### Dashboard Progress

The dashboard displays progress over the current seven-day calendar window.

For example:

```text
5 / 7 days = 71%
```

The dashboard also displays a current streak based on consecutive logged calendar days.

A habit can therefore legitimately show:

```text
5 / 7 days
1 day streak
```

This means the user logged the habit on five days during the seven-day period, but the logs are not necessarily five consecutive days ending today.

## 8. Backend Automated Tests

From the `backend` directory:

```bash
npm test -- --run
```

The final verified test suite contains:

```text
6 test files
21 tests
```

Build passed, but Node 22.9.0 is below the Vite-supported 22.12+ requirement. Evaluators should use Node 22.12+ or another supported version.

```text
Test Files  6 passed (6)
Tests       21 passed (21)
```

The tests cover:

- Signup service behavior
- Duplicate email handling
- Login behavior
- Login validation
- Signup validation
- JWT generation and verification
- Password hashing
- Password comparison

## 9. Backend TypeScript Build

From the `backend` directory:

```bash
npm run build
```

This runs the TypeScript compiler:

```text
tsc
```

The final backend build completed successfully.

## 10. Frontend Production Build

From the `frontend` directory:

```bash
npm run build
```

This runs:

```text
tsc -b && vite build
```

The final frontend production build completed successfully.

### Node.js Compatibility

The installed Vite version requires a supported Node.js version.

During final verification, Node.js `22.9.0` produced a Vite compatibility warning because the installed Vite version requires Node.js `20.19+` or `22.12+`.

For a clean environment, use a supported Node.js version such as a current Node.js 22 release.

## 11. Frontend Linting

The frontend provides an ESLint script:

```bash
npm run lint
```

Run this from the `frontend` directory.

## 12. API Authentication

The authentication API provides:

```text
POST /api/auth/signup
POST /api/auth/login
```

A successful login returns a JWT.

Protected API requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

The dashboard endpoint is:

```text
GET /api/dashboard
```

The habit-log endpoint is protected by the same authentication mechanism.

The backend determines the authenticated user from the JWT rather than accepting the user ID from the frontend for protected operations.

## 13. Docker Database Information

The expected local MongoDB configuration is:

```text
MongoDB version: 8
Host: localhost
Port: 27017
Database: habit_tracker
Container: habit-tracker-mongodb
```

The application connects using:

```text
mongodb://localhost:27017/habit_tracker
```

The MongoDB database itself is not committed to the repository. Each evaluator can create their own local MongoDB Docker container using the commands above.

## 14. Useful Commands

### Backend

```bash
cd backend

npm install
npm run dev
npm test -- --run
npm run build
npm run db:seed
npm start
```

### Frontend

```bash
cd frontend

npm install
npm run dev
npm run build
npm run lint
npm run preview
```

### Docker MongoDB

```bash
docker start habit-tracker-mongodb
docker stop habit-tracker-mongodb
docker ps
```

## 15. Assumptions and Edge Cases

The following assumptions and edge-case decisions were made for this time-boxed assessment:

- The dashboard covers a rolling seven-day calendar window consisting of today and the previous six calendar days.
- A habit log is uniquely identified by the authenticated user, habit type, and calendar date.
- Logging the same habit again for the same date updates the existing value rather than creating a duplicate record.
- Historical dates within the supported dashboard window can be logged and are reflected in dashboard progress and recent activity.
- A current streak represents consecutive calendar days with a logged value. A missing day breaks the streak.
- A habit can have a high weekly completion count while still having a shorter current streak because the logged days do not have to be consecutive.
- The application currently supports the predefined Water, Sleep, and Exercise habit types.
- User identity for protected operations is derived from the authenticated JWT rather than being supplied as a client-controlled user ID.
- The assessment does not include user-created habit types, habit deletion, password reset, email verification, or account-management features.
- Production-grade timezone configuration and deployment-specific infrastructure were outside the scope of the assessment.

## 16. Production Considerations

This implementation is intentionally scoped to the assessment requirements. For a production application, I would further improve the system by:

- Managing JWT secrets through a production secret-management solution rather than environment files on the application host.
- Adding rate limiting and abuse protection to authentication endpoints.
- Adding broader API and integration test coverage, including protected-route and user-isolation scenarios.
- Introducing centralized error handling and structured application logging.
- Adding monitoring, health checks, and production observability.
- Reviewing and optimizing database indexes and constraints as the dataset grows.
- Defining an explicit timezone strategy for users and server-side date calculations.
- Adding CI/CD checks for tests, type checking, linting, and production builds.
- Adding production deployment configuration and environment-specific settings.
- Considering refresh-token/session management if long-lived authentication is required.

These items were intentionally kept outside the time-boxed assessment scope so that the implementation could focus on the requested authentication, habit logging, dashboard, testing, and user-isolation requirements.

## 17. Quick Start

For an evaluator who wants the shortest possible setup:

### Terminal 1 — MongoDB

```bash
docker run -d \
  --name habit-tracker-mongodb \
  -p 27017:27017 \
  -v habit-tracker-mongo-data:/data/db \
  mongo:8
```

### Terminal 2 — Backend

```bash
cd backend
npm install
```

Create `.env`:

```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/habit_tracker
JWT_SECRET="YOUR_JWT_SECRET"
```

Then:

```bash
npm run dev
```

### Terminal 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

Create an account and test the authentication, dashboard, habit logging, historical dates, progress, streaks, and user-data isolation.

## 18. Assessment Verification Checklist

- [ ] MongoDB starts successfully through Docker
- [ ] Backend connects to MongoDB
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] User signup works
- [ ] User login works
- [ ] JWT authentication works
- [ ] Logout works
- [ ] Dashboard loads for authenticated users
- [ ] Users only see their own habit data
- [ ] Water logging works
- [ ] Sleep logging works
- [ ] Exercise logging works
- [ ] Historical dates can be logged
- [ ] Existing date entries can be updated
- [ ] Seven-day progress is calculated correctly
- [ ] Current streak is calculated correctly
- [ ] Recent activity is displayed
- [ ] Backend tests pass
- [ ] Backend TypeScript build passes
- [ ] Frontend production build passes
- [ ] Frontend lint passes

AI Disclosure

AI-assisted development tools were used during this project as development support.

## 19. AI Disclosure

AI-assisted development tools were used during this project as development support.

AI assistance was used for activities including:

- Reviewing and improving code structure.
- Identifying and debugging TypeScript and runtime issues.
- Suggesting implementation approaches.
- Reviewing authentication, JWT, API, and dashboard logic.
- Improving code comments and documentation.
- Assisting with test and build troubleshooting.

The final implementation, integration, testing, and verification were performed against the actual project code and local development environment.

All functionality included in the submission was manually tested, and the backend automated test suite and production builds were verified before submission.
