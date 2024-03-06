import { Controller, Get, Post, HttpException, Body, HttpStatus } from '@nestjs/common';
import { WarmupService } from './warmup.service';
import { AccountCredentials } from './account.schema';

@Controller('client')
export class WarmupController {
  constructor(private readonly warmupService: WarmupService) {}

  @Get('send-email')
  async SendEmail() {
    try {
      const result = await this.warmupService.sendEmail(
        'gokulsidharth02@gmail.com',
        'testing subject',
        'hello from client server email id',
      );
      return result
    } catch (error) {
      return {
        success: false,
        message: `Failed to send email. Error: ${error.message}`,
      };
    }
  }

@Post('accountadd')
async create(@Body() configData: any) {
  return this.warmupService.create(configData);
}
}
