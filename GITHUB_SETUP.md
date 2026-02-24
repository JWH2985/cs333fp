# GitHub Setup Instructions

## Step 1: Create a New GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `photogallery-lite` (or whatever you prefer)
   - **Description**: "Full-stack photo gallery with OAuth authentication and star ratings"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we have our own)
4. Click **"Create repository"**

## Step 2: Initialize Git in Your Project

Open PowerShell in your project root:

```powershell
cd C:\Users\Jwh29\OneDrive\School\CS_333_WebDev_II\FinalProject

# Initialize git repository
git init

# Copy the .gitignore and README.md files you just downloaded to your project root
# Make sure .gitignore is at the root level
```

## Step 3: CRITICAL - Verify .env is NOT Being Committed

**BEFORE YOU COMMIT ANYTHING**, verify your .env file is ignored:

```powershell
# Check git status
git status

# Your .env file should NOT appear in the list
# If it does, make sure .gitignore is in the root directory
```

**If you see `.env` in git status:**
```powershell
# Make sure .gitignore exists in root
ls .gitignore

# If not, create it with the contents I provided
```

## Step 4: Stage and Commit Your Files

```powershell
# Add all files (except those in .gitignore)
git add .

# Check what's being committed (should NOT include .env, node_modules, etc.)
git status

# Make your first commit
git commit -m "Initial commit: PhotoGallery Lite with OAuth and star ratings"
```

## Step 5: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/photogallery-lite.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Verify on GitHub

1. Go to your repository on GitHub
2. **Check that .env is NOT there** (critical!)
3. Verify all your code files are present
4. Check that README.md displays nicely

## Step 7: Add a .env.example for Reference

It's good practice to include a `.env.example` file (without real credentials) so others know what environment variables are needed:

```powershell
# Server .env.example should already exist, if not create it:
cd server
notepad .env.example
```

Contents should be:
```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=your_random_session_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

```powershell
# Add and commit
git add server/.env.example
git commit -m "Add .env.example for setup reference"
git push
```

## Common Git Commands for Future Updates

```powershell
# Check status
git status

# Add specific files
git add client/src/pages/Gallery.jsx
git add server/routes/photos.js

# Or add all changes
git add .

# Commit with message
git commit -m "Add dark mode feature"

# Push to GitHub
git push

# Pull latest changes (if working from multiple locations)
git pull
```

## GitHub Desktop Alternative

If you prefer a GUI:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in to your GitHub account
3. Add your local repository
4. It will show you files to commit
5. Write commit message and push

## Portfolio Tips

**Update your README.md** with:
- Screenshots of your app
- Link to live demo (if you deploy it)
- Your actual GitHub username
- Link to your portfolio site

**Create a good repository description** on GitHub:
```
Full-stack photo gallery with Google OAuth authentication, MongoDB database, and interactive star rating system. Built with React, Node.js, Express, and Tailwind CSS.
```

**Add topics/tags** on GitHub:
`react` `nodejs` `mongodb` `express` `oauth` `tailwindcss` `full-stack` `photo-gallery`

## IMPORTANT REMINDERS

❌ **NEVER commit:**
- `.env` files with real credentials
- `node_modules/` folders
- Your actual MongoDB connection string
- Google OAuth secrets

✅ **DO commit:**
- All source code
- `.env.example` (template with no real credentials)
- README.md
- .gitignore

## If You Accidentally Committed .env

If you accidentally committed your `.env` file with credentials:

```powershell
# Remove from git but keep local file
git rm --cached server/.env

# Commit the removal
git commit -m "Remove .env from git"
git push

# Then go to MongoDB Atlas and Google Console
# Generate NEW credentials (your old ones are compromised)
```

---

**After pushing to GitHub, you can:**
- Add it to your LinkedIn portfolio
- Include the GitHub link on your resume
- Show it to potential employers
- Use it as a code sample
