const pool = require("./db");

const categories = [
  "Electronics",
  "Wallet & Purse",
  "Keys",
  "Bag & Backpack",
  "Clothing",
  "Jewelry",
  "Documents & Cards",
  "Phone",
  "Books & Stationery",
  "Other",
];

const locations = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
];

const seed = async () => {
  try {
    // Seed categories
    for (const name of categories) {
      await pool.query(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    }
    console.log("✅ Categories seeded");

    // Seed locations
    for (const city of locations) {
      await pool.query(
        `INSERT INTO locations (city) VALUES ($1)`,
        [city]
      );
    }
    console.log("✅ Locations seeded");

  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await pool.end();
  }
};

seed();