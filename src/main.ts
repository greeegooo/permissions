import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { controllersExcludes } from '@tresdoce/nestjs-health';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  const { server, swagger, project } =
    app.get<ConfigService>(ConfigService)['internalConfig']['config'];
  const port = parseInt(server.port, 10) || 8080;

  app.setGlobalPrefix(`${server.context}`, {
    exclude: [...controllersExcludes],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer'),
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (swagger.enabled) {
    const config = new DocumentBuilder()
      .setTitle(`${project.name}`)
      .setVersion(`${project.version}`)
      .setDescription(`${project.description}`)
      .setExternalDoc('Documentation', project.homepage)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${swagger.path}`, app, document);
  }

  if (server.corsEnabled) {
    app.enableCors({
      origin: server.origins,
      allowedHeaders: `${server.allowedHeaders}`,
      methods: `${server.allowedMethods}`,
      credentials: server.corsCredentials,
    });
  }
  await app.listen(port, () => {
    console.log(`App running on: http://localhost:${port}`);
  });
}

bootstrap();
