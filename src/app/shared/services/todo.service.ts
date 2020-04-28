import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoModel } from '../models';
import { Constance } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) {}

  getTodoList(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${Constance.apiUrlConst}todo`);
  }

  postTodo(todo: TodoModel): Observable<TodoModel> {
    return this.http.post<TodoModel>(`${Constance.apiUrlConst}todo`, todo);
  }

  deleteTodo(id: string): Observable<TodoModel> {
    return this.http.delete<TodoModel>(`${Constance.apiUrlConst}todo/${id}`);
  }

  putTodo(id: string, formData: TodoModel): Observable<TodoModel> {
    return this.http.put<TodoModel>(`${Constance.apiUrlConst}todo/${id}`, formData);
  }
}
