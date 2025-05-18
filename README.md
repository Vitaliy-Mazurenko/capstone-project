# Online Learning Platform

A web application for browsing and enrolling in online courses. Users can search, filter, and explore courses with intuitive navigation and responsive design.

## Introduction
**Goal:**

Task is to create a web application using HTML, CSS, and JavaScript to practice your core web development skills. You are required to avoid using JavaScript frameworks (e.g., React, Angular) or CSS frameworks (e.g., Bootstrap).

## Real Estate Website
Develop a web application for a real estate listing website where users can search properties available for sale or rent. The site should display detailed property information such as price, size, location, and amenities, along with photos. Enhance user experience by providing a dynamic gallery for property images, a search function to quickly find listings, and pagination to navigate between listing pages. A map should indicate the property location, making geographic information easily accessible. Ensure the layout is responsive and visually appealing on different devices.

**Data and assets:**
•	The data used in the application should be created by you in JSON format. There should be at least 11 items (elements), and the data must be stored locally (not fetched from external APIs).
•	Images in your project should be free for using. 
•	Add Sass into your project and implement a "compile" script to the package.json file to handle the compilation of all .scss files into .css files. If you’re unfamiliar with how to compile .scss files into .css, please refer to the [guide.](https://sass-lang.com/guide/)

## Web Application Development

The second stage involves building your web application. Follow the general requirements below to structure your HTML, CSS, and JavaScript code effectively. The application should use HTML, CSS, and JavaScript to create a dynamic and user-friendly experience.

**HTML & CSS part**

•	Create semantic HTML markup using tags like <header>, <footer>, <article>, <nav>, <ul>, <li>, etc., for structured content organization.
•	Implement styles using Sass: utilize mixins, variables, and Sass inheritance to simplify and organize styles.
•	Apply Flexbox and/or CSS Grid layouts to arrange elements effectively.
•	The “Home” page should contain an image slider and a navigation menu:
o	Implement a submenu in the main menu using proper tags (<nav>, <ul>, <li>, <a>).
o	Ensure the menu block stretches across the available space (responsive design). If necessary, menu can be displayed on different devices in different ways.
•	Ensure the web application is responsive: use media queries to adjust layout and styles so that the design works on all devices and avoids horizontal scrolling when resizing the browser window.

**JavaScript part**

•	Implement a "Gallery" page that displays a set of cards featuring courses or properties (depending on the selected project option). Each card should display an image with 300 x 300 px dimensions along with all relevant information provided in the data (JSON) file. Handle varying original image sizes by ensuring proper scaling or cropping.
•	Add client-side pagination to display data page-by-page (maximum of 10 elements per page). Include navigation controls for users to access other pages. Additionally, implement asynchronous loading for elements that are initially hidden. These elements should load dynamically when the user clicks a “Show more” button.
•	Add functionality to enable sorting and filtering of data on designated pages.
•	Provide functionality to search information across the data provided.
•	Include a "Contacts" page with a map indicating a specific location. Use JavaScript to integrate a map service like Google Maps or OpenStreetMap.

**Final notes**

•	Ensure your web application combines HTML, CSS, and JavaScript smoothly for a functional and engaging user experience.
•	Test your application on multiple browsers and devices to ensure it works properly and looks good everywhere.
•	Write clean, well-organized code that is easy to maintain and reuse.

## Project Compilation, Verification & Submission
Once your project is complete, take the following steps to ensure quality and submit it for evaluation:

**Quality control:**
Add linters: Set up ESLint for JavaScript and Stylelint for Sass/CSS to maintain consistent code quality and style.
Linting script: Add a "lint" script to your package.json to check both .js and .scss files for issues. Fix any problems detected.


## Setup Instructions

### Prerequisites
- Node.js and npm installed

### Installation
1. Clone the repository
   ```bash
   git clone https://autocode.git.epam.com/vitaliy007m/capstone-project-template.git
   cd online-learning-platform
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Compile Sass to CSS and Start development
   ```bash
   npm run dev
   ```

## Features
- Course browsing with filtering and sorting
- Image slider on home page
- Interactive course gallery
- Pagination
- Course search functionality
- Contact page with integrated map
- Responsive design for all devices
