// import { Injectable, NotFoundException  } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { AccountCredentials } from './account.schema';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Warmupisactive } from './Warmupisactive.schema';
// import {Server} from './user.model';
// import {Email} from './email.schema';

// @Injectable()
// export class WarmupService {
//   private transporter;
//   private transporters: nodemailer.Transporter[];

//   constructor(@InjectModel(AccountCredentials.name) private readonly accountCredentialsModel: Model<AccountCredentials>,
//   @InjectModel(Warmupisactive.name) private readonly WarmupisactiveModel: Model<Warmupisactive>,
//   @InjectModel(Email.name) private readonly emailModel: Model<Email>,
//   @InjectModel(Server.name) private readonly ServerModel: Model<Server>) {
  
//     // this.transporter = nodemailer.createTransport({
//     //   service: 'gmail',
//     //   auth: {
//     //     user: "gokulsidharth02@gmail.com",
//     //     pass: "edsgthytjykdkkj",
//     //   },
//     //   tls: {
//     //     rejectUnauthorized: false,
//     //   },
//     // });
//     this.setupTransporters();
//     // this.initializeTransporter();
//   }

//   private async setupTransporters(): Promise<void> {
//     const accountdata = await this.WarmupfindAll();
//     console.log(accountdata,"accountdatadata",accountdata.fromEmail);
//     this.transporters = [];
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: accountdata.fromEmail, // Use 'fromEmail' instead of 'user'
//           pass: accountdata.appPassword, // Use 'appPassword' instead of 'password'
//         },
//         tls: {
//           rejectUnauthorized: false,
//         },
//       });

//       // Push the created transporter to the array
//       this.transporters.push(transporter);

      
//   }
 

//     // async initializeTransporter() {
//     //   try {
//     //     const accountdata = await this.WarmupfindAll(); // Await here to get the resolved value
//     //     console.log(accountdata, "2222222222222222222222222");
//     //     this.transporter = nodemailer.createTransport({
//     //       service: 'gmail',
//     //       auth: {
//     //         user: "gokulsidharth02@gmail.com", // Now you can access properties after awaiting the Promise accountdata.fromEmail,accountdata.appPassword
//     //         pass: "edsgthytjykdkkj",
//     //       },
//     //       tls: {
//     //         rejectUnauthorized: false,
//     //       },
//     //     });
//     //   } catch (error) {
//     //     console.error('Error initializing transporter:', error);
//     //     // Handle the error appropriately (e.g., throw an exception)
//     //   }
//     // }

//   async sendEmail(fromEmail: string, to: string) {
//     const mailOptions = {
//       from: fromEmail,
//       to : to,
//       subject:"Email warm-up",
//       text:"As we’ve already mentioned, email warm-up is about building a positive reputation. To ensure that their users have the best experience possible, ESPs like Gmail and Outlook will check a sender’s reputation before allowing their email through.",
      
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('Email sent successfully');
//       const email = new this.emailModel({
//         from: fromEmail,
//         to: to,
//         subject: "Email warm-up",
//         text: "As we’ve already mentioned, email warm-up is about building a positive reputation. To ensure that their users have the best experience possible, ESPs like Gmail and Outlook will check a sender’s reputation before allowing their email through.",
//         sentAt: new Date(),
//       });
//       await email.save();
//       return {
//         success : true ,
//         message: 'email sent successfully' ,
//         info,
//       }
//     } catch (error) {
//       console.log('Error sending email:', error);
//       return {
//         success: false,
//         message: `Failed to send email. Error: ${error.message}`,
//       };
//     }
//   }

//   //Account added here with app password
//   async create(accountCredentialsModel: any): Promise<AccountCredentials> {
//     const createdConfig = new this.accountCredentialsModel(accountCredentialsModel);
//     return createdConfig.save();
//   }

//   async findAll(): Promise<AccountCredentials[]> {
//     // const accountdata = await this.WarmupfindAll();
//     // // const accountdata = this.WarmupfindAll();
//     // console.log(accountdata,"1111111111111111111",accountdata.fromEmail);
//     return this.accountCredentialsModel.find().exec();
//   }
//   async creating(WarmupisactiveModel: any): Promise<Warmupisactive> {
//     const createdConfig = new this.WarmupisactiveModel(WarmupisactiveModel);
//     return createdConfig.save();
//   }
 



//   async WarmupfindAll(): Promise<AccountCredentials| null> {
//     const warmupData = await this.WarmupisactiveModel.find().exec();
//     console.log('Warmup Data:', warmupData, warmupData[0].isOn);
//     if (warmupData.length === 0) {
//       throw new NotFoundException('No warmup data found.');
//     }
//     if (warmupData.length > 0 && warmupData[0].isOn) {
//       // console.log(warmupData[0].id)
//       const accountCredentialsData = await this.accountCredentialsModel.findOne({ _id: warmupData[0].id }).exec();
//       if (!accountCredentialsData) {
//         throw new NotFoundException('No corresponding account credentials found.');
//       }
//       // await sendEmailsToServers.call(this, accountCredentialsData);
//       // console.log(accountCredentialsData.fromEmail, accountCredentialsData.appPassword);
//       // const serverData = await this.ServerModel.find().exec();
     
