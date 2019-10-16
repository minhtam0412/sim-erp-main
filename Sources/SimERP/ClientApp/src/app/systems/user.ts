export class User {
  UserId: number;
  UserCode: string = '';
  UserName: string = '';
  Password: string = '';
  SecondPassword: string = '';
  FullName: string = '';
  Address: string = '';
  PhoneNumber: string = '';
  Email: string = '';
  DepartmentId?: number;
  Avatar: string;
  IsActive: boolean = true;
  UserTypeName: string = '';
  CreatedDate: Date;
  CreatedBy: number;
  Gender: number;
  UserTypeId: number;
  IsFirstChangePassword: Boolean;
  PageDefault: string;
}
