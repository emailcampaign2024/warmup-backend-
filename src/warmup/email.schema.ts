// email.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Email extends Document {
  @Prop()
  from: string;
  
  @Prop(String)
  to: string;

  @Prop()
  subject: string;

  @Prop()
  text: string;

  @Prop()
  sentAt: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
