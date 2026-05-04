export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}
