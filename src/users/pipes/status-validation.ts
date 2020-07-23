import { PipeTransform, BadRequestException, Injectable, ArgumentMetadata } from "@nestjs/common";
import { RoleStatus } from "../new.enum/role";
import * as mongose from 'mongoose';

//export class CourseValidationPipe implements PipeTransform {
export class RoleValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        RoleStatus.TEACH,
        RoleStatus.STU,
    ];

    private isStatusValid(role: any) {
        const idx = this.allowedStatuses.indexOf(role);
        return idx !== -1;
      }

    transform(value:any){
        value = value.toUpperCase()
        
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid role`);
        }
        return value;
    }
}

@Injectable()
export class ValidateObjectId implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const isValid = mongose.Types.ObjectId.isValid(value);
    if (!isValid) {
        throw new BadRequestException('Invalid ID!');
    }
    return value;
  }
}