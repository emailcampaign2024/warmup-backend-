import { Injectable, NotFoundException  } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AccountCredentials } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warmupisactive } from './Warmupisactive.schema';
import {Server} from './user.model';
import {Email} from './email.schema';
import * as Imap from 'imap';
import { inspect } from 'util';
import {analytics} from './analytics.schema';

@Injectable()
export class WarmupService {
  private transporters: nodemailer.Transporter[] = [];

  constructor(@InjectModel(AccountCredentials.name) private readonly accountCredentialsModel: Model<AccountCredentials>,
  @InjectModel(Warmupisactive.name) private readonly WarmupisactiveModel: Model<Warmupisactive>,
  @InjectModel('Email') private readonly emailModel: Model<Email>,
  @InjectModel(analytics.name) private readonly analyticsModel: Model<analytics>,
  @InjectModel(Server.name) private readonly ServerModel: Model<Server>) {
  
    this.setupTransporters();
  }

  private async setupTransporters(): Promise<void> {
    try {
      const accountdata = await this.WarmupfindAll();
      if (accountdata) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: accountdata.accountCredentialsData.fromEmail,
            pass: accountdata.accountCredentialsData.appPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 20000,
        });
  
        this.transporters.push(transporter);
        const serverData = await this.ServerModel.find().exec();
  
        let sentEmailsCount = 0; // Counter for tracking sent emails
  
