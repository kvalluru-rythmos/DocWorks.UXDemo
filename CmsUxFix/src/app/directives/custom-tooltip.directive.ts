import { Directive, ElementRef, OnInit } from '@angular/core';


@Directive({
  selector: '[appCustomTooltip]'
})
export class CustomTooltipDirective implements OnInit {

  nativeElement: any;
  constructor(private element: ElementRef) {
    this.nativeElement = this.element.nativeElement;
  }

  ngOnInit(): void {
    this.nativeElement.classList.add('custom-tooltip-parent');
    this.nativeElement.children[0].addEventListener('mouseover', function () {
      this.parentElement.children[1].style.display = 'block !important';
    });
  }


}
