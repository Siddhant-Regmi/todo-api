import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Request } from 'express';

interface JwtPayload extends Request {
  payload: {
    user_id: number;
  };
}

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Req() request: JwtPayload,
    @Body() createTodoDto: CreateTodoDto) {
      createTodoDto.user_id = request.payload.user_id;
      return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Req() request: JwtPayload) {
    return this.todosService.findAll(request.payload.user_id);
  }

  @Get(':id')
  findOne(
    @Req() request: JwtPayload,
    @Param('id') id: string) {
    return this.todosService.findOne(+id,request.payload.user_id);
  }

  @Patch(':id')
  update(@Req() request: JwtPayload,
  @Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id,request.payload.user_id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Req() request: JwtPayload,
  @Param('id') id: string) {
    return this.todosService.remove(+id, request.payload.user_id);
  }
}
