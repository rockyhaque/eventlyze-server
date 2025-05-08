# Eventlyze – Backend

A robust and scalable backend API for the **Eventlyze - Event Planner & Participation System**, a secure event management platform enabling user authentication, event creation (public/private, free/paid), participant management, payment processing, reviews, and admin moderation. Designed with RESTful principles for modularity and performance.

📃 **Documentation**  
**Server Link** ➡️ [https://eventlyze-server.vercel.app](https://eventlyze-server.vercel.app)

🛠 **Tech Stack**

- **Node.js + Express** – Backend Framework
- **PostgreSQL** – Relational Database
- **Prisma ORM** – Database Modeling & Querying
- **JWT** – Secure Authentication
- **SSLCommerz** – Payment Gateway Integration
- **RESTful API** – Endpoint Management

📦 **Features**

- User authentication and profile management (JWT-based)
- Role-based access control (Admin/User)
- Event CRUD operations (public/private, free/paid, online/offline)
- Participant workflows: join, request, approve, reject, ban, invite
- Payment processing with status tracking for paid events
- Post-event review and rating system
- Admin APIs for site-wide moderation
- Optional notification system for invitations and updates

📁 **Project Setup**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rockyhaque/eventlyze-server
   cd eventlyze-server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**  
   Create a `.env` file in the root directory. Refer to `.env.example` for guidance:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/event_planner"
   PORT=5000
   JWT_SECRET="your_jwt_secret_key"
   PAYMENT_GATEWAY_API_KEY="your_payment_gateway_api_key"
   PAYMENT_GATEWAY_SECRET="your_payment_gateway_secret"
   NODE_ENV="development"
   ```

4. **Run Prisma Migrations**  
   Initialize the database schema (ensure PostgreSQL is running locally):

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the Server**
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:5000`.

📋 **Additional Notes**

- **Database**: Ensure PostgreSQL is installed and running locally. Create a database named `event_planner` and update the `DATABASE_URL` in `.env` with your credentials.
- **Testing**: Use the provided admin credentials for testing:
  - **Email**: admin@eventplanner.com
  - **Password**: Admin123!
- **Deployment**: Deployed on Render. Configure environment variables in the hosting platform’s dashboard.

📬 **Contact**  
For issues or inquiries, reach out to [rockyhaque99@gmail.com](mailto:rockyhaque99@gmail.com).
