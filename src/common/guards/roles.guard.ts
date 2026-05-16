import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

const roleAliases: Record<string, string[]> = {
  END_USER: ['END_USER', 'USER', 'GROUP_LEADER'],
  ENTITY_USER: ['ENTITY_USER'],
  PLATFORM_ADMIN: ['PLATFORM_ADMIN', 'ADMIN'],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role;

    if (!userRole) {
      return false;
    }

    return requiredRoles.some((requiredRole) => {
      const allowedRoles = roleAliases[requiredRole] ?? [requiredRole];
      return allowedRoles.includes(userRole);
    });
  }
}