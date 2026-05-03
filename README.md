# 🏡 Property Finder Project(Work In Progress)
This is a full-stack property finder web application, inspired by platforms like Property Finder Saudi Arabia (you can change to any country).
It allows users to search, list, and manage properties for sale or rent, with features tailored to different types of users.

## Screen shoot :
<img width="1894" height="794" alt="Screenshot 2026-01-21 200302" src="https://github.com/user-attachments/assets/1ece4c9a-b10b-43db-aa68-b25b8d925e4f" />


<img width="1894" height="827" alt="Screenshot 2026-01-21 200337" src="https://github.com/user-attachments/assets/fef67872-98ef-4e72-bbfa-f3ae9a6e4e61" />

<img width="1890" height="820" alt="Screenshot 2026-01-21 200427" src="https://github.com/user-attachments/assets/5434134c-4561-49e9-bbe0-dd68ddb4bfde" />

<img width="1877" height="822" alt="Screenshot 2026-01-21 200530" src="https://github.com/user-attachments/assets/6ac61042-e047-4496-bc01-e2c902a4f46d" />

<img width="1875" height="823" alt="Screenshot 2026-01-21 200602" src="https://github.com/user-attachments/assets/06ee1ff1-f07a-4c61-b993-8cd378a31a23" />

<img width="1867" height="820" alt="Screenshot 2026-01-21 200802" src="https://github.com/user-attachments/assets/810d2884-5b90-4b6d-adef-1d65ecb754be" />

## Project Technology :

| Component     | Technology              |
| ------------- | ----------------------- |
| Backend       | Django 5.x              |
| API Framework | Django REST Framework   |
| Auth          | JWT (Simple JWT)        |
| Database      | PostgreSQL (via Docker) |
| Deployment    | Docker & Docker Compose |
| Frontend      | NextJS                  |
| HTTP cookies  |  Http Only Cookies      |


## System Architecture:
![System Architecture](assets/propertyFinderFullstackProject.png)

## ER Diagram:
![ER Diagram](assets/dbdiagram.io_property_finder.png)
https://dbdiagram.io/d/Property-Finder-68df410ed2b621e42210ee1f

## 🔑 Key Features
- Role-based access control (5 user types)
- Property listings with detailed information (location, price, type, images, etc.)
- Advanced search & filtering (buy, rent, commercial, residential, etc.)
- Secure authentication (JWT with HTTP-only cookies)
- Admin dashboard for managing users and properties
- Modern frontend built with Next.js (React)
- Robust backend built with Django REST Framework (DRF)

## 👥 User Roles
The system is powered by a CustomUser model with a role field, which determines user type and permissions.

### Admin
- Full access to all data
- Manage users and property listings

### Developer
- Can list multiple properties (apartments, villas, etc.)
- Typically represents a real estate development company

### Broker
- Can manage property listings
- Can have Agents working under them

### Agent
- Works under a Broker
- Can list and manage properties on behalf of the broker

### Buyer
- Can search, browse, and inquire about properties
- Can save favorite listings.


## ⚙️ Tech Stack
- Backend: Django REST Framework (DRF)
- Frontend: Next.js (React, TypeScript-ready)
- Database: PostgreSQL (recommended, but can work with SQLite/MySQL)
- Authentication: JWT (stored in HTTP-only cookies) with refresh token logic
- Deployment-ready with modular, scalable architecture.



## 🚀 Project Goal
The goal of this project is to create a scalable, role-based property listing platform where different user types can interact in a real estate ecosystem — just like on Property Finder.


## 🛠️ Usage Flow
Here’s how different users interact with the platform:
### Registration & Login
#### Buyers (normal users):
Can directly sign up and start browsing properties.
#### Developers, Brokers, and Agents:
Must first go to the “Join Us” page and submit an application form (with full name, email, job, experience, etc.).
The Admin team reviews the request.
If approved, the applicant receives a special registration link via email to create an account as a Developer, Broker, or Agent.
#### Admins: 
Created manually from the backend with full access rights.

## Property Listing
Developers, Brokers, and Agents can create property listings (with images, details, and pricing).

## Searching & Browsing
Buyers browse listings using filters (buy/rent, price range, location, property type).

## Connecting
Buyers contact Agents or Brokers for more details.
Agents respond on behalf of Brokers or Developers.

## Management & Control
Admins oversee the entire platform, review role requests, and manage users and properties.

## 👨‍💻 Developer
**Nikhil Kumar Singh**
*Final year undergraduate at IIIT Agartala*
