import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para permitir peticiones desde el frontend
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
