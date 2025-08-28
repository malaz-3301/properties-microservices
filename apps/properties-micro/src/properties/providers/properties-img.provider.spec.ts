/**
 * properties-img.provider.spec.ts
 */
import { Test, TestingModule } from '@nestjs/testing';

// mock fs BEFORE importing code under test
jest.mock('node:fs', () => {
  const real = jest.requireActual('node:fs');
  return {
    ...real,
    readFileSync: jest.fn(),
    unlinkSync: jest.fn(),
  };
});

// mock sharp BEFORE importing code under test
jest.mock('sharp', () =>
  jest.fn((input: any, options?: any) => {
    return {
      // For .jpeg().toBuffer()
      jpeg: (opts?: any) => ({
        toBuffer: async () => Buffer.from('jpegBuf'),
      }),
      // For .metadata()
      metadata: async () => ({ format: 'jpeg', width: 2, height: 1 }),
      // For .raw().toBuffer({resolveWithObject:true})
      raw: () => ({
        toBuffer: async (arg?: any) => ({
          data: Buffer.from([10, 20, 30, 40, 50, 60]),
          info: { width: 2, height: 1, channels: 3 },
        }),
      }),
      // For creating ela image from diff: sharp(diff, {raw:...}).png().toBuffer()
      png: () => ({
        toBuffer: async () => Buffer.from('elaBuf'),
      }),
    };
  }),
);

import * as fs from 'node:fs';
import { join } from 'node:path';
import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';

import { PropertiesImgProvider } from './properties-img.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { PropertiesGetProvider } from './properties-get.provider';

