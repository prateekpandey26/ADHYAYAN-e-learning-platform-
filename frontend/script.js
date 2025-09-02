// ===================== CONTACT FORM SUBMIT =====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (res.ok) {
        btn.textContent = 'Sent';
        contactForm.reset();
        showToast('Message sent successfully!');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
        showToast(data.error || 'Failed to send message');
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      showToast('Failed to send message');
    }
  });
}
// ===================== DOM SELECTORS =====================
const scrollBtn = document.getElementById('scrollToTopBtn');
const themeToggle = document.getElementById('themeToggle');
const courseGrid = document.getElementById('courseGrid');
const myCoursesGrid = document.getElementById('myCoursesGrid');
const instructorForm = document.getElementById('courseForm');
const quizGrid = document.getElementById('quizGrid');
const certGrid = document.getElementById('certGrid');
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const cartGrid = document.getElementById('cartGrid');
const cartTotal = document.getElementById('cartTotal');
const profileDropdown = document.getElementById('profileDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const profileName = document.getElementById('profileName');
const logoutBtn = document.getElementById('logoutBtn');
const myProfileSection = document.getElementById('myProfileSection');
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const profileModalBody = document.getElementById('profileModalBody');


// ===================== HERO SEARCH DROPDOWN TOGGLE =====================
document.addEventListener('DOMContentLoaded', function() {
  const dropdown = document.querySelector('.hero-search-dropdown');
  const btn = dropdown && dropdown.querySelector('.hero-search-dropdown-btn');
  const menu = dropdown && dropdown.querySelector('.hero-search-dropdown-menu');
  if (btn && menu) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }
});
// ...existing code...

// ===================== MODAL LOGIN/SIGNUP =====================
if (loginBtn) loginBtn.addEventListener('click', () => authModal.showModal());
if (signupBtn) signupBtn.addEventListener('click', () => authModal.showModal());
closeAuthModal.addEventListener('click', () => authModal.close());

// ...existing code...

