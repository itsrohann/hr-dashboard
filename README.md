# HR Performance Dashboard

This is a frontend HR management dashboard built using Next.js (App Router), Tailwind CSS, and Framer Motion. The goal was to simulate a clean, interactive internal HR tool that works entirely on the client side, using dummy data and localStorage. It covers features like employee search, filtering, bookmarking, project assignment, and basic analytics visualization.

## Features Implemented

- Dummy login using localStorage (no auth logic)
- Search by name, email, or department
- Filter by department and performance rating (dropdowns with checkboxes)
- Bookmark employees
- View bookmarked employees in a separate tab
- Assign bookmarked employees to projects (dropdown + confirmation)
- Side drawer to view assigned project status
- Individual employee pages with:
  - Tabbed UI (Overview, Projects, Feedback)
  - Feedback submission with validation
- Animated transitions on all major UI changes using Framer Motion
- Basic analytics dashboard using Chart.js:
  - Average rating per department (Bar chart)
  - Bookmark activity trend over last 4 days (Line chart)
- Dark mode toggle (saved in localStorage)

## How to Run

1. Clone the repository:
   git clone https://github.com/itsrohann/hr-dashboard.git
   cd hr-dashboard

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Go to:
   http://localhost:3000

## Login Details

There's no real authentication. Just enter the following credentials:
Username: admin
Password: pass123

## Data Handling

All user data is pulled from https://dummyjson.com/users?limit=20. On top of that, each user is given a random department and a random rating. Bookmarks and project assignments are stored in localStorage only.

## Folder Structure Overview

- `/app`: all routing and pages
- `/components`: reusable components like `UserCard`
- `/context`: (if used) can be removed if state is fully localized
- `/public`: optional assets like screenshots
- `/styles`: tailwind/global styles if extended

## Screenshots

Please go through the attached screenshots for a general idea of the portal.

![Login]
![image](https://github.com/user-attachments/assets/01a006ed-6a9c-45ec-ae54-2094749c6e16)

![Dashboard]
![image](https://github.com/user-attachments/assets/64a43458-8e85-4080-8b93-612647473479)

![Employee Details]
![image](https://github.com/user-attachments/assets/6c98f204-9d63-44a2-a0bd-8257948863c8)

![Analytics]
![image](https://github.com/user-attachments/assets/4591e7db-9415-4fad-8db4-0838f724a215)

![Bookmarks]
![image](https://github.com/user-attachments/assets/8bca2b30-be88-40d3-bcc7-d12529dca9f3)


## Tech Stack Used

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Chart.js via react-chartjs-2
- LocalStorage for state persistence
- DummyJSON API for fetching sample users

## Notes

- This app is fully client-side.
- Ideal for demo purposes, prototyping, or as a base for a full-stack extension.
- No backend, database, or real login is implemented.
- All project assignment logic is mocked and persisted in-browser only.

## License

Open-source. Use it freely for reference or personal projects.

