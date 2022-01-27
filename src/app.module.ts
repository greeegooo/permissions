import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@tresdoce/nestjs-health';
import { HttpClientModule } from '@tresdoce/nestjs-httpclient';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { config, enviroments, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[`${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    HealthModule.register(config()),
    HttpClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
