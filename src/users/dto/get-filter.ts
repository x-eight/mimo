import { RoleStatus } from '../new.enum/role';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetFilterDto {
  @IsOptional()
  @IsIn([RoleStatus.TEACH, RoleStatus.STU])
  role: RoleStatus ;

  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  price: string;
}