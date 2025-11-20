# Database Migration Guide

This guide will help you update your database to support the new ticketing and QR code features.

## What's New

The following fields have been added to the `Registration` table:

- `ticket_code` - Unique identifier for each ticket (UUID, unique, auto-generated)
- `qr_code` - Base64-encoded QR code image (TEXT)
- `checked_in_at` - Timestamp when attendee was checked in (DATETIME, nullable)

## Migration Steps

### Option 1: Using Prisma Migrate (Recommended)

This is the cleanest way to update your database:

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client with new schema
npm run prisma:generate

# Create and apply migration
npx prisma migrate dev --name add_ticket_qr_fields

# Alternatively, if you want to name it differently:
npx prisma migrate dev --name ticket_system
```

This will:

1. Create a new migration file
2. Apply it to your database
3. Update the Prisma client

### Option 2: Manual SQL Migration

If you prefer to manually update the database, run these SQL commands:

```sql
-- Add ticket_code column
ALTER TABLE `Registration` 
ADD COLUMN `ticket_code` VARCHAR(191) NOT NULL DEFAULT (UUID());

-- Add qr_code column
ALTER TABLE `Registration` 
ADD COLUMN `qr_code` TEXT NULL;

-- Add checked_in_at column
ALTER TABLE `Registration` 
ADD COLUMN `checked_in_at` DATETIME(3) NULL;

-- Add unique constraint on ticket_code
ALTER TABLE `Registration` 
ADD UNIQUE INDEX `Registration_ticket_code_key` (`ticket_code`);

-- Add index on ticket_code for faster lookups
ALTER TABLE `Registration` 
ADD INDEX `Registration_ticket_code_idx` (`ticket_code`);
```

### Option 3: Using Docker (If using docker-compose)

If you're running the application with Docker:

```bash
# Stop the containers
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Rebuild and start
docker-compose up --build

# The migrations will run automatically on startup
```

**⚠️ Warning:** This option will delete all existing data!

## Verification

After running the migration, verify it was successful:

```bash
# Using Prisma Studio (visual database viewer)
cd backend
npx prisma studio

# Or check with MySQL client
mysql -u eventnest_user -p eventnest_db
```

Then run this query:

```sql
DESCRIBE Registration;
```

You should see the new fields:

- `ticket_code` (VARCHAR, unique)
- `qr_code` (TEXT, nullable)
- `checked_in_at` (DATETIME, nullable)

## Handling Existing Data

If you have existing registrations in your database, they will automatically receive:

1. **ticket_code**: Automatically generated UUID
2. **qr_code**: NULL (will be generated on next login or when viewing tickets)
3. **checked_in_at**: NULL (only set when checked in)

### Generate QR Codes for Existing Registrations

If you want to generate QR codes for existing registrations, you can create a script or endpoint to
do this:

```javascript
// One-time script to generate QR codes for existing registrations
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateQRCode(data) {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

async function updateExistingRegistrations() {
  const registrations = await prisma.registration.findMany({
    where: { qr_code: null }
  });

  console.log(`Found ${registrations.length} registrations without QR codes`);

  for (const reg of registrations) {
    const qrCodeData = JSON.stringify({
      ticketCode: reg.ticket_code,
      eventId: reg.event_id,
      userId: reg.user_id,
      registrationId: reg.id,
    });

    const qrCode = await generateQRCode(qrCodeData);

    if (qrCode) {
      await prisma.registration.update({
        where: { id: reg.id },
        data: { qr_code: qrCode }
      });
      console.log(`Updated registration ${reg.id}`);
    }
  }

  console.log('Done!');
  await prisma.$disconnect();
}

updateExistingRegistrations();
```

Save this as `backend/scripts/generate-qr-codes.js` and run:

```bash
node backend/scripts/generate-qr-codes.js
```

## Rollback

If you need to rollback the migration:

### Using Prisma

```bash
cd backend
npx prisma migrate resolve --rolled-back <migration_name>
```

### Manual SQL Rollback

```sql
-- Remove the columns
ALTER TABLE `Registration` DROP COLUMN `ticket_code`;
ALTER TABLE `Registration` DROP COLUMN `qr_code`;
ALTER TABLE `Registration` DROP COLUMN `checked_in_at`;

-- Remove indexes (if they exist)
ALTER TABLE `Registration` DROP INDEX `Registration_ticket_code_key`;
ALTER TABLE `Registration` DROP INDEX `Registration_ticket_code_idx`;
```

## Troubleshooting

### Issue: Migration fails with "Duplicate entry"

**Cause:** Existing registrations might have duplicate values.

**Solution:** Clear the registrations table or use UUID generation:

```sql
-- Generate unique ticket codes for existing records
UPDATE Registration 
SET ticket_code = UUID() 
WHERE ticket_code IS NULL OR ticket_code = '';
```

### Issue: "Unknown column 'ticket_code'"

**Cause:** Migration hasn't been applied to the database.

**Solution:** Run the migration commands again or check your database connection.

### Issue: QR codes not generating

**Cause:** `qrcode` package not installed.

**Solution:**

```bash
cd backend
npm install qrcode
```

### Issue: Prisma client out of sync

**Cause:** Prisma client needs to be regenerated.

**Solution:**

```bash
cd backend
npx prisma generate
```

## Testing After Migration

1. **Test Registration:**
    - Create a test event (as organizer)
    - Register for the event (as student)
    - Check if email is sent with QR code
    - Verify ticket appears in "My Tickets" page

2. **Test QR Verification:**
    - Go to event's QR verification page
    - Enter the ticket code
    - Verify it shows correct information
    - Check in the attendee
    - Verify attendance is marked

3. **Test Attendance Stats:**
    - Check that attendance statistics are accurate
    - Verify checked-in count updates in real-time

## Production Considerations

1. **Backup First:** Always backup your database before running migrations
2. **Test in Staging:** Test the migration in a staging environment first
3. **Downtime:** Schedule the migration during low-traffic periods
4. **Monitoring:** Monitor the application after migration for any issues
5. **Rollback Plan:** Have a rollback plan ready in case of issues

## Support

If you encounter issues during migration:

1. Check the error messages carefully
2. Verify your database connection
3. Ensure you have proper permissions
4. Check the Prisma documentation: https://www.prisma.io/docs
5. Review the application logs for more details

---

**Last Updated:** November 2025  
**Compatible with:** EventNest v2.0+
