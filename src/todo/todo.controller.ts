import type { Request as Req } from "express";
import { Controller, Get, Request, Route, SuccessResponse } from "tsoa";
import { TTodo } from "./todo.types";

@Route("todos")
export class TodosController extends Controller {
  @Get()
  @SuccessResponse("200", "OK")
  public async getTodos(@Request() req: Req): Promise<TTodo[] | null> {
    return [];
  }
}
