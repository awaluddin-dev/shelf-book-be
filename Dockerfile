FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN npx prisma generate
COPY . .
RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile --prod --ignore-scripts
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/src/main.js"]