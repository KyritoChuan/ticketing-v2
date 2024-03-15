import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host: configService.get('ORDER_HOST'),
      port: configService.get('ORDER_PORT'),
    },
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    microserviceOptions
  );

  await app.listen();
}
bootstrap();
