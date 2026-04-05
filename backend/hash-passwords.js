/**
 * One-time migration script to hash plaintext passwords in MongoDB.
 * 
 * Usage:
 *   node hash-passwords.js
 * 
 * This script:
 * 1. Connects to MongoDB
 * 2. Finds all users with plaintext passwords (not bcrypt hashes)
 * 3. Hashes them with bcrypt (same as authController.signup)
 * 4. Updates them in the database
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function migratePasswords() {
  try {
    await mongoose.connect(
      "mongodb://admin:minijira123@localhost:27017/minijira?authSource=admin"
    );
    console.log("✅ Connected to MongoDB");

    const users = await User.find();
    console.log(`📋 Found ${users.length} user(s) in the database\n`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      // bcrypt hashes always start with "$2a$", "$2b$", or "$2y$"
      const isBcryptHash = /^\$2[aby]\$/.test(user.password);

      if (isBcryptHash) {
        console.log(`⏭️  ${user.email} — already hashed, skipping`);
        skipped++;
      } else {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        console.log(`🔒 ${user.email} — password hashed successfully`);
        migrated++;
      }
    }

    console.log(`\n✅ Migration complete: ${migrated} hashed, ${skipped} skipped`);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

migratePasswords();
