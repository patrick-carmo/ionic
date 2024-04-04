import { Component } from '@angular/core';
import {
  AlertController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  type: string = 'pending';

  constructor(
    public alertController: AlertController,
    public taskService: TaskService,
    public toastController: ToastController,
    public popoverController: PopoverController
  ) {}

  async presentAlertPromptAdd() {
    const alert = await this.alertController.create({
      header: 'Adicionar Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Tarefa',
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Data',
          min: '2020-01-01',
          max: '2026-12-31',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.task !== '') {
              return this.taskService.addTask(alertData.task, alertData.date);
            }

            this.presentToast();
            this.presentAlertPromptAdd();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Preencha a tarefa',
      duration: 2000,
    });
    await toast.present();
  }

  async presentAlertPromptDelete(index: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Tarefa',
      message: 'Deseja excluir a tarefa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.taskService.delTask(index);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertPromptUpdate(index: number, task: any) {
    const alert = await this.alertController.create({
      header: 'Atualizar Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Tarefa',
          value: task.value,
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Data',
          min: '2020-01-01',
          max: '2026-12-31',
          value: task.date.toISOString().substring(0, 10),
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (alertData) => {
            if (alertData.task !== '') {
              this.taskService.updateTask(
                index,
                alertData.task,
                alertData.date
              );
              return;
            }

            this.presentToast();
            this.taskService.updateTask(index, alertData.task, alertData.date);
          },
        },
      ],
    });
    await alert.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
    });

    return await popover.present();
  }
}