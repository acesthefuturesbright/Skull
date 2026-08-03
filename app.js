/**
 * $SKULL Website Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initIntersectionObserver();
  initDigitalFire();
});

/**
 * 1. Intersection Observer for Scroll Entrance Animations
 */
function initIntersectionObserver() {
  const sections = document.querySelectorAll('section, footer');
  
  // Add animation class
  sections.forEach(section => {
    section.classList.add('fade-in-section');
  });

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * 2. Canvas-based Digital Fire Particles in Hero Section
 */
function initDigitalFire() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-particles';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  heroSection.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = heroSection.offsetWidth;
  let height = canvas.height = heroSection.offsetHeight;

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
  });

  // Particle Class
  class Spark {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.opacity = Math.random() * 0.6 + 0.4;
      this.life = Math.random() * 100 + 100; // frames to live
      this.currentLife = 0;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.currentLife++;
      
      // Fade out near end of life
      const remainingLife = this.life - this.currentLife;
      if (remainingLife < 30) {
        this.opacity = remainingLife / 30;
      }

      if (this.currentLife >= this.life || this.y < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(57, 255, 20, ${this.opacity})`; // Neon green
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgb(57, 255, 20)';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for performance
    }
  }

  // Create sparks
  const sparkCount = 60;
  const sparks = [];
  for (let i = 0; i < sparkCount; i++) {
    sparks.push(new Spark());
  }

  // Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < sparks.length; i++) {
      sparks[i].update();
      sparks[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}
