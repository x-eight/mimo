import { PipeTransform, BadRequestException } from "@nestjs/common";
import { RoleStatus } from "../new.enum/role";

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