//       // for (const server of serverData) {
//       //   console.log(server.email,"server")
//       //   // await this.sendEmail(accountCredentialsData.fromEmail, server.email);
//       //   // Wait for 5 minutes (300000 milliseconds) before sending the next email
//       //   await new Promise(resolve => setTimeout(resolve, 300000));
//       // }
//       // console.log(accountCredentialsData,"jjjjjjjjjjjjjjjjjjjj");
//       return accountCredentialsData;
//   }

//   async function sendEmailsToServers(accountCredentialsData: AccountCredentials) {
//     try {
//       const serverData = await this.ServerModel.find().exec();
  
//       for (const server of serverData) {
//         console.log(server.email, "server");
//         await this.sendEmail(accountCredentialsData.fromEmail, server.email);
//         // Wait for 5 minutes (300000 milliseconds) before sending the next email
//         await new Promise(resolve => setTimeout(resolve, 300000));
//       }
//     } catch (error) {
//       console.error('Error sending emails to servers:', error);
//       // Handle error as needed
//     }
//   }
  
//   }



// }


import { Injectable, NotFoundException  } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AccountCredentials } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warmupisactive } from './Warmupisactive.schema';
import {Server} from './user.model';
import {Email} from './email.schema';

@Injectable()
export class WarmupService {
  private transporters: nodemailer.Transporter[] = [];

  constructor(@InjectModel(AccountCredentials.name) private readonly accountCredentialsModel: Model<AccountCredentials>,
  @InjectModel(Warmupisactive.name) private readonly WarmupisactiveModel: Model<Warmupisactive>,
  @InjectModel('Email') private readonly emailModel: Model<Email>,
  @InjectModel(Server.name) private readonly ServerModel: Model<Server>) {
  
    this.setupTransporters();
  }

  // private async setupTransporters(): Promise<void> {
  //   try {
  //     const accountdata = await this.WarmupfindAll();
  //     console.log(accountdata,"jjjjjjjjjjjjjj",accountdata.accountCredentialsData.fromEmail,accountdata.perday);
  //     if (accountdata) {
  //       const transporter = nodemailer.createTransport({
  //         service: 'gmail',
  //         auth: {
  //           user: accountdata.accountCredentialsData.fromEmail,
  //           pass: accountdata.accountCredentialsData.appPassword,
  //         },
  //         tls: {
  //           rejectUnauthorized: false,
  //         },
  //         connectionTimeout: 20000,  
  //       });
        
  //       this.transporters.push(transporter)
  //       const serverData = await this.ServerModel.find().exec();
       
  //     for (const server of serverData) {
  //       // console.log(accountdata , 'accountData')
  //       // console.log(server.email)
  //       await this.sendEmail(accountdata.accountCredentialsData.fromEmail, server.email);
  //       await new Promise(resolve => setTimeout(resolve, 300000));
  //     }
  //     } else {
  //       console.error('Error setting up transporters: Account data is undefined');
  //     }
  //   } catch (error) {
  //     console.error('Error setting up transporters:', error);
  //     // Handle the error appropriately (e.g., throw an exception)
  //   }
  // }
 
  private async setupTransporters(): Promise<void> {
    try {
      const accountdata = await this.WarmupfindAll();
      console.log(accountdata, "jjjjjjjjjjjjjj", accountdata.accountCredentialsData.fromEmail, accountdata.perday);
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
          sentEmailsCount++; // Increment the sent emails count
  
          // Wait for 5 minutes (300000 milliseconds) before sending the next email
          await new Promise(resolve => setTimeout(resolve, 300000));
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
 
  // async update(id: string, updateData: any): Promise<Warmupisactive | null> {
  //   const updatedDocument = await this.WarmupisactiveModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    
  //   if (!updatedDocument) {
  //     throw new NotFoundException(`Warmupisactive with ID ${id} not found`);
  //   }

  //   return updatedDocument;
  // }

  async update(id: string, updateData: any): Promise<Warmupisactive | null> {
    console.log(id,"idddddddddddddddddddd");
    // Remove the colon ':' from the beginning of the ID value
    const cleanedId = id.replace(':', '');
    
    const updatedDocument = await this.WarmupisactiveModel.findByIdAndUpdate(cleanedId, updateData, { new: true }).exec();
    
    if (!updatedDocument) {
      throw new NotFoundException(`Warmupisactive with ID ${cleanedId} not found`);
    }
  
    return updatedDocument;
  }


  async WarmupfindAll(): Promise<{ accountCredentialsData: AccountCredentials | null, perday: number }> {
    const warmupData = await this.WarmupisactiveModel.find().exec();
    // console.log('Warmup Data:', warmupData, warmupData[0].isOn);
    if (warmupData.length === 0) {
      throw new NotFoundException('No warmup data found.');
    }
    if (warmupData.length > 0 && warmupData[0].isOn) {
      const perday = warmupData[0].totalWarmUpEmailsPerDay; 
      // console.log(warmupData[0].id)
      const accountCredentialsData = await this.accountCredentialsModel.findOne({ _id: warmupData[0].id }).exec();
      if (!accountCredentialsData) {
        throw new NotFoundException('No corresponding account credentials found.');
      }
      return {accountCredentialsData,perday};
  }


  
    
  }






}
