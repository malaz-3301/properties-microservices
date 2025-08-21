import { Injectable } from '@nestjs/common';

@Injectable()
export class ToUsersAuditService {
  //للاستكمال اجباري async
  //هي الcreate من الـ interceptor
  async create(adminId: number, meta: any){

  }
}
