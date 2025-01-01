import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { schema } from 'ngx-editor/schema';
import { ToolListComponent } from '../../../core/components/tool-list/tool-list.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editor-component',
  standalone: true,
  imports: [FormsModule, NgxEditorModule, CommonModule],
  template: `
    <div class="NgxEditor__Wrapper " [ngClass]="{'bg-danger': whenInvalid}">
      @if (barPosition == 'top') {

        <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"> </ngx-editor-menu>
      }
      <ngx-editor (ngModelChange)="showtext($event)" [editor]="editor" [ngModel]="html" [disabled]="false" class="custom-eidtor " style="height: {{height}}px;" [placeholder]="'Type here...'"></ngx-editor>
      @if (barPosition == 'bottom') {
        <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"> </ngx-editor-menu>
      }
</div>

  `,
  styles: `
  
  `
})
export class EditorComponentComponent implements OnInit, OnDestroy {

  @Input() barPosition: 'top' | 'bottom' = 'top';
  editor: Editor = new Editor();
  @Input() html = '';
  @Input() height: number = 200;

  @Input() fullTool: boolean = true;
  @Output() htmlChange = new EventEmitter<string>();
  toolbar: Toolbar = [];
  @Input() whenInvalid:boolean|undefined = false;

  fulltoolbar: Toolbar = [
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    ['ordered_list', 'bullet_list',
      'link', 'text_color', 'background_color', 'align_left', 'align_center', 'align_right', 'align_justify', 'superscript'],

  ];
  minifybar: Toolbar = [
    ['bold', 'italic', 'ordered_list', 'bullet_list', { heading: ['h3', 'h4', 'h5', 'h6'] }, 'text_color',],

  ];
  ngOnInit(): void {
    this.editor = new Editor({});
    this.toolbar = this.fullTool ? this.fulltoolbar : this.minifybar
  }
  showtext(e: any) {
    this.htmlChange.emit(e);

  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
