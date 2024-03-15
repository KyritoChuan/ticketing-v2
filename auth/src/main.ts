import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const host = configService.get<string>('AUTH_HOST');
  const port = parseInt(configService.get<string>('AUTH_PORT'));

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    microserviceOptions
  );

  await app.listen();
}
bootstrap();
