const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get all photos with ratings
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadedAt: -1 });
    
    // Add user's rating to each photo if they've rated it
    const photosWithUserRating = photos.map(photo => {
      const photoObj = photo.toObject();
      const userRating = photo.ratings.find(
        r => r.userId.toString() === req.user._id.toString()
      );
      photoObj.userRating = userRating ? userRating.rating : null;
      return photoObj;
    });
    
    res.json({ photos: photosWithUserRating });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Rate a photo
router.post('/:photoId/rate', isAuthenticated, async (req, res) => {
  try {
    const { photoId } = req.params;
    const { rating } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Check if user already rated this photo
    const existingRatingIndex = photo.ratings.findIndex(
      r => r.userId.toString() === req.user._id.toString()
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      photo.ratings[existingRatingIndex].rating = rating;
      photo.ratings[existingRatingIndex].ratedAt = new Date();
    } else {
      // Add new rating
      photo.ratings.push({
        userId: req.user._id,
        rating: rating,
        ratedAt: new Date()
      });
    }
    
    // Update average rating
    photo.updateAverageRating();
    await photo.save();
    
    res.json({ 
      message: 'Rating saved successfully',
      averageRating: photo.averageRating,
      totalRatings: photo.totalRatings,
      userRating: rating
    });
  } catch (error) {
    console.error('Error rating photo:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// Seed initial photos (for testing - remove after use)
router.get('/seed', isAuthenticated, async (req, res) => {
  try {
    // Check if photos already exist
    const existingPhotos = await Photo.countDocuments();
    if (existingPhotos > 0) {
      return res.json({ message: 'Photos already seeded' });
    }
  const samplePhotos = [
  {
    title: 'The Crimson Gaze of the Infinite',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (1).jpg'
  },
  {
    title: 'Lunar Optimization: 50% Loading',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (2).jpg'
  },
  {
    title: 'The Sky is Lava',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (3).jpg'
  },
  {
    title: 'Suburban Solitude',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (4).jpg'
  },
  {
    title: 'Moonlight Through the Brush',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (5).jpg'
  },
  {
    title: 'The Council of Boulders Discusses the Horizon',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (6).jpg'
  },
  {
    title: 'The Universe’s Low-Light Mode',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (7).jpg'
  },
  {
    title: 'Cloudy with a Chance of Melodrama',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (8).JPG'
  },
  {
    title: 'The Forest’s Final Warning',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (9).jpg'
  },
  {
    title: 'Sun Sandwich on Toasted Rye Clouds',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (10).jpg'
  },
  {
    title: 'The Sanguine Spires of Silent Judgment',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (11).jpg'
  },
  {
    title: 'Legacy Hardware: The Barn Edition',
    description: 'From my photography collection',
    imageUrl: '/images/cs333fp (12).jpg'  
  }
    ];

    await Photo.insertMany(samplePhotos);
    res.json({ message: 'Photos seeded successfully' });
  } catch (error) {
    console.error('Error seeding photos:', error);
    res.status(500).json({ error: 'Failed to seed photos' });
  }
});

module.exports = router;
