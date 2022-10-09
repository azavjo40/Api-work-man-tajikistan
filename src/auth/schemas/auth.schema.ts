import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop()
  username: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  roles: string[];

  @Prop()
  dateCreated: string;

  @Prop()
  image?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
