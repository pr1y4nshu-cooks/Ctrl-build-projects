# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for OpenIssue.

## Step 1: Create a GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click on "OAuth Apps" in the left sidebar
3. Click "New OAuth App" button
4. Fill in the application details:
   - **Application name**: `OpenIssue` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `AI-powered GitHub Issue Intelligence`
   - **Authorization callback URL**: `http://localhost:8000/auth/callback`
5. Click "Register application"
6. You'll see your **Client ID** on the next page
7. Click "Generate a new client secret" to get your **Client Secret**
8. **IMPORTANT**: Copy both the Client ID and Client Secret immediately - you won't be able to see the secret again!

## Step 2: Configure Backend Environment Variables

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and update the following values:
   ```env
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback
   SECRET_KEY=generate-a-random-secret-key-here
   ```

4. To generate a secure SECRET_KEY, you can use Python:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

## Step 3: Install Dependencies

Make sure you have the required Python packages installed:

```bash
cd backend
pip install -r requirements.txt
```

## Step 4: Start the Backend Server

```bash
cd backend
python run.py
```

The backend should now be running on `http://localhost:8000`

## Step 5: Start the Frontend Server

In a new terminal:

```bash
cd frontend
python -m http.server 3000
```

The frontend should now be running on `http://localhost:3000`

## Step 6: Test the Authentication

1. Open your browser and go to `http://localhost:3000`
2. You should be redirected to the login page
3. Click "Continue with GitHub"
4. You'll be redirected to GitHub to authorize the application
5. After authorization, you'll be redirected back to the home page

## How It Works

1. User clicks "Continue with GitHub" on the login page
2. Frontend redirects to backend `/auth/login` endpoint
3. Backend redirects to GitHub OAuth authorization page
4. User authorizes the application on GitHub
5. GitHub redirects back to backend `/auth/callback` with an authorization code
6. Backend exchanges the code for an access token
7. Backend fetches user information from GitHub API
8. Backend creates a session and redirects to frontend with session ID
9. Frontend stores session ID in localStorage
10. Frontend uses session ID for authenticated API requests

## Security Notes

- **Never commit your `.env` file** - it contains sensitive credentials
- The `.env` file is already in `.gitignore`
- In production, use a proper session store (Redis) instead of in-memory storage
- Use HTTPS in production
- Set proper CORS origins in production (not `*`)

## Troubleshooting

### "GitHub OAuth not configured" error
- Make sure you've set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your `.env` file
- Restart the backend server after updating `.env`

### "Invalid state parameter" error
- This is a CSRF protection mechanism
- Clear your browser cookies and try again
- Make sure you're not blocking cookies

### "Failed to get access token" error
- Check that your Client ID and Client Secret are correct
- Verify the callback URL matches exactly: `http://localhost:8000/auth/callback`
- Check that your OAuth app is not suspended on GitHub

### Redirect loop
- Clear localStorage: Open browser console and run `localStorage.clear()`
- Clear cookies
- Try in an incognito/private window

## Production Deployment

For production deployment, you'll need to:

1. Create a new GitHub OAuth App with production URLs
2. Update environment variables with production values:
   - `GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback`
   - `FRONTEND_URL=https://yourdomain.com`
3. Use a proper session store (Redis recommended)
4. Enable HTTPS
5. Set specific CORS origins
6. Use a strong SECRET_KEY

## API Endpoints

### Authentication Endpoints

- `GET /auth/login` - Initiates GitHub OAuth flow
- `GET /auth/callback` - Handles GitHub OAuth callback
- `GET /auth/user?session=<session_id>` - Get current user info
- `GET /auth/check?session=<session_id>` - Check if user is authenticated
- `POST /auth/logout?session=<session_id>` - Logout user

### Using Authentication in API Requests

Include the session ID in your API requests:

```javascript
const session = localStorage.getItem('openissue_session');
const response = await fetch(`http://localhost:8000/api/endpoint?session=${session}`);
```

## Next Steps

- Implement protected routes that require authentication
- Add user profile page
- Store user preferences
- Integrate with GitHub API to fetch user's repositories and issues
