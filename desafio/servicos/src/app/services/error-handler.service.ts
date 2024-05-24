import { ErrorHandler, Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private readonly utils: UtilsService) {}

  async handleError() {
    this.utils
      .toast({
        message: 'Erro interno do servidor',
        color: 'danger',
      })
      .catch(console.error);
  }
}
