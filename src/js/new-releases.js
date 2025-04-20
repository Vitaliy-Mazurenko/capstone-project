document.addEventListener('DOMContentLoaded', function() {
  const coursesContainer = document.getElementById('courses-container');
    
  // Загрузка данных курсов
  fetch('./data/courses.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      //console.log('Loaded courses data:', data.length, 'items');
            
      // Сортировка по ID (предполагаем, что более высокие ID - более новые курсы)
      const sortedCourses = [...data].sort((a, b) => b.id - a.id);
            
      // Берем только 3 последних (новейших) курса
      const newReleases = sortedCourses.slice(0, 3);
            
      // Удаляем индикатор загрузки
      coursesContainer.innerHTML = '';
            
      // Отображаем новые курсы
      if (newReleases.length === 0) {
        coursesContainer.innerHTML = '<div class="no-results">No new releases found.</div>';
      } else {
        newReleases.forEach(course => {
          const courseElement = createCourseCard(course);
          courseElement.classList.add('fade-in');
          coursesContainer.appendChild(courseElement);
        });
      }
    })
    .catch(error => {
      console.error('Error loading courses:', error);
      coursesContainer.innerHTML = `<div class="error-message">
                <p>Failed to load courses data. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>`;
    });
    
  // Функция для создания карточки курса
  function createCourseCard(course) {
    const article = document.createElement('article');
    article.className = 'course-card';
        
    // Генерация звездочек на основе рейтинга
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
        
    // Создание бейджей тем
    const topicsHTML = course.topics
      .map(topic => `<span class="badge">${topic}</span>`)
      .join('');
        
    // Проверка на наличие изображения
    const imageUrl = course.image || 'images/course-placeholder.jpg';
        
    article.innerHTML = `
            <div class="course-card__image">
                <img 
                    src="${imageUrl}" 
                    alt="${course.title}" 
                    onerror="this.onerror=null; this.src='images/course-placeholder.jpg'; this.classList.add('fallback-image');"
                >
                <div class="new-badge">New</div>
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
        
    return article;
  }
}); 