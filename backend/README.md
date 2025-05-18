
# Dubai Referral CRM Backend

This is the backend for the Dubai Referral CRM application.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL database server

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   - Create a PostgreSQL database named `dubai_crm`
   - Run the SQL script in `setup-db.sql` to create tables and initial data:
     ```
     psql -U postgres -d dubai_crm -f setup-db.sql
     ```

3. Configure environment variables:
   - Modify the `.env` file with your database credentials

4. Start the server:
   ```
   npm run dev
   ```

### Default User
- Email: demo@example.com
- Password: password123

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Referrals
- GET `/api/referrals` - Get all referrals
- POST `/api/referrals` - Create a new referral

### Deals
- GET `/api/deals` - Get all deals
- POST `/api/deals` - Create a new deal

### Reports
- GET `/api/reports/referrals` - Get referrals sorted by specified field
- GET `/api/reports/deals` - Get deals sorted by specified field

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
