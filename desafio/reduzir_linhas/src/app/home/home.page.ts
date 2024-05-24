import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

interface Person {
  name: string;
  age: number;
  image?: ArrayBuffer | string | null;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  protected people: Person[] = [];
  protected newPerson = {} as Person;
  private personIndex: number | null = null;
  protected isEditing: boolean = false;

  constructor(
    private readonly storage: Storage,
    private readonly alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const people = await this.storage.get('people');
    if (people.length) this.people = people;
  }

  protected async addOrEditPerson() {
    const newPerson: Person = {
      name: this.newPerson.name,
      age: this.newPerson.age ? this.newPerson.age : 0,
      image: this.newPerson.image ? this.newPerson.image.toString() : undefined,
    };
    if (this.newPerson.name) {
      if (!this.isEditing && this.newPerson.age) this.people.push(newPerson);
      else this.people[this.personIndex!] = newPerson;

      await this.storage.set('people', this.people);
    }
    this.clearFields();
  }

  protected async confirmDeletePerson(personIndex: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir esta pessoa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            this.people.splice(personIndex, 1);
            await this.storage.set('people', this.people);
            this.clearFields();
          },
        },
      ],
    });
    await alert.present();
  }

  protected startEdit(person: Person, index: number) {
    this.isEditing = true;
    this.newPerson = { ...person };
    this.personIndex = index;
  }

  protected onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.newPerson.image = undefined;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => (this.newPerson.image = reader.result);
    reader.readAsDataURL(file);
  }

  private clearFields() {
    this.newPerson = {} as Person;
    this.isEditing = false;
    this.personIndex = null;

    const fileInput: HTMLInputElement | null =
      document.querySelector('#fileInput');
    if (fileInput) fileInput.value = '';
  }
}
