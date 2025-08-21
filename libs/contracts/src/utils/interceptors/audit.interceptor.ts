import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { UserType } from '../enums';

import { ToUsersAuditService } from '../../../../../apps/api-gateway/src/to-users/to-audit/to-users-audit.service';


@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly toUsersAuditService: ToUsersAuditService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //observable لان المعترض قد يعطي رد لدالة أو يعدل قيم observable
    const req = context.switchToHttp().getRequest();
    // Admin NOOOOOOOOOOOOOOOOOOOOOOt Super admin
    if (req['payload'].userType === UserType.ADMIN) {
      const adminId = req['payload'].id;
      const className = context.getClass().name;
      //
      const msg = `(Admin #${adminId}) requested the method ${context.getHandler().name} to affect the (${className.match(/[A-Z][a-z]*/)?.[0]} #${req.params.id})`;
      //
      const meta = {
        type: req.method,
        params: req.params,
        msg: msg,
        body: req.body,
        ip: req.ips && req.ips.length ? req.ips[0] : req.ip,
      };
      //next when use catch
      return next.handle().pipe(
        tap({
          next: () => {
            this.toUsersAuditService
              .create(adminId, meta)
              .catch((err) => console.error('Audit log error:', err));
          },
        }),
      );
    }
    return next.handle();
  }
}
