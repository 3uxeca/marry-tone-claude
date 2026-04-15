import { Controller, Get } from '@nestjs/common'

@Controller('wardrobe')
export class WardrobeController {
  @Get()
  getWardrobe() {
    return { message: 'wardrobe stub — S2' }
  }
}
