# Autorização por Roles (RBAC)

Este documento descreve como usar o sistema de autorização baseado em roles do Kandonga Backend.

## Roles Disponíveis

- `END_USER`: Micro e pequenas empresas
- `ENTITY_USER`: Bancos e instituições financeiras
- `PLATFORM_ADMIN`: Administrador da plataforma

O schema também mantém compatibilidade com roles legados:
- `USER`
- `GROUP_LEADER`
- `ADMIN`

## Usar Roles Guard em Endpoints

### 1. Importar o decorator e guard nos controllers

```typescript
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
```

### 2. Aplicar o decorator e guard nos endpoints

```typescript
@Controller('entities')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EntitiesController {
  
  @Get()
  @Roles('ENTITY_USER', 'PLATFORM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar entidades (apenas para Entity Users e Admins)' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Delete(':id')
  @Roles('PLATFORM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar entidade (apenas para Admins)' })
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
```

### 3. No Swagger

Quando usas `@Roles()` e `@ApiBearerAuth()`, o Swagger automaticamente documenta que o endpoint requer autenticação JWT.

## UserStatus

Além do role, os utilizadores têm um `status`:

- `PENDING`: Aguardando aprovação
- `APPROVED`: Aprovado pelo admin
- `REJECTED`: Rejeitado
- `SUSPENDED`: Suspenso

O serviço de autenticação já valida se o utilizador está `REJECTED` ou `SUSPENDED`, lançando erro `UnauthorizedException`.

## Fluxo de Autorização

1. Utilizador faz login via `POST /auth/signin`
2. Recebe JWT com `sub: userId`
3. JwtStrategy valida o token e carrega o utilizador inteiro (incluindo role e status)
4. Se role está bloqueado, retorna erro
5. Se o endpoint tem `@Roles()`, RolesGuard verifica se o role do utilizador está permitido
6. Requisição prossegue ou retorna 403 Forbidden

## Exemplo Completo: Módulo de Entidades

```typescript
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';

@ApiTags('Entities')
@Controller('entities')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

  @Post()
  @Roles('PLATFORM_ADMIN')
  @ApiOperation({ summary: 'Registar nova instituição financeira' })
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @Get()
  @Roles('ENTITY_USER', 'PLATFORM_ADMIN')
  @ApiOperation({ summary: 'Listar instituições' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  @Roles('ENTITY_USER', 'PLATFORM_ADMIN')
  @ApiOperation({ summary: 'Obter detalhes de instituição' })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Delete(':id')
  @Roles('PLATFORM_ADMIN')
  @ApiOperation({ summary: 'Deletar instituição' })
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
```

## Aliasing

O RolesGuard implementa aliasing automático para manter compatibilidade:

- `END_USER`: permite `END_USER`, `USER`, `GROUP_LEADER`
- `ENTITY_USER`: permite só `ENTITY_USER`
- `PLATFORM_ADMIN`: permite `PLATFORM_ADMIN`, `ADMIN`

Assim, qualquer role legado continua a funcionar sem refactor.

## Próximos Passos

- Implementar guards mais granulares (ex: ownership checks)
- Adicionar permissões policy-based
- Integrar com subscription/pricing plans
