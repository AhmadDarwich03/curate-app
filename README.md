<img width="1915" height="836" alt="image" src="https://github.com/user-attachments/assets/148e269a-191d-4136-b1f8-90ad4b6d29c0" />
<img width="1918" height="830" alt="image" src="https://github.com/user-attachments/assets/f3af5329-26ed-4415-a7b6-69a3c72a8433" />
<img width="1919" height="835" alt="image" src="https://github.com/user-attachments/assets/7521587a-2ad7-441a-ac69-a9cdc5129067" />

> A modern, full-stack visual discovery tool built for designers to organize inspiration. Featuring a dark-mode interface, masonry grid layout, and persistent data storage.

## 🚀 Features

* **SPA Architecture:** Seamless navigation between Dashboard, Favorites, and Settings without page reloads.
* **Persistent Database:** Powered by **SQLite** for robust data management (CRUD).
* **Interactive UI:**
    * Custom "Glassmorphism" design with Dark Mode.
    * Instant "Like/Favorite" functionality.
    * Dynamic image grid rendering.
* **Smart Backend:** Node.js API that handles data requests and serves static assets.
* **Auto-Seeding:** The application automatically populates with professional mock data upon first launch so it never looks empty.

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js, SQLite3
* **Frontend:** HTML5, CSS3 (CSS Grid & Flexbox), Vanilla JavaScript (ES6+)
* **Design:** Inter Font, Remix Icons, Glassmorphism UI
* **Version Control:** Git & GitHub

## ⚙️ Installation & Setup

Clone the repository and run the server locally within minutes.

```bash
# 1. Clone the repository

# 2. Navigate to project directory
cd curate-app

# 3. Install dependencies
npm install

# 4. Start the server
npm start
# OR if using nodemon
npx nodemon server.js
The application will run on http://localhost:3000.

Project Structure

curate-app/
├── public/             # Static assets (Frontend)
│   ├── index.html      # Single Page Application entry
│   ├── style.css       # Advanced styling & variables
│   └── app.js          # Client-side logic & DOM manipulation
├── server.js           # Express API & Database logic
├── gallery.db          # SQLite Database (Auto-generated)
└── package.json        # Dependencies & Scripts
🔮 Future Improvements

[ ] User Authentication (JWT)
[ ] Image drag-and-drop upload to AWS S3
[ ] Tagging system for better filtering

Made with ❤️ by Ahmad Darwich
