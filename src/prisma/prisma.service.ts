import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { ConnectionOptions } from 'tls';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  // Config log query (Opsional: bagus untuk debugging)
  constructor() {
    let sslConfig: boolean | ConnectionOptions = false;

    if (process.env.DB_REQUIRE_SSL === 'true') {
      if (process.env.DATABASE_CA) {
        // Baca dari env var (base64 encoded)
        sslConfig = {
          rejectUnauthorized: true,
          ca: Buffer.from(process.env.DATABASE_CA, 'base64').toString('utf-8'),
        };
      } else if (process.env.CA_CERT_PATH) {
        // Fallback ke file kalau ada
        const fullPath = path.resolve(process.cwd(), process.env.CA_CERT_PATH);
        if (!fs.existsSync(fullPath)) {
          throw new Error(`File CA tidak ditemukan: ${fullPath}`);
        }
        sslConfig = {
          rejectUnauthorized: true,
          ca: fs.readFileSync(fullPath).toString(),
        };
      } else {
        // Fallback: SSL tanpa verify CA
        sslConfig = { rejectUnauthorized: false };
      }
    }
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({
      connectionString,
      ssl: sslConfig,
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter,
      log: ['info', 'warn', 'error'], // Lihat query apa yang dijalankan (kecuali 'query' yang bikin spam)
    });
  }

  async onModuleInit() {
    // Saat aplikasi nyala, connect ke DB
    await this.$connect();
  }

  async onModuleDestroy() {
    // Saat aplikasi mati, putus koneksi biar tidak memory leak
    await this.$disconnect();
    await this.pool.end();
  }
}
