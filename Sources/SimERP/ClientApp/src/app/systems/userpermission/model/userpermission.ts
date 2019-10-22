export class UserRole {
  UserRoleId: number;
  StoreId: number;
  UserId: number;
  RoleId: number;
}

export class UserRoleList {
  RoleId: number;
  RoleName: string;
  isCheck: boolean = false;
}