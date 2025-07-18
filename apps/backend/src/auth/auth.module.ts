import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthRouter } from "./auth.router";
import { JwtStrategy } from "./jwt.strategy";
import { JwtGuard } from "./jwt.guard";
import { UserModule } from "../user/user.module";
import { ConsoleLogger } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "default-secret-key",
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthRouter,
    JwtStrategy,
    JwtGuard,
    ConsoleLogger,
    LoggerMiddleware,
  ],
  exports: [AuthService, JwtGuard],
})
export class AuthModule {}
