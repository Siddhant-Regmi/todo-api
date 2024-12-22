import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
    
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsBoolean()
    @IsOptional()
    iscomplete: boolean;

    @IsOptional()
    @IsNumber()
    user_id: number;
}
