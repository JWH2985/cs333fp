# Rating System Update - Installation Instructions

## What This Adds:
- Photo model with ratings system
- API routes for fetching photos and submitting ratings
- Sample photos seeded from Unsplash
- Each user can rate each photo 1-5 stars
- Tracks average rating and total ratings per photo

## Step 1: Add New Files to Your Server

Copy these files to your project:

### New Files:
```
server/
├── models/
│   └── Photo.js          (NEW - Photo database model)
├── routes/
│   └── photos.js         (NEW - Photo and rating routes)
└── server.js             (UPDATED - imports the new routes)
```

## Step 2: Replace Your server.js

**IMPORTANT**: The `server.js` file in this package is your UPDATED server.js with the photo routes added.

**Option A - Safe Method:**
1. Open your current `server/server.js`
2. Find this line: `const User = mongoose.model('User', userSchema);`
3. Add after it:
   ```javascript
   // Import Photo routes
   const photoRoutes = require('./routes/photos');
   ```

4. Find this section near the end:
   ```javascript
   // Admin route to get all users
   app.get('/api/users', async (req, res) => {
     ...
   });
   ```

5. Add after it:
   ```javascript
   // Photo routes
   app.use('/api/photos', photoRoutes);
   ```

**Option B - Quick Method:**
- Just replace your entire `server/server.js` with the one from this package

## Step 3: Restart Your Server

```powershell
# Stop server (Ctrl+C)
# Start again
cd server
npm run dev
```

You should see:
```
Connected to MongoDB Atlas
Server running on port 5000
```

## Step 4: Seed Sample Photos

Once your server is running, open your browser and navigate to:
```
http://localhost:5173
```

Sign in, then in a NEW browser tab, go to:
```
http://localhost:5000/api/photos/seed
```

You should see:
```json
{"message":"Sample photos added successfully","count":8}
```

This adds 8 sample photos to your database. **Only do this once!**

## Step 5: Test the API

You can test if photos are loading by visiting:
```
http://localhost:5000/api/photos
```

You should see JSON with your 8 photos.

## Next Steps:

After these server changes are working, we'll update the frontend Gallery component to:
1. Display the photos in a nice grid
2. Show star rating system
3. Let users click to rate
4. Show average ratings

Let me know when you've completed these steps and we'll move on to the frontend!
