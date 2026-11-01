<div align="center">

# 🍲 LocalChefBazaar

### A marketplace that connects home chefs with people who crave real, home-cooked food

<br />

[![Live Site](https://img.shields.io/badge/%F0%9F%9A%80%20CLICK%20HERE%20TO%20VISIT%20LIVE%20SITE-c8461a?style=for-the-badge)](https://localchefbazaarbd.vercel.app)

<br />

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat-square&logo=daisyui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)

**[Live Site](https://localchefbazaarbd.vercel.app)** · **[Server Repository](<https://github.com/minhazahmmed/Local-Chef-Bazar-Server>)**

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Related Repository](#related-repository)
- [Developed By](#developed-by)

---

## About the Project

**LocalChefBazaar** is a full-stack MERN marketplace where home chefs can list the meals they cook, and customers can browse, order, pay online and review them. The platform has three roles, each with its own dashboard: **User**, **Chef** and **Admin**.

This repository contains the **client (front end)**. The REST API lives in a separate repository, linked [below](#related-repository).

---

## Screenshots

<div align="center">

### Home Page

<img src="./screenshots/home.png" alt="LocalChefBazaar home page" width="100%" />

<details>
  <summary><b>View full home page</b></summary>
  <br />
  <img src="./screenshots/home-full.png" alt="Full home page" width="100%" />
</details>

<br />

### Meals and Meal Details

<table>
  <tr>
    <td width="50%"><img src="./screenshots/meals.png" alt="Meals page" /></td>
    <td width="50%"><img src="./screenshots/meal-details.png" alt="Meal details page" /></td>
  </tr>
</table>

### Coverage Map

<img src="./screenshots/coverage.png" alt="Coverage map" width="100%" />

<br />
<br />

### Role Based Dashboards

<table>
  <tr>
    <th width="33%">User</th>
    <th width="33%">Chef</th>
    <th width="33%">Admin</th>
  </tr>
  <tr>
    <td><img src="./screenshots/dashboard-user.png" alt="User dashboard" /></td>
    <td><img src="./screenshots/dashboard-chef.png" alt="Chef dashboard" /></td>
    <td><img src="./screenshots/dashboard-admin.png" alt="Admin dashboard" /></td>
  </tr>
</table>

### Mobile View

<table>
  <tr>
    <td width="33%" valign="top"><img src="./screenshots/mobile-home.jpg" alt="Mobile home" width="100%" /></td>
    <td width="33%" valign="top"><img src="./screenshots/mobile-meals.jpg" alt="Mobile meals" width="100%" /></td>
    <td width="33%" valign="top"><img src="./screenshots/mobile-meals-details.jpg" alt="Mobile meals details" width="100%" /></td>
  </tr>
  <tr>
    <td width="33%" valign="top"><img src="./screenshots/mobile-user-dashboard.jpg" alt="Mobile user dashboard" width="100%" /></td>
    <td width="33%" valign="top"><img src="./screenshots/mobile-chef-dashboard.jpg" alt="Mobile chef dashboard" width="100%" /></td>
    <td width="33%" valign="top"><img src="./screenshots/mobile-admin-dashboard.jpg" alt="Mobile admin dashboard" width="100%" /></td>
  </tr>
</table>

</div>

---

## Key Features

### Public
- Clean, fully responsive home page with a hero banner, featured meals and customer reviews
- **Meals page** with sorting by price
- **Meal details** page with chef information, ingredients, ratings and reviews
- **Coverage page** with an interactive map of Bangladesh, a district search that zooms in and highlights the district, and tooltips showing where home chefs deliver

### Authentication
- Email and password registration and login
- Google sign in
- Forgot password email flow
- Protected routes for logged in users and role based dashboards
- Login and register pages are hidden from users who are already signed in
- Firebase ID token sent as a Bearer token with every secured request

### User Dashboard
- My Profile, with the option to request a Chef or Admin role
- Place orders and track their status in real time
- Pay online with Stripe Checkout once the chef accepts an order
- Write, edit and delete reviews
- Save and remove favorite meals

### Chef Dashboard
- Create, update and delete meals, with image upload to Cloudinary
- Order Requests with filter tabs, search, and Accept, Cancel and Deliver actions
- Delivery is allowed only after the customer has paid
- Clear delivered and cancelled orders from the list

### Admin Dashboard
- **Manage Users**: change roles, mark users as fraud or restore them, with search, role filter and pagination
- **Manage Requests**: approve, reject or reopen chef and admin role requests, with search, status filter and pagination
- Platform statistics with charts

### UI and Experience
- Light theme, Inter font, and a consistent warm color palette
- Mobile first layouts, with cards on small screens and tables on large screens in the dashboard
- Toast notifications, confirmation dialogs and loading states for every action
- Route level code splitting to keep the first load fast

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | React 19, Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4, DaisyUI v5 |
| Data Fetching | TanStack Query v5, Axios |
| Forms | React Hook Form |
| Authentication | Firebase Authentication |
| Payments | Stripe Checkout |
| Image Upload | Cloudinary |
| Maps | Leaflet, React Leaflet, OpenStreetMap |
| UI Libraries | Swiper, Framer Motion, Recharts, React Icons |
| Feedback | React Hot Toast, SweetAlert2 |
| Hosting | Vercel |

---

## Project Structure

```text
src/
├── api/            Axios instances
├── assets/         Images
├── components/     Reusable and shared UI components
├── contexts/       Auth context and provider
├── data/           Static data, such as district list
├── hooks/          Custom hooks (useAuth, useAxiosSecure, useTitle)
├── layouts/        Main and dashboard layouts
├── pages/          Public pages and dashboard pages
├── routes/         Router, private, public and role based routes
└── utils/          Helpers (formatters, image upload)
```

---

## Getting Started

### Prerequisites
- Node.js 20 or newer
- A Firebase project, a Cloudinary account, and the running [server](<https://github.com/minhazahmmed/Local-Chef-Bazar-Server>)

### Installation

```bash
git clone https://github.com/minhazahmmed/Local-Chef-Bazar-Client.git
cd Local-Chef-Bazar-Client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

> Vite bakes `VITE_` variables in at build time, so redeploy after changing them.

---

## Deployment

The client is deployed on **Vercel**. Every push to the `main` branch triggers an automatic deployment. Add the same environment variables in the Vercel project settings, and add the live domain to Firebase **Authorized domains** so Google sign in works.

---

## Related Repository

| Repository | Description |
| --- | --- |
| [LocalChefBazaar Server](<https://github.com/minhazahmmed/Local-Chef-Bazar-Server>) | Express and MongoDB REST API, Stripe payments and Firebase token verification |

---

## Developed By

<div align="center">

## Minhaz Ahmmed

MERN Stack Developer


CSE Student, International Islamic University Chittagong

<br />

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/minhaz-ahmmed)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/minhazahmmed)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](<https://facebook.com/minhaz.ahmmed.98>)
[![Portfolio](https://img.shields.io/badge/Portfolio-c8461a?style=for-the-badge&logo=googlechrome&logoColor=white)](https://minhazahmmed.vercel.app)

<br />

⭐ If you like this project, please consider giving it a star.

</div>