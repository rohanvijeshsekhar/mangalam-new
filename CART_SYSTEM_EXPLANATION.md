# Cart System Explanation - How It Works

## Overview
The cart system uses a **two-stage storage approach**:
1. **Browser Storage (localStorage)** - For temporary cart data while shopping
2. **Database** - For permanent storage when enquiry is submitted

---

## Stage 1: Browser Storage (localStorage)

### When Does It Store?
- **While Shopping**: When users add items to cart from:
  - `activity-details.php`
  - `tickets-details.php`
  - `package-details.php`
  - When editing items in `cart.php`

### Storage Location
- **Storage Type**: Browser's `localStorage`
- **Storage Key**: `'cartItem'`
- **Storage Format**: Comma-separated JSON objects
  ```javascript
  // Example: "{id:'act-34',type:'Activity',...},{id:'tkt-56',type:'Ticket',...}"
  localStorage.setItem('cartItem', '{...},{...}')
  ```

### What Gets Stored?
Each cart item includes:
```javascript
{
  id: "act-34",              // Item ID (e.g., "act-34" or "tkt-56")
  type: "Activity",          // Item type
  title: "Root",             // Item title
  thumbnail: "./path/to/image.jpg",
  amount: 80,                // Adult price
  childAmount: 50,           // Child price
  date: "2025-10-31",       // Travel date
  adults: 10,               // Number of adults
  children: 1,              // Number of children
  age: [5],                 // Array of child ages (e.g., [5, 7, 9])
  destinationId: "",        // Optional destination ID
}
```

### Functions Used
- `getCartData()` - Retrieves cart from localStorage
- `setCartData(data)` - Saves cart to localStorage
- `updateCartItem(id, item)` - Updates specific item
- `removeCartItem(id)` - Removes item from cart
- `clearCart()` - Clears entire cart

### Where Are These Functions?
- `cart.php` (lines 958-1046)
- `script.php` (lines 497-520)

### Important Notes
- ✅ **Persists** across page reloads (same browser)
- ✅ **Fast** - No server requests needed
- ❌ **Not permanent** - Lost if browser cache is cleared
- ❌ **Not shared** - Different browsers/devices have different carts
- ❌ **No admin visibility** - Admins can't see cart until enquiry is submitted

---

## Stage 2: Database Storage

### When Does It Store?
- **Only when user submits enquiry** via checkout form in `cart.php`
- Triggered when user clicks "Proceed to Checkout" → fills form → clicks "Send enquiry"

### Storage Process

#### Step 1: Customer Information
Saved to `enquiry_cart` table:
```sql
INSERT INTO enquiry_cart (name, email, phone, status)
VALUES ('John Doe', 'john@example.com', '+971501234567', 1)
```

#### Step 2: Cart Items
Each item is saved based on its type:

**For Activities:**
```sql
INSERT INTO enquiry_activities 
  (date, adult_count, children_count, enquiry_cart_id, activity_id, status)
VALUES ('2025-10-31', 10, 1, 123, 34, 1)
```

**For Tickets:**
```sql
INSERT INTO enquiry_tickets 
  (date, adult_count, children_count, enquiry_cart_id, ticket_id, status)
VALUES ('2025-10-31', 2, 1, 123, 56, 1)
```

#### Step 3: Child Ages
Saved to separate age tables:

**For Activities:**
```sql
INSERT INTO enquiry_activity_age 
  (enquiry_activity_id, age, status)
VALUES (456, '5', 1)
```

**For Tickets:**
```sql
INSERT INTO enquiry_ticket_age 
  (enquiry_ticket_id, age, status)
VALUES (789, '7', 1)
```

### Where Is This Code?
- **Main Handler**: `action/emailApi.php` (lines 38-200)
- **Email Function**: `assets/js/emailFunctions.js` → `sendCartEnquiryEmail()`
- **Cart Checkout**: `cart.php` (lines 870-933)

### Database Tables Used
1. `enquiry_cart` - Customer details (name, email, phone)
2. `enquiry_activities` - Activity items (linked to enquiry_cart)
3. `enquiry_tickets` - Ticket items (linked to enquiry_cart)
4. `enquiry_activity_age` - Child ages for activities
5. `enquiry_ticket_age` - Child ages for tickets

### Flow Diagram
```
User Shopping
    ↓
Add Items to Cart
    ↓
Browser localStorage ← Cart data stored here
    ↓
User clicks "Proceed to Checkout"
    ↓
User fills contact form (name, email, phone)
    ↓
User clicks "Send enquiry"
    ↓
JavaScript sends POST to action/emailApi.php
    ↓
Email sent to admin
    ↓
Database INSERT ← Cart data saved here permanently
    ↓
localStorage cleared ← Cart emptied
    ↓
Success message shown
```

---

## Key Differences

| Aspect | Browser Storage | Database |
|--------|---------------|----------|
| **When** | While shopping | On enquiry submit |
| **Location** | Browser localStorage | MySQL Database |
| **Persistence** | Temporary (browser) | Permanent |
| **Admin Visible** | ❌ No | ✅ Yes |
| **Survives Cache Clear** | ❌ No | ✅ Yes |
| **Cross-Device** | ❌ No | ✅ Yes |
| **Speed** | ⚡ Instant | 🐌 Requires server |
| **Storage Limit** | ~5-10MB | Unlimited |

---

## Summary

**Cart data storage flow:**
1. **Browser Storage (localStorage)** = Shopping cart (temporary, client-side)
2. **Database** = Permanent record (only after enquiry submission)

**Benefits of this approach:**
- ✅ Fast cart operations (no server calls while shopping)
- ✅ Works offline (until checkout)
- ✅ Reduces server load
- ✅ Permanent record for admin visibility
- ✅ Can retrieve historical enquiries from database

**Current Implementation:**
- Cart items stored in `localStorage.getItem('cartItem')`
- Database persistence in `action/emailApi.php` (cart case)
- Data flow: `cart.php` → `emailFunctions.js` → `emailApi.php` → Database

---

## Testing

To verify cart storage:

1. **Check Browser Storage:**
   - Open browser DevTools (F12)
   - Go to "Application" tab → "Local Storage"
   - Look for key: `cartItem`

2. **Check Database:**
   - After submitting enquiry, check these tables:
   - `enquiry_cart` - Should have new row with customer info
   - `enquiry_activities` or `enquiry_tickets` - Should have cart items
   - `enquiry_activity_age` or `enquiry_ticket_age` - Should have child ages

