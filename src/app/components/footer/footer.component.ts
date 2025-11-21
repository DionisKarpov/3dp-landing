import { Component, HostListener } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { RouterLink } from "@angular/router";
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
  isScrolled: boolean = false;
  activeSection: string | null = null;

  constructor(private scrollService: ScrollService,
              private modalService: ModalService) { }

  scrollTo(sectionId: string): void {
    this.scrollService.scrollToElement(sectionId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
    this.activeSection = this.scrollService.getCurrentSection();
  }

  openModal(templateName: string): void {
    this.modalService.openModal(templateName);
  }
}
