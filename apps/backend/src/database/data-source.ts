import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "../user/user.entity";
import { Post } from "../post/post.entity";

// 환경 변수 로드를 위한 설정
import * as dotenv from "dotenv";
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: configService.get<string>("DATABASE_URL"),
  entities: [User, Post],
  migrations: ["src/database/migrations/*.js"],
  synchronize: false, // 마이그레이션 사용 시 false로 설정
  logging: configService.get<string>("NODE_ENV") === "development",
  ssl:
    configService.get<string>("NODE_ENV") === "production"
      ? { rejectUnauthorized: false }
      : false,
});
