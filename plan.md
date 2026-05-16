**✅ PLANO ATUALIZADO DO BACKEND – KANDONGA**  
**Tecnologia:** Nest.js + TypeScript

### 1. Visão Geral da Arquitetura

- **Framework:** NestJS (com Fastify)
- **ORM:** Prisma + PostgreSQL
- **Autenticação:** JWT + Refresh Token + Role-based Guards
- **Validação:** class-validator + DTOs
- **Documentação:** Swagger
- **Filas:** BullMQ + Redis
- **Cache:** Redis
- **IA:** Integração com Grok API / OpenAI / Claude (via LangChain ou HTTP)
- **Armazenamento:** Supabase ou MinIO (comprovativos, PDFs)
- **Pagamentos:** Mock + preparação para GPO (webhooks)

**Estrutura de Pastas (Clean Architecture)**

```
/src
  /common
    /decorators
    /filters
    /guards
    /interceptors
  /config
  /modules
    ├── auth
    ├── users
    ├── entities          (Bancos e Instituições Financeiras)
    ├── businesses        (Perfil das micro empresas)
    ├── pos               (Gestão de vendedores)
    ├── financial-records
    ├── inventory
    ├── credit-requests   ← Novo e prioritário
    ├── invoices
    ├── groups
    ├── platform-logs
    ├── ai-analysis
    └── reports
  /shared
  prisma/
  main.ts
```

### 2. Modelo de Dados (Prisma Schema – Principal)

```prisma
enum Role {
  END_USER
  ENTITY_USER
  PLATFORM_ADMIN
}

enum UserStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum CreditStatus {
  PENDING
  AI_ANALYZED
  APPROVED
  REJECTED
  PAID
}

model User {
  id              String        @id @default(cuid())
  phone           String        @unique
  name            String
  email           String?
  role            Role
  status          UserStatus    @default(PENDING)
  createdAt       DateTime      @default(now())

  business        Business?
  entityProfile   EntityProfile?
  creditRequestsAsEndUser   CreditRequest[] @relation("EndUserRequests")
  creditRequestsAsEntity    CreditRequest[] @relation("EntityRequests")
  logs            ActivityLog[]
}

model EntityProfile {           // Banco / Instituição
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  institutionName   String
  nif               String   @unique
  licenseNumber     String
  isActive          Boolean  @default(true)
}

model Business {                // Perfil da micro empresa (End User)
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  businessName    String
  type            String   // zungueira, taxi, loja, etc.
  groupId         String?
  group           Group?
  nif             String?
  creditScore     Int      @default(0)
  totalRevenue    Decimal  @default(0)
}

model CreditRequest {
  id              String       @id @default(cuid())
  endUserId       String
  endUser         User         @relation("EndUserRequests", fields: [endUserId], references: [id])
  entityUserId    String
  entityUser      User         @relation("EntityRequests", fields: [entityUserId], references: [id])

  amount          Decimal
  purpose         String
  status          CreditStatus @default(PENDING)
  aiAnalysis      Json?        // Resultado completo da IA
  aiScore         Float?
  platformFee     Decimal      @default(0)
  paymentRef      String?      // Referência GPO
  reviewedAt      DateTime?
  reviewedById    String?

  createdAt       DateTime     @default(now())
}

model ActivityLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  action      String
  details     Json?
  createdAt   DateTime @default(now())
}
```

(Inclua também os modelos anteriores: `FinancialRecord`, `InventoryItem`, `Invoice`, `Group`, `POSeller`, etc.)

### 3. Módulos e Responsabilidades

| Módulo                | Principais Responsabilidades |
|-----------------------|------------------------------|
| **auth**              | Login com telefone + OTP, JWT, Role Guards |
| **users**             | CRUD, aprovação de registo (Admin) |
| **entities**          | Cadastro e gestão de Bancos (só Admin) |
| **businesses**        | Perfil da empresa do End User |
| **pos**               | Gestão de vendedores/caixas do negócio |
| **financial-records** | Entradas, saídas, balanço, importação |
| **inventory**         | Stock + IA preditiva |
| **credit-requests**   | **Módulo mais importante** – criação, análise IA, aprovação |
| **ai-analysis**       | Análise de crédito, fraude, predição de stock |
| **invoices**          | Facturas + exportação AGT |
| **groups**            | Grupos de até 10 membros |
| **platform-logs**     | Logs para Admin |
| **reports**           | Relatórios por role |

### 4. Fluxos Principais Implementados

**Fluxo de Crédito (Core Feature):**

1. End User → `POST /credit-requests` (escolhe banco)
2. Sistema → Executa IA automaticamente (`ai-analysis/credit`)
3. Se score baixo → Rejeição automática
4. Se score bom → Pedido vai para o Entity User
5. Entity User → Analisa + Aprova/Recusa
6. Aprovação → Gerar referência GPO + deduzir fee da plataforma
7. Webhook GPO → Atualizar status para `PAID`

### 5. Plano de Implementação (Hackathon – 3 dias)

**Dia 1 (Fundação)**
- Setup NestJS + Prisma + Fastify + Swagger
- Módulos: `auth`, `users`, `entities`
- Roles + Guards
- Modelos principais + migrações

**Dia 2 (Core)**
- `businesses`, `financial-records`, `inventory`, `pos`
- `credit-requests` + integração IA básica
- Geração de facturas e referências de pagamento

**Dia 3 (Finalização)**
- Módulo Admin (logs, visualização de transações, saldo)
- Grupos + exportação AGT
- Anti-fraude + análise preditiva
- Testes + Documentação Swagger
- Docker + README

### 6. Tecnologias Recomendadas

- **Banco:** PostgreSQL
- **Fila:** BullMQ + Redis (análise IA, relatórios, notificações)
- **PDF:** `pdf-lib` ou Puppeteer
- **IA:** Grok API (preferencial) ou OpenAI
- **Deploy:** Railway ou Render (suporta Redis)

### 7. Segurança e Boas Práticas

- Cada role só acessa o que deve (Policy-based authorization)
- Rate limiting por IP e por user
- Validação rigorosa em todos os DTOs
- Logs de auditoria (ActivityLog)
- Exception filters personalizados
- Config via `ConfigModule` (.env)

---

**Quer que eu gere agora algum dos seguintes itens?**

1. **Schema Prisma completo** (todo o arquivo `schema.prisma`)
2. **Estrutura detalhada do módulo `credit-requests`** (controller, service, dto)
3. **Código base de todos os módulos** (arquitetura inicial)
4. **DTOs principais** + Guards de Role

Diga-me qual parte quer ver primeiro ou se prefere o plano ainda mais detalhado em alguma área específica.