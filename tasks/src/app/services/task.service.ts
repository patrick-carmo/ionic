import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: any = [];
  constructor() {}

  public getTasks(): Task[] {
    return this.tasks;
  }

  public addTask(value: string, date: string): void {
    const task: Task = {
      value,
      date: new Date(date),
      done: false,
    };
    this.tasks.push(task);
  }

  public delTask(index: number) {
    this.tasks.splice(index, 1);
  }

  public updateTask(index: number, value: string, date: string) {
    const task: Task = this.tasks[index];
    task.value = value;
    task.date = new Date(date);
    this.tasks[index] = task;
  }
}

interface Task {
  value: string;
  date: Date;
  done?: boolean;
}
