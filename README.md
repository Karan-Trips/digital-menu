# KarQR — Smart Digital Menu

A premium, responsive, and easy-to-manage digital QR menu for restaurants, hotels, and cafes. KarQR allows customers to browse food categories through an elegant interface and enables owners to manage their menu in real-time through a password-protected admin panel.

![Landing Page](https://via.placeholder.com/800x400?text=KarQR+Landing+Page)

## ✨ Features

- **📱 Customer Experience**
  - **Dynamic Tabs**: Seamlessly switch between categories (Thali, Paratha, Rice, etc.).
  - **Premium UI**: Modern glassmorphism design with sleek animations.
  - **Sort by Price**: Customers can sort items from Low to High or High to Low.
  - **Mobile First**: Optimized for smartphone scanning.
  - **Theming**: Supports multiple visual styles (Classic, Dark, Minimal, etc.).

- **⚙️ Admin Panel**
  - **Menu Management**: Add, edit, or delete items and categories.
  - **Live Theme Picker**: Switch the entire look of the menu with one click.
  - **Settings**: Change the restaurant name, tagline, and admin password.
  - **Data Persistence**: All changes are saved instantly via `localStorage`.

## 📂 Project Architecture

The project has been refactored from a single file into a clean, maintainable multi-file architecture:

```text
digital-menu/
├── index.html          # Clean landing page with KarQR branding
├── menu.html           # Customer-facing menu with category logic
├── admin.html          # Admin panel & login gateway
├── css/
│   ├── style.css       # Shared base styles, themes, and vars
│   ├── menu.css        # Item cards, thali layouts, and tab bar
│   └── admin.css       # Admin dashboard UI and item tables
└── js/
    ├── data.js         # Central data store & persistence logic
    ├── menu.js         # Customer view rendering & tab logic
    └── admin.js        # Admin CRUD operations & dashboard logic
```

## 🚀 Getting Started

1. **Download/Clone** the project folder.
2. **Run Locally**: Since it's built with Vanilla HTML/JS/CSS, you can simply open `index.html` in any web browser.
3. **Scan QR**: Point your phone camera at a QR code linking to your hosted `menu.html`.

## 🔐 Admin Access

- **Login Page**: Click the "⚙ Admin" button on the menu or navigate to `admin.html`.
- **Default Password**: `admin123`
- *Note: You can change this password in the Admin Settings tab.*

## 🛠 Technologies

- **HTML5**: Semantic structure.
- **Vanilla CSS**: Custom styling with CSS Variables (Theming).
- **Vanilla JS**: Dynamic DOM manipulation and localStorage management.
- **Google Fonts**: Nunito & Playfair Display for a premium feel.

---
*Created with ❤️ by Karan Smart Menu*
