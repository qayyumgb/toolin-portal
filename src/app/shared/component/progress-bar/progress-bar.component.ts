import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  template: `
   <div class="progress-wrapper w-75 mx-auto">
      <div class="progress-info">
        <div class="progress-percentage">
          <span class="text-xs font-weight-bold">{{figure}}%</span>
        </div>
      </div>
      <div class="progress">
        <div class="progress-bar bg-gradient-{{theme}}" style="width: {{figure}}%;" role="progressbar" aria-valuenow="60"
          aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  `,
  styles: ``
})
export class ProgressBarComponent {
  @Input() figure:number=20;
  @Input() theme:string="info";
}
