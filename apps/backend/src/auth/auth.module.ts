import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthRouter } from "./auth.router";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "../user/user.module";

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
  providers: [AuthService, AuthRouter, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
