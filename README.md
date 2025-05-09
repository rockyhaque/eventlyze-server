# Eventlyze – Backend

A robust and scalable backend API for **Eventlyze - Event Planner & Participation System**, a secure event management platform enabling user authentication, event creation (public/private, free/paid), participant management, payment processing, reviews, and admin moderation. Designed with RESTful principles for modularity, performance, and scalability.

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

- **User Authentication and Profile Management**:

  - Secure user registration and login with JWT-based authentication, ensuring protected access to platform features.
  - Profile management allowing users to update personal details, manage notification preferences, and view participation history.
  - Password hashing and secure session handling to maintain data privacy and security.

- **Role-Based Access Control**:

  - Distinct roles for Admin and User, enforcing granular permissions.
  - Admins have full access to monitor and moderate events, users, and content.
  - Users can perform actions limited to their own events, participation, and reviews.

- **Event CRUD Operations**:

  - Create events with customizable attributes: title, date/time, venue/link, description, visibility (public/private), fee (free/paid), and format (online/offline).
  - Edit existing events to update details or adjust visibility and pricing.
  - Delete events with cascading removal of associated participant data and reviews.
  - Real-time synchronization of event data across the platform for consistent user experience.

- **Participant Workflows**:

  - **Join**: Instant joining for free public events with automatic acceptance.
  - **Request**: Request-to-join functionality for private events, with pending status until host approval.
  - **Approve/Reject**: Hosts can approve or reject participant requests, with notifications sent to users.
  - **Ban**: Hosts can ban attendees to enforce community standards, preventing future participation in their events.
  - **Invite**: Hosts can send direct invitations to registered users, with a streamlined "Pay & Accept" flow for paid events.
  - Comprehensive participant management interface for hosts to view and manage attendee statuses.

- **Payment Processing with Status Tracking**:

  - Integration with SSLCommerz for secure payment collection on paid events.
  - Real-time payment status updates (pending, completed, failed) for both hosts and attendees.
  - Automated pending request creation post-payment, awaiting host approval for event access.
  - Refund handling for declined invitations or canceled events, ensuring transparency.

- **Post-Event Review and Rating System**:

  - Attendees can submit ratings and reviews post-event, visible on event details pages.
  - Review editing and deletion within a defined post-event period to ensure fairness.
  - Aggregated ratings displayed to help users assess event quality.

- **Admin APIs for Site-Wide Moderation**:

  - Monitor all events, users, and content to ensure compliance with platform policies.
  - Delete inappropriate events or user accounts with audit logging for transparency.
  - Access to detailed activity reports for proactive community management.

- **Optional Notification System**:
  - Real-time notifications for invitation receipts, request approvals, payment confirmations, and event updates.
  - Configurable notification preferences (email, in-app) for users to control their experience.
  - Batch notifications for hosts to communicate with multiple participants efficiently.

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
- **Deployment**: Deployed on Vercel. Configure environment variables in the hosting platform’s dashboard.
- **API Documentation**: Explore endpoints and schemas at `http://localhost:5000/api-docs` in development mode.

📬 **Contact**  
For issues or inquiries, reach out to [rockyhaque99@gmail.com](mailto:rockyhaque99@gmail.com). Thank you.
