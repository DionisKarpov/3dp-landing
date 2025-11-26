import { Component, signal, computed, Signal, ElementRef, Renderer2, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export type ProcessSlide = {
  title: string;
  image: string;
  alt?: string;
};

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  imports: [CommonModule]
})
export class ProcessComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLElement>;

  index = signal(0);
  knobX = signal(0);
  cardGap = 16;
  cardWidth = 282;
  cardHeight = 383;
  slideStep = 1;

  _slides = signal<ProcessSlide[]>([
    { title: 'Модель', image: 'assets/images/process/1.webp', alt: '3D модель' },
    { title: 'Друк', image: 'assets/images/process/2.webp', alt: 'Друк' },
    { title: 'Пост-обробка', image: 'assets/images/process/3.webp', alt: 'Пост-обробка' },
    { title: 'Збірка', image: 'assets/images/process/4.webp', alt: 'Збірка' },
    { title: 'Готова модель', image: 'assets/images/process/5.webp', alt: 'Готова модель' },
  ]);

  slidesSig: Signal<ProcessSlide[]> = this._slides;
  count = computed(() => this._slides().length);
  isBrowser: boolean;
  private wasMobile = false;

  private pointerId?: number;
  private dragStartX = 0;
  private dragStartIndex = 0;
  private removeMove?: () => void;
  private removeUp?: () => void;
  private resizeHandler?: () => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private r2: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.wasMobile = this.isMobile();
    this.updateKnobPosition();
    this.resizeHandler = () => {
      const nowMobile = this.isMobile();
      if (!this.wasMobile && nowMobile) {
        setTimeout(() => this.scrollToActiveCard(), 100);
      }
      this.wasMobile = nowMobile;
      this.updateKnobPosition();
      this.index.set(this.index());
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    this.detachDrag();
    if (this.isBrowser && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  isMobile(): boolean {
    return this.isBrowser && window.innerWidth <= 768;
  }

  get translateX(): string {
    if (this.isMobile()) {
      return 'translateX(0)';
    }
    
    const container = this.el.nativeElement.querySelector('.process__container');
    const containerWidth = container ? container.clientWidth : 1200;
    const activeCardWidth = 308;
    const idx = this.index();
    const firstCardMargin = 24;
    
    let offset = firstCardMargin;
    for (let i = 0; i < idx; i++) {
      offset += this.cardWidth + this.cardGap;
    }
    
    offset = offset - (containerWidth / 2) + (activeCardWidth / 2);
    
    const n = this.count();
    let totalWidth = firstCardMargin;
    for (let i = 0; i < n; i++) {
      totalWidth += (i === idx ? activeCardWidth : this.cardWidth);
      if (i < n - 1) totalWidth += this.cardGap;
    }
    
    const maxOffset = Math.max(0, totalWidth - containerWidth);
    const clamped = Math.min(Math.max(offset, 0), maxOffset);
    
    return `translateX(${-Math.round(clamped)}px)`;
  }

  get knobStyle(): any {
    return { left: `${this.knobX()}px` };
  }

  get mathCount(): number {
    return Math.max(1, this.count() - 1);
  }

  onKnobPointerDown(ev: PointerEvent): void {
    if (this.isMobile()) return;
    ev.preventDefault();
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
    this.pointerId = ev.pointerId;

    const { left } = this.trackMetrics();
    this.dragStartX = ev.clientX - left;
    this.dragStartIndex = this.index();

    const move = (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;
      const rel = e.clientX - left;
      const clamped = Math.max(0, Math.min(rel, this.trackWidth()));
      this.knobX.set(clamped);
    };

    const up = (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;
      const idx = this.nearestIndexByX(this.knobX());
      this.goTo(idx);
      this.detachDrag();
      this.pointerId = undefined;
    };

    this.removeMove = this.r2.listen('document', 'pointermove', move);
    this.removeUp = this.r2.listen('document', 'pointerup', up);
  }

  goTo(i: number): void {
    const idx = Math.max(0, Math.min(i, this.count() - 1));
    this.index.set(idx);
    this.updateKnobPosition();

    if (this.isMobile()) {
      requestAnimationFrame(() => this.scrollToActiveCard());
    }
  }

  next(): void {
    this.goTo(this.index() + this.slideStep);
  }

  prev(): void {
    this.goTo(this.index() - this.slideStep);
  }

  private updateKnobPosition(): void {
    if (!this.isMobile()) {
      this.knobX.set(Math.round(this.index() * this.stepX()));
    }
  }

  private scrollToActiveCard(): void {
    if (!this.isMobile() || !this.viewportRef) return;
    const cards = this.viewportRef.nativeElement.querySelectorAll('.process__card');
    const activeCard = cards[this.index()] as HTMLElement;
    if (activeCard) {
      activeCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }

  private detachDrag(): void {
    if (this.removeMove) {
      this.removeMove();
      this.removeMove = undefined;
    }
    if (this.removeUp) {
      this.removeUp();
      this.removeUp = undefined;
    }
  }

  private stepX(): number {
    const steps = Math.max(1, this.count() - 1);
    return this.trackWidth() / steps;
  }

  private trackEl(): HTMLElement {
    return this.el.nativeElement.querySelector('.process__track') as HTMLElement;
  }

  private trackMetrics() {
    const rect = this.trackEl().getBoundingClientRect();
    return { left: rect.left };
  }

  private trackWidth(): number {
    return this.trackEl()?.clientWidth || 0;
  }

  private nearestIndexByX(x: number): number {
    const steps = Math.max(1, this.count() - 1);
    const stepX = this.trackWidth() / steps;
    return Math.round(x / stepX);
  }
}