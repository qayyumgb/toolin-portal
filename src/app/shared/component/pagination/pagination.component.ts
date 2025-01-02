import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-end">
      <nav aria-label="Page navigation mt">
        <ul class="pagination news-pagination">
          <li class="page-item cursor-pointer" (click)="getFirstPageOfNews(1)">
            <a class="page-link p-2" aria-label="First">
              <i class="fa-solid fa-angles-left"></i>
            </a>
          </li>
          <li class="page-item cursor-pointer" [ngClass]="{'disabled': currentPage === 1}" (click)="getFirstPageOfNews(currentPage - 1)">
            <a class="page-link p-2" aria-label="Previous">
              <span class="fa fa-chevron-left"></span>
            </a>
          </li>
          <ng-container *ngFor="let page of getPageNumbers; let i = index">

            
            <li  class="page-item cursor-pointer" [ngClass]="{'active': currentPage === page}" 
            (click)="getFirstPageOfNews(page)">
            <a class="page-link" *ngIf="page !== '...'">{{ page }}</a>
            <span class="page-link" *ngIf="page === '...'">{{ page }}</span>
          </li>
        </ng-container>
          <li class="page-item cursor-pointer" [ngClass]="{'disabled': currentPage === totalPage}" (click)="getFirstPageOfNews(currentPage + 1)">
            <a class="page-link" aria-label="Next">
              <span class="fa fa-chevron-right"></span>
            </a>
          </li>
          <li class="page-item cursor-pointer" (click)="getFirstPageOfNews(totalPage)">
            <a class="page-link" aria-label="Last">
              <i class="fa-solid fa-angles-right"></i>
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
        border-radius: 5px;
        border-width: 1px;
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 500;
        color: #b2b2b2;
      }

      .active {
        .page-link {
          background: linear-gradient(90deg, #f89100, #ff7417);
          color: white;
          border-color: var(--bs-primary);
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

  constructor() {}

  ngOnInit(): void {
    this.totalPage = Math.ceil(this.count / 10);
  }

  getFirstPageOfNews(id: number|string = 1) {
   if (typeof id === 'number') {
    if (id < 1) id = 1;
    if (id > this.totalPage) id = this.totalPage;
    this.currentPage = id;
    this.pageChange.emit(id);
    
   }
  }
}