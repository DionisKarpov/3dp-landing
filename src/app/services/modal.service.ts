import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public toOpenModal: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() {}

  openModal(templateName: string): void {
    this.toOpenModal.next(templateName);
  }
}