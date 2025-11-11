import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public toOpenModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  openModal() {
    this.toOpenModal.next(true);
  }
}