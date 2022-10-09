import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AnyAaaaRecord } from 'dns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private auth: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user: any = await this.auth.findOne({ username });
      const isMatchPass: boolean = await compare(pass, user?.password);
      if (isMatchPass) {
        const { password, ...result } = user._doc;
        return result;
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  }

  public async login(user: any) {
    try {
      delete user.password;
      return { access_token: this.jwtService.sign({ user }) };
    } catch (e) {
      console.log(e);
    }
  }

  public async getProfile(user: any) {
    try {
      const candidate: any = await this.auth.findOne({ _id: user._id });
      const { password, ...result } = candidate._doc;
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  public async register(registerDto: RegisterDto) {
    try {
      const { username, password }: RegisterDto = registerDto;
      const candidate = await this.auth.findOne({ username });
      if (candidate) return { message: 'This user already exists' };
      registerDto.password = await hash(password, 12);
      registerDto.dateCreated = new Date(Date.now()).toUTCString();
      const user = await new this.auth(registerDto);
      await user.save();
      delete user.password;
      return { access_token: this.jwtService.sign({ user }) };
    } catch (e) {
      console.log(e);
    }
  }

  public async updateUser(user: any, image: any) {
    try {
      const candidate = await this.auth.findOne({ _id: user._id });
      candidate.image = image.image;
      await new this.auth(candidate).save();
      return { message: 'Updated image' };
    } catch (e) {
      console.log(e);
    }
  }
}
