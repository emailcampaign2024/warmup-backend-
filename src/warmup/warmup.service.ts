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

//   async create(accountCredentials: AccountCredentials): Promise<AccountCredentials> {
//     const newAccountCredentials = new this.accountCredentialsModel(accountCredentials);
//     return await newAccountCredentials.save();
//   }
  async create(email: string, password: string): Promise<AccountCredentials> {
    const createdEmailCredentials = new this.accountCredentialsModel({ email: email, password });
    console.log(createdEmailCredentials,"jjjjjjj");
    return createdEmailCredentials.save();
  }
}
