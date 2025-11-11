import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [CommonModule]
})
export class BannerComponent {
  private modalService = inject(ModalService);
  private scrollService = inject(ScrollService);  

  scrollTo(sectionId: string): void {
    this.scrollService.scrollToElement(sectionId);
  }

  openModal(): void {
    this.modalService.openModal();
  }
}
