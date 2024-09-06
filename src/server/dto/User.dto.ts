export class CreateUserDto {
    oAuthkey: string;
    userName: string;
}

export class UpdateUserDto {
    oAuthkey?: string;
    userName?: string;
}