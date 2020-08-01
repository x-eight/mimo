
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { RoleStatus } from '../new.enum/role';

export class UpdateUser {
  @IsOptional()
  @IsIn([RoleStatus.STU, RoleStatus.TEACH])
  status: RoleStatus ;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;
}