// ===================== PROFILE MODAL LOGIC =====================
if (myProfileSection) {
  myProfileSection.addEventListener('click', async () => {
    profileMenu.style.display = 'none';
    profileDropdown.classList.remove('active');
    // Fetch user details from backend
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    let detailsHtml = `<h2 style="margin-bottom:1rem;">My Profile</h2>`;
    detailsHtml += `<p><b>Name:</b> ${user.name || ''}</p>`;
    detailsHtml += `<p><b>Email:</b> ${user.email || ''}</p>`;
    detailsHtml += `<p><b>Role:</b> ${user.role || ''}</p>`;
    // Fetch enrolled courses/quizzes from backend
    try {
      const res = await fetch(`http://localhost:5000/api/user-details?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (user.role === 'student') {
        detailsHtml += `<h3 style='margin-top:1.2rem;'>Enrolled Courses</h3>`;
        if (data.enrolledCourses && data.enrolledCourses.length) {
          detailsHtml += '<ul>' + data.enrolledCourses.map(c => `<li>${c.title}</li>`).join('') + '</ul>';
        } else {
          detailsHtml += '<p>No enrolled courses.</p>';
        }
        detailsHtml += `<h3 style='margin-top:1.2rem;'>Enrolled Quizzes</h3>`;
        if (data.enrolledQuizzes && data.enrolledQuizzes.length) {
          detailsHtml += '<ul>' + data.enrolledQuizzes.map(q => `<li>${q.title}</li>`).join('') + '</ul>';
        } else {
          detailsHtml += '<p>No enrolled quizzes.</p>';
        }
      } else if (user.role === 'instructor') {
        detailsHtml += `<h3 style='margin-top:1.2rem;'>Your Courses</h3>`;
        if (data.courses && data.courses.length) {
          detailsHtml += '<ul>' + data.courses.map(c => `<li>${c.title}</li>`).join('') + '</ul>';
        } else {
          detailsHtml += '<p>No courses created.</p>';
        }
        detailsHtml += `<h3 style='margin-top:1.2rem;'>Enrolled Students</h3>`;
        if (data.enrolledStudents && data.enrolledStudents.length) {
          detailsHtml += '<ul>' + data.enrolledStudents.map(s => `<li>${s.name} (${s.email})</li>`).join('') + '</ul>';
        } else {
          detailsHtml += '<p>No students enrolled.</p>';
        }
      }
    } catch (err) {
      detailsHtml += '<p style="color:red;">Failed to load details.</p>';
    }
    profileModalBody.innerHTML = detailsHtml;
    profileModal.showModal();
  });
}
if (closeProfileModal) closeProfileModal.addEventListener('click', () => profileModal.close());

// ===================== COURSES DATA =====================
let courses = [
  { title: "JavaScript Basics", category: "Programming", price: 0 },
  { title: "AI & ML Intro", category: "AI & ML", price: 500 },
  { title: "Web Design", category: "Design", price: 300 },
  { title: "Python for Beginners", category: "Programming", price: 200 },
  { title: "Data Structures", category: "Computer Science", price: 400 },
  { title: "Digital Marketing", category: "Business", price: 350 },
  { title: "Cloud Computing", category: "IT", price: 600 }
];
let myCourses = [
  { title: "JavaScript Basics", category: "Programming", price: 0 },
  { title: "AI & ML Intro", category: "AI & ML", price: 500 },
  { title: "Web Design", category: "Design", price: 300 },
  { title: "Python for Beginners", category: "Programming", price: 200 },
  { title: "Data Structures", category: "Computer Science", price: 400 },
  { title: "Digital Marketing", category: "Business", price: 350 },
  { title: "Cloud Computing", category: "IT", price: 600 }
];
let quizzes = [
  { title: "JS Basics Quiz", course: "JavaScript Basics", totalQuestions: 10, passed: false },
  { title: "AI & ML Quiz", course: "AI & ML Intro", totalQuestions: 8, passed: true },
  { title: "Web Design Quiz", course: "Web Design", totalQuestions: 12, passed: false },
  { title: "Python Quiz", course: "Python for Beginners", totalQuestions: 15, passed: false },
  { title: "Data Structures Quiz", course: "Data Structures", totalQuestions: 20, passed: true },
  { title: "Digital Marketing Quiz", course: "Digital Marketing", totalQuestions: 10, passed: false },
  { title: "Cloud Computing Quiz", course: "Cloud Computing", totalQuestions: 9, passed: false }
];
let certificates = [
  { title: "JavaScript Basics Certificate", course: "JavaScript Basics", date: "2025-08-01" },
  { title: "AI & ML Certificate", course: "AI & ML Intro", date: "2025-08-10" },
  { title: "Web Design Certificate", course: "Web Design", date: "2025-08-15" },
  { title: "Python for Beginners Certificate", course: "Python for Beginners", date: "2025-08-20" },
  { title: "Data Structures Certificate", course: "Data Structures", date: "2025-08-25" },
  { title: "Digital Marketing Certificate", course: "Digital Marketing", date: "2025-08-28" },
  { title: "Cloud Computing Certificate", course: "Cloud Computing", date: "2025-08-30" }
];
let cart = [];

function addToCart(item, type) {
  const key = item.title + (item.course || '') + type;
  const found = cart.find(c => c.key === key);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...item, type, qty: 1, key });
  }
  renderCart();
  showToast(`Added "${item.title}" to cart`);
}
function updateCartQty(key, delta) {
  const found = cart.find(c => c.key === key);
  if (found) {
    found.qty += delta;
    if (found.qty <= 0) {
      cart = cart.filter(c => c.key !== key);
    }
    renderCart();
  }
}

// ===================== RENDER CART =====================
function renderCart() {
  cartGrid.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.category ? 'Category: ' + item.category : item.course ? 'Course: ' + item.course : ''}</p>
      <p>Type: ${item.type}</p>
      <div class="cart-qty-controls">
        <button class="cart-qty-btn" data-key="${item.key}" data-delta="-1">-</button>
        <span class="cart-qty-value">${item.qty}</span>
        <button class="cart-qty-btn" data-key="${item.key}" data-delta="1">+</button>
      </div>
      <p>Price: ₹${(item.price || 0) * item.qty}</p>
      <button class="btn remove-cart-btn" data-index="${idx}">Remove</button>
    `;
    cartGrid.appendChild(card);
    total += (item.price || 0) * item.qty;
  });
  cartTotal.textContent = cart.length ? `Total: ₹${total}` : 'Cart is empty.';
  document.querySelectorAll('.remove-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      const card = btn.closest('.card');
      btn.classList.add('removing');
      card.classList.add('fade-out');
      setTimeout(() => {
        cart.splice(idx, 1);
        renderCart();
      }, 400);
    });
  });
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      const delta = parseInt(btn.getAttribute('data-delta'));
      updateCartQty(key, delta);
    });
  });
}

