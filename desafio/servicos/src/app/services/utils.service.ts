import { Injectable } from '@angular/core';
import {
  AlertController,
  AlertOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private readonly alertCtrl: AlertController,
    private readonly toastCtrl: ToastController
  ) {}

  async alert(fields: AlertOptions) {
    const { header, subHeader, message, buttons, inputs } = fields;

    const alert = await this.alertCtrl.create({
      header,
      inputs: inputs || [],
      subHeader,
      message,
      buttons: buttons || ['OK'],
    });

    await alert.present();
  }

  async toast(fields: ToastOptions) {
    const { header, message, duration, color, buttons } = fields;

    const toast = await this.toastCtrl.create({
      header,
      message,
      color: color || 'warning',
      buttons,
      swipeGesture: 'vertical',
      duration: duration ?? 4000,
    });

    await toast.present();
  }
}
