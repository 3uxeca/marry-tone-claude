import { Controller, Get } from '@nestjs/common'

@Controller('admin')
export class AdminController {
  @Get()
  getAdmin() {
    return { message: 'admin stub — S3' }
  }
}
