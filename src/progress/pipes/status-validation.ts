import { PipeTransform, BadRequestException } from "@nestjs/common";
import { StatusAdavance } from "../new.enum/status";


export class AdvanceValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        StatusAdavance.NO,
        StatusAdavance.YES,
    ];

    private isStatusValid(advance: any) {
        const idx = this.allowedStatuses.indexOf(advance);
        return idx !== -1;
      }

    transform(value:any){
        value = value.toUpperCase()
        
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid value`);
        }
        return value;
    }
}

