document.addEventListener('DOMContentLoaded', function() {
  // Элементы DOM
  const giftContainer = document.getElementById('giftContainer');
  const giftBox = document.getElementById('giftBox');
  const mainContent = document.getElementById('mainContent');
  const specialBtn = document.getElementById('specialBtn');
  const hiddenMessage = document.getElementById('hiddenMessage');
  const qualityItems = document.querySelectorAll('.quality-item');
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  const mainPhoto = document.getElementById('mainPhoto');
  const rotateBtn = document.getElementById('rotateBtn');
  const zoomBtn = document.getElementById('zoomBtn');
  const effectBtn = document.getElementById('effectBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const sliderContainer = document.getElementById('sliderContainer');
  const mobileNotification = document.getElementById('mobileNotification');

  // Установка размера canvas
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  // Проверка мобильного устройства
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  if (isMobileDevice()) {
    mobileNotification.style.display = 'flex';
    setTimeout(() => {
      mobileNotification.style.display = 'none';
    }, 3000);
  }

  // Открытие подарка
  let giftOpened = false;

  giftBox.addEventListener('click', function() {
    if (!giftOpened) {
      giftOpened = true;
      this.classList.add('open');
      
      // Анимация открытия подарка
      setTimeout(() => {
        giftContainer.style.opacity = '0';
        giftContainer.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          giftContainer.style.display = 'none';
          mainContent.style.display = 'block';
          
          // Анимация появления основного контента
          setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
          }, 100);
        }, 500);
      }, 1500);
    }
  });

  // Особый сюрприз
  specialBtn.addEventListener('click', function() {
    hiddenMessage.classList.toggle('show');
    specialBtn.innerHTML = hiddenMessage.classList.contains('show') ? 
      '<i class="fas fa-star"></i><span>Скрыть сюрприз</span>' : 
      '<i class="fas fa-star"></i><span>Сюрприз</span>';
    
    // Запускаем конфетти при первом открытии
    if (hiddenMessage.classList.contains('show')) {
      createConfetti();
    }
  });

  // Управление фото
  let rotation = 0;
  let scale = 1;
  let currentEffect = 0;
  const effects = ['effect-normal', 'effect-sepia', 'effect-grayscale', 'effect-saturate'];

  rotateBtn.addEventListener('click', function() {
    rotation += 90;
    mainPhoto.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });

  zoomBtn.addEventListener('click', function() {
    scale = scale === 1 ? 1.1 : 1;
    mainPhoto.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });

  effectBtn.addEventListener('click', function() {
    // Удаляем текущий эффект
    mainPhoto.classList.remove(effects[currentEffect]);
    
    // Переходим к следующему эффекту
    currentEffect = (currentEffect + 1) % effects.length;
    
    // Применяем новый эффект
    mainPhoto.classList.add(effects[currentEffect]);
  });

  // Качества - анимация при наведении
  qualityItems.forEach(item => {
    item.addEventListener('click', function() {
      const qualityId = this.dataset.quality;
      const qualityMessages = {
        '1': 'Твоя креативность помогает находить нестандартные решения и вдохновляет окружающих!',
        '2': 'Твоя настойчивость - пример того, как нужно идти к цели, не смотря ни на что!',
        '3': 'Твоя отзывчивость создаёт тёплую атмосферу и делает коллектив сплочённее!'
      };
      
      showToast(qualityMessages[qualityId]);
      
      // Анимация прогресс-бара
      const progressBar = this.querySelector('.progress-bar');
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.width = progressBar.style.width;
      }, 100);
    });
  });

  // Слайдер воспоминаний
  let currentSlide = 0;

  function showSlide(index) {
    const slides = sliderContainer.children;
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    sliderContainer.scrollTo({
      left: slides[currentSlide].offsetLeft,
      behavior: 'smooth'
    });
  }

  prevBtn.addEventListener('click', () => {
    currentSlide--;
    showSlide(currentSlide);
  });

  nextBtn.addEventListener('click', () => {
    currentSlide++;
    showSlide(currentSlide);
  });

  // Swipe для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      currentSlide++;
      showSlide(currentSlide);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      currentSlide--;
      showSlide(currentSlide);
    }
  }

  // Функция для показа уведомлений
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(74, 111, 165, 0.95);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s ease;
      font-weight: 500;
      backdrop-filter: blur(10px);
      max-width: 80%;
      text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // Показываем toast
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Убираем toast через 3 секунды
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.opacity = '0';
      
      // Удаляем элемент после анимации
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Система частиц для фона
  const particles = [];
  const particleCount = 30;
  
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
    this.color = `rgba(74, 111, 165, ${Math.random() * 0.3 + 0.1})`;
    this.direction = Math.random() * 360;
  }
  
  Particle.prototype.update = function() {
    this.y += this.speed;
    this.x += Math.sin(this.y * 0.01) * 0.5;
    
    if (this.y > canvas.height) {
      this.y = -this.size;
      this.x = Math.random() * canvas.width;
    }
  };
  
  Particle.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };
  
  function createParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    animateParticles();
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
  }
  
  // Система конфетти для сюрприза
  function createConfetti() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${getRandomColor()};
          top: -20px;
          left: ${Math.random() * 100}%;
          border-radius: 2px;
          z-index: 1000;
          pointer-events: none;
        `;
        document.body.appendChild(confetti);
        
        // Анимация падения
        const animation = confetti.animate([
          { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${window.innerHeight}px) rotate(360deg)`, opacity: 0 }
        ], {
          duration: 2000 + Math.random() * 3000,
          easing: 'cubic-bezier(0.1, 0.3, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
      }, i * 100);
    }
  }
  
  function getRandomColor() {
    const colors = [
      '#ff6b6b', '#ff8e53', '#4a6fa5', '#6b8cbe', '#38b000', '#ffd166'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Запускаем систему частиц
  createParticles();
  
  // Анимация появления элементов при загрузке
  setTimeout(() => {
    document.querySelectorAll('.quality-item').forEach((item, index) => {
      setTimeout(() => {
        item.style.animation = 'fadeIn 0.6s ease forwards';
      }, index * 200);
    });
  }, 500);

  // Добавляем обработчики для мобильного меню
  document.getElementById('homeBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('photoBtn').addEventListener('click', () => {
    document.querySelector('.photo-section').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('qualitiesBtn').addEventListener('click', () => {
    document.querySelector('.qualities-section').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('memoriesBtn').addEventListener('click', () => {
    document.querySelector('.memories-section').scrollIntoView({ behavior: 'smooth' });
  });

  console.log('Сайт с виртуальным подарком для Кристины 2025 загружен!');
});