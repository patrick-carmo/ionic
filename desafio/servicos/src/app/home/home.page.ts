import { UtilsService } from './../services/utils.service';
import { Component, inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { FormBuilder, Validators } from '@angular/forms';

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

  protected form = inject(FormBuilder).group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('[a-zA-Z ]*'),
      ],
    ],
    age: [0, [Validators.min(1), Validators.max(150)]],
    image: [null],
  });

  constructor(
    private readonly storageService: StorageService,
    private readonly utils: UtilsService
  ) {}

  async ngOnInit() {
    const people = await this.storageService.get('people');
    if (people && people.length) this.people = people;
  }

  startEdit(person: Person, index: number) {
    this.isEditing = true;
    this.newPerson = { ...person };
    this.personIndex = index;
  }

  protected async setPerson() {
    const { name, age } = this.form.value;

    if (!this.form.valid || !name || !age) {
      await this.utils.toast({
        message: 'Preencha todos os campos corretamente',
      });
      return;
    }

    const newPerson: Person = {
      name,
      age,
      image: this.newPerson.image,
    };

    if (this.isEditing && this.personIndex !== null)
      this.people[this.personIndex] = newPerson;
    else this.people.push(newPerson);

    await this.storageService.set('people', this.people);
    this.resetForm();
  }

  protected async confirmDeletePerson(person: Person, personIndex: number) {
    await this.utils.alert({
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
            await this.storageService.set('people', this.people);
            this.resetForm();

            await this.utils.toast({
              header: 'Sucesso',
              message: 'Pessoa excluída com sucesso',
              buttons: [
                {
                  text: 'Desfazer',
                  handler: async () => {
                    this.people.splice(personIndex, 0, person);
                    await this.storageService.set('people', this.people);
                  },
                },
              ],
            });
          },
        },
      ],
    });
  }

  protected async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      this.newPerson.image = undefined;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => (this.newPerson.image = reader.result);
    reader.readAsDataURL(file);
  }

  protected resetForm() {
    this.newPerson = {} as Person;
    this.isEditing = false;
    this.personIndex = null;

    this.form.reset();
  }
}
