import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./user.entity";

describe("UserService", () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    name: "테스트 사용자",
    password: "hashedPassword",
    avatar: null,
    refreshToken: null,
    posts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledWith();
    });
  });

  describe("findOne", () => {
    it("should return a user when found", async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when user not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return a user when found by email", async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null when user not found by email", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    const createUserData = {
      email: "new@example.com",
      name: "새 사용자",
      password: "hashedPassword",
      avatar: undefined,
    };

    it("should create and return a new user", async () => {
      const newUser = { ...mockUser, ...createUserData, id: 2 };
      mockRepository.create.mockReturnValue(newUser);
      mockRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserData);

      expect(result).toEqual(newUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserData);
      expect(mockRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe("update", () => {
    const updateData = {
      name: "수정된 이름",
      avatar: "new-avatar.jpg",
    };

    it("should update user and return updated user", async () => {
      const updatedUser = { ...mockUser, ...updateData };
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return null when user not found", async () => {
      mockRepository.update.mockResolvedValue({ affected: 0 });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.update(999, updateData);

      expect(result).toBeNull();
      expect(mockRepository.update).toHaveBeenCalledWith(999, updateData);
    });
  });

  describe("remove", () => {
    it("should delete user successfully", async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
