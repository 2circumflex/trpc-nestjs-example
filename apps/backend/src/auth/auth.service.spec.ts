import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";

// bcrypt 모킹
jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("AuthService", () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

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

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return user when credentials are valid", async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser("test@example.com", "password");

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "password",
        mockUser.password
      );
    });

    it("should return null when user not found", async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        "nonexistent@example.com",
        "password"
      );

      expect(result).toBeNull();
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should return null when password is invalid", async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(
        "test@example.com",
        "wrongpassword"
      );

      expect(result).toBeNull();
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        mockUser.password
      );
    });
  });

  describe("login", () => {
    const email = "test@example.com";
    const password = "password";

    it("should return access token and user when credentials are valid", async () => {
      const mockToken = "mock.jwt.token";
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(email, password);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          avatar: mockUser.avatar,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it("should throw UnauthorizedException when credentials are invalid", async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.login(email, password)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("register", () => {
    const email = "new@example.com";
    const password = "password123";
    const name = "새 사용자";

    it("should register new user and return access token", async () => {
      const hashedPassword = "hashedPassword123";
      const newUser = {
        ...mockUser,
        email,
        name,
        password: hashedPassword,
        id: 2,
      };
      const mockToken = "mock.jwt.token";

      mockUserService.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockUserService.create.mockResolvedValue(newUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(email, password, name);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserService.create).toHaveBeenCalledWith({
        email,
        password: hashedPassword,
        name,
      });
    });

    it("should throw UnauthorizedException when user already exists", async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(email, password, name)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.register(email, password, name)).rejects.toThrow(
        "User already exists"
      );
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserService.create).not.toHaveBeenCalled();
    });
  });
});
