import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService){}
  async create(createTodoDto: CreateTodoDto) {
    const todoExists = await this.prismaService.todo.findFirst({
      where: { 
        title: createTodoDto.title, 
        user_id: createTodoDto.user_id },
    });

    if (todoExists) {
      throw new ConflictException(`Todo ${createTodoDto.title} already exists`);
    }

    const todo = await this.prismaService.todo.create({
      data: createTodoDto,});

    return todo;
  }

  async findAll(user_id: number) {
    return this.prismaService.todo.findMany({
      where: { user_id }},
  );
  }

  async findOne(id: number, user_id: number) {
    return this.getTodo(id, user_id);
  }

  async update(id: number,user_id: number, updateTodoDto: UpdateTodoDto) {
    await this.getTodo(id, user_id);
    if (updateTodoDto.title){
      await this.checkIfTodoExists(updateTodoDto.title, id, user_id);
    }
    return this.prismaService.todo.update({ where: { id, user_id }, data: updateTodoDto});
  }

  async remove(id: number, user_id: number) {
    await this.getTodo(id, user_id);
    return this.prismaService.todo.delete({ where: { id, user_id }});
  }

  private async getTodo(id: number, user_id: number){
    const todo = await this.prismaService.todo.findFirst({ where: { id, user_id } });

    if (!todo){ 
      throw new NotFoundException('TODO not found');
    }
    return todo;
  }

  private async checkIfTodoExists(title: string,user_id: number, id?: number){
    const doesTodoExist = await this.prismaService.todo.findFirst({ where: { title, user_id },});
    if (doesTodoExist){ 
      if (id && doesTodoExist.id !== id){
        throw new BadRequestException(`TODO ${title} already exists`);
      } else if (!id){
        throw new BadRequestException(`TODO ${title} already exists`);
      }
    }
  }
}