// ===================== RENDER COURSES =====================
function renderCourses() {
  courseGrid.innerHTML = '';
  courses.forEach((course, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>Category: ${course.category}</p>
      <p>Price: ₹${course.price}</p>
      <button class="btn primary enroll-btn" data-index="${index}">Enroll</button>
      <button class="add-cart-btn" data-index="${index}">Add to Cart
        <span class="cart-qty-controls" style="display:none"></span>
      </button>
    `;
    courseGrid.appendChild(card);
  });
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      myCourses.push(courses[idx]);
      renderMyCourses();
      showToast(`Enrolled in "${courses[idx].title}"`);
    });
  });
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = btn.getAttribute('data-index');
      addToCart(courses[idx], 'Course');
      btn.textContent = 'Added';
      btn.disabled = true;
    });
  });
}

// ===================== RENDER MY COURSES =====================
function renderMyCourses() {
  myCoursesGrid.innerHTML = '';
  myCourses.forEach((course, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>Category: ${course.category}</p>
      <p>Price: ₹${course.price}</p>
      <button class="add-cart-btn" data-index="${index}">Add to Cart
        <span class="cart-qty-controls" style="display:none"></span>
      </button>
    `;
    myCoursesGrid.appendChild(card);
  });
  document.querySelectorAll('#myCoursesGrid .add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = btn.getAttribute('data-index');
      addToCart(myCourses[idx], 'My Course');
      btn.textContent = 'Added';
      btn.disabled = true;
    });
  });
}

// ===================== RENDER QUIZZES =====================
function renderQuizzes() {
  quizGrid.innerHTML = '';
  quizzes.forEach((quiz, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${quiz.title}</h3>
      <p>Course: ${quiz.course}</p>
      <p>Total Questions: ${quiz.totalQuestions}</p>
      <p>Status: <span style="color:${quiz.passed ? 'green' : 'red'}">${quiz.passed ? 'Passed' : 'Not Passed'}</span></p>
      <button class="btn primary" ${quiz.passed ? 'disabled' : ''}>${quiz.passed ? 'Completed' : 'Start Quiz'}</button>
      <button class="add-cart-btn" data-index="${index}">Add to Cart
        <span class="cart-qty-controls" style="display:none"></span>
      </button>
    `;
    quizGrid.appendChild(card);
  });
  document.querySelectorAll('#quizGrid .add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = btn.getAttribute('data-index');
      addToCart(quizzes[idx], 'Quiz');
      btn.textContent = 'Added';
      btn.disabled = true;
    });
  });
}

// ===================== RENDER CERTIFICATES =====================
function renderCertificates() {
  certGrid.innerHTML = '';
  certificates.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${cert.title}</h3>
      <p>Course: ${cert.course}</p>
      <p>Date: ${cert.date}</p>
      <button class="btn primary">Download</button>
      <button class="add-cart-btn" data-index="${index}">Add to Cart
        <span class="cart-qty-controls" style="display:none"></span>
      </button>
    `;
    certGrid.appendChild(card);
  });
  document.querySelectorAll('#certGrid .add-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = btn.getAttribute('data-index');
      addToCart(certificates[idx], 'Certificate');
      btn.textContent = 'Added';
      btn.disabled = true;
    });
  });
}

// ===================== TOAST FUNCTION =====================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.removeAttribute('hidden');
  toast.style.opacity = 1;
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.setAttribute('hidden', true), 500);
  }, 2500);
}

// ===================== INITIAL RENDER =====================
renderCourses();
renderMyCourses();
renderQuizzes();
renderCertificates();
renderCart();

