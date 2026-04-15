import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RecommendationModule } from './modules/recommendation/recommendation.module'
import { WardrobeModule } from './modules/wardrobe/wardrobe.module'
import { CoupleModule } from './modules/couple/couple.module'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    RecommendationModule,
    WardrobeModule,
    CoupleModule,
    AdminModule,
  ],
})
export class AppModule {}
