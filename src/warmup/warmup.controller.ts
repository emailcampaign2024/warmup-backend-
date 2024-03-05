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

//   @Post('accountadd')
//   async create(accountCredentials: AccountCredentials): Promise<AccountCredentials> {
//     try {
//       const newAccountCredentials = await this.warmupService.create(accountCredentials);
//       return newAccountCredentials;
//     } catch (error) {
//       throw new HttpException('Failed to create account credentials', HttpStatus.BAD_REQUEST);
//     }
//   }
  @Post("accountadd")
   async createEmailCredentials(@Body('email') email: string, @Body('password') password: string) {
  try {
    console.log(email, password);
    const createdEmailCredentials = await this.warmupService.create(email, password);
    return { message: 'Email credentials created successfully', data: createdEmailCredentials };
  } catch (error) {
    return { error: error.message };
  }
}
}
