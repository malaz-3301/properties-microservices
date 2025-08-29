import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import * as process from 'node:process';
import { unlinkSync } from 'node:fs';

@Injectable()
export class UsersHttpMediaService {
  removePhysicalImage(profileImageName: string) {
    const imagePath = join(process.cwd(), `./images/users/${profileImageName}`);
    unlinkSync(imagePath); //delete
  }
}
