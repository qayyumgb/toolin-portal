import { Component, OnInit } from '@angular/core';
import { EditorComponentComponent } from '../../../shared/component/editor-component/editor-component.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolService } from '../../../shared/services/tool.service';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

type addTool = {

  brand: string;
  category1: string;
  category2: string;
  category3: string;
  description: string;
  images: any
  hasInsurance: boolean
  isAvailable: boolean
  isOperatorAvailable: boolean
  isOwnerApproved: false
  marketValue: string;
  model: string;
  name: string;
  priceDaily: number
  priceMonthly: number
  priceWeekly: number
  streetAddress: string;
}
@Component({
  selector: 'app-add-tool',
  standalone: true,
  imports: [EditorComponentComponent,NgMultiSelectDropDownModule , CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-tool.component.html',
  styleUrl: './add-tool.component.scss'
})
export class AddToolComponent implements OnInit {
  formtab: number = 1;
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};
  addTool(tool: addTool) {
    console.log(tool)
  }
  newToolForm: FormGroup;

  constructor(private fb: FormBuilder, private tools:ToolService) {

    this.newToolForm = this.fb.group({
      brand: ['', Validators.required],
      category1: ['',],
      category2: ['',],
      category3: ['',],
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
      hasInsurance: [false],
      isAvailable: [true],
      isOperatorAvailable: [false],
      isOwnerApproved: [false],
      marketValue: ['', Validators.required],
      model: ['', Validators.required],
      priceDaily: [0, Validators.required],
      priceMonthly: [0, Validators.required],
      priceWeekly: [0, Validators.required],
      streetAddress: [''],
      _geoloc:[{lat:0,lng:0}],
      isDeliveryAvailable:[false] ,
      isPublished:[false],
    });
  }
  AddToolHandler(){
    this.newToolForm.patchValue({
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1WNJMT1e93sFm6AThHWpPRQXwi_EvpoCWUFhCQ_SRiYt1fCm4rS3BbHezh3o8Ip2yXsM&usqp=CAU"]
    })
    if (this.newToolForm.valid) {console.log(this.newToolForm.value);
      this.tools.add(this.newToolForm.value).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error('There was an error!', error);
      }});
    } else {
      console.log('Form is invalid');
    }  }

    onItemSelect(item: any) {
      console.log(item);
    }
    onSelectAll(items: any) {
      console.log(items);
    }
  ngOnInit(): void {
    this.getCategory();  }


  category:any ;
 getCategory(){
  this.tools.getCategory().subscribe((x:any[]) =>{
    this.category = x.map(x => {
      return {
        item_id: x.id,
        item_text: x.name
      }
    });
    console.log(x);
    
  })




  this.dropdownList = [
    { item_id: 1, item_text: 'Mumbai' },
    { item_id: 2, item_text: 'Bangaluru' },
    { item_id: 3, item_text: 'Pune' },
    { item_id: 4, item_text: 'Navsari' },
    { item_id: 5, item_text: 'New Delhi' }
  ]
  this.selectedItems = [
    { item_id: 3, item_text: 'Pune' },
    { item_id: 4, item_text: 'Navsari' }
  ];
  this.dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
}
  changeTab(e: number) {
    let goNext: boolean = false;
    switch (e) {
      case 1:
        goNext = true;
        break;
      case 2:
        goNext = this.newToolForm.get('brand')?.valid && this.newToolForm.get('name')?.valid ? true : false
        break;
      case 3:
        goNext = this.newToolForm.get('description')?.valid ? true : false
        break;
      default:
        goNext = true;


    }
    if (e < 6 && e > 0 && goNext) {
      this.formtab = e
      console.log(this.formtab);

    }
    else{
      this.newToolForm.markAllAsTouched();

    }
  }
  data = [
    {
      id: 1,
      icon: 'fa-home',
      name: 'General',
      detail: 'Basic information about the tool',
    },
    {
      id: 2,
      icon: 'fa-cogs',
      name: 'Description',
      detail: 'Describe the tool and its features',
    },
    {
      id: 5,
      icon: 'fa-camera',
      name: 'Media',
      detail: 'Add images and videos of the tool',
    },
    {
      id: 4,
      icon: 'fa-money-check-alt',
      name: 'Price',
      detail: 'Set the price for the tool',
    },
    {
      id: 4,
      icon: 'fa-envelope-open-text',
      name: 'Others',
      detail: 'Set other details for the tool',
    },
  ]

  getModal(e: any) {
    console.log(e);
    this.newToolForm.patchValue({
      description: e
    });
  }

  removeImage(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1)
  }

  
  selectedFiles: File[] = [];
  previewUrls: (string | ArrayBuffer | null)[] = [];

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFiles = Array.from(fileInput.files);
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrls.push(reader.result);
          console.log(this.previewUrls[0]);

        };
        reader.readAsDataURL(file);
      });
    }
  }
}
