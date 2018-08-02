import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {
  @Output() scrolldown: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollup: EventEmitter<any> = new EventEmitter<any>();

  constructor(private el: ElementRef) { }
  @HostListener('scroll', ['$event']) onScrollDown(evt) {
    const element = this.el.nativeElement;
    if (element.scrollTop === 0) {
      this.scrollup.emit();
    } else {
      const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      if (atBottom) {
        this.scrolldown.emit();
      }
    }
  }
}
