import { ActionSheetController } from '@ionic/angular';
import { FotoService } from './../services/foto.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    public fotoService: FotoService,
    public actionSheetController: ActionSheetController
  ) {}

  async presentActionSheet(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Deletar',
          icon: 'trash',
          handler: () => {
            this.fotoService.deleteFoto(index);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
