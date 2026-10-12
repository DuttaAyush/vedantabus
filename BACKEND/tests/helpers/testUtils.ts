import jwt from 'jsonwebtoken';
import { prisma } from '../../src/prisma';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'VedantaBus_dev_access_secret_key_super_secure_random_123456789';

export const TEST_USER_ID = 'b9a6911a-6f7c-4654-9843-f31ea1d58523';
export const TEST_ADMIN_ID = 'cf83b6c9-7799-4a9b-8516-21c9403fe5f8';

export function generateTestToken(id: string = TEST_USER_ID, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' = 'USER'): string {
  return jwt.sign({ id, role }, ACCESS_SECRET, { expiresIn: '1h' });
}

export function getUserAuthHeader(id: string = TEST_USER_ID): { Authorization: string } {
  return { Authorization: `Bearer ${generateTestToken(id, 'USER')}` };
}

export function getAdminAuthHeader(id: string = TEST_ADMIN_ID): { Authorization: string } {
  return { Authorization: `Bearer ${generateTestToken(id, 'ADMIN')}` };
}

export async function cleanupTestData() {
  // Disconnect prisma safely after tests
  try {
    await prisma.$disconnect();
  } catch {}
}
