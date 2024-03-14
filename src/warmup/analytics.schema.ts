// email.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class analytics extends Document {
  @Prop({ unique: true })
  objectid: string;
  
  @Prop({ unique: true })
  emailssent: string;

  @Prop()
  Landedinbox: string;

  @Prop()
  spamcount: string;

  @Prop()
  Emailsreceived: string;
}

export const analyticsSchema = SchemaFactory.createForClass(analytics);
