import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDocumentDocument = ResearchDocument & Document;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  tags: string[];

  @Prop()
  uploadedBy: string;

  @Prop()
  fileUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);

// Add text index for search
ResearchDocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });
