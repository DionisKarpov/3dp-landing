import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
  imports: [CommonModule]
})
export class MaterialsComponent {
  private modalService = inject(ModalService);

  openModal(): void {
    this.modalService.openModal();
  }
}
