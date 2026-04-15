import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import fastifyCookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/filters'
import { TransformInterceptor } from './common/interceptors'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV !== 'production' }),
  )

  await app.register(fastifyCookie as any)
  await app.register(helmet as any, { contentSecurityPolicy: false })

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  const port = Number(process.env.PORT ?? 4000)
  await app.listen(port, '0.0.0.0')
  console.log(`API running on http://localhost:${port}/api`)
}
bootstrap()
