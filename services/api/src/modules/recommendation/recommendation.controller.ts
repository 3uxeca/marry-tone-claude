import { Controller, Get } from '@nestjs/common'

@Controller('recommendation')
export class RecommendationController {
  @Get()
  getRecommendations() {
    return { message: 'recommendation stub — S3' }
  }
}
