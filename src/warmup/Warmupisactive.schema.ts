// account-credentials.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Warmupisactive extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  isOn: boolean;

  @Prop({ required: true })
  totalWarmUpEmailsPerDay: number;

  @Prop({ required: true })
  dailyRampUpEnabled: boolean;

  @Prop({ required: true })
  rampUpIncrement: number;
}

export const WarmupisactiveSchema = SchemaFactory.createForClass(Warmupisactive);
