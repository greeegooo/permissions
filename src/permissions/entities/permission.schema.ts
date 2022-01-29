import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {

    @Prop()
    initiative: string;
    @Prop()
    fields: Field[]
}

export class Field {
    property: string;
    access_key: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);