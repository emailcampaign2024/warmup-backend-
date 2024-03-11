import { Controller, Get, Post, HttpException, Body, HttpStatus } from '@nestjs/common';
import { WarmupService } from './warmup.service';
import { AccountCredentials } from './account.schema';
import { Warmupisactive } from './Warmupisactive.schema';

@Controller('client')
export class WarmupController {
  constructor(private readonly warmupService: WarmupService) {}

  // @Get('send-email')
  // async SendEmail() {
  //   try {
  //     const result = await this.warmupService.sendEmail(fromEmail, to);
  //     return result
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: `Failed to send email. Error: ${error.message}`,
  //     };
  //   }
  // }

@Post('accountadd')
async create(@Body() configData: any) {
  return this.warmupService.create(configData);
}

@Get('getAll')
async getAllConfigs() {
  try {
    const configs = await this.warmupService.findAll();
    return {
      success: true,
      configs,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to retrieve configs, Error: ${error.message}`,
    };
  }
}

@Post('warmupisactive')
async WarmupisactiveModel(@Body() WarmupisactiveModel: any) {
  return this.warmupService.creating(WarmupisactiveModel);
}

}
