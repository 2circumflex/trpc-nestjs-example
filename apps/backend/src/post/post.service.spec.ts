import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { PostService, CreatePostDto, UpdatePostDto } from "./post.service";
import { Post } from "./post.entity";

describe("PostService", () => {
  let service: PostService;
  let repository: Repository<Post>;

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

  const mockPost = {
    id: 1,
    title: "테스트 포스트",
    content: "테스트 내용입니다.",
    isPublic: true,
    authorId: 1,
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createPost", () => {
    const createPostDto: CreatePostDto = {
      title: "새 포스트",
      content: "새 포스트 내용",
      isPublic: true,
    };
    const authorId = 1;

    it("should create and return new post", async () => {
      const newPost = { ...mockPost, ...createPostDto, authorId, id: 2 };
      mockRepository.create.mockReturnValue(newPost);
      mockRepository.save.mockResolvedValue(newPost);

      const result = await service.createPost(createPostDto, authorId);

      expect(result).toEqual(newPost);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        authorId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newPost);
    });
  });

  describe("getPublicPosts", () => {
    it("should return public posts", async () => {
      const publicPosts = [mockPost];
      mockRepository.find.mockResolvedValue(publicPosts);

      const result = await service.getPublicPosts();

      expect(result).toEqual(publicPosts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isPublic: true },
        relations: ["author"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("getUserPosts", () => {
    it("should return user posts", async () => {
      const userPosts = [mockPost];
      mockRepository.find.mockResolvedValue(userPosts);

      const result = await service.getUserPosts(1);

      expect(result).toEqual(userPosts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { authorId: 1 },
        relations: ["author"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("getPostById", () => {
    it("should return post when found", async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.getPostById(1);

      expect(result).toEqual(mockPost);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["author"],
      });
    });

    it("should throw NotFoundException when post not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getPostById(999)).rejects.toThrow(NotFoundException);
      await expect(service.getPostById(999)).rejects.toThrow(
        "Post with ID 999 not found"
      );
    });
  });

  describe("updatePost", () => {
    const updatePostDto: UpdatePostDto = {
      title: "수정된 제목",
      content: "수정된 내용",
    };

    it("should update and return post when user is author", async () => {
      const updatedPost = { ...mockPost, ...updatePostDto };
      mockRepository.findOne.mockResolvedValue(mockPost);
      mockRepository.save.mockResolvedValue(updatedPost);

      const result = await service.updatePost(1, updatePostDto, 1);

      expect(result).toEqual(updatedPost);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockPost,
        ...updatePostDto,
      });
    });

    it("should throw ForbiddenException when user is not author", async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.updatePost(1, updatePostDto, 2)).rejects.toThrow(
        ForbiddenException
      );
      await expect(service.updatePost(1, updatePostDto, 2)).rejects.toThrow(
        "You can only update your own posts"
      );
    });

    it("should throw NotFoundException when post not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updatePost(999, updatePostDto, 1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("deletePost", () => {
    it("should delete post when user is author", async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      mockRepository.remove.mockResolvedValue(mockPost);

      await service.deletePost(1, 1);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it("should throw ForbiddenException when user is not author", async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.deletePost(1, 2)).rejects.toThrow(
        ForbiddenException
      );
      await expect(service.deletePost(1, 2)).rejects.toThrow(
        "You can only delete your own posts"
      );
    });

    it("should throw NotFoundException when post not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePost(999, 1)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("getPublicPostById", () => {
    it("should return public post", async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.getPublicPostById(1, 2);

      expect(result).toEqual(mockPost);
    });

    it("should return private post when user is author", async () => {
      const privatePost = { ...mockPost, isPublic: false };
      mockRepository.findOne.mockResolvedValue(privatePost);

      const result = await service.getPublicPostById(1, 1);

      expect(result).toEqual(privatePost);
    });

    it("should throw ForbiddenException when accessing private post as non-author", async () => {
      const privatePost = { ...mockPost, isPublic: false };
      mockRepository.findOne.mockResolvedValue(privatePost);

      await expect(service.getPublicPostById(1, 2)).rejects.toThrow(
        ForbiddenException
      );
      await expect(service.getPublicPostById(1, 2)).rejects.toThrow(
        "This post is private"
      );
    });

    it("should throw NotFoundException when post not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getPublicPostById(999)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
