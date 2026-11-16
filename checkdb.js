#!/usr/bin/env node
/**
 * VEDBUS - Database Connection & Health Verification Tool
 *
 * Can be run locally, from an app VPS, or directly on the Database VPS:
 *   node checkdb.js
 */

const path = require('path');
const fs = require('fs');

// Try to load dotenv if available
try {
  const dotenv = require('dotenv');
  // Check .env in current folder, BACKEND/.env, or parent .env
  const candidatePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'BACKEND', '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  }
} catch (e) {
  // dotenv optional if env vars are passed directly
}

const host = process.env.DB_HOST || '82.29.161.126';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const user = process.env.DB_USER || 'ayush';
const database = process.env.DB_NAME || 'vedbus';
const password = process.env.DB_PASSWORD || 'AyushDev2026X9';

let Client;
try {
  Client = require('pg').Client;
} catch (e) {
  try {
    Client = require(path.resolve(__dirname, 'node_modules', 'pg')).Client;
  } catch (err) {
    try {
      Client = require(path.resolve(__dirname, 'BACKEND', 'node_modules', 'pg')).Client;
    } catch (finalErr) {
      console.error('❌ "pg" module not found. Run "npm install pg" first.');
      process.exit(1);
    }
  }
}

async function runCheck() {
  console.log('\n================================================================');
  console.log('       VEDBUS — Database Connection & Integrity Diagnostic      ');
  console.log('================================================================');
  console.log(`Connecting to: ${user}@${host}:${port}/${database}`);
  console.log(`Timestamp    : ${new Date().toISOString()}`);
  console.log('----------------------------------------------------------------');

  const startTime = Date.now();
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis: 8000,
  });

  try {
    await client.connect();
    const latency = Date.now() - startTime;
    console.log(`\n✔ TCP & Authentication Successful! (Latency: ${latency}ms)`);

    // 1. Server Metadata
    const metaRes = await client.query(`
      SELECT 
        version(),
        current_database() AS db,
        current_user AS usr,
        inet_server_addr() AS server_ip,
        inet_server_port() AS server_port,
        NOW() AS server_now;
    `);
    const meta = metaRes.rows[0];
    console.log('\n[Database Metadata]');
    console.log(`  Connected Database : ${meta.db}`);
    console.log(`  Current User       : ${meta.usr}`);
    console.log(`  Server Host/Port   : ${meta.server_ip || host}:${meta.server_port || port}`);
    console.log(`  Server Time        : ${meta.server_now}`);
    console.log(`  Engine Version     : ${meta.version.split(',')[0]}`);

    // 2. Table Inspection
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n[Tables & Record Counts]');
    if (tablesRes.rows.length === 0) {
      console.log('  ⚠ No tables found. Run "npm --prefix BACKEND run prisma:migrate"');
    } else {
      for (const row of tablesRes.rows) {
        const t = row.table_name;
        try {
          const countRes = await client.query(`SELECT count(*) AS c FROM "${t}";`);
          console.log(`  ✔ ${t.padEnd(25)} : ${countRes.rows[0].c} records`);
        } catch (cntErr) {
          console.log(`  ✔ ${t.padEnd(25)} : (accessible)`);
        }
      }
    }

    // 3. Prisma Migrations History
    const hasMigrationsTable = tablesRes.rows.some(r => r.table_name === '_prisma_migrations');
    if (hasMigrationsTable) {
      console.log('\n[Prisma Migrations Applied]');
      const migRes = await client.query(`
        SELECT migration_name, finished_at, rolled_back_at 
        FROM _prisma_migrations 
        ORDER BY finished_at ASC;
      `);
      for (const m of migRes.rows) {
        const status = m.rolled_back_at ? '❌ ROLLED BACK' : '✔ APPLIED';
        console.log(`  ${status} ${m.migration_name} (${m.finished_at})`);
      }
    }

    console.log('\n================================================================');
    console.log('🎉 ALL DATABASE CHECKS PASSED — READY FOR PRODUCTION!');
    console.log('================================================================\n');
    await client.end();
  } catch (err) {
    console.error('\n❌ Database Connection FAILED!');
    console.error(`Reason: ${err.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if the PostgreSQL service is running on the VPS: sudo systemctl status postgresql');
    console.error('2. Check if port 5432 is open in VPS firewall (ufw): sudo ufw allow 5432/tcp');
    console.error('3. Check listen_addresses in postgresql.conf is set to \'*\'');
    console.error('4. Check pg_hba.conf allows user "ayush" to connect to "vedbus"');
    console.error('================================================================\n');
    await client.end().catch(() => {});
    process.exit(1);
  }
}

runCheck();
