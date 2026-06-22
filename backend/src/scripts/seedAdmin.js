/*
=====================================
SEED ADMIN
Creates the first admin account directly in the database.
Run with: npm run seed:admin
=====================================
*/

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.SEED_ADMIN_EMAIL || "admin@nexora.com";
    const name = process.env.SEED_ADMIN_NAME || "Super Admin";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

    const exists = await User.findOne({ email });

    if (exists) {
      console.log(`Admin already exists: ${email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log("Log in at /login and change the password afterwards.");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
