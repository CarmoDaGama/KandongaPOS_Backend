# Resumo das Alterações: Autenticação & Swagger

Data: 16 Maio 2026

## Autenticação (JWT + Roles)

### Mudanças no Schema

1. **User Status**: Adicionado campo `status` com enum `UserStatus`:
   - `PENDING` - Aguardando aprovação
   - `APPROVED` - Aprovado
   - `REJECTED` - Rejeitado
   - `SUSPENDED` - Suspenso

2. **Novos Roles**: Adicionados aos enum `Role`:
   - `END_USER` - Micro e pequenas empresas (padrão novo)
   - `ENTITY_USER` - Bancos e instituições
   - `PLATFORM_ADMIN` - Administrador

3. **Autorização por Guard**: 
   - Adicionado `src/common/decorators/roles.decorator.ts`
   - Adicionado `src/common/guards/roles.guard.ts`
   - Suporta aliasing: `END_USER` → `[END_USER, USER, GROUP_LEADER]`

### Mudanças nos Serviços

- **auth.service.ts**: Agora valida `status` (rejeita `REJECTED` ou `SUSPENDED`)
- **auth.service.ts**: Todas as respostas (signUp, signIn, refreshToken) incluem `status`
- **auth.module.ts**: Exporta `JwtModule` para uso em outros módulos

### Fluxo de Validação

1. Utilizador envia credenciais a `POST /auth/signin`
2. JWT gerado com `sub: userId`
3. JwtStrategy carrega utilizador inteiro (role + status)
4. Se status é bloqueado, retorna erro 401
5. Se endpoint tem `@Roles()`, RolesGuard verifica permissão
6. Se role inválido, retorna 403 Forbidden

## Swagger (Documentação)

### DTOs Atualizados com Descrições

1. **AuthResponseDto**: 
   - Adicionado `status` no exemplo
   - Agora documenta o novo campo

2. **CreateBusinessDto**:
   - Adicionadas descrições em português para cada campo
   - `businessName`: Nome do negócio
   - `type`: Tipo (individual, group, zungueira, taxi, etc.)
   - `nif`: Número de Identificação Fiscal

3. **UpdateBusinessDto**: 
   - Descrições alinhadas com CreateBusinessDto

4. **CreateCreditRequestDto**:
   - `entityUserId`: ID do banco/instituição
   - `businessId`: ID do negócio (opcional)
   - `amount`: Valor em Kwanzas
   - `purpose`: Finalidade do crédito

5. **ReviewCreditRequestDto**:
   - `status`: Decisão do banco
   - `aiScore`: Score de análise IA (0-100)
   - `paymentRef`: Referência de pagamento GPO

### Endpoints com Documentação Clara

- `POST /auth/signup`: Sem autenticação obrigatória
- `POST /auth/signin`: Sem autenticação obrigatória
- `POST /auth/refresh`: Sem autenticação obrigatória
- `POST /users`: Criação sem autenticação (admin pode verificar depois)
- `GET /users`: Requer autenticação JWT
- `PATCH /users/:id`: Requer autenticação JWT
- `DELETE /users/:id`: Requer autenticação JWT
- `POST /credit-requests`: Requer autenticação JWT
- `GET /credit-requests`: Requer autenticação JWT
- `PATCH /credit-requests/:id/review`: Requer autenticação JWT

### Decoradores Aplicados

- `@ApiBearerAuth()`: Em todos os endpoints protegidos
- `@ApiTags()`: Agrupando por domínio (Auth, Users, Businesses, etc.)
- `@ApiOperation()`: Descrevendo o que cada endpoint faz
- `@ApiProperty()`: Documentando cada campo de DTO

## Ficheiros Criados/Atualizados

### Novos
- `src/common/decorators/roles.decorator.ts`
- `src/common/guards/roles.guard.ts`
- `src/common/AUTHORIZATION.md` (guia completo de autorização)

### Modificados
- `src/modules/auth/auth.service.ts` (status validation + responses)
- `src/modules/auth/auth.module.ts` (export JwtModule)
- `src/modules/auth/auth.controller.ts` (descrições melhoradas)
- `src/modules/auth/dto/auth-response.dto.ts` (status field)
- `src/modules/auth/dto/auth.dto.ts` (descriptions)
- `src/modules/businesses/dto/business.dto.ts` (field descriptions)
- `src/modules/credit-requests/dto/credit-request.dto.ts` (detailed descriptions)
- `src/modules/users/users.controller.ts` (descriptions)
- `prisma/schema.prisma` (UserStatus enum, new relations)

## Validação

✅ `prisma validate` - Schema válido
✅ `prisma generate` - Tipos TypeScript gerados
✅ `npm run build` - Sem erros TypeScript

## Próximos Passos

1. Aplicar `@Roles()` guards em endpoints administrativos (entities, platform-logs)
2. Implementar middleware/interceptor para logar atividades em ActivityLog
3. Adicionar middleware de rate-limiting
4. Integração com IA para análise de crédito automática
5. Webhooks para atualizações de pagamento (GPO)

---

## Como Usar o Sistema de Roles

Ver `src/common/AUTHORIZATION.md` para exemplos completos.

Resumo rápido:

```typescript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ENTITY_USER', 'PLATFORM_ADMIN')
@ApiBearerAuth()
@Get('entities')
findEntities() { /* ... */ }
```
