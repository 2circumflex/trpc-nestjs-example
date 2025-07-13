import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostService } from "./post.service";
import { PostRouter } from "./post.router";

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService, PostRouter],
  exports: [PostService],
})
export class PostModule {}
