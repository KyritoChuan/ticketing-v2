import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( // it is applied to every route handler across the entire application
    new ValidationPipe({  // Cast automaticaly class-transform
      transform: true, // If true, it allows to transform the flat JSON objects to objects of the DTO class.
      forbidUnknownValues: true, // Setting true will cause fail validation of unknown objects.
      forbidNonWhitelisted: true, // If set to true, instead of stripping non-whitelisted properties validator will throw an error
    }),
  );

  const config = new DocumentBuilder()   // RESTful web services documentation
    .setTitle('Api-Gateway')
    .setDescription('Demo')
    .setVersion('1.0')
    .addTag('Ticketing')
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(AppModule.port);
}
bootstrap();
