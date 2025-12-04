# Dashboard de Clientes

Sistema completo de dashboard para acompanhamento de vendas e upsells, desenvolvido com Node.js, TypeScript, React e PostgreSQL.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com TypeScript
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **Zod** - Validação de dados

### Frontend
- **React 19** com TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- PostgreSQL 14.x ou superior
- pnpm (recomendado) ou npm

## 🔧 Instalação

### Opção 1: Instalação Automática (Recomendado)

```bash
# Execute o script de instalação
./setup.sh
```

### Opção 2: Instalação Manual

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd teste-directcash
```

#### 2. Configurar o Backend

```bash
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dashboard_db?schema=public"
PORT=3001
```

### 3. Configurar o Banco de Dados

```bash
# Criar o banco de dados e executar migrations
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

### 4. Configurar o Frontend

```bash
cd ../client

# Instalar dependências
npm install
```

## ▶️ Executando o Projeto

### Backend

```bash
cd server
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

```bash
cd client
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📡 Endpoints da API

### POST /api/events
Registra um novo evento de compra via JSON.

**Body:**
```json
{
  "type": "payment",
  "name": "John Doe",
  "email": "john@example.com",
  "value": 97.00,
  "timestamp": "2025-12-01T14:20:00Z"
}
```

**Resposta:** `201 Created`

---

### GET /api/events/add
Registra um novo evento de compra via query params.

**Exemplo:**
```
GET /api/events/add?type=payment&name=John&email=john@test.com&value=97.00&timestamp=2025-12-01T14:20:00Z
```

**Resposta:** `201 Created`

---

### GET /api/events
Lista eventos filtrados por data.

**Query Params:**
- `date_from` (opcional): Data inicial no formato YYYY-MM-DD
- `date_to` (opcional): Data final no formato YYYY-MM-DD

Se não informado, retorna os últimos 7 dias.

**Exemplo:**
```
GET /api/events?date_from=2025-12-01&date_to=2025-12-31
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "type": "payment",
    "name": "John Doe",
    "email": "john@example.com",
    "value": 97.00,
    "timestamp": "2025-12-01T14:20:00Z",
    "createdAt": "2025-12-01T14:20:00Z"
  }
]
```

---

### DELETE /api/events/:id
Remove um evento específico.

**Exemplo:**
```
DELETE /api/events/uuid-do-evento
```

**Resposta:** `204 No Content`

## 🎨 Funcionalidades do Dashboard

### Estatísticas em Tempo Real
- **Receita Total**: Soma de todas as vendas e upsells
- **Total de Vendas**: Contador de eventos do tipo `payment`
- **Total de Upsells**: Contador de eventos do tipo `upsell`

### Filtros
- Filtro por intervalo de datas (data inicial e final)
- Botão de atualização manual
- Padrão: últimos 7 dias se não houver filtro

### Tabela de Eventos
- Listagem completa de eventos
- Colunas: Tipo, Nome, E-mail, Valor, Data da Compra, Ações
- Formatação monetária em BRL
- Badges coloridos para diferenciar vendas e upsells
- Botão de exclusão para cada evento
- Design responsivo

## 🏗️ Arquitetura

### Backend
```
server/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── index.ts               # Entrada da aplicação
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma
│   ├── routes/
│   │   └── events.ts          # Rotas de eventos
│   └── schemas/
│       └── event.schema.ts    # Validação com Zod
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json
└── tsconfig.json
```

### Frontend
```
client/
├── src/
│   ├── components/
│   │   └── Dashboard.tsx      # Componente principal
│   ├── services/
│   │   └── api.ts             # Cliente API
│   ├── types/
│   │   └── event.ts           # Tipos TypeScript
│   ├── App.tsx                # Componente raiz
│   ├── index.css              # Diretivas TailwindCSS
│   └── main.tsx               # Entrada da aplicação
├── tailwind.config.js         # Configuração TailwindCSS
├── postcss.config.js          # Configuração PostCSS
├── package.json
└── tsconfig.json
```

## 🔒 Validações

- **type**: Aceita apenas `payment` ou `upsell`
- **name**: Campo obrigatório, string não vazia
- **email**: Formato de email válido
- **value**: Número positivo
- **timestamp**: ISO 8601 datetime (opcional, usa data atual se não fornecido)

## 🧪 Testando a API

### Usando cURL

```bash
# POST - Criar evento via JSON
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "value": 150.00
  }'

# GET - Criar evento via query params
curl "http://localhost:3001/api/events/add?type=upsell&name=João&email=joao@test.com&value=50.00"

# GET - Listar eventos
curl "http://localhost:3001/api/events?date_from=2025-12-01&date_to=2025-12-31"

# DELETE - Remover evento
curl -X DELETE http://localhost:3001/api/events/uuid-do-evento
```

## 📦 Build para Produção

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## 🎯 Boas Práticas Implementadas

1. **Separação de responsabilidades**: Rotas, schemas e lógica de negócio separados
2. **Validação robusta**: Uso de Zod para validação de entrada
3. **Tratamento de erros**: Respostas apropriadas para diferentes tipos de erro
4. **TypeScript**: Tipagem forte em todo o código
5. **Design moderno**: Interface limpa e responsiva com TailwindCSS
6. **Código limpo**: Sem comentários desnecessários, código autoexplicativo
7. **Performance**: Índices no banco de dados para queries otimizadas
8. **Utility-first CSS**: TailwindCSS para estilização rápida e consistente

**Solução**: Execute `npm install` nos diretórios `server` e `client`. Todos os erros serão resolvidos automaticamente após a instalação das dependências.

## 📝 Licença

Este projeto foi desenvolvido como teste técnico.
