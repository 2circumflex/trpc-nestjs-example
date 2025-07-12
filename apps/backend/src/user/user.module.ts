import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserRouter } from "./user.router";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRouter],
  exports: [UserService],
})
export class UserModule {}
