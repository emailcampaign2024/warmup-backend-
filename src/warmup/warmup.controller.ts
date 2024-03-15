import { Controller, Get, Post, HttpException, Body, HttpStatus, Put, Param, NotFoundException } from '@nestjs/common';
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

@Get('account/:id')
async getAccountCredentialsById(@Param('id') id: string) {
  try {
    const accountCredentials = await this.warmupService.findById(id);
    return { success: true, accountCredentials };
  } catch (error) {
    if (error instanceof NotFoundException) {
      return { success: false, message: error.message };
    }
    console.error('Error retrieving account credentials:', error);
    return { success: false, message: 'Failed to retrieve account credentials' };
  }
}

@Get('warmupdetails/:id')
async getwarmupById(@Param('id') id: string) {
  try {
    const accountCredentials = await this.warmupService.WarmupfindById(id);
    return { success: true, accountCredentials };
  } catch (error) {
    if (error instanceof NotFoundException) {
      return { success: false, message: error.message };
    }
    console.error('Error retrieving account credentials:', error);
    return { success: false, message: 'Failed to retrieve account credentials' };
  }
}

@Put('updateWarmup/:id')
async updateWarmup(@Param('id') id: string, @Body() updateData: any) {
  try {
    const updatedWarmup = await this.warmupService.update(id, updateData);
    return { success: true, warmup: updatedWarmup };
  } catch (error) {
    if (error instanceof NotFoundException) {
      return { success: false, message: error.message };
    }
    console.error('Error updating warmup:', error);
    return { success: false, message: 'Failed to update warmup' };
  }
}

@Put('updateaccount/:id')
async updateAccountCredentials(@Param('id') id: string, @Body() accountCredentialsModel: any): Promise<AccountCredentials> {
  return this.warmupService.updateAccountCredentials(id, accountCredentialsModel);
}

@Post('warmupisactive')
async WarmupisactiveModel(@Body() WarmupisactiveModel: any) {
  return this.warmupService.creating(WarmupisactiveModel);
}


// @Get('checkSpamid/:id')
// async checkSpamEmail(@Param('id') id: string): Promise<any> {
//   try {
//     console.log("check12345666");
//     await this.warmupService.checkSpamEmails(id);
//     return 'Spam emails checked successfully';
//   } catch (error) {
//     throw new Error('Failed to check spam emails');
//   }
// }


@Get('spamcount')
async checkSpamEmails(): Promise<boolean> {
  const isSpam = await this.warmupService.checkSpamEmails();
  return isSpam;
}

@Get('checkdata/:id')
async getAnalytics(@Param('id') id: string): Promise<any> {
  const fromEmail = await this.warmupService.analytics(id);
  return { fromEmail };
}

}
