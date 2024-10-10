The app was using Google OAuth strategy that needs the below configurations.

At https://console.cloud.google.com
- Create new project
- API & Services ->  OAuth consent screen -> create app
- API & Services ->  OAuth consent screen -> add email and profile scopes
- Credentials -> create OAuth client ID
- Credentials -> Authorized JavaScript origins -> http://localhost:3000
- Credentials -> Authorized redirect URIs -> http://localhost:3000/auth/callback
- Copy and paste the Client ID to .env GOOGLE_CLIENT_ID
- Copy and paste the Client secret to .env GOOGLE_CLIENT_SECRET
