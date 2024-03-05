import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User } from './user.modal';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
  
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  async createUser(userData: any): Promise<any> {
    try {
      const existingUser = await this.userModel.findOne({ email: userData.email });

      if (existingUser) {
        return { error: "Email address already exists" };
      } else if (!this.isValidEmail(userData.email)) {
        return { error: "Invalid email" };
      } else {
        const createdUser = new this.userModel({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          hash_password: userData.password,
          createdAt: userData.createdAt,
        });
        createdUser.hash_password = bcrypt.hashSync(userData.password, 10);
        await createdUser.save();
  
        const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET);
        return { user: createdUser, token };
      }
    } catch (error) {
      console.log(error.message)
      return { error: error.message };
    }
  }
  
   
  
  

  async getUserByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<any> {
      try {
        const user = await this.userModel.findOne({ email }).exec();
        console.log(bcrypt.hashSync(user.hash_password, 10))

        if (!user || !bcrypt.compareSync(password, user.hash_password)) {
          throw new UnauthorizedException('Invalid email or password');
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
          });
          return { token, user };
    }catch(error : any) {
        throw new Error('An error occurred during login');
    }
  
  } 
  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users;
  }
}
