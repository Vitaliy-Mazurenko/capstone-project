document.addEventListener('DOMContentLoaded', function() {
  // Load featured courses on homepage
  const featuredContainer = document.querySelector('.featured__grid');
  
  if (featuredContainer) {
    fetch('./data/courses.json')
      .then(response => response.json())
      .then(courses => {
        // Get 3 highest rated courses for featured section
        const featuredCourses = courses
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        
        displayCourses(featuredCourses, featuredContainer);
      })
      .catch(error => console.error('Error loading courses:', error));
  }
  
  // Function to display courses
  function displayCourses(courses, container) {
    container.innerHTML = '';
    //console.log(courses);
    courses.forEach(course => {
      const courseElement = createCourseCard(course);
      container.appendChild(courseElement);
    });
  }
  
  // Function to create a course card
  function createCourseCard(course) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'course-card';
    
    // Generate stars based on rating
    const fullStars = Math.floor(course.rating);
    const halfStar = course.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '★';
    }
    if (halfStar) {
      starsHTML += '☆';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '☆';
    }
    
    // Create topics badges
    const topicsHTML = course.topics
      .map(topic => `<span class="badge">${topic}</span>`)
      .join('');
    
    cardDiv.innerHTML = `
      <div class="course-card__image">
        <img src="${course.image}" alt="${course.title}">
      </div>
      <div class="course-card__content">
        <h3 class="course-card__title">${course.title}</h3>
        <p class="course-card__instructor">By ${course.instructor}</p>
        <div class="course-card__meta">
          <span class="badge">${course.difficulty}</span>
          <span class="badge">${course.duration}</span>
          ${topicsHTML}
        </div>
        <p class="course-card__description">${course.description}</p>
        <div class="course-card__footer">
          <div class="price">$${course.price.toFixed(2)}</div>
          <div class="rating">
            <span class="stars">${starsHTML}</span>
            <span>${course.rating.toFixed(1)}</span>
          </div>
        </div>
        <div class="course-card__cta">
          <button class="btn">Enroll Now</button>
        </div>
      </div>
    `;
    
    return cardDiv;
  }
}); 