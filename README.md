# PhotoGallery Lite

A full-stack photo gallery application with user authentication and interactive star ratings. Built for CS 333 Web Development II.

![PhotoGallery Lite](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## 🎯 Features

- **Google OAuth Authentication** - Secure, passwordless sign-in
- **Photo Gallery** - Responsive grid layout with 12 photos
- **Star Rating System** - Rate photos 1-5 stars
- **User-Specific Ratings** - Each user can rate once, update anytime
- **Full-Screen Lightbox** - Click to enlarge with keyboard navigation
- **Rate in Modal** - Seamlessly rate while viewing full-size photos
- **Dark Mode** - Toggle between light and dark themes
- **Persistent Data** - Ratings saved to MongoDB, survive refresh
- **Analytics** - View average ratings and total votes per photo

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation

**Backend:**
- Node.js with Express
- Passport.js for OAuth authentication
- MongoDB Atlas for database
- Session management with express-session

**Deployment:**
- Static file serving for photos
- Environment-based configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Google Cloud Console account (for OAuth credentials)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/photogallery-lite.git
cd photogallery-lite
```

### 2. Set Up MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
   - Your production URL + `/auth/google/callback`
6. Copy your Client ID and Client Secret

### 4. Configure Backend

```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `server/.env` with your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_random_secret_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 5. Configure Frontend

```bash
cd client
npm install
```

### 6. Add Your Photos (Optional)

Place your photos in `server/public/images/`:

```bash
mkdir -p server/public/images
# Copy your photos to this directory
```

### 7. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173`

### 8. Seed Sample Photos

After signing in, visit:
```
http://localhost:5000/api/photos/seed
```

This adds sample photos to the database (only do this once).

## 📁 Project Structure

```
photogallery-lite/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Landing page with OAuth
│   │   │   └── Gallery.jsx    # Main gallery with ratings
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/
│   │   └── Photo.js          # Photo & Rating schema
│   ├── routes/
│   │   └── photos.js         # Photo & rating endpoints
│   ├── public/
│   │   └── images/           # Static photo files
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Sign out
- `GET /auth/current-user` - Get current user

### Photos
- `GET /api/photos` - Get all photos with user ratings
- `POST /api/photos/:id/rate` - Rate a photo (1-5)
- `GET /api/photos/seed` - Seed sample photos (dev only)

### Users
- `GET /api/users` - Get all registered users

## 🎨 Features Showcase

### Star Rating System
- Click stars to rate (1-5)
- Updates instantly
- Shows average rating
- Displays total vote count
- Your rating highlighted in yellow

### Lightbox Modal
- Click any photo to enlarge
- Navigate with arrow keys (← →)
- Rate photos in full-screen view
- Press ESC to close
- Smooth transitions

### Dark Mode
- Toggle in navigation bar
- Saves preference to localStorage
- Smooth color transitions
- Optimized for photo viewing

## 🔒 Security Features

- OAuth-only authentication (no password storage)
- Session-based authentication
- Environment variables for secrets
- CORS protection
- Input validation for ratings

## 📝 Database Schema

**Users Collection:**
```javascript
{
  googleId: String,
  email: String,
  name: String,
  picture: String,
  createdAt: Date,
  lastLogin: Date
}
```

**Photos Collection:**
```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  uploadedBy: String,
  uploadedAt: Date,
  ratings: [{
    userId: ObjectId,
    rating: Number (1-5),
    ratedAt: Date
  }],
  averageRating: Number,
  totalRatings: Number
}
```

## 🚢 Deployment

### Production Environment Variables

Update your `.env` for production:

```env
NODE_ENV=production
CLIENT_URL=https://your-production-domain.com
```

Update Google OAuth redirect URIs to include your production domain.

### Deployment Checklist

- [ ] Update `CLIENT_URL` in server `.env`
- [ ] Add production URL to Google OAuth redirect URIs
- [ ] Update MongoDB IP whitelist if needed
- [ ] Build frontend: `cd client && npm run build`
- [ ] Serve frontend from backend or use separate hosting

## 🤝 Contributing

This is a class project, but suggestions are welcome! Feel free to open an issue.

## 📄 License

MIT License - feel free to use this project as a learning resource.

## 👨‍💻 Author

**Jon Harmon**
- Portfolio: [jonathanharmonvisuals.com](https://jonathanharmonvisuals.com)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built for CS 333 Web Development II at Southern Oregon University
- Course Instructor: [Instructor Name]
- Semester: Spring 2026

## 📸 Screenshots

*Add screenshots here after deployment*

---

**Note:** This project was created as a learning exercise for web development. The OAuth setup requires your own Google Cloud credentials.
