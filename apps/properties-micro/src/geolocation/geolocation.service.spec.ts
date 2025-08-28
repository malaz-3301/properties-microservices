import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import {
  HttpException,
  NotFoundException,
} from '@nestjs/common';

describe('GeolocationService', () => {
  let service: GeolocationService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    // منع طباعة console.log أثناء الاختبارات
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeolocationService,
        // mock لـ HttpService
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        // mock لـ ConfigService
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'BASE_URL') return 'http://fake-url';
              if (key === 'API_KEY') return 'fake-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    consoleSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return formatted location when API returns data', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            components: {
              road: 'Main St',
              suburb: 'Suburb',
              city: 'Damascus',
              state: 'Dimashq',
              country: 'Syria',
            },
          },
        ],
      },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const result = await service.reverse_geocoding(33, 36);

    expect(result).toEqual({
      street: 'Main St',
      quarter: 'Suburb',
      city: 'Damascus',
      governorate: 'Dimashq',
      country: 'Syria',
    });

    // تأكد أن URL بني من config
    expect(configService.get).toHaveBeenCalledWith('BASE_URL');
    expect(configService.get).toHaveBeenCalledWith('API_KEY');
  });

  it('should throw NotFoundException if results array is empty', async () => {
    const mockResponse = { data: { results: [] } };
    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    await expect(service.reverse_geocoding(33, 36)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw HttpException for 400 client error (bail)', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { status: { message: 'Bad Request' } },
      },
    };

    (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));

    await expect(service.reverse_geocoding(33, 36)).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw HttpException if retries exhausted for network/server errors', async () => {
    const mockError = { message: 'Network Error' };
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));

    await expect(service.reverse_geocoding(33, 36)).rejects.toThrow(
      HttpException,
    );
  });
});