describe('PropertiesImgProvider', () => {
  let provider: PropertiesImgProvider;
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockSave = jest.fn();

  const mockPropertyRepo = {
    save: mockSave,
  };

  const mockGetProvider = {
    getProByUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesImgProvider,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepo,
        },
        {
          provide: PropertiesGetProvider,
          useValue: mockGetProvider,
        },
      ],
    }).compile();

    provider = module.get<PropertiesImgProvider>(PropertiesImgProvider);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('analyzeImage', () => {
    it('should produce an ELA buffer when provided with a jpeg buffer', async () => {
      // stub private getPixelData to return two different pixel arrays
      (provider as any).getPixelData = jest
        .fn()
        .mockResolvedValueOnce(new Uint8ClampedArray([100, 100, 100, 120, 120, 120]))
        .mockResolvedValueOnce(new Uint8ClampedArray([90, 90, 90, 100, 100, 100]));

      const input = Buffer.from('someimage');
      const result = await provider.analyzeImage(input);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe('elaBuf'); // from our sharp mock png().toBuffer()
      expect((provider as any).getPixelData).toHaveBeenCalledTimes(2);
    });

    it('should throw an error with message when analysis fails', async () => {
      // make getPixelData throw
      (provider as any).getPixelData = jest.fn().mockRejectedValue(new Error('pixel fail'));

      await expect(provider.analyzeImage(Buffer.from('x'))).rejects.toThrow('فشل في التحليل: pixel fail');
    });
  });

  describe('setSingleImg', () => {
    const fakeFile = { path: '/tmp/file.jpg', filename: 'file.jpg' } as Express.Multer.File;

    it('should save property image, delete old image if present and return elaImage + filename', async () => {
      const pro: any = {
        id: 1,
        propertyImage: 'old.jpg',
        propertyImages: ['a.jpg'],
      };

      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);

      // mock reading file
      mockedFs.readFileSync.mockReturnValue(Buffer.from('file-buffer'));

      // stub analyzeImage to return ela buffer
      jest.spyOn(provider as any, 'analyzeImage').mockResolvedValue(Buffer.from('ela-data'));

      mockSave.mockResolvedValueOnce({ ...pro, propertyImage: fakeFile.filename });

      const res = await provider.setSingleImg(1, 2, fakeFile);

      expect(mockGetProvider.getProByUser).toHaveBeenCalledWith(1, 2, expect.anything());
      // unlinkSync should have been called to remove old image
      expect((fs.unlinkSync as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      // saved with updated filename
      expect(mockSave).toHaveBeenCalled();
      expect(res).toHaveProperty('message', 'File uploaded successfully');
      expect(res).toHaveProperty('filename', fakeFile.filename);
      expect(res).toHaveProperty('elaImage');
      expect((provider as any).analyzeImage).toHaveBeenCalled();
    });

    it('should throw RpcException when property not found', async () => {
      mockGetProvider.getProByUser.mockResolvedValueOnce(null);

      await expect(provider.setSingleImg(99, 1, fakeFile)).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('setMultiImg', () => {
    it('should append filenames if under limit and save', async () => {
      const pro: any = {
        id: 2,
        propertyImages: ['1.jpg', '2.jpg'],
      };

      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);
      mockSave.mockResolvedValueOnce({ ...pro, propertyImages: ['1.jpg', '2.jpg', '3.jpg'] });

      const res = await provider.setMultiImg(2, 5, ['3.jpg']);

      expect(mockGetProvider.getProByUser).toHaveBeenCalledWith(2, 5, expect.anything());
      expect(mockSave).toHaveBeenCalled();
      expect(res).toHaveProperty('message');
    });

    it('should delete oldest files when total exceeds 8', async () => {
      // create 8 existing + add 3 new => total 11 -> delete 3 oldest
      const existing = ['p1.jpg', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg', 'p6.jpg', 'p7.jpg', 'p8.jpg'];
      const pro: any = {
        id: 3,
        propertyImages: [...existing],
      };

      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);
      mockSave.mockResolvedValueOnce({ ...pro, propertyImages: [] });

      const newFiles = ['n1.jpg', 'n2.jpg', 'n3.jpg'];

      const res = await provider.setMultiImg(3, 7, newFiles);

      // should have attempted to unlink the first 3 files
      const unlinkCalls = (fs.unlinkSync as jest.Mock).mock.calls;
      expect(unlinkCalls.length).toBeGreaterThanOrEqual(3);
      // ensure repository.save called
      expect(mockSave).toHaveBeenCalled();
      expect(res).toHaveProperty('message');
    });

    it('should throw RpcException when property not found', async () => {
      mockGetProvider.getProByUser.mockResolvedValueOnce(null);
      await expect(provider.setMultiImg(999, 1, ['a.jpg'])).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('removeAnyImg', () => {
    it('should delete the specified image and save', async () => {
      const pro: any = {
        id: 4,
        propertyImages: ['keep.jpg', 'del.jpg'],
        propertyImage: 'keep.jpg',
      };

      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);
      mockSave.mockResolvedValueOnce({ ...pro, propertyImage: null });

      const result = await provider.removeAnyImg(4, 11, 'del.jpg');

      // unlinkSync should be called with the joined path
      expect((fs.unlinkSync as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if the image is not owned by user', async () => {
      const pro: any = {
        id: 5,
        propertyImages: ['only.jpg'],
      };
      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);

      await expect(provider.removeAnyImg(5, 1, 'notexist.jpg')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw RpcException when property not found', async () => {
      mockGetProvider.getProByUser.mockResolvedValueOnce(null);
      await expect(provider.removeAnyImg(123, 1, 'x.jpg')).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('setMultiPanorama', () => {
    it('should remove old panorama files, save new mapping and return message', async () => {
      const existingMap = { left: 'l.jpg', right: 'r.jpg' };
      const pro: any = {
        id: 6,
        panoramaImages: JSON.stringify(existingMap),
      };

      mockGetProvider.getProByUser.mockResolvedValueOnce(pro);
      mockSave.mockResolvedValueOnce({ ...pro });

      // request to replace 'left'
      const res = await provider.setMultiPanorama(6, 2, ['left'], ['newleft.jpg']);

      // should have unlinked 'l.jpg'
      expect((fs.unlinkSync as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockSave).toHaveBeenCalled();
      expect(res).toHaveProperty('message');
    });

    it('should throw RpcException when property not found', async () => {
      mockGetProvider.getProByUser.mockResolvedValueOnce(null);
      await expect(provider.setMultiPanorama(999, 1, ['a'], ['b'])).rejects.toBeInstanceOf(RpcException);
    });
  });
});
