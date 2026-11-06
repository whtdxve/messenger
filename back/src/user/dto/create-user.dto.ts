import { IsEmail, MinLength, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Transform(({ value }) => bcrypt.hashSync(value, 10))
    password!: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 40)
    tag!: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 40)
    name!: string;

    @IsOptional()
    @IsString()
    profile_image?: string
}
