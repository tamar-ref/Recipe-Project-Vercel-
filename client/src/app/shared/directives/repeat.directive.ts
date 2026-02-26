import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appRepeat(times: number) {
    this.viewContainer.clear();

    const count = Math.floor(times);
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    }
  }
}
