export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  permissions: string[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Permission {
  id: number;
  module: string;
  functionality: string;
  action: string;
  description: string;
}
