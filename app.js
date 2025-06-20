const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Set up EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Custom middleware to check working hours
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours(); //0-23
  
  // Check if it's Monday (1) to Friday (5) and between 9 AM and 5 PM
  const isWorkingDay = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 9 && hour < 17;
  
  if (isWorkingDay && isWorkingHour) {
    next(); // Continue to the next middleware/route
  } else {
    // Outside working hours
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[day];
    const currentTime = now.toLocaleTimeString();
    
    res.status(503).render('closed', {
      currentDay,
      currentTime,
      title: 'Service Unavailable'
    });
  }
};

// Apply working hours middleware to all routes
app.use(checkWorkingHours);

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'Home - TechSolutions Pro',
    currentPage: 'home'
  });
});

app.get('/services', (req, res) => {
  res.render('services', { 
    title: 'Our Services - TechSolutions Pro',
    currentPage: 'services'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us - TechSolutions Pro',
    currentPage: 'contact'
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    currentPage: 'none'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Application is only available during working hours (Mon-Fri, 9 AM - 5 PM)');
});