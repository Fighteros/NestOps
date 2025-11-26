import { INestApplication, Module, OnModuleInit } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({})
export class DocsModule implements OnModuleInit {
  private app!: INestApplication;

  onModuleInit() {
    /* noop: bound in bootstrap in larger apps if needed */
  }

  static setup(app: INestApplication) {
    /* Only expose in non-prod or behind auth. */
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.SWAGGER_ENABLED !== 'true'
    )
      return;

    const config = new DocumentBuilder()
      .setTitle(`${process.env.APP_NAME ?? ''} Back End Docs`)
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access_token',
      )
      .build();

    const doc = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup(`api`, app, doc, { jsonDocumentUrl: `api/json` });
  }
}
