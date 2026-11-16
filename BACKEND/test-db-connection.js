const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { Client } = require('pg');

// Load environment variables from .env
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const user = process.env.DB_USER || 'postgres';
const database = process.env.DB_NAME || 'vedbus';
const password = process.env.DB_PASSWORD;

if (!password || password.trim() === '') {
  console.log('⚠️ DB_PASSWORD is empty in .env file!');
  console.log('Please open BACKEND/.env and set DB_PASSWORD=<your_actual_password>');
  process.exit(2);
}

// Update DATABASE_URL in .env if it has placeholder or no password
try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  const encodedPassword = encodeURIComponent(password.trim());
  const newDbUrl = `postgresql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  if (envContent.includes('DATABASE_URL=')) {
    const updated = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${newDbUrl}"`
    );
    if (updated !== envContent) {
      fs.writeFileSync(envPath, updated, 'utf8');
      console.log('🔄 Synced DATABASE_URL in .env with your DB credentials.');
    }
  }
} catch (e) {
  // non-fatal
}

async function testConnection(sslMode) {
  const clientConfig = {
    host,
    port,
    user,
    password: password.trim(),
    database,
    connectionTimeoutMillis: 7000,
  };

  if (sslMode) {
    clientConfig.ssl = { rejectUnauthorized: false };
  }

  const client = new Client(clientConfig);
  try {
    await client.connect();
    const res = await client.query('SELECT version(), current_database(), current_user, NOW() as current_time;');
    console.log('\n========================================');
    console.log('🎉 SUCCESS: Successfully connected to PostgreSQL VPS!');
    console.log('========================================');
    console.log('Connected to Host    :', host);
    console.log('Port                 :', port);
    console.log('Database             :', res.rows[0].current_database);
    console.log('Logged in as User    :', res.rows[0].current_user);
    console.log('Server Timestamp     :', res.rows[0].current_time);
    console.log('PostgreSQL Version   :', res.rows[0].version.split(',')[0]);
    
    // Check tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nExisting Tables in public schema:');
    if (tablesRes.rows.length === 0) {
      console.log(' (No tables yet. Ready for Prisma migrate/push!)');
    } else {
      tablesRes.rows.forEach(r => console.log(' - ' + r.table_name));
    }
    console.log('========================================\n');
    await client.end();
    return true;
  } catch (err) {
    await client.end().catch(() => {});
    throw err;
  }
}

async function run() {
  console.log(`\nAttempting connection to ${user}@${host}:${port}/${database}...`);
  try {
    // Try standard connection without SSL first
    await testConnection(false);
  } catch (err) {
    console.warn(`Direct connection note: ${err.message}`);
    // If server requires SSL or certificate
    if (err.message.includes('SSL') || err.message.includes('ssl') || err.message.includes('no pg_hba.conf entry')) {
      console.log('Retrying with SSL enabled...');
      try {
        await testConnection(true);
        return;
      } catch (sslErr) {
        console.error('\n❌ Connection failed with SSL:', sslErr.message);
        process.exit(1);
      }
    }
    console.error('\n❌ Connection failed:', err.message);
    process.exit(1);
  }
}

run();
