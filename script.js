/**
 * Wedding Website JavaScript
 * Handles audio player, smooth scrolling, form submission, and other functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Audio player functionality
    const setupAudioPlayer = () => {
        const audio = document.getElementById('background-music');
        const playButton = document.getElementById('play-music');
        
        if (!audio || !playButton) {
            console.error('Audio elements not found in the DOM');
            return;
        }
        
        // Audio load error handling
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            playButton.disabled = true;
            playButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Audio Unavailable';
            
            // Show alert after a short delay to ensure it's seen
            setTimeout(() => {
                alert('There was an error loading the audio file. Please check that the file exists at the correct path.');
            }, 500);
        });
        
        // Play/pause button toggle
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                // Try to play and handle any errors
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Successfully playing
                            audio.muted = false;
                            playButton.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
                            console.log('Audio is now playing');
                        })
                        .catch((error) => {
                            console.error('Failed to play audio:', error);
                            alert('Unable to play audio. Please check your browser settings and ensure audio is enabled.');
                        });
                }
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i> Play Music';
                console.log('Audio is now paused');
            }
        });
        
        // Optionally check if audio is ready
        audio.addEventListener('canplaythrough', () => {
            console.log('Audio file is loaded and ready to play');
            playButton.disabled = false;
        });
    };
    
    // Smooth scrolling for navigation
    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    };
    
    // RSVP form submission to Google Sheets
    const setupRsvpForm = () => {
        const form = document.getElementById('rsvp-form');
        // Replace with your actual Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyZmXQF4UqkBorUKhLlG_kUyH-z8gw3jJKg6uX7xGkHcfnxkD52twiqBtm0mRAiwF7xSQ/exec';
        
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                
                // Show loading indicator
                const submitButton = form.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Create a FormData object to collect form data
                const formData = new FormData(form);
                
                // Convert form data to URL-encoded string
                const data = new URLSearchParams(formData).toString();
                
                // Submit the form data to Google Sheets
                fetch(scriptURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: data
                })
                .then(response => {
                    if (response.ok) {
                        // Success message
                        alert('Thank you! Your RSVP has been submitted successfully.');
                        form.reset();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting your RSVP. Please try again later.');
                })
                .finally(() => {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
            });
        }
    };
    
    // Gallery lightbox functionality (simple version)
    const setupGallery = () => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Simple placeholder for future lightbox functionality
                console.log('Gallery item clicked - lightbox would activate here');
                
                // Check if there's an actual image
                const img = this.querySelector('img');
                if (img) {
                    console.log('Image source:', img.src);
                    // Here you would typically activate a lightbox
                }
            });
        });
    };
    
    // Optional: Countdown timer to wedding date
    const setupCountdown = () => {
        const weddingDate = new Date('June 15, 2024 16:00:00').getTime();
        const header = document.querySelector('header .container');
        
        // Create countdown element if it doesn't exist
        let countdownEl = document.querySelector('.countdown');
        if (!countdownEl && header) {
            countdownEl = document.createElement('div');
            countdownEl.className = 'countdown';
            header.appendChild(countdownEl);
        }
        
        if (countdownEl) {
            // Update the countdown every second
            const countdown = setInterval(function() {
                const now = new Date().getTime();
                const distance = weddingDate - now;
                
                if (distance < 0) {
                    clearInterval(countdown);
                    countdownEl.innerHTML = "Our Wedding Day Has Arrived!";
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                countdownEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s until we say "I do"`;
            }, 1000);
        }
    };
    
    // Initialize all functionality
    setupAudioPlayer();
    setupSmoothScrolling();
    setupRsvpForm();
    setupGallery();
    
    // Uncomment the next line if you want to enable the countdown timer
    // setupCountdown();
    
    // Add a message when the page is fully loaded
    console.log('Wedding website loaded successfully!');
});
