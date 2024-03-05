import {
  Controller,
  Body,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      createdAt: new Date(),
    };
  
    const newUser = await this.userService.createUser(userData);
  
    if (newUser.error) {
      switch (newUser.error) {
        case "Email address already exists":
          return { error: "Email address already exists" };
        case "Invalid email":
          return { error: "Invalid email format" };
        default:
          return { error: "Signup failed. Please try again later." };
      }
    } else {
      return newUser;
    }
  }
  


  @Get('signup')
  getUsers() {
    return 'users';
  }

  @Post('login')
  async loginUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    try {
      const response = await this.userService.validateUser(email, password);
      console.log(response)
      if (!response.token) {
        throw new HttpException('Authentication failed. Invalid user or password.',HttpStatus.UNAUTHORIZED);
      }

      return response;
    } catch (error) {
      throw new HttpException('Oops , something went wrong',HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
