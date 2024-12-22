import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService){}
  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailExists(createUserDto.email);
    await this.checkIfMobileExists(createUserDto.mobile);
    createUserDto.password = await hash(createUserDto.password,10);
    return this.prismaService.user.create({data: createUserDto});
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.getUser(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUser(id);

    if(updateUserDto.email){
      await this.checkIfEmailExists(updateUserDto.email, id);
    }

    if(updateUserDto.mobile){
      await this.checkIfMobileExists(updateUserDto.mobile, id);
    }

    if (updateUserDto.password && user.password !== updateUserDto.password){
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }
    return this.prismaService.user.update({where: { id },data: updateUserDto,});
  }

  async remove(id: number) {
    await this.getUser(id);
    return this.prismaService.user.delete({ where: { id }});
  }

  private async getUser(id: number){
    const user = await this.prismaService.user.findFirst({ where: { id }});

    if (!user){    
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async checkIfEmailExists(email: string, id?: number){
    const doesUserExist = await this.prismaService.user.findFirst({ where: { email },});
    if (doesUserExist){ 
      if (id && doesUserExist.id !== id){
        throw new BadRequestException (`User with ${email} already exists`);
      } else if (!id){
        throw new BadRequestException(`User with ${email} already exists`);
      }
    }
  }
  private async checkIfMobileExists(mobile: string, id?: number){
    const doesMobileExist = await this.prismaService.user.findFirst({ where: { mobile },});
    if (doesMobileExist){ 
      if (id && doesMobileExist.id !== id){
        throw new BadRequestException(`User with ${mobile} already exists`);
      } else if (!id){
        throw new BadRequestException(`User with ${mobile} already exists`);
      }
    }
  }
}
