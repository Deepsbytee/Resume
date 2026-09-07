const elements = document.querySelectorAll(".animate");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      
      
      if (entry.target.classList.contains("stats")) {
        animateCounters();
      }
    }
  });
}, {
  threshold: 0.15
});

elements.forEach(el => {
  observer.observe(el);
});


function animateCounters() {
  const counters = document.querySelectorAll('.stat h2[data-target]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current) + (current % 1 > 0.5 ? '+' : '');
        setTimeout(updateCounter, 20);
      } else {
        counter.textContent = target + (target === 133 || target === 938 ? '+' : '');
      }
    };
    
    updateCounter();
  });
}


function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}


window.addEventListener('load', () => {
  const typedEl = document.querySelector('.typed-subtitle');
  if (typedEl) {
    typeWriter(typedEl, 'Football Legend | Global Icon | The GOAT');
  }
});


let quoteActive = 1;
document.querySelector('.quote').addEventListener('click', () => {
  const q1 = document.getElementById('quote1');
  const q2 = document.getElementById('quote2');
  
  if (quoteActive === 1) {
    q1.classList.remove('show');
    q2.classList.add('show');
    q2.style.display = 'block';
    quoteActive = 2;
  } else {
    q2.classList.remove('show');
    q1.classList.add('show');
    quoteActive = 1;
  }
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImg = document.querySelector('.hero-image img');
  if (heroImg) {
    heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});
