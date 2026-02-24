import React, { useState, useEffect } from 'react';

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        // Sun icon for light mode
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

function PhotoModal({ photo, onClose, onNext, onPrev, onRate }) {
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState(photo.userRating);
  const [averageRating, setAverageRating] = useState(photo.averageRating);
  const [totalRatings, setTotalRatings] = useState(photo.totalRatings);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleArrowKey = (e) => {
      if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKey);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKey);
    };
  }, [onClose, onNext, onPrev]);

  // Update local state when photo changes
  useEffect(() => {
    setUserRating(photo.userRating);
    setAverageRating(photo.averageRating);
    setTotalRatings(photo.totalRatings);
  }, [photo]);

  const handleRate = async (rating) => {
    setIsRating(true);
    try {
      const response = await fetch(`/api/photos/${photo._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUserRating(data.userRating);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
        // Notify parent component to update the main photo list
        if (onRate) {
          onRate(photo._id, data);
        }
      }
    } catch (error) {
      console.error('Error rating photo:', error);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light z-10"
      >
        ×
      </button>
      
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 text-white hover:text-gray-300 text-4xl font-bold z-10 hover:scale-110 transition-transform"
        >
          ‹
        </button>
      )}
      
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 text-white hover:text-gray-300 text-4xl font-bold z-10 hover:scale-110 transition-transform"
        >
          ›
        </button>
      )}
      
      <div 
        className="max-w-7xl max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="mt-6 text-center text-white space-y-4 bg-black bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
          <div>
            <h3 className="text-3xl font-semibold">{photo.title}</h3>
            {photo.description && (
              <p className="text-gray-300 mt-2 text-lg">{photo.description}</p>
            )}
          </div>
          
          {/* Star Rating in Modal */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-600">
            <span className="text-sm text-gray-300">
              {userRating ? 'Your rating:' : 'Rate this photo:'}
            </span>
            <StarRating 
              rating={averageRating}
              userRating={userRating}
              onRate={handleRate}
              disabled={isRating}
            />
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-medium text-lg">
                {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
              </span>
              {totalRatings > 0 && (
                <span>({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-400 pt-2">
            Use ← → arrow keys to navigate • ESC to close
          </p>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating, onRate, userRating, disabled = false }) {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onRate(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          className={`text-2xl transition-colors ${
            disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <span className={
            star <= (hover || userRating || 0)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function PhotoCard({ photo, onRate, onImageClick }) {
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState(photo.userRating);
  const [averageRating, setAverageRating] = useState(photo.averageRating);
  const [totalRatings, setTotalRatings] = useState(photo.totalRatings);

  const handleRate = async (rating) => {
    setIsRating(true);
    try {
      const response = await fetch(`/api/photos/${photo._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUserRating(data.userRating);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      }
    } catch (error) {
      console.error('Error rating photo:', error);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
        onClick={() => onImageClick(photo)}
      >
        <img 
          src={photo.imageUrl} 
          alt={photo.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{photo.title}</h3>
          {photo.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{photo.description}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userRating ? 'Your rating:' : 'Rate this photo:'}
            </span>
          </div>
          
          <StarRating 
            rating={averageRating}
            userRating={userRating}
            onRate={handleRate}
            disabled={isRating}
          />
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings yet'}
            </span>
            {totalRatings > 0 && (
              <span>({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Gallery({ user, setUser }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or default to false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (photo) => {
    const index = photos.findIndex(p => p._id === photo._id);
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
    setSelectedIndex(null);
  };

  const handleNextPhoto = () => {
    if (selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedPhoto(photos[selectedIndex + 1]);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedPhoto(photos[selectedIndex - 1]);
    }
  };

  const handleModalRating = (photoId, ratingData) => {
    // Update the photo in the main list when rated from modal
    setPhotos(prevPhotos => 
      prevPhotos.map(p => 
        p._id === photoId 
          ? { ...p, userRating: ratingData.userRating, averageRating: ratingData.averageRating, totalRatings: ratingData.totalRatings }
          : p
      )
    );
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { credentials: 'include' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto}
          onClose={handleCloseModal}
          onNext={selectedIndex < photos.length - 1 ? handleNextPhoto : null}
          onPrev={selectedIndex > 0 ? handlePrevPhoto : null}
          onRate={handleModalRating}
        />
      )}

      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PhotoGallery Lite</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <div className="flex items-center gap-3">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Photo Gallery</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Rate your favorite photos!</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-xl text-gray-600 dark:text-gray-400">Loading photos...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button 
              onClick={fetchPhotos}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">No photos found. Let's add some sample photos!</p>
            <a 
              href="/api/photos/seed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Add Sample Photos
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Click the button above, then refresh this page
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <PhotoCard 
                key={photo._id} 
                photo={photo} 
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Gallery;
