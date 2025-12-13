import { UserDto } from "@sgcv2/shared";

export interface ValidationService {
    validateUser(username: string, password: string): Promise<UserDto>;
}