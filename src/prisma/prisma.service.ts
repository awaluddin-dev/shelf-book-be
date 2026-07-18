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
      const caPath = process.env.CA_CERT_PATH || './certs/ca.pem';
      const fullPath = path.resolve(process.cwd(), caPath);

      // Pastikan file CA benar-benar ada agar aplikasi tidak crash
      if (!fs.existsSync(fullPath)) {
        throw new Error(
          `File Sertifikat CA tidak ditemukan di path: ${fullPath}`,
        );
      }

      sslConfig = {
        rejectUnauthorized: true, // Wajibkan sertifikat yang valid
        ca: fs.readFileSync(fullPath).toString(), // Muat CA dari Aiven
      };
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
