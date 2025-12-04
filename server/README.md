# Backend - Dashboard de Clientes

API REST desenvolvida com Node.js, TypeScript, Express e Prisma para gerenciamento de eventos de vendas.

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_db?schema=public"
PORT=3001
```

## Executar Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Executar em Desenvolvimento

```bash
npm run dev
```

## Build para Produção

```bash
npm run build
npm start
```

## Endpoints Disponíveis

- `POST /api/events` - Criar evento via JSON
- `GET /api/events/add` - Criar evento via query params
- `GET /api/events` - Listar eventos com filtros
- `DELETE /api/events/:id` - Remover evento
- `GET /health` - Health check
