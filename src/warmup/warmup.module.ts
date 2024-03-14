// campaign.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountCredentials,AccountCredentialsSchema } from './account.schema';
import { WarmupService } from './warmup.service';
import { WarmupController } from './warmup.controller';
import {Warmupisactive, WarmupisactiveSchema} from './Warmupisactive.schema';
import {Server,UserSchema} from './user.model';
import {Email, EmailSchema} from './email.schema';
import {analytics, analyticsSchema} from './analytics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountCredentials.name, schema: AccountCredentialsSchema }]),
    MongooseModule.forFeature([{ name: Warmupisactive.name, schema: WarmupisactiveSchema }]),
    MongooseModule.forFeature([{ name: Server.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }]),
    MongooseModule.forFeature([{ name: analytics.name, schema: analyticsSchema }]),
  ],
  providers: [WarmupService],
  controllers: [WarmupController],
})
export class WarmupModule {}