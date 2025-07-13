import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./post.entity";

export interface CreatePostDto {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}

  // 포스트 생성
  async createPost(
    createPostDto: CreatePostDto,
    authorId: number
  ): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId,
    });
    return await this.postRepository.save(post);
  }

  // 모든 공개 포스트 조회
  async getPublicPosts(): Promise<Post[]> {
    return await this.postRepository.find({
      where: { isPublic: true },
      relations: ["author"],
      order: { createdAt: "DESC" },
    });
  }

  // 특정 사용자의 포스트 조회
  async getUserPosts(userId: number): Promise<Post[]> {
    return await this.postRepository.find({
      where: { authorId: userId },
      relations: ["author"],
      order: { createdAt: "DESC" },
    });
  }

  // 포스트 ID로 조회
  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  // 포스트 수정
  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number
  ): Promise<Post> {
    const post = await this.getPostById(id);

    // 작성자만 수정 가능
    if (post.authorId !== userId) {
      throw new ForbiddenException("You can only update your own posts");
    }

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  // 포스트 삭제
  async deletePost(id: number, userId: number): Promise<void> {
    const post = await this.getPostById(id);

    // 작성자만 삭제 가능
    if (post.authorId !== userId) {
      throw new ForbiddenException("You can only delete your own posts");
    }

    await this.postRepository.remove(post);
  }

  // 공개 포스트 중에서 특정 포스트 조회 (비공개 포스트는 작성자만 조회 가능)
  async getPublicPostById(id: number, userId?: number): Promise<Post> {
    const post = await this.getPostById(id);

    // 비공개 포스트는 작성자만 조회 가능
    if (!post.isPublic && post.authorId !== userId) {
      throw new ForbiddenException("This post is private");
    }

    return post;
  }
}
