import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: any = [];
  constructor() {}

  public getTasks() {
    return this.tasks;
  }

  public addTask(value: string, date: string): void {
    date = date.replace('-', '/');
    let task = { value, date: new Date(date), done: false };
    this.tasks.push(task);
    this.setToStorage();
  }

  public delTask(index: number) {
    this.tasks.splice(index, 1);
    this.setToStorage();
  }

  public updateTask(index: number, value: string, date: string) {
    const task: Task = this.tasks[index];
    task.value = value;
    date = date.replace('-', '/');
    task.date = new Date(date);
    this.tasks[index] = task;
    this.setToStorage();
  }

  public async setToStorage() {
    await Preferences.set({
      key: 'tasks',
      value: JSON.stringify(this.tasks),
    });
  }

  public async getFromStorage() {
    const { value } = await Preferences.get({ key: 'tasks' });
    let tempoTasks = value ? JSON.parse(value) : '';
    if (tempoTasks) {
      for (let temp of tempoTasks) {
        if (temp.date) {
          temp.date = format(new Date(temp.date), 'yyyy/MM/dd');
        } else {
          temp.date = '';
        }
        let task = {
          value: temp.value,
          date: new Date(temp.date),
          done: temp.done,
        };

        this.tasks.push(task);
      }
    }
  }
}

interface Task {
  value: string;
  date: Date;
  done?: boolean;
}
