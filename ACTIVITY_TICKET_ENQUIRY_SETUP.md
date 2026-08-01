# Activity and Ticket Enquiry Setup

## Overview
This setup ensures that activity and ticket enquiries from the frontend are stored in the admin panel following the same flow as cart enquiries.

## Database Flow
The system follows this flow (same as cart enquiries):

1. **Step 1**: Insert customer info into `enquiry_cart` table
   - Fields: `name`, `email`, `phone`
   - Get the `enquiry_cart_id`

2. **Step 2**: Insert activity/ticket into respective tables
   - For **Activity**: Insert into `enquiry_activities` with `enquiry_cart_id`
   - For **Ticket**: Insert into `enquiry_tickets` with `enquiry_cart_id`

3. **Step 3**: Insert children ages (if any)
   - For **Activity**: Insert into `enquiry_activity_age`
   - For **Ticket**: Insert into `enquiry_ticket_age`

## Changes Made

### 1. Updated `action/emailApi.php`

**Activity Enquiry Flow:**
- Step 1: Insert customer info (`name`, `email`, `phone`) into `enquiry_cart`
- Step 2: Insert activity details into `enquiry_activities` with `enquiry_cart_id` reference
- Step 3: Insert children ages into `enquiry_activity_age` (if provided)

**Ticket Enquiry Flow:**
- Step 1: Insert customer info (`name`, `email`, `phone`) into `enquiry_cart`
- Step 2: Insert ticket details into `enquiry_tickets` with `enquiry_cart_id` reference
- Step 3: Insert children ages into `enquiry_ticket_age` (if provided)

## Database Tables Required

The following tables should exist (they already exist from cart enquiry setup):

### 1. `enquiry_cart`
```sql
- id (AUTO_INCREMENT PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- status (INT, default: 1)
```

### 2. `enquiry_activities`
```sql
- id (AUTO_INCREMENT PRIMARY KEY)
- date (DATE)
- adult_count (INT)
- children_count (INT)
- enquiry_cart_id (INT, FOREIGN KEY)
- activity_id (INT, FOREIGN KEY)
- status (INT, default: 1)
```

### 3. `enquiry_tickets`
```sql
- id (AUTO_INCREMENT PRIMARY KEY)
- date (DATE)
- adult_count (INT)
- children_count (INT)
- enquiry_cart_id (INT, FOREIGN KEY)
- ticket_id (INT, FOREIGN KEY)
- status (INT, default: 1)
```

### 4. `enquiry_activity_age`
```sql
- id (AUTO_INCREMENT PRIMARY KEY)
- enquiry_activity_id (INT, FOREIGN KEY)
- age (INT)
```

### 5. `enquiry_ticket_age`
```sql
- id (AUTO_INCREMENT PRIMARY KEY)
- enquiry_ticket_id (INT, FOREIGN KEY)
- age (INT)
```

## SQL Setup

Run the SQL file `database_setup_activity_ticket_enquiry.sql` to:
1. Verify tables exist
2. Create tables if they don't exist
3. Ensure correct table structure

## How It Works

### Frontend Flow (activity-details.php / tickets-details.php)
1. User fills enquiry form (name, email, phone, date, adults, children)
2. Frontend calls `sendActivityEnquiryEmail()` or `sendTicketEnquiryEmail()` from `emailFunctions.js`
3. This sends POST request to `action/emailApi.php` with enquiry type

### Backend Flow (emailApi.php)
1. Receives enquiry data
2. Sends emails (customer and admin)
3. **NEW**: Persists data to database:
   - Insert into `enquiry_cart` (customer info)
   - Insert into `enquiry_activities` or `enquiry_tickets` (item details)
   - Insert into age tables (children ages)

### Admin Panel
- Activity and ticket enquiries will now appear in the admin panel
- They follow the same structure as cart enquiries
- Admin can view them using the same enquiry list pages

## Testing

1. Submit an activity enquiry from `activity-details.php`
2. Submit a ticket enquiry from `tickets-details.php`
3. Check admin panel to verify:
   - Customer info appears in `enquiry_cart` table
   - Activity/ticket appears in respective tables
   - All data is linked via `enquiry_cart_id`

## Notes

- The system follows the exact same flow as `submitEnquiryCart.php`
- All enquiries (cart, activity, ticket) use the same `enquiry_cart` table for customer info
- Activity and ticket enquiries are linked via `enquiry_cart_id` for consistency
- Database errors are caught and don't break email sending functionality

