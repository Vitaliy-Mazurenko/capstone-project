document.addEventListener('DOMContentLoaded', function() {
  const coursesContainer = document.getElementById('courses-container');
  const paginationContainer = document.getElementById('pagination');
  const showMoreBtn = document.getElementById('show-more-btn');
  const searchInput = document.getElementById('search-input');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const sortBy = document.getElementById('sort-by');
  
  // Переменные для пагинации и асинхронной загрузки
  let allCourses = [];
  let filteredCourses = [];
  let displayedCourses = 0;
  let currentPage = 1;
  const coursesPerPage = 10;
  const coursesPerLoad = 5; // Количество курсов, загружаемых по кнопке "Показать больше"
  let totalPages = 0;
  let isLoading = false;
  
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
      allCourses = data;
      filteredCourses = [...allCourses];
      totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
      
      // Первоначальное отображение (только первые coursesPerPage курсов)
      applyFiltersAndSort();
    })
    .catch(error => {
      console.error('Error loading courses:', error);
      coursesContainer.innerHTML = `<div class="error-message">
        <p>Failed to load courses data. Please try again later.</p>
        <p>Error: ${error.message}</p>
      </div>`;
    });
  
  // Функция для отображения курсов с пагинацией
  function displayCourses(append = false) {
    const startIndex = append ? displayedCourses : (currentPage - 1) * coursesPerPage;
    let endIndex;
    
    if (append) {
      // При асинхронной загрузке берем следующую порцию курсов
      endIndex = startIndex + coursesPerLoad;
      
      // Если нажали "Показать больше" на последней странице
      if (startIndex >= filteredCourses.length) {
        showMoreBtn.style.display = 'none';
        return;
      }
    } else {
      // При обычной пагинации берем стандартное количество
      endIndex = startIndex + coursesPerPage;
      
      // Сбрасываем счетчик отображенных курсов при переключении страницы
      displayedCourses = 0;
    }
    
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
    
    //console.log(`Displaying courses ${startIndex+1}-${Math.min(endIndex, filteredCourses.length)} of ${filteredCourses.length}`);
    
    // Показываем индикатор загрузки
    if (append) {
      const loader = document.createElement('div');
      loader.className = 'loader';
      loader.innerHTML = '<span>Loading...</span>';
      coursesContainer.appendChild(loader);
    } else {
      // Очистка контейнера если не добавляем новые элементы
      coursesContainer.innerHTML = '';
    }
    
    // Имитация асинхронной загрузки
    isLoading = true;
    setTimeout(() => {
      // Удаляем индикатор загрузки
      if (append) {
        const loader = document.querySelector('.loader');
        if (loader) loader.remove();
      } else {
        coursesContainer.innerHTML = '';
      }
      
      // Отображение курсов
      if (paginatedCourses.length === 0 && !append) {
        coursesContainer.innerHTML = '<div class="no-results">No courses matching your criteria were found.</div>';
      } else {
        paginatedCourses.forEach(course => {
          const courseElement = createCourseCard(course);
          // Добавляем эффект появления
          courseElement.classList.add('fade-in');
          coursesContainer.appendChild(courseElement);
        });
      }
      
      // Обновляем счетчик отображенных курсов
      displayedCourses += paginatedCourses.length;
      
      // Обновление пагинации
      if (!append) {
        updatePagination();
      }
      
      // Показ/скрытие кнопки "Показать еще"
      showMoreBtn.style.display = displayedCourses < filteredCourses.length ? 'block' : 'none';
      
      isLoading = false;
    }, 500); // Имитация задержки загрузки в 500 мс
  }
  
  // Функция для создания карточки курса
  function createCourseCard(course) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'course-card';
    
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
    
    // Проверка на наличие изображения и обработка возможного его отсутствия
    const imageUrl = course.image || 'images/course-placeholder.jpg';
    
    cardDiv.innerHTML = `
      <div class="course-card__image">
        <img 
          src="${imageUrl}" 
          alt="${course.title}" 
          onerror="this.onerror=null; this.src='images/course-placeholder.jpg'; this.classList.add('fallback-image');"
        >
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
  
  // Обновление элементов управления пагинацией
  function updatePagination() {
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Добавляем кнопку "Предыдущая страница"
    if (currentPage > 1) {
      const prevButton = document.createElement('div');
      prevButton.className = 'page-item page-nav';
      prevButton.innerHTML = '&laquo;';
      prevButton.addEventListener('click', () => {
        if (isLoading) return;
        currentPage--;
        displayCourses(false);
        scrollToTop();
      });
      paginationContainer.appendChild(prevButton);
    }
    
    // Определяем, сколько страниц показывать
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Если мы близко к концу, сдвигаем окно
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // Создание элементов пагинации
    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement('div');
      pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
      pageItem.textContent = i;
      pageItem.addEventListener('click', () => {
        if (isLoading) return;
        currentPage = i;
        displayCourses(false);
        scrollToTop();
      });
      
      paginationContainer.appendChild(pageItem);
    }
    
    // Добавляем кнопку "Следующая страница"
    if (currentPage < totalPages) {
      const nextButton = document.createElement('div');
      nextButton.className = 'page-item page-nav';
      nextButton.innerHTML = '&raquo;';
      nextButton.addEventListener('click', () => {
        if (isLoading) return;
        currentPage++;
        displayCourses(false);
        scrollToTop();
      });
      paginationContainer.appendChild(nextButton);
    }
  }
  
  // Функция для прокрутки к верху галереи
  function scrollToTop() {
    document.querySelector('.gallery').scrollIntoView({ behavior: 'smooth' });
  }
  
  // Обработчик событий для кнопки "Показать еще"
  showMoreBtn.addEventListener('click', () => {
    if (isLoading) return;
    displayCourses(true); // Передаем true для асинхронной загрузки
  });
  
  // Функция для применения фильтров и сортировки
  function applyFiltersAndSort() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const difficultyValue = difficultyFilter.value;
    const sortValue = sortBy.value;
    
    // Фильтрация курсов
    filteredCourses = allCourses.filter(course => {
      // Поиск
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.topics.some(topic => topic.toLowerCase().includes(searchTerm));
      
      // Фильтр по уровню сложности
      const matchesDifficulty = !difficultyValue || course.difficulty === difficultyValue;
      
      return matchesSearch && matchesDifficulty;
    });
    
    // Сортировка курсов
    filteredCourses.sort((a, b) => {
      switch (sortValue) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'popularity':
        return b.enrolledStudents - a.enrolledStudents;
      default:
        return 0;
      }
    });
    
    // Сброс пагинации и отображение курсов
    currentPage = 1;
    displayedCourses = 0;
    totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    //console.log(`After filtering: ${filteredCourses.length} courses, ${totalPages} pages`);
    displayCourses(false);
  }
  
  // Обработчики событий для элементов управления фильтрами
  searchInput.addEventListener('input', debounce(applyFiltersAndSort, 300));
  difficultyFilter.addEventListener('change', applyFiltersAndSort);
  sortBy.addEventListener('change', applyFiltersAndSort);
  
  // Функция debounce для предотвращения частого запуска события поиска
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
}); 