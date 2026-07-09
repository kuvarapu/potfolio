/**
 * Kuvarapu Kiran - Portfolio Website JS Logic
 * Interactive Features: Neural Canvas, Typing Effect, Skills Filter, Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // NAVBAR SCROLL EFFECT & ACTIVE STATE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    // Navbar height & background adjustment
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // SCROLL-TRIGGERED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const fadeSections = document.querySelectorAll('.fade-in-section');
  
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    fadeSections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    fadeSections.forEach(section => section.classList.add('is-visible'));
  }

  // ==========================================================================
  // AUTOTYPING HERO SUBTITLE
  // ==========================================================================
  const typingText = document.getElementById('typing-text');
  const roles = [
    "AI/ML Engineering solutions.",
    "Conversational RAG pipelines.",
    "Real-time async voice assistants.",
    "Scalable backends with FastAPI.",
    "Clean, robust cloud-certified code."
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting character
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      // Typing character
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Switch states
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at complete word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Initiate typing
  if (typingText) {
    setTimeout(typeEffect, 1000);
  }

  // ==========================================================================
  // SKILLS FILTERING LOGIC
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillTags = document.querySelectorAll('.skill-tag');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current button
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      skillTags.forEach(tag => {
        const category = tag.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          tag.classList.remove('hidden');
        } else {
          tag.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // NEURAL NETWORK INTERACTIVE CANVAS BACKGROUND
  // ==========================================================================
  const canvas = document.getElementById('neural-canvas');
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = {
      x: null,
      y: null,
      radius: 120 // Interaction distance
    };

    // Set canvas dimensions
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener('resize', () => {
      setCanvasSize();
    });

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle class definition
    class Particle {
      constructor(x, y, vx, vy, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.35)';
        ctx.fill();
      }

      update() {
        // Bounce off canvas boundaries
        if (this.x > canvas.width || this.x < 0) {
          this.vx = -this.vx;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.vy = -this.vy;
        }

        // Mouse collision/interaction (soft repelling or connection drawing)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.x !== null && distance < mouse.radius) {
          // Subtle drag towards mouse
          this.x += (dx / distance) * 0.5;
          this.y += (dy / distance) * 0.5;
        }

        // Normal movement
        this.x += this.vx;
        this.y += this.vy;

        this.draw();
      }
    }

    // Initialize particles array based on viewport density
    function initParticles() {
      particlesArray = [];
      const densityMultiplier = 0.05; // Density adjustment
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 9000) * densityMultiplier, 100);
      
      const targetParticlesCount = numberOfParticles < 30 ? 30 : numberOfParticles; // Minimum count for small displays

      for (let i = 0; i < targetParticlesCount; i++) {
        let size = Math.random() * 1.5 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let vx = (Math.random() - 0.5) * 0.4;
        let vy = (Math.random() - 0.5) * 0.4;

        particlesArray.push(new Particle(x, y, vx, vy, size));
      }
    }

    // Draw connecting lines between close particles & particles-to-mouse
    function connectParticles() {
      let opacityValue = 1;
      const maxDistance = 110;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            
            // Highlight connections that are closer to mouse in custom colors
            let mouseToA_dx = mouse.x - particlesArray[a].x;
            let mouseToA_dy = mouse.y - particlesArray[a].y;
            let mouseToA_dist = Math.sqrt(mouseToA_dx * mouseToA_dx + mouseToA_dy * mouseToA_dy);
            
            if (mouse.x !== null && mouseToA_dist < mouse.radius) {
              ctx.strokeStyle = `rgba(147, 51, 234, ${opacityValue * 0.22})`; // Glow purple close to cursor
            } else {
              ctx.strokeStyle = `rgba(79, 70, 229, ${opacityValue * 0.12})`; // standard network indigo line
            }

            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }

        // Draw connections directly to the mouse cursor
        if (mouse.x !== null) {
          let dx = mouse.x - particlesArray[a].x;
          let dy = mouse.y - particlesArray[a].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            opacityValue = 1 - (distance / mouse.radius);
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacityValue * 0.35})`; // sky blue cursor connections
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Radial glow behind mouse
      if (mouse.x !== null) {
        let gradient = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, mouse.radius);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    }

    // Initialize Canvas
    setCanvasSize();
    animate();
  }

  // ==========================================================================
  // BACKGROUND SHAPES PARALLAX EFFECT
  // ==========================================================================
  const shapes = document.querySelectorAll('.glass-shape');
  
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    
    shapes.forEach((shape, index) => {
      const speedMultiplier = 40; // Parallax distance range in px
      if (index === 0) {
        const dx = -normX * speedMultiplier;
        const dy = -normY * speedMultiplier;
        shape.style.transform = `translate(${dx}px, ${dy}px)`;
      } else if (index === 1) {
        const dx = normX * speedMultiplier * 1.4;
        const dy = normY * speedMultiplier * 1.4;
        shape.style.transform = `translate(${dx}px, ${dy}px)`;
      } else {
        const dx = normX * speedMultiplier * 0.8;
        const dy = -normY * speedMultiplier * 0.8;
        shape.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    });
  });

  // ==========================================================================
  // DYNAMIC 3D CARD HOVER TILT MECHANICS
  // ==========================================================================
  const cardsToTilt = document.querySelectorAll('.project-card, .feature-card, .cert-card, .timeline-content, .about-text-card');

  cardsToTilt.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate mouse position relative to the card center
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      // Normalize values to -0.5 to 0.5 range
      const normX = (x / width) - 0.5;
      const normY = (y / height) - 0.5;
      
      // Calculate maximum tilt angles (in degrees)
      const maxTilt = 15; /* Increased for stronger 3D feedback */
      const tiltX = -normY * maxTilt;
      const tiltY = normX * maxTilt;
      
      // Update custom properties on card element
      card.style.setProperty('--rx', `${tiltX}deg`);
      card.style.setProperty('--ry', `${tiltY}deg`);
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset tilt angles
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
});
