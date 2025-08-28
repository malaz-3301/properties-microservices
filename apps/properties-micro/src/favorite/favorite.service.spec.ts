import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let repo: jest.Mocked<Repository<Favorite>>;

  const mockFavorite: Favorite = {
    id: 1,
    user: { id: 10 } as any,
    property: { id: 20 } as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    repo = module.get(getRepositoryToken(Favorite));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  describe('findFavorite', () => {
    it('should call repository.findOne with correct args', async () => {
      repo.findOne.mockResolvedValue(mockFavorite);
      const result = await service.findFavorite(10, 20);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 10 }, property: { id: 20 } },
      });
      expect(result).toEqual(mockFavorite);
    });
  });

  describe('isFavorite', () => {
    it('should return true if favorite exists', async () => {
      repo.findOne.mockResolvedValue(mockFavorite);
      const result = await service.isFavorite(10, 20);
      expect(result).toBe(true);
    });

    it('should return false if favorite does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.isFavorite(10, 20);
      expect(result).toBe(false);
    });
  });

  describe('changeStatusOfFavorite', () => {
    it('should delete if favorite exists', async () => {
      repo.findOne.mockResolvedValue(mockFavorite);
      repo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.changeStatusOfFavorite(10, 20);

      expect(repo.delete).toHaveBeenCalledWith(mockFavorite.id);
      expect(result).toEqual({ affected: 1 });
    });

    it('should create and save if favorite does not exist', async () => {
      const newFav = { ...mockFavorite, id: 2 };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(newFav as any);
      repo.save.mockResolvedValue(newFav);

      const result = await service.changeStatusOfFavorite(10, 20);

      expect(repo.create).toHaveBeenCalledWith({
        user: { id: 10 },
        property: { id: 20 },
      });
      expect(repo.save).toHaveBeenCalledWith(newFav);
      expect(result).toEqual(newFav);
    });
  });

  describe('deleteAll', () => {
    it('should delete all favorites for user', async () => {
      repo.delete.mockResolvedValue({ affected: 3 } as any);
      const result = await service.deleteAll(10);

      expect(repo.delete).toHaveBeenCalledWith({ user: { id: 10 } });
      expect(result).toEqual({ affected: 3 });
    });
  });

  describe('getAllFavorites', () => {
    it('should return favorites with relations and select', async () => {
      const favs = [mockFavorite];
      repo.find.mockResolvedValue(favs);

      const result = await service.getAllFavorites(10);

      expect(repo.find).toHaveBeenCalledWith({
        where: { user: { id: 10 } },
        relations: { property: true },
        select: {
          property: {
            id: true,
            rooms: true,
            bathrooms: true,
            area: true,
            price: true,
            firstImage: true,
            status: true,
            isForRent: true,
            propertyType: true,
            location: {
              country: true,
              governorate: true,
              city: true,
              quarter: true,
              street: true,
              lon: true,
              lat: true,
            },
          },
        },
      });
      expect(result).toEqual(favs);
    });
  });
});
