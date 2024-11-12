# Gig Work Platform

Gig Work Platform is a React-based web application that allows users to browse, view, and show interest in various gig work opportunities. It provides a user-friendly interface for managing gigs and tracking interested jobs.

## Features

- Browse available gigs
- Search functionality with keyword highlighting
- View detailed gig information
- Show interest in gigs
- Manage interested gigs
- Notification system

## Technologies Used

- React
- Tailwind CSS
- Radix UI
- Lucide React icons

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Setting Up the Project Locally

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/castrokjoseph/gig-work-platform-ui.git
   cd gig-work-platform-ui
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add any necessary environment variables (if applicable).

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:3000` to view the application.
6. There are two views #Creator - Manager Flow
                       #Worker - User Flow 
      To Toggle between Worker and Creator, Change the userRole in App.jsx to either worker or creator accordingly.

## Project Structure

```
/gig-work-platform
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── GigDetailsPage.jsx
│   │   ├── GigListingPage.jsx
│   │   ├── Header.jsx
│   │   └── MyJobsPage.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Builds the app for production.
- `npm run eject`: Removes the single build dependency from your project.

## Contributing

Contributions to the Gig Work Platform are welcome. Please feel free to submit a Pull Request.

