import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type AdsDocument = Ads & Document;

@Schema()
export class Ads {
  @Prop()
  title: string;

  @Prop()
  city: string;

  @Prop()
  description: string;

  @Prop()
  skils: string[];

  @Prop()
  userId: string;

  @Prop()
  images?: string[];

  @Prop()
  isPublish: boolean;

  @Prop()
  dateCreated: string;

  @Prop()
  dateUpdate: string;
}

export const AdsSchema = SchemaFactory.createForClass(Ads);
