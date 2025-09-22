import { Component, HostListener } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isScrolled: boolean = false;
  activeSection: string | null = null;

  constructor(private scrollService: ScrollService) { }

  scrollTo(sectionId: string): void {
    this.scrollService.scrollToElement(sectionId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
    this.activeSection = this.scrollService.getCurrentSection();
  }
}
