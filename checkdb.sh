#!/usr/bin/env bash
# ==============================================================================
# VEDBUS - Database Setup, Health & Diagnostics Tool for PostgreSQL VPS
#
# Run this directly on your VPS (Ubuntu/Debian) to verify or set up the database.
#
# USAGE:
#   chmod +x checkdb.sh
#   ./checkdb.sh              # Run full health check & diagnostics
#   sudo ./checkdb.sh --setup # Auto-create/fix user 'ayush', db 'vedbus', & configs
# ==============================================================================

set -e

# Default Target DB Settings
DB_NAME="${DB_NAME:-vedbus}"
DB_USER="${DB_USER:-ayush}"
DB_PORT="${DB_PORT:-5432}"
DB_PASSWORD="${DB_PASSWORD:-AyushDev2026X9}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}       VEDBUS - PostgreSQL VPS Health Check & Setup Helper            ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "Target Database : ${CYAN}${DB_NAME}${NC}"
echo -e "Target User     : ${CYAN}${DB_USER}${NC}"
echo -e "Target Port     : ${CYAN}${DB_PORT}${NC}"
echo -e "Timestamp       : $(date)"
echo -e "${BLUE}------------------------------------------------------------------------------${NC}\n"

# 1. Check if PostgreSQL is installed
echo -e "${CYAN}[1/7] Checking PostgreSQL Installation...${NC}"
if command -v psql >/dev/null 2>&1; then
    PG_VERSION=$(psql -V | head -n1)
    echo -e "  ${GREEN}✔${NC} PostgreSQL installed: ${PG_VERSION}"
else
    echo -e "  ${RED}✘ PostgreSQL client/server is NOT installed!${NC}"
    echo -e "  ${YELLOW}Fix: sudo apt update && sudo apt install -y postgresql postgresql-contrib${NC}"
    exit 1
fi

# 2. Check Service Status
echo -e "\n${CYAN}[2/7] Checking PostgreSQL Service Status...${NC}"
if systemctl is-active --quiet postgresql; then
    echo -e "  ${GREEN}✔${NC} PostgreSQL service is active and running."
else
    echo -e "  ${RED}✘ PostgreSQL service is NOT running.${NC}"
    echo -e "  ${YELLOW}Fix: sudo systemctl start postgresql && sudo systemctl enable postgresql${NC}"
    exit 1
fi

# 3. Check Listening Port
echo -e "\n${CYAN}[3/7] Checking Listening Port (${DB_PORT})...${NC}"
if command -v ss >/dev/null 2>&1; then
    LISTEN_CHECK=$(ss -tlpn | grep ":${DB_PORT} " || true)
elif command -v netstat >/dev/null 2>&1; then
    LISTEN_CHECK=$(netstat -tlpn | grep ":${DB_PORT} " || true)
else
    LISTEN_CHECK="unknown"
fi

if [[ -n "$LISTEN_CHECK" && "$LISTEN_CHECK" != "unknown" ]]; then
    echo -e "  ${GREEN}✔${NC} Port ${DB_PORT} is listening:"
    echo -e "    ${LISTEN_CHECK}"
    if echo "$LISTEN_CHECK" | grep -q "0.0.0.0:${DB_PORT}"; then
        echo -e "    ${GREEN}✔ Listen addresses include 0.0.0.0 (open for remote VPS connections)${NC}"
    elif echo "$LISTEN_CHECK" | grep -q "127.0.0.1:${DB_PORT}"; then
        echo -e "    ${YELLOW}⚠ Warning: Port is only listening on 127.0.0.1 (localhost). Remote VPS cannot connect.${NC}"
        echo -e "    ${YELLOW}To fix: set listen_addresses = '*' in postgresql.conf and restart postgresql.${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ Could not verify socket with ss/netstat, continuing...${NC}"
fi

