**Plano de Implementação do Backend com Nest.js**

### 1. Visão Geral da Arquitetura (Recomendada)

Adote uma **arquitetura modular + Clean Architecture / DDD lite** para facilitar a manutenção e escalabilidade em hackathon.

- **Padrão**: NestJS + TypeScript
- **HTTP Adapter**: Fastify (mais performático que Express)
- **ORM**: Prisma (mais rápido para protótipos) ou TypeORM
- **Validação**: class-validator + class-transformer
- **Autenticação**: JWT + Refresh Token + Guards
- **Documentação**: Swagger (NestJS Swagger)
- **Queue**: BullMQ + Redis (para jobs assíncronos: relatórios, análise de IA, notificações)
- **Cache**: Redis
- **Logs**: Winston + Pino
- **Testes**: Jest

**Estrutura de Pastas (recomendada)**

```
/src
  /common          (filters, interceptors, guards, decorators)
  /config
  /modules
    /auth
    /users
    /businesses
    /financial-records
    /inventory
    /groups          (grupos de 10 pessoas)
    /invoices
    /payments
    /credit-analysis
    /reports
    /ai-analysis
  /shared          (services reutilizáveis)
  /database
  main.ts
```

### 2. Entidades Principais (Banco de Dados)

```prisma
// Exemplo com Prisma
model User {
  id            String   @id @default(cuid())
  phone         String   @unique
  name          String
  role          Role     // USER, ADMIN, GROUP_LEADER
  businesses    Business[]
  createdAt     DateTime @default(now())
}

model Business {
  id              String   @id @default(cuid())
  ownerId         String
  owner           User     @relation(fields: [ownerId], references: [id])
  name            String
  type            String   // "individual", "group", "zungueira", "taxi", etc.
  groupId         String?
  group           Group?
  isFormal        Boolean  @default(false)
  taxId           String?  // NIF / AGT
  creditScore     Int      @default(0)
  financialRecords FinancialRecord[]
  inventoryItems  InventoryItem[]
  invoices        Invoice[]
}

model Group {  // Até 10 membros
  id          String    @id @default(cuid())
  leaderId    String
  members     Business[] // ou User[]
  maxMembers  Int       @default(10)
  status      GroupStatus
}

model FinancialRecord {
  id          String   @id @default(cuid())
  businessId  String
  type        String   // INCOME / EXPENSE
  amount      Decimal
  category    String
  description String?
  date        DateTime
  receiptUrl  String?
  isVerified  Boolean  @default(false)
}

model InventoryItem {
  id           String   @id @default(cuid())
  businessId   String
  productName  String
  quantity     Int
  unitPrice    Decimal
  lastSaleDate DateTime?
  salesCount   Int      @default(0)
}

model Invoice {
  id           String   @id @default(cuid())
  businessId   String
  number       String   @unique
  amount       Decimal
  customerData Json?
  status       String
  pdfUrl       String?
  sentToAGT    Boolean  @default(false)
  createdAt    DateTime @default(now())
}
```

### 3. Módulos e Funcionalidades Principais

**Módulo Auth**
- Registro por telefone (OTP via SMS - usar Twilio ou serviço angolano)
- JWT + Refresh Token
- Roles + Policies (CASL ou custom)

**Módulo Businesses**
- CRUD
- Transformar em "formal" ao criar grupo ou ter registros mínimos
- Associação a grupos (máx 10)

**Módulo Financial Records**
- Registro de entradas/saídas (com upload de comprovativo)
- Dashboard: balanço, fluxo de caixa
- Importação de dados (CSV/Excel) → endpoint `/financial/import`

**Módulo Inventory**
- Controle em tempo real (WebSocket opcional)
- Análise preditiva (ver IA)

**Módulo Invoices**
- Geração de factura (PDF com pdf-lib ou @pdfme/generator)
- Exportação para AGT (preparar payload XML/JSON conforme formato AGT)
- Número de referência único

**Módulo Payments**
- Geração de referência de pagamento (para EMIS, Unitel Money, etc.)
- Webhooks de confirmação de pagamento
- Integração com gateway angolano (se disponível na API)

**Módulo Groups**
- Criar grupo, adicionar membros
- Relatórios consolidados do grupo (para facilitar financiamento)

**Módulo Credit Analysis**
- Cálculo de score baseado em:
  - Volume de transações
  - Regularidade
  - Razão corrente, liquidez
  - Histórico de pagamentos
- Exportar relatório PDF/JSON para bancos

**Módulo AI Analysis** (crítico para o projeto)
- Usar **NestJS + LangChain** ou chamadas diretas para:
  - Grok API / OpenAI / Claude / Llama local
- Análises:
  - Detecção de fraude (padrões anormais de transações)
  - Perfil de crédito (prompt estruturado)
  - Predição de stock (o que vende mais, quando repor)
  - Sugestões de produtos

Exemplo de service:
```ts
@Injectable()
export class AiService {
  async analyzeCredit(businessId: string) { ... }
  async predictStock(businessId: string) { ... }
  async detectFraud(records: FinancialRecord[]) { ... }
}
```

### 4. Fluxo de Implementação (Hackathon - Prioridades)

**Fase 1 (MVP - Dia 1)**
1. Setup do projeto NestJS + Prisma + PostgreSQL (ou SQLite para teste)
2. Módulos: Auth, Users, Businesses, Financial Records
3. CRUD básico + autenticação

**Fase 2 (Dia 1-2)**
4. Módulo Inventory + Invoices (geração PDF)
5. Geração de referências de pagamento
6. Módulo Groups

**Fase 3 (Dia 2-3)**
7. Credit Analysis (lógica simples + IA)
8. Export AGT (mock primeiro)
9. Anti-fraude básico + relatórios

**Fase 4 (Polimento)**
10. Redis + BullMQ
11. Swagger completo
12. Rate limiting + segurança
13. Docker + docker-compose

### 5. Tecnologias Recomendadas (Hackathon)

| Camada           | Tecnologia                     |
|------------------|--------------------------------|
| Banco            | PostgreSQL + Prisma            |
| Cache/Queue      | Redis + BullMQ                 |
| Armazenamento    | Supabase Storage ou AWS S3     |
| IA               | Grok API ou OpenAI             |
| PDF              | pdf-lib ou puppeteer           |
| Deploy           | Railway / Render / Fly.io      |

### 6. Boas Práticas Essenciais

- Usar **DTOs** em todos os endpoints
- **Exception Filters** personalizados
- **Interceptors** para transformar respostas
- **Pipes** de validação global
- Logging estruturado
- Config via `ConfigModule` (dotenv)
- Testes unitários nos services críticos (credit analysis e fraud)

### 7. Endpoints Principais (Exemplo)

- `POST /auth/login` (phone + OTP)
- `POST /businesses` + `/businesses/:id/records`
- `POST /invoices` + `/invoices/export-agt`
- `POST /groups`
- `POST /ai/credit-analysis/:businessId`
- `POST /financial/import`
- `GET /reports/group/:groupId`

---

**Próximos Passos Imediatos:**

1. Criar o projeto: `npx nest new backend --package-manager npm`
2. Instalar dependências principais:
   ```bash
   npm i prisma @prisma/client fastify @nestjs/platform-fastify class-validator class-transformer bullmq redis
   npm i -D prisma
   ```
3. Configurar Prisma + Swagger

Quer que eu gere agora o **código base completo** (estrutura de pastas + módulos principais) ou prefere focar primeiro em algum módulo específico (ex: Financial Records + Credit Analysis)?