document.addEventListener('DOMContentLoaded', function() {
  const coursesContainer = document.getElementById('courses-container');
  const paginationContainer = document.getElementById('pagination-container');
  const showMoreBtn = document.getElementById('show-more-btn');
  const searchInput = document.getElementById('search-input');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const durationFilter = document.getElementById('duration-filter');
    
  // Параметры пагинации
  const coursesPerPage = 6;
  let currentPage = 1;
  let filteredCourses = [];
    
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
            
      // Фильтрация коротких курсов (меньше 8 недель)
      filteredCourses = data.filter(course => {
        // Извлекаем число из строки длительности (например, из "6 weeks" получаем 6)
        const durationMatch = course.duration.match(/(\d+)/);
        if (durationMatch && durationMatch[1]) {
          const weeks = parseInt(durationMatch[1]);
          return weeks < 8;
        }
        return false;
      });
            
      // Инициализация отображения курсов
      updateCoursesDisplay();
            
      // Инициализация обработчиков событий для фильтров
      initializeEventListeners();
    })
    .catch(error => {
      console.error('Error loading courses:', error);
      coursesContainer.innerHTML = `<div class="error-message">
                <p>Failed to load courses data. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>`;
    });
    
  function initializeEventListeners() {
    // Обработчик для поиска
    searchInput.addEventListener('input', function() {
      currentPage = 1;
      updateCoursesDisplay();
    });
        
    // Обработчики для фильтров
    difficultyFilter.addEventListener('change', function() {
      currentPage = 1;
      updateCoursesDisplay();
    });
        
    durationFilter.addEventListener('change', function() {
      currentPage = 1;
      updateCoursesDisplay();
    });
        
    // Обработчик для кнопки "Show More"
    showMoreBtn.addEventListener('click', function() {
      currentPage++;
      updateCoursesDisplay(true); // append = true
    });
  }
    
  function updateCoursesDisplay(append = false) {
    // Применение фильтров и поиска
    const searchQuery = searchInput.value.toLowerCase().trim();
    const difficultyValue = difficultyFilter.value;
    const durationValue = durationFilter.value;
        
    const displayCourses = filteredCourses.filter(course => {
      // Фильтр по поисковому запросу
      const matchesSearch = course.title.toLowerCase().includes(searchQuery) || 
                                  course.description.toLowerCase().includes(searchQuery) ||
                                  course.instructor.toLowerCase().includes(searchQuery);
            
      // Фильтр по сложности
      const matchesDifficulty = difficultyValue === 'all' || course.difficulty === difficultyValue;
            
      // Фильтр по длительности
      const matchesDuration = durationValue === 'all' || course.duration === durationValue;
            
      return matchesSearch && matchesDifficulty && matchesDuration;
    });
        
    // Расчет пагинации
    const totalPages = Math.ceil(displayCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = Math.min(startIndex + coursesPerPage, displayCourses.length);
    const coursesToShow = displayCourses.slice(startIndex, endIndex);
        
    // Очистить контейнер, если это не добавление
    if (!append) {
      coursesContainer.innerHTML = '';
    }
        
    // Если нет курсов для отображения
    if (displayCourses.length === 0) {
      coursesContainer.innerHTML = '<div class="no-results">No short courses found matching your criteria.</div>';
      paginationContainer.innerHTML = '';
      showMoreBtn.style.display = 'none';
      return;
    }
        
    // Отображение курсов
    coursesToShow.forEach(course => {
      const courseElement = createCourseCard(course);
      courseElement.classList.add('fade-in');
      coursesContainer.appendChild(courseElement);
    });
        
    // Обновить кнопку "Show More"
    if (endIndex >= displayCourses.length) {
      showMoreBtn.style.display = 'none';
    } else {
      showMoreBtn.style.display = 'block';
    }
        
    // Обновить пагинацию
    updatePagination(totalPages);
  }
    
  function updatePagination(totalPages) {
    paginationContainer.innerHTML = '';
        
    if (totalPages <= 1) {
      return;
    }
        
    // Создаем пагинацию
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.classList.add('page-item');
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.textContent = i;
            
      pageLink.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = i;
        updateCoursesDisplay();
        window.scrollTo({
          top: coursesContainer.offsetTop - 100,
          behavior: 'smooth'
        });
      });
            
      paginationContainer.appendChild(pageLink);
    }
  }
    
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
        
    // Добавляем в описание информацию из Open University
    let enhancedDescription = course.description;
    if (course.difficulty === 'Beginner') {
      enhancedDescription += ' Perfect for those just starting out with no prior knowledge required.';
    } else if (course.difficulty === 'Intermediate') {
      enhancedDescription += ' This course builds on foundational knowledge and will help you deepen your skills.';
    }
        
    article.innerHTML = `
            <div class="course-card__image">
                <img 
                    src="${imageUrl}" 
                    alt="${course.title}" 
                    onerror="this.onerror=null; this.src='images/course-placeholder.jpg'; this.classList.add('fallback-image');"
                >
                <div class="short-badge">Short Course</div>
            </div>
            <div class="course-card__content">
                <h3 class="course-card__title">${course.title}</h3>
                <p class="course-card__instructor">By ${course.instructor}</p>
                <div class="course-card__meta">
                    <span class="badge">${course.difficulty}</span>
                    <span class="badge highlight-badge">${course.duration}</span>
                    ${topicsHTML}
                </div>
                <p class="course-card__description">${enhancedDescription}</p>
                <div class="course-card__benefits">
                    <p><strong>What you'll learn:</strong></p>
                    <ul>
                        <li>Practical skills in ${course.topics[0]}</li>
                        <li>Career-relevant knowledge</li>
                        <li>Completion certificate</li>
                    </ul>
                </div>
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