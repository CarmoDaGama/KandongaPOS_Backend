# Kandonga Backend

Plataforma digital que facilita o acesso a financiamento para micro e pequenas empresas em Angola, unindo registos financeiros, controlo de stock, POS, análise de crédito via IA e ligação direta com instituições financeiras.

## Visão Geral

O sistema permite que pequenos negócios (zungueiras, taxistas, mototaxistas, etc.) organizem as suas finanças, emitam facturas, controlem stock e peçam financiamento de forma simples e transparente. Instituições financeiras (bancos) podem analisar pedidos com suporte de IA e realizar pagamentos via GPO.

---

## Tipos de Utilizadores (Roles)

| Role                | Descrição                              | Principais Permissões |
|---------------------|----------------------------------------|-----------------------|
| **END_USER**        | Micro e pequenas empresas              | Gerir finanças, stock, POS, pedir crédito |
| **ENTITY_USER**     | Bancos e Instituições Financeiras      | Analisar e aprovar/recusar pedidos de crédito |
| **PLATFORM_ADMIN**  | Administrador da Plataforma            | Gerir utilizadores, visualizar logs e transações |

---

## Funcionalidades Principais

### End User
- Gestão de finanças (entradas e saídas)
- Controlo de stock em tempo real + análise preditiva IA
- Gestão de vendedores/POS
- Geração de facturas e exportação para AGT
- Criação de referências de pagamento (GPO)
- **Pedido de Crédito** com análise automática de IA
- Importação de dados financeiros existentes

### Entity User (Banco)
- Visualizar pedidos de crédito direcionados
- Análise completa: dados do utilizador, histórico, score IA
- Aprovar ou recusar pedido
- Realizar pagamento via GPO (com dedução da taxa da plataforma)

### Platform Admin
- Registar novas instituições financeiras (Entity Users)
- Aprovar ou rejeitar registos de End Users
# Kandonga Backend

Backend da plataforma Kandonga, focado em crédito para micro e pequenas empresas, registo financeiro, POS, inventário, facturação e integração com instituições financeiras.

## Visão Geral

O projeto está organizado em NestJS + Prisma + Fastify. A base atual já cobre autenticação JWT, utilizadores, negócios, registos financeiros e a estrutura inicial para crédito, entidades, logs e módulos de apoio.

## Roles

| Role | Descrição |
|---|---|
| `END_USER` | Micro e pequenas empresas |
| `ENTITY_USER` | Bancos e instituições financeiras |
| `PLATFORM_ADMIN` | Administrador da plataforma |

O schema também mantém compatibilidade com os papéis legados `USER`, `GROUP_LEADER` e `ADMIN`.

## Módulos

- `auth`
- `users`
- `businesses`
- `financial-records`
- `entities`
- `inventory`
- `pos`
- `credit-requests`
- `invoices`
- `groups`
- `ai-analysis`
- `platform-logs`
- `reports`

## Estado Atual

- Prisma já inclui `UserStatus`, `CreditStatus`, `EntityProfile`, `CreditRequest`, `ActivityLog` e `POSeller`.
- `Business` foi ajustado para expor `businessName`, `userId` e `nif`, com mapeamento compatível com a base existente.
- Existe um esqueleto funcional de `credit-requests` com controller, service e DTOs.
- Foram adicionados `Roles` decorator e `RolesGuard` em `src/common`.

## Arquitetura Técnica

- **Framework**: NestJS (TypeScript)
- **HTTP**: Fastify
- **Banco de Dados**: Prisma ORM
- **Autenticação**: JWT + Refresh Token
- **Validação**: class-validator
- **Documentação**: Swagger
- **IA**: pronto para integração com Grok / OpenAI / Claude
- **Armazenamento**: pronto para Supabase Storage ou S3

## Estrutura de Pastas

```bash
/src
  /common
    /decorators
    /guards
    /filters
    /interceptors
  /modules
    auth
    users
    businesses
    financial-records
    entities
    inventory
    pos
    credit-requests
    invoices
    groups
    ai-analysis
    platform-logs
    reports
  /database
  /shared
/prisma
```

## Próximos Passos Naturais

1. Implementar regras de negócio nos módulos novos, começando por `credit-requests`.
2. Ligar guards por role nos endpoints administrativos e de entidades.
3. Adicionar filas/IA/webhooks e depois migrar a base para PostgreSQL quando a infraestrutura estiver pronta.