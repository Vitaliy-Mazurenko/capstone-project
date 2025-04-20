/* global L */
document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('contact-map');
  
  if (!mapContainer) return;
  
  // Координаты для отображения на карте (пример)
  const latitude = 49.23370534;
  const longitude = 28.470041975;
  
  // Инициализация карты с помощью Leaflet (OpenStreetMap)
  // Загрузим Leaflet с CDN
  loadLeaflet().then(() => {
    initMap(latitude, longitude);
  }).catch(error => {
    console.error('Error loading map:', error);
    mapContainer.innerHTML = '<div class="map-error">Failed to load map. Please try again later.</div>';
  });
  
  // Функция для загрузки Leaflet
  function loadLeaflet() {
    return new Promise((resolve, reject) => {
      // Проверка, загружен ли уже Leaflet
      if (window.L) {
        resolve();
        return;
      }
      
      // Загрузка CSS для Leaflet
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
      leafletCSS.integrity = 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=';
      leafletCSS.crossOrigin = '';
      document.head.appendChild(leafletCSS);
      
      // Загрузка JS для Leaflet
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
      leafletScript.integrity = 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=';
      leafletScript.crossOrigin = '';
      
      leafletScript.onload = resolve;
      leafletScript.onerror = reject;
      
      document.head.appendChild(leafletScript);
    });
  }
  
  // Функция для инициализации карты
  function initMap(lat, lng) {
    // Создаем карту
    const map = L.map('contact-map').setView([lat, lng], 13);
    
    // Добавляем слой тайлов OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Добавляем маркер
    const marker = L.marker([lat, lng]).addTo(map);
    
    // Добавляем всплывающее окно к маркеру
    marker.bindPopup(`
      <strong>EduLearn Headquarters</strong><br>
      123 Learning Street<br>
      Education City, EC 12345
    `).openPopup();
  }
}); 