// ===================== HERO SEARCH BAR & DROPDOWN LOGIC =====================
const heroSearchDropdownBtn = document.getElementById('heroSearchDropdownBtn');
const heroSearchDropdownMenu = document.getElementById('heroSearchDropdownMenu');
const heroSearchDropdownLabel = document.getElementById('heroSearchDropdownLabel');
const heroSearchInput = document.getElementById('heroSearchInput');
const heroSearchBtn = document.getElementById('heroSearchBtn');
const heroSearchGroup = document.querySelector('.hero-search-group');

if (heroSearchDropdownBtn && heroSearchDropdownMenu && heroSearchDropdownLabel) {
  heroSearchDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = heroSearchDropdownBtn.getAttribute('aria-expanded') === 'true';
    heroSearchDropdownBtn.setAttribute('aria-expanded', !expanded);
    heroSearchDropdownBtn.parentElement.classList.toggle('open', !expanded);
  });
  // Dropdown menu item click
  heroSearchDropdownMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('href');
      heroSearchDropdownLabel.textContent = link.textContent;
      heroSearchDropdownBtn.setAttribute('aria-expanded', 'false');
      heroSearchDropdownBtn.parentElement.classList.remove('open');
      if (section) {
        window.location.hash = section;
      }
    });
  });
  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!heroSearchDropdownBtn.parentElement.contains(e.target)) {
      heroSearchDropdownBtn.setAttribute('aria-expanded', 'false');
      heroSearchDropdownBtn.parentElement.classList.remove('open');
    }
  });
}

if (heroSearchBtn && heroSearchInput) {
  heroSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = heroSearchInput.value.trim().toLowerCase();
    if (!query) {
      showToast('Please enter a subject to search.');
      return;
    }
    // Try to match with course, quiz, or section
    let found = false;
    // Search in courses
    for (const c of courses) {
      if (c.title.toLowerCase().includes(query)) {
        window.location.hash = '#catalog';
        heroSearchInput.value = '';
        found = true;
        break;
      }
    }
    // Search in quizzes
    if (!found) {
      for (const q of quizzes) {
        if (q.title.toLowerCase().includes(query)) {
          window.location.hash = '#quizzes';
          heroSearchInput.value = '';
          found = true;
          break;
        }
      }
    }
    // Search in certificates
    if (!found) {
      for (const cert of certificates) {
        if (cert.title.toLowerCase().includes(query)) {
          window.location.hash = '#certificates';
          heroSearchInput.value = '';
          found = true;
          break;
        }
      }
    }
    // If not found, show toast
    if (!found) {
      showToast('No matching subject or section found.');
    }
  });
  // Enter key triggers search
  heroSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      heroSearchBtn.click();
    }
  });
}

// ===================== PAYMENT LOGIC =====================
const payNowBtn = document.getElementById('payNowBtn');
const paymentSuccess = document.getElementById('paymentSuccess');
const paymentSection = document.getElementById('paymentSection');

if (payNowBtn && paymentSection) {
  payNowBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    // Get selected payment method
    const selected = paymentSection.querySelector('input[name="paymentMethod"]:checked');
    let method = selected ? selected.value : 'upi';
    payNowBtn.disabled = true;
    payNowBtn.textContent = 'Processing...';
    setTimeout(() => {
      paymentSuccess.hidden = false;
      payNowBtn.textContent = 'Pay Now';
      payNowBtn.disabled = false;
      cart = [];
      renderCart();
      setTimeout(() => {
        paymentSuccess.hidden = true;
      }, 2500);
    }, 1500);
    showToast('Payment via ' + method.toUpperCase() + ' initiated!');
  });
}

// ===================== SIGNUP =====================
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const role = document.getElementById('signupRole').value;

  try {
    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    alert(data.message);
    signupForm.reset();
  } catch (err) {
    console.error(err);
    alert('Signup failed');
  }
});

// ===================== LOGIN =====================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {  // status 200
      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user || { name: data.name || 'My Profile', email, role: data.role }));
      showProfileDropdown(data.user || { name: data.name || 'My Profile', email, role: data.role });
      showToast(data.message);
      authModal.close();
    } else {  // status 401 / 400 / 500
      alert(data.error);    // Invalid email or password
    }

    loginForm.reset();
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
});
