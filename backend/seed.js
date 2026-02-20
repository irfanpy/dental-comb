import "dotenv/config";
import { query } from "./src/db/index.js";
import bcrypt from "bcryptjs";

const SAMPLE_PATIENTS = [
  { name: "Alice Johnson", email: "alice@example.com", phone: "555-0001", dob: "1985-03-15", medicalNotes: "Regular checkup needed" },
  { name: "Bob Smith", email: "bob@example.com", phone: "555-0002", dob: "1990-07-22", medicalNotes: "Sensitive teeth" },
  { name: "Carol White", email: "carol@example.com", phone: "555-0003", dob: "1988-11-10", medicalNotes: "Orthodontic treatment ongoing" },
  { name: "David Brown", email: "david@example.com", phone: "555-0004", dob: "1992-01-05", medicalNotes: "Recent root canal" },
  { name: "Emma Davis", email: "emma@example.com", phone: "555-0005", dob: "1987-05-18", medicalNotes: "Gum disease monitoring" },
  { name: "Frank Miller", email: "frank@example.com", phone: "555-0006", dob: "1991-09-30", medicalNotes: "Implant candidate" },
  { name: "Grace Wilson", email: "grace@example.com", phone: "555-0007", dob: "1989-12-25", medicalNotes: "Whitening treatment" },
  { name: "Henry Moore", email: "henry@example.com", phone: "555-0008", dob: "1986-04-12", medicalNotes: "Cavity filling" },
  { name: "Iris Taylor", email: "iris@example.com", phone: "555-0009", dob: "1993-06-08", medicalNotes: "First visit" },
  { name: "Jack Anderson", email: "jack@example.com", phone: "555-0010", dob: "1984-10-20", medicalNotes: "Preventive care" },
  { name: "Karen Thomas", email: "karen@example.com", phone: "555-0011", dob: "1994-02-14", medicalNotes: "Cleaning scheduled" },
  { name: "Leo Jackson", email: "leo@example.com", phone: "555-0012", dob: "1988-08-03", medicalNotes: "Emergency treatment" },
  { name: "Monica Harris", email: "monica@example.com", phone: "555-0013", dob: "1991-03-27", medicalNotes: "Braces adjustment" },
  { name: "Nathan Martin", email: "nathan@example.com", phone: "555-0014", dob: "1986-11-16", medicalNotes: "Fluoride treatment" },
  { name: "Olivia Lee", email: "olivia@example.com", phone: "555-0015", dob: "1995-07-09", medicalNotes: "Pediatric checkup" },
  { name: "Peter Clark", email: "peter@example.com", phone: "555-0016", dob: "1989-01-11", medicalNotes: "Extraction needed" },
  { name: "Quinn Lewis", email: "quinn@example.com", phone: "555-0017", dob: "1992-05-22", medicalNotes: "Cosmetic consultation" },
  { name: "Rachel Walker", email: "rachel@example.com", phone: "555-0018", dob: "1987-09-14", medicalNotes: "Regular patient" },
  { name: "Samuel Hall", email: "samuel@example.com", phone: "555-0019", dob: "1990-12-03", medicalNotes: "Emergency follow-up" },
  { name: "Tina Allen", email: "tina@example.com", phone: "555-0020", dob: "1986-06-25", medicalNotes: "Scaling and polishing" },
  { name: "Ulysses Young", email: "ulysses@example.com", phone: "555-0021", dob: "1993-04-18", medicalNotes: "First appointment" },
  { name: "Vanessa King", email: "vanessa@example.com", phone: "555-0022", dob: "1991-10-07", medicalNotes: "Plaque removal" },
  { name: "Walter Wright", email: "walter@example.com", phone: "555-0023", dob: "1988-02-28", medicalNotes: "Crown placement" },
  { name: "Xena Lopez", email: "xena@example.com", phone: "555-0024", dob: "1994-08-15", medicalNotes: "Checkup due" },
  { name: "Yuri Hill", email: "yuri@example.com", phone: "555-0025", dob: "1989-11-30", medicalNotes: "Cavity treatment" },
  { name: "Zoe Scott", email: "zoe@example.com", phone: "555-0026", dob: "1992-03-10", medicalNotes: "New patient intake" },
  { name: "Aaron Green", email: "aaron@example.com", phone: "555-0027", dob: "1986-07-21", medicalNotes: "Routine exam" },
  { name: "Bella Adams", email: "bella@example.com", phone: "555-0028", dob: "1995-01-06", medicalNotes: "Preventive" },
  { name: "Carlos Nelson", email: "carlos@example.com", phone: "555-0029", dob: "1990-09-12", medicalNotes: "Follow-up" },
  { name: "Diana Carter", email: "diana@example.com", phone: "555-0030", dob: "1987-04-19", medicalNotes: "Annual checkup" },
];

async function seed() {
  try {
    console.log("Creating test user...");
    const passwordHash = await bcrypt.hash("password123", 10);
    const userRes = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      ["seed@example.com", passwordHash]
    );

    const userId = userRes.rows[0].id;
    console.log(`Test user created/found: ${userId}`);

    console.log("Inserting 30 sample patients...");
    let count = 0;
    for (const patient of SAMPLE_PATIENTS) {
      await query(
        `INSERT INTO patients (user_id, name, email, phone, dob, medical_notes)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, patient.name, patient.email, patient.phone, patient.dob, patient.medicalNotes]
      );
      count++;
    }

    console.log(`✓ Successfully seeded ${count} patients`);
    console.log(`\nTest credentials:`);
    console.log(`  Email: seed@example.com`);
    console.log(`  Password: password123`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
