import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesGetProvider } from './properties-get.provider';

import * as sharp from 'sharp';
import { UserType } from '@malaz/contracts/utils/enums';

@Injectable()
export class PropertiesImgProvider {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly propertiesGetProvider: PropertiesGetProvider,
  ) {}

  async analyzeImage(buffer: Buffer): Promise<Buffer> {
    try {
      // تحويل الصورة إلى JPEG أولًا
      buffer = await sharp(buffer).jpeg().toBuffer();

      // التحقق من التنسيق
      const metadata = await sharp(buffer).metadata();
      if (metadata.format !== 'jpeg') {
        throw new Error('الصورة يجب أن تكون JPEG');
      }

      // إعادة الضغط بجودة منخفضة (50%)
      const compressedImage = await sharp(buffer)
        .jpeg({ quality: 50 })
        .toBuffer();

      // الحصول على بيانات البكسل للصورتين
      const originalPixels = await this.getPixelData(buffer);
      const compressedPixels = await this.getPixelData(compressedImage);

      // حساب الفروق بين البكسلات
      const diff = new Uint8ClampedArray(originalPixels.length);
      for (let i = 0; i < originalPixels.length; i += 3) {
        diff[i] = Math.abs(originalPixels[i] - compressedPixels[i]);
        diff[i + 1] = Math.abs(originalPixels[i + 1] - compressedPixels[i + 1]);
        diff[i + 2] = Math.abs(originalPixels[i + 2] - compressedPixels[i + 2]);
      }

      // إنشاء صورة ELA الناتجة
      const elaImage = await sharp(diff, {
        raw: {
          width: metadata.width,
          height: metadata.height,
          channels: 3,
        },
      })
        .png()
        .toBuffer();

      return elaImage;
    } catch (error) {
      throw new Error(`فشل في التحليل: ${error.message}`);
    }
  }

  private async getPixelData(buffer: Buffer): Promise<Uint8ClampedArray> {
    const { data, info } = await sharp(buffer)
      .raw() // لا نضيف قناة Alpha
      .toBuffer({ resolveWithObject: true });
    return new Uint8ClampedArray(data.buffer);
  }

  async setSingleImg(id: number, userId: number, filename: string) {
    const pro = (await this.propertiesGetProvider.getProByUser(
      id,
      userId,
      UserType.Owner,
    ))!;

    pro.propertyImage = filename;
    await this.propertyRepository.save(pro);
    //   return { message: `File uploaded successfully :  ${file.filename}` };
    return filename;
  }

  async setMultiImg(id: number, userId: number, filenames: string[]) {
    const pro = (await this.propertiesGetProvider.getProByUser(
      id,
      userId,
      UserType.Owner,
    ))!;

    await this.propertyRepository.save({
      ...pro,
      firstImage: filenames?.[0],
      propertyImages: filenames,
    });
    return {
      message: `File uploaded successfully :  ${filenames}`,
    };
  }

  //حذف اي صورة من العقار
  async removeAnyImg(id: number, userId: number, imageName: string) {
    return this.propertyRepository.update(id, {
      propertyImage: null,
    });
  }

  async setMultiPanorama(
    id: number,
    userId: number,
    panoramaNames: string[],
    filenames: string[],
  ) {
    const pro = await this.propertiesGetProvider.getProByUser(
      id,
      userId,
      UserType.Owner,
    );

    //تهيئة ال record
    const panoramaImages: Record<string, string> = panoramaNames.reduce(
      (acc, pN, i) => {
        acc[pN] = filenames[i];
        return acc;
      },
      {
        /*قيمة ابتدائية*/
      },
    );

    await this.propertyRepository.save({
      ...pro,
      panoramaImages: panoramaImages,
    });
    return {
      message: `File uploaded successfully :  ${filenames}`,
    };
  }

  /*  async removeSingleImage(id: number, userId: number) {
      const pro = await this.propertiesGetProvider.getProByOwner(id, userId);
      if (!pro.propertyImage) {
        throw new BadRequestException('User does not have image');
      }
      //current working directory
      const imagePath = join(
        process.cwd(),
        `./images/properties/${pro.propertyImage}`,
      );
      unlinkSync(imagePath); //delete
      pro.propertyImage = null;
      return this.propertyRepository.save(pro);
    }*/
}
