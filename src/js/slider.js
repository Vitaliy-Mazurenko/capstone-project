document.addEventListener('DOMContentLoaded', function() {
  const sliderTrack = document.querySelector('.slider__track');
  const slides = document.querySelectorAll('.slider__slide');
  const prevBtn = document.querySelector('.slider__prev');
  const nextBtn = document.querySelector('.slider__next');
  const dotsContainer = document.querySelector('.slider__dots');
  
  if (!sliderTrack || slides.length === 0) return;
  
  let currentIndex = 0;
  const slideWidth = 100; // percentage
  let autoplayInterval;
  
  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  // Get all dots
  const dots = document.querySelectorAll('.dot');
  
  // Function to go to a specific slide
  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  // Event listeners for buttons
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  });
  
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  });
  
  // Start autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // Change slide every 5 seconds
  }
  
  // Reset autoplay
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  
  // Initialize slider
  startAutoplay();
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  sliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  sliderTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, go to next slide
      goToSlide(currentIndex + 1);
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, go to previous slide
      goToSlide(currentIndex - 1);
      resetAutoplay();
    }
  }
}); 