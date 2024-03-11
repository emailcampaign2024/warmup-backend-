import { Injectable, NotFoundException  } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AccountCredentials } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warmupisactive } from './Warmupisactive.schema';
import {Server} from './user.model';

@Injectable()
export class WarmupService {
  private transporter;

  constructor(@InjectModel(AccountCredentials.name) private readonly accountCredentialsModel: Model<AccountCredentials>,
  @InjectModel(Warmupisactive.name) private readonly WarmupisactiveModel: Model<Warmupisactive>,
  @InjectModel(Server.name) private readonly ServerModel: Model<Server>) {
    const accountCredentialsData = this.accountCredentialsModel.find().sort({ _id: -1 }).exec();
    console.log(accountCredentialsData,"jkjkkkk");
    // const emailuser = accountCredentialsData[0].fromEmail;
    // const emailpass = accountCredentialsData[0].appPassword;
    // console.log(emailuser,emailpass,"aurthrrbrbrb");
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "emailuser",
        pass: "emailpass",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(fromEmail: string, to: string) {
    const mailOptions = {
      from: fromEmail,
      to : to,
      subject:"Email warm-up",
      text:"As we’ve already mentioned, email warm-up is about building a positive reputation. To ensure that their users have the best experience possible, ESPs like Gmail and Outlook will check a sender’s reputation before allowing their email through.",
      
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

  //Account added here with app password
  async create(accountCredentialsModel: any): Promise<AccountCredentials> {
    const createdConfig = new this.accountCredentialsModel(accountCredentialsModel);
    return createdConfig.save();
  }

  async findAll(): Promise<AccountCredentials[]> {
    // const accountdata = this.WarmupfindAll();
    // console.log(accountdata,"1111111111111111111");
    return this.accountCredentialsModel.find().exec();
  }
  async creating(WarmupisactiveModel: any): Promise<Warmupisactive> {
    const createdConfig = new this.WarmupisactiveModel(WarmupisactiveModel);
    return createdConfig.save();
  }
 



  async WarmupfindAll(): Promise<AccountCredentials| null> {
    const warmupData = await this.WarmupisactiveModel.find().exec();
    console.log('Warmup Data:', warmupData);
    if (warmupData.length === 0) {
      throw new NotFoundException('No warmup data found.');
    }
    if (warmupData.length > 0 && warmupData[0].isOn) {
      // console.log(warmupData[0].id)
      const accountCredentialsData = await this.accountCredentialsModel.findOne({ _id: warmupData[0].id }).exec();
      if (!accountCredentialsData) {
        throw new NotFoundException('No corresponding account credentials found.');
      }
      console.log(accountCredentialsData.fromEmail, accountCredentialsData.appPassword);
      const serverData = await this.ServerModel.find().exec();
     
      for (const server of serverData) {
        console.log(server.email)
        await this.sendEmail(accountCredentialsData.fromEmail, server.email);
        // Wait for 5 minutes (300000 milliseconds) before sending the next email
        await new Promise(resolve => setTimeout(resolve, 300000));
      }
      return accountCredentialsData;
  }
 
  }



}
