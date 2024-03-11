// campaign.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountCredentials,AccountCredentialsSchema } from './account.schema';
import { WarmupService } from './warmup.service';
import { WarmupController } from './warmup.controller';
import {Warmupisactive, WarmupisactiveSchema} from './Warmupisactive.schema';
import {Server,UserSchema} from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccountCredentials.name, schema: AccountCredentialsSchema }]),
    MongooseModule.forFeature([{ name: Warmupisactive.name, schema: WarmupisactiveSchema }]),
    MongooseModule.forFeature([{ name: Server.name, schema: UserSchema }]),
  ],
  providers: [WarmupService],
  controllers: [WarmupController],
})
export class WarmupModule {}