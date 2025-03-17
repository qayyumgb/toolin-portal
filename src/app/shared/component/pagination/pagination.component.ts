import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-end">
      <nav aria-label="Page navigation mt">
        <ul class="pagination news-pagination align-items-center gap-3">
          
          <li class="page-item cursor-pointer" 
          [ngClass]="{'disabled': currentPage === 1 || bothDisable || prevDisable}" 
          (click)="getFirstPageOfNews(currentPage - 1)">
            <a class="page-link p-2 gap-2" aria-label="Previous">
              <span class="fa p-icon fa-chevron-left"></span>
              <span class="p-text">  Previous  </span>

            </a>
          </li>
          Page {{currentPage}} of {{totalPage}}

          <li class="page-item cursor-pointer" 
          [ngClass]="{'disabled': currentPage === totalPage || bothDisable || nextDisable}" 
          (click)="getFirstPageOfNews(currentPage + 1)">
            <a class="page-link" aria-label="Next">
            <span class="p-text">  Next  </span>
              <span  class="fa p-icon fa-chevron-right"></span>
            </a>
          </li>
          
        </ul>
      </nav>
    </div>
  `,
  styles: `
    .news-pagination {
      .page-link {
        border-color: #b2b2b2;
        border-width: 1px;
        width:auto;
        border-radius:0  !important;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        color: #b2b2b2;
        padding: 0.5rem 1rem !important;
        span.p-text{
        

        }
        span.p-icon{
          width: auto;
        }
      }

     
      .disabled {
        pointer-events: none;
        opacity: 0.6;
      }
    }
  `
})
export class PaginationComponent implements OnInit {
  @Input() totalPage: number = 1;
  @Input() count: number = 1;
  @Input() currentPage: number = 1;
  @Input() nextDisable: boolean = false;
  @Input() prevDisable: boolean = false;
  @Input() bothDisable: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  get getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalPage = this.totalPage;

    if (totalPage <= 4) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPage);
      } else if (this.currentPage > 4 && this.currentPage < totalPage - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPage);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = totalPage - 3; i <= totalPage; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  }

  constructor() { }

  ngOnInit(): void {
    this.totalPage = Math.ceil(this.count / 10);
  }

  getFirstPageOfNews(id: number | string = 1) {
    if (typeof id === 'number') {
      if (id < 1) id = 1;
      if (id > this.totalPage) id = this.totalPage;
      this.currentPage = id;
      this.pageChange.emit(id);

    }
  }
}