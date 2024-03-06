import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AccountCredentials } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WarmupService {
  private transporter;

  constructor(@InjectModel(AccountCredentials.name) private readonly accountCredentialsModel: Model<AccountCredentials>) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rajakumarandevloper@gmail.com',
        pass: 'grmwpcokgoqgamht',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'rajakumarandevloper@gmail.com',
      to,
      subject,
      text,
      
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return {
        success : true ,
        message: 'email sent successfully' ,
        info,
      }
    } catch (error) {
      console.log('Error sending email:', error);
      return {
        success: false,
        message: `Failed to send email. Error: ${error.message}`,
      };
    }
  }
  async create(accountCredentialsModel: any): Promise<AccountCredentials> {
    const createdConfig = new this.accountCredentialsModel(accountCredentialsModel);
    return createdConfig.save();
  }
  async findAll(): Promise<AccountCredentials[]> {
    return this.accountCredentialsModel.find().exec();
  }
}
