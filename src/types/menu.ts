export interface MenuItemDto {
  id: number;
  titleKey: string;
  title: string;
  icon?: string;
  route?: string;
  path?: string;
  orderIndex: number;
  children: MenuItemDto[];
  requiredPermission?: string;
  allowedRoles: string[];
  parentId?: number;
  isRootItem: boolean;
  hasChildren: boolean;
}

export interface MenuResponse {
  data: MenuItemDto[];
}
