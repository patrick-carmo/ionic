import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  InfiniteScrollCustomEvent,
  IonCard,
  IonCardContent,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  ModalController,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { ModalComponent } from '../modal/modal.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonButton,
    IonCardContent,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLabel,
    IonItem,
    IonList,
    IonAvatar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
    CommonModule,
  ],
})
export class HomePage {
  items: any[] = [];
  private posts: any;
  private users: any;

  private acumulator: number = 0;

  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    this.posts = await this.api.getPosts().toPromise();
    this.users = await this.api.getUsers().toPromise();

    await this.generateItems();
  }

  private async generateItems() {
    if (this.acumulator <= this.posts.length - 10) {
      for (let i = this.acumulator; i < this.acumulator + 10; i++) {
        const post = this.formatPost(this.posts[i]);

        this.items.push(post);
      }

      this.acumulator += 10;
      return;
    }

    this.showToast();
  }

  private formatPost(post: any) {
    const name = this.users.find((user: any) => user.id === post.userId).name;

    return {
      id: post.id,
      title: post.title,
      body: post.body,
      name,
    };
  }

  async openModal(post: any) {
    const comments = await this.api.getComments(post.id).toPromise();

    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      breakpoints: [0, 0.4, 1],
      componentProps: {
        comments,
      },
      initialBreakpoint: 1,
    });
    await modal.present();
  }

  private async showToast() {
    const toast = await this.toast.create({
      message: 'No more posts',
      color: 'warning',
      duration: 2000,
    });

    await toast.present();
  }

  onIonInfinite(ev: any) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
