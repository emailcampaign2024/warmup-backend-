// campaign.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountCredentials,AccountCredentialsSchema } from './account.schema';
import { WarmupService } from './warmup.service';
import { WarmupController } from './warmup.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountCredentials.name, schema: AccountCredentialsSchema }]),
  ],
  providers: [WarmupService],
  controllers: [WarmupController],
})
export class WarmupModule {}