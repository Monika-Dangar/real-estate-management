# Real Estate Platform Backend

A specialized Node.js backend application designed for a real estate platform. It supports distinct roles, secure authentication workflows, mocked payments, and robust property/appointment management.

## Features & Requirements Met

### 1. Authentication & Authorization
- Implement secure authentication using **JWT**.
- Role-based Access Control (**Buyer**, **Seller/Builder**, **Admin**) implemented using custom middleware (`protect` and `authorize`).
- Mocked **Google Login** endpoint provided.

### 2. User Management
- **Buyers** can browse properties publicly, manage favorite properties, and request appointments (Video Calls/Site Visits).
- **Sellers** register as pending, can mock pay fees to become active, and subsequently manage their own property listings.
- **Admins** have platform-wide access to manage all users, update statuses (e.g., approve/block), and view all data.

### 3. Property Management
- Properties contain detailed fields including amenities, budget ranges, possession dates, and mocked URLs for sample videos.
- Sellers create property listings (flagged as pending by default).
- Admins approve or reject property listings.
- Only approved properties are visible publicly.

### 4. Search & Filtering
- Open API endpoint (`/api/v1/properties`) allows flexible search/filtering by:
  - Budget (min/max price)
  - Location (City/Locality string matching)
  - Configuration (e.g., 2 BHK)
  - Possession Date limits
- Premium listings are sorted at the top of the search results automatically.

### 5. Favorites
- Authenticated buyers can mark properties as favorites, preventing duplicate additions via MongoDB indexing.

### 6. Appointments
- Buyers request appointments (Video Call or Site Visit) on a property.
- Sellers and buyers can track status. Sellers can mark status as scheduled, cancelled, or completed. Admin has full oversight.

### 7. Notifications (Mock)
- Notification records are generated in the database internally (upon appointment request and update). Options exist for mocked delivery methods (email/sms/whatsapp).

### 8. Monetization
- **Seller Paid Status:** Sellers invoke `/api/v1/users/pay-fee` to upgrade their account to paid, which allows them to list properties.
- **Premium properties:** Sellers can mark properties as premium, handled by indexing for top placement in querying.

### 9. Documentation
- Complete OpenAPI 3.0 documentation using **Swagger UI**.
- Fully integrated with Express to run at `/api-docs`.

## Technology Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database mapping & relations)
- **JWT** (JSON Web Tokens)
- **Bcrypt.js** (Password hashing)
- **Joi** (Data Validation)
- **Swagger UI Express** & **YAMLJS** (API Documentation)
- **Helmet**, **Cors**, **Morgan** (Security & Logging)

## Project Setup

1. **Clone & Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

3. **Run the Server**
```bash
npm run dev
# Server will start on http://localhost:3003
```

4. **Access Swagger Documentation**
Visit: `http://localhost:3003/api-docs` to view and test all endpoints directly.
