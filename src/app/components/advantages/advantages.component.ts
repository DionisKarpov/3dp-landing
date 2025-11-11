import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-advantages',
  templateUrl: './advantages.component.html',
  styleUrls: ['./advantages.component.scss']
})
export class AdvantagesComponent {
  private modalService = inject(ModalService);

  openModal(): void {
    this.modalService.openModal();
  }
}
