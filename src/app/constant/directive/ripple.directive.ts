import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ripple]',
  standalone: true

})
export class RippleModule {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const button = this.el.nativeElement;
   let  buttoncolor='rgba(255, 255, 255, 0.3)'
    if(button.classList.contains("ripple-primary")){
      buttoncolor ="rgba(248, 145, 0, 0.26)"
    }
    if(button.classList.contains("ripple-secondary")){
      buttoncolor ="rgba(147, 147, 147, 0.26)"
    }
    if(button.classList.contains("ripple-danger")){
      buttoncolor ="rgba(167, 13, 13, 0.26)"
    }
    
    // Create ripple element
    const ripple = this.renderer.createElement('span');

    // Get the size and position of the button
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Style the ripple
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x}px`);
    this.renderer.setStyle(ripple, 'top', `${y}px`);
    this.renderer.setStyle(ripple, 'position', 'absolute');
    this.renderer.setStyle(ripple, 'z-index', '1');
    this.renderer.setStyle(ripple, 'background', buttoncolor);
    this.renderer.setStyle(ripple, 'border-radius', '50%');
    this.renderer.setStyle(ripple, 'transform', 'scale(0)');
    this.renderer.setStyle(ripple, 'animation', 'ripple-animation 600ms linear');
    this.renderer.setStyle(ripple, 'pointer-events', 'none');

    // Append the ripple to the button
    this.renderer.appendChild(button, ripple);
    console.log(ripple);
    
    // Remove the ripple after animation
    setTimeout(() => {
      this.renderer.removeChild(button, ripple);
    }, 400);
  }
}
