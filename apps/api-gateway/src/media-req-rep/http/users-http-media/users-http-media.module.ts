import { BadRequestException, Module } from '@nestjs/common';
import { UsersHttpMediaService } from './users-http-media.service';
import { UsersHttpMediaController } from './users-http-media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import e, { Express } from 'express';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images/users',
        filename(
          req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 10000)}`;
          const filename = `${prefix}-${file.originalname}`.replace(
            /[\s,]/g,
            '',
          );
          callback(null, filename);
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype.startsWith('image')) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Unsupported Media Type'), false);
        }
        console.log('stored');
        //لا تنسى المعالجة
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  ],
  controllers: [UsersHttpMediaController],
  providers: [UsersHttpMediaService],
})
export class UsersHttpMediaModule {}
