# Portfolio Backend API

Backend RESTful API untuk aplikasi portfolio interaktif, dibangun menggunakan **NestJS**, **Fastify**, dan **PostgreSQL** (Prisma ORM). Backend ini sebelumnya merupakan sistem e-wallet (LedgerFlow) yang telah direfactor menjadi CMS headless untuk *personal portfolio*.

## Architecture & Tech Stack

- **Framework**: NestJS (Fastify Adapter)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Aiven for Production / Docker for Local)
- **ORM**: Prisma v7
- **Caching & Auth Storage**: Redis
- **Security**: Argon2 (Password Hashing), JWT (Access Tokens)
- **API Documentation**: Swagger UI

## Key Features

1. **Portfolio Content Management**
   Menyediakan endpoint CRUD yang tersentralisasi untuk mengelola konfigurasi halaman depan (Hero), Work Experience, Projects, Skills, Roadmap, dan Testimonials. Seluruh data disimpan rapi dalam skema relasional PostgreSQL.

2. **Secure Admin Authentication**
   Seluruh rute mutasi data (POST, PUT, DELETE, PATCH) dilindungi dengan **JWT Guard**. Hanya sesi admin terautentikasi yang dapat mengubah konten website.

3. **Fastify Engine**
   Berjalan di atas Fastify (bukan Express) untuk menjamin latensi yang sangat rendah saat *frontend* melakukan `fetch()` data secara paralel.

## Prerequisites

Sebelum menjalankan project ini di komputer Anda, pastikan Anda telah menginstal:
- Node.js (v18 atau lebih baru)
- pnpm (rekomendasi *package manager*)
- Docker & Docker Compose (untuk database lokal)

## Getting Started

1. **Jalankan Database Lokal (PostgreSQL & Redis)**
   Gunakan docker-compose yang tersedia untuk menyalakan database lokal di *background*:
   ```bash
   docker-compose up -d
   ```

2. **Konfigurasi Environment Variables**
   Salin `.env.example` ke `.env` (atau pastikan file `.env` sudah ada). 
   ```env
   DATABASE_URL="postgresql://admin:admin123@localhost:5432/portfolio-prod?sslmode=disable"
   REDIS_URL="redis://localhost:6379"
   JWT_SECRET="rahasia_admin"
   ```

3. **Install Dependencies & Sinkronisasi Database**
   ```bash
   # Install paket node_modules
   pnpm install

   # Generate Prisma Client (sangat penting setelah update skema)
   npx prisma generate

   # Sinkronisasi tabel ke database PostgreSQL lokal
   npx prisma db push
   ```

4. **Jalankan Aplikasi**
   ```bash
   pnpm run start:dev
   ```
   Backend Anda akan berjalan pada port `3000`.

## API Documentation

Setelah server berjalan, Anda dapat melihat seluruh daftar rute API (Auth & Portfolio) dan mengujinya melalui antarmuka Swagger UI di:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

## License
MIT License