# 4. Check / Setup Database and User (requires sudo if running as non-postgres)
echo -e "\n${CYAN}[4/7] Checking Database '${DB_NAME}' & Role '${DB_USER}'...${NC}"
if id -u postgres >/dev/null 2>&1; then
    DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}';" 2>/dev/null || true)
    USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}';" 2>/dev/null || true)

    if [[ "$DB_EXISTS" == "1" ]]; then
        echo -e "  ${GREEN}✔${NC} Database '${DB_NAME}' exists."
    else
        echo -e "  ${RED}✘ Database '${DB_NAME}' does NOT exist!${NC}"
    fi

    if [[ "$USER_EXISTS" == "1" ]]; then
        echo -e "  ${GREEN}✔${NC} Role/User '${DB_USER}' exists."
    else
        echo -e "  ${RED}✘ Role/User '${DB_USER}' does NOT exist!${NC}"
    fi

    # If --setup flag passed and anything is missing or requested
    if [[ "$1" == "--setup" ]]; then
        echo -e "\n  ${YELLOW}[Setup Mode Enabled] Configuring User and Database...${NC}"
        sudo -u postgres psql <<EOSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
    RAISE NOTICE 'Role ${DB_USER} created.';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
    RAISE NOTICE 'Password for ${DB_USER} updated.';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOSQL
        echo -e "  ${GREEN}✔ Setup completed successfully.${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ 'postgres' system user not accessible without sudo. Skipping direct role check.${NC}"
fi

# 5. Check Authentication (pg_hba.conf)
echo -e "\n${CYAN}[5/7] Inspecting pg_hba.conf Location...${NC}"
if id -u postgres >/dev/null 2>&1; then
    HBA_FILE=$(sudo -u postgres psql -tAc "SHOW hba_file;" 2>/dev/null || true)
    CONF_FILE=$(sudo -u postgres psql -tAc "SHOW config_file;" 2>/dev/null || true)
    if [[ -n "$HBA_FILE" ]]; then
        echo -e "  ${GREEN}✔${NC} pg_hba.conf path: ${HBA_FILE}"
        echo -e "  ${GREEN}✔${NC} postgresql.conf : ${CONF_FILE}"
    fi
fi

# 6. Test Local DB Connection as User
echo -e "\n${CYAN}[6/7] Testing Connection as '${DB_USER}' to '${DB_NAME}'...${NC}"
export PGPASSWORD="${DB_PASSWORD}"

CONN_TEST=$(psql -h 127.0.0.1 -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT current_database(), current_user, version();" 2>&1 || true)

if echo "$CONN_TEST" | grep -q "${DB_NAME}"; then
    echo -e "  ${GREEN}✔ Connection test SUCCEEDED!${NC}"
else
    echo -e "  ${RED}✘ Connection test failed:${NC}"
    echo -e "    ${CONN_TEST}"
    echo -e "\n  ${YELLOW}Tip: Run 'sudo ./checkdb.sh --setup' to automatically fix credentials and permissions.${NC}"
    unset PGPASSWORD
    exit 1
fi

# 7. Check Tables & Record Counts
echo -e "\n${CYAN}[7/7] Checking Tables & Schema in '${DB_NAME}'...${NC}"
TABLES=$(psql -h 127.0.0.1 -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -tAc "
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
" 2>/dev/null || true)

if [[ -z "$TABLES" ]]; then
    echo -e "  ${YELLOW}⚠ No tables found in public schema.${NC}"
    echo -e "  Run 'npm --prefix BACKEND run prisma:migrate' on your app server to apply migrations."
else
    echo -e "  ${GREEN}✔ Tables verified:${NC}"
    for t in $TABLES; do
        COUNT=$(psql -h 127.0.0.1 -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -tAc "SELECT count(*) FROM \"${t}\";" 2>/dev/null || echo "N/A")
        printf "    %-25s : %s rows\n" "$t" "$COUNT"
    done
fi

unset PGPASSWORD

echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${GREEN}🎉 DATABASE CHECK COMPLETED SUCCESSFULLY!${NC}"
echo -e "${BLUE}==============================================================================${NC}"
