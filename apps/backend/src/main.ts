import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (웹, 모바일 앱에서 접근 가능하도록)
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Next.js, React Native 개발 서버
    credentials: true,
  });

  await app.listen(8080);
  console.log("🚀 NestJS Backend is running on: http://localhost:8080");
  console.log("📡 tRPC endpoint: http://localhost:8080/trpc");
}
bootstrap();
