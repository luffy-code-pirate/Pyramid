import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Reads cookies from incoming requests into request.cookies —
  // required for our JwtAuthGuard to find the access_token cookie.
  app.use(cookieParser());

  // Enforces every DTO's validation decorators globally, on every route.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips any fields NOT defined in the DTO (security: ignores unexpected extra fields)
      transform: true, // auto-converts incoming JSON into actual DTO class instances
      forbidNonWhitelisted: true, // REJECTS the request if extra, unexpected fields are sent
    }),
  );

  // Allows our frontend's origin to make requests to this API,
  // and — crucially — allows cookies to be included in those requests.
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();