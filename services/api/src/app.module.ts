import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { DatabaseModule } from './common/database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RecommendationModule } from './modules/recommendation/recommendation.module'
import { WardrobeModule } from './modules/wardrobe/wardrobe.module'
import { CoupleModule } from './modules/couple/couple.module'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    ProfileModule,
    RecommendationModule,
    WardrobeModule,
    CoupleModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
