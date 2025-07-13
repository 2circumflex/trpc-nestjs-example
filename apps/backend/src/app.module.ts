import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TRPCModule } from "nestjs-trpc";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // PostgreSQL 데이터베이스 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("DATABASE_URL"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("NODE_ENV") === "development", // 개발 환경에서만 사용
        logging: configService.get<string>("NODE_ENV") === "development",
        ssl:
          configService.get<string>("NODE_ENV") === "production"
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),

    // tRPC 설정
    TRPCModule.forRoot({
      autoSchemaFile: "./src/@generated",
    }),

    // 기능 모듈들
    UserModule,
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
