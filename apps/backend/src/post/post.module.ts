import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostService } from "./post.service";
import { PostRouter } from "./post.router";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  providers: [PostService, PostRouter],
  exports: [PostService],
})
export class PostModule {}