        for (const server of serverData) {
          // Check if the sent emails count exceeds the per day limit
          if (sentEmailsCount >= accountdata.perday) {
            console.log('Per day email limit reached. Stopping further emails.');
            break; // Exit the loop if the limit is reached
          }
  
          await this.sendEmail(accountdata.accountCredentialsData.fromEmail, server.email);
          await new Promise(resolve => setTimeout(resolve, 300000));
          sentEmailsCount++; // Increment the sent emails count
  
          // Wait for 5 minutes (300000 milliseconds) before sending the next email
          
        }
      } else {
        console.error('Error setting up transporters: Account data is undefined');
      }
    } catch (error) {
      console.error('Error setting up transporters:', error);
      // Handle the error appropriately (e.g., throw an exception)
    }
  }
  

  async sendEmail(fromEmail: string, to: string) {
    const mailOptions = {
      from: fromEmail,
      to : to,
      subject:"Email warm-up",
      text:"As we’ve already mentioned, email warm-up is about building a positive reputation. To ensure that their users have the best experience possible, ESPs like Gmail and Outlook will check a sender’s reputation before allowing their email through.",
      
    };

    try {
      const info = await this.transporters[0].sendMail(mailOptions);
      console.log('Email sent successfully');
      const email = new this.emailModel({
        from: fromEmail,
        to: to,
        subject: "Email warm-up",
        text: "As we’ve already mentioned, email warm-up is about building a positive reputation. To ensure that their users have the best experience possible, ESPs like Gmail and Outlook will check a sender’s reputation before allowing their email through.",
        sentAt: new Date(),
      });
      await email.save();
      console.log(email,"emailemailemailemail")
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

  async updateAccountCredentials(id: string, updateData: any): Promise<AccountCredentials> {
    const cleanedId = id.replace(':', '');
    const existingAccountCredentials = await this.accountCredentialsModel.findByIdAndUpdate(cleanedId, updateData, { new: true }).exec();
    
    if (!existingAccountCredentials) {
      throw new NotFoundException(`Account credentials with ID ${id} not found`);
    }

    return existingAccountCredentials;
  }

  async findAll(): Promise<AccountCredentials[]> {
    return this.accountCredentialsModel.find().exec();
  }

  async findById(id: string): Promise<AccountCredentials | null> {
    const accountCredentials = await this.accountCredentialsModel.findById(id).exec();
    if (!accountCredentials) {
      throw new NotFoundException(`Account credentials with ID ${id} not found`);
    }
    return accountCredentials;
  }
 


  async creating(WarmupisactiveModel: any): Promise<Warmupisactive> {
    const createdConfig = new this.WarmupisactiveModel(WarmupisactiveModel);
    return createdConfig.save();
  }

  async WarmupfindById(id: string): Promise<Warmupisactive | null> {
    const warmup = await this.WarmupisactiveModel.findOne({id:id}).exec();
    if (!warmup) {
      throw new NotFoundException(`Warmup with ID ${id} not found`);
    }
    return warmup;
  }
 
  async update(id: string, updateData: any): Promise<Warmupisactive> {
    const cleanedId = id.replace(':', '');
    const existingWarmup = await this.WarmupisactiveModel.findOne({ id: cleanedId }).exec();
    if (!existingWarmup) {
      throw new NotFoundException(`Warmup with ID ${id} not found`);
    }

    // Update the existingWarmup object with the provided updateData
    Object.assign(existingWarmup, updateData);

    // Save the updated document
    const updatedWarmup = await existingWarmup.save();
    if (existingWarmup.isOn) {
     const test = this.setupTransporters();
    //  console.log(test,"testestestes")
    }
    return updatedWarmup;
  }


  async WarmupfindAll(): Promise<{ accountCredentialsData: AccountCredentials | null, perday: number }> {
    const warmupData = await this.WarmupisactiveModel.find().exec();
    // console.log('Warmup Data:', warmupData, warmupData[0].isOn);
    if (warmupData.length === 0) {
      throw new NotFoundException('No warmup data found.');
    }
    if (warmupData.length > 0 && warmupData[0].isOn) {
      const perday = warmupData[0].totalWarmUpEmailsPerDay; 
      console.log(warmupData[0].id)
      const accountCredentialsData = await this.accountCredentialsModel.findOne({ _id: warmupData[0].id }).exec();
      if (!accountCredentialsData) {
        throw new NotFoundException('No corresponding account credentials found.');
      }
      return {accountCredentialsData,perday};
    }
    else {
      // If the condition is not satisfied, return an error response
      throw new NotFoundException('Warmup is not active.');
    }
  }


  // async checkSpamEmails(): Promise<boolean> {
  //   return new Promise<boolean>((resolve, reject) => {
  //     const imap = new Imap({
  //       user: 'gokulsidharth02@gmail.com',
  //       password: 'wypqevvlfqdcwcqb',
  //       host: 'imap.gmail.com',
  //       port: 993,
  //       tls: true
  //     });
  
  //     imap.once('ready', () => {
  //       imap.openBox('INBOX', false, (err, box) => {
  //         if (err) {
  //           console.error('Error opening INBOX:', err);
  //           imap.end();
  //           reject(err); // Reject the promise if there's an error
  //           return;
  //         }
  
  //         const f = imap.seq.fetch(box.messages.total + ':*', { bodies: '', struct: true });
  
  //         f.on('message', (msg, seqno) => {
  //           msg.once('attributes', (attrs) => {
  //             // Check if the email is marked as spam
  //             const isSpam = attrs.flags.includes('\\Spam');
  
  //             console.log(`Email ${seqno} is ${isSpam ? 'marked as spam' : 'not spam'}`);
  //             resolve(isSpam); // Resolve the promise with spam status
  //           });
  //         });
  
  //         f.once('error', (err) => {
  //           console.error('Fetch error:', err);
  //           imap.end();
  //           reject(err); // Reject the promise if there's an error
  //         });
  
  //         f.once('end', () => {
  //           console.log('Done fetching emails');
  //           imap.end();
  //         });
  //       });
  //     });
  
  //     imap.once('error', (err) => {
  //       console.error('IMAP error:', err);
  //       reject(err); // Reject the promise if there's an error
  //     });
  
  //     imap.once('end', () => {
  //       console.log('IMAP connection ended');
  //     });
  
  //     imap.connect();
  //   });
  // }
  
  
  async checkSpamEmails(): Promise<boolean> {
    const accountdata = await this.WarmupfindAll();
    return new Promise<boolean>((resolve, reject) => {
      const imap = new Imap({
        user: accountdata.accountCredentialsData.fromEmail,
        password: accountdata.accountCredentialsData.appPassword,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 30000,
        connTimeout: 30000
      });
        
      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            console.error('Error opening INBOX:', err);
            imap.end();
            reject(err); // Reject the promise if there's an error
            return;
          }
  
          const f = imap.seq.fetch(box.messages.total + ':*', { bodies: '', struct: true });
  
          f.on('message', (msg, seqno) => {
            msg.once('attributes', (attrs) => {
              // Check if the email is marked as spam
              const isSpam = attrs.flags.includes('\\Spam');
              
              console.log(`Email ${seqno} is ${isSpam ? 'marked as spam' : 'not spam'}`);
              
              resolve(isSpam); 
            });
          });
  
          f.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(err); // Reject the promise if there's an error
          });
  
          f.once('end', () => {
            console.log('Done fetching emails');
            imap.end();
          });
        });
      });
  
      imap.once('error', (err) => {
        console.error('IMAP error:', err);
        reject(err); // Reject the promise if there's an error
      });
  
      imap.once('end', () => {
        console.log('IMAP connection ended');
      });
  
      imap.connect();
    });
  }


  async checkSentEmailInInbox() {
    const accountdata = await this.WarmupfindAll();
    const imap = new Imap({
      user: accountdata.accountCredentialsData.fromEmail,
      password: accountdata.accountCredentialsData.appPassword,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 30000,
      connTimeout: 30000
    });
    
    
    imap.openBox('INBOX', false, async (err, box) => { // Make the callback function async
      if (err) {
          console.error('Error opening INBOX:', err);
          imap.end();
          return;
      }
      
      try {
          const serverData = await this.ServerModel.find().exec();
          
          for (const server of serverData) {
              const searchCriteria = ['UNSEEN', ['FROM', server.email]];
              
              imap.search(searchCriteria, (searchErr, searchResults) => {
                  if (searchErr) {
                      console.error('Search error:', searchErr);
                      return;
                  }
  
                  if (searchResults.length > 0) {
                      
                      console.log(`Email from ${server.email} found in the inbox`);
                  } else {

                      console.log(`Email from ${server.email} not found in the inbox`);
                  }
              });
          }
      } catch (error) {
          console.error('Error fetching server data:', error);
      } finally {
          imap.end();
      }
  });
}

  
  async aggregateSpamEmailsByDate() {
    try {
      const aggregationResult = await this.emailModel.aggregate([
        {
          $match: {
            "sentAt": {
              $gte: new Date(Number(new Date()) - 7 * 24 * 60 * 60 * 1000) // 7 days ago
            }
          }
        },
        {
          $group: {
            _id: "$from",
            count: { $sum: 1 }
          }
        }
      ])
      console.log(aggregationResult,"aggregationResult")
      return aggregationResult;
    } catch (error) {
      console.error('Email Count Error executing aggregation:', error);
      throw error;
    }
  }
  

  async analytics(){
    const lastsevenday = this.aggregateSpamEmailsByDate()
    console.log(lastsevenday,"lastsevenday");
    const spam = this.checkSentEmailInInbox()
    console.log(spam,"spamspamspam");    
  }


}
