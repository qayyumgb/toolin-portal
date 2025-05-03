import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EditorComponentComponent } from '../../../shared/component/editor-component/editor-component.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToolService } from '../../../shared/services/tool.service';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { UploadService } from '../../../shared/services/upload.service';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../../shared/utilities/utility';

type addTool = {
  id?: null | string
  brand: string;
  category: string;
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
  imports: [EditorComponentComponent, NgMultiSelectDropDownModule, CommonModule, ReactiveFormsModule, FormsModule, AngularFireStorageModule, AlertComponent, GoogleMapsModule],
  templateUrl: './add-tool.component.html',
  styleUrl: './add-tool.component.scss'
})
export class AddToolComponent implements OnInit, AfterViewInit {
  formtab: number = 1;
  dropdownList: any = [];
  selectedCategory: any = [];
  selectedSubCategory: any = [];
  iscategorySelected: boolean = true;
  isSubcategorySelected: boolean = true;
  dropdownSettings: IDropdownSettings = {};
  value1: string = '';
  isLoading: boolean = false;
  addTool(tool: addTool) {
    console.log(tool)
  }
  newToolForm: FormGroup;
  toolId: string | null = null;
  @ViewChild('addresstext') addresstext!: ElementRef;
  autocomplete: google.maps.places.Autocomplete | undefined
  lat: any
  lng: any;
  isEditForm: boolean = false;

  constructor(private fb: FormBuilder, private getAddFromCord: UtilityService, private route: ActivatedRoute, private routes: Router, private tools: ToolService, private uploadService: UploadService, private toast: ToastrService) {

    this.newToolForm = this.fb.group({
      id: [""],
      brand: ['', Validators.required],
      categories: [[''], Validators.required],
      subCategories: [[''], Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
      hasInsurance: [false],
      isAvailable: [true],
      isOperatorAvailable: [false],
      isOwnerApproved: [false],
      marketValue: ['', Validators.required],
      model: ['', Validators.required],
      priceDaily: [0, [Validators.required, Validators.min(1)]],
      priceMonthly: [0, [Validators.required, Validators.min(1)]],
      priceWeekly: [0, [Validators.required, Validators.min(1)]],
      streetAddress: [''],
      _geoloc: [{ lat: 51.509865, lng: -0.118092 }, Validators.required],
      isDeliveryAvailable: [false],
      isPublished: [false],
      availableAfter: [12],
      availableBefore: [12],
      insuranceId: ["12"],
    });
  }

  AddToolHandler() {
    this.newToolForm.patchValue({
      images: this.previewUrls,
      _geoloc: { lat: this.lat, lng: this.lng },
      categories: this.selectedCategory.map((x: any) => x.item_id)
    })
    debugger
    if (this.newToolForm.valid) {
      this.isLoading = false;
      if (this.newToolForm.get('id')?.value == null || this.newToolForm.get('id')?.value == "") {
        this.newToolForm.removeControl('id')
        this.tools.add(this.newToolForm.value).subscribe({
          next: (data) => {
            this.toast.success("Tool successfully Added")
            this.routes.navigate(['/tools']);
          },
          error: (error) => {
            console.error('There was an error!', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
      else {
        this.isLoading = true;

        this.tools.update(this.newToolForm.get('id')?.value, this.newToolForm.value).subscribe({
          next: (data) => {
            this.toast.success("Tool successfully Update")
            this.routes.navigate(['/tools']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('There was an error!', error);
          },
          complete: () => this.isLoading = false
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  EditToolHandler() {
    console.log('edit tools here')
  }
  onItemSelect(item: any) {
    if (!this.selectedCategory.some((x: any) => x.item_id === item.item_id)) {
      this.selectedCategory.push(item);
    }
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => { return x.item_id })
    });
    this.iscategorySelected = this.selectedCategory.length > 0;
    this.getSubcategory()
  }

  onSubCatSelect(item: any) {
    if (!this.selectedSubCategory.some((x: any) => x.item_id === item.item_id)) {
      this.selectedSubCategory.push(item);
    }
    this.newToolForm.patchValue({
      subCategories: this.selectedSubCategory.map((x: any) => { return x.item_id })
    });
    this.isSubcategorySelected = this.selectedSubCategory.length > 0;
  }

  onSelectAll(items: any, iscategory: boolean = true) {
    if (iscategory) {
      this.selectedCategory = items;
      this.newToolForm.patchValue({
        categories: this.selectedCategory.map((x: any) => { return x.item_id })
      });
      this.iscategorySelected = this.selectedCategory.length > 0;

    }
    else {
      this.selectedSubCategory = items;
      this.newToolForm.patchValue({
        subCategory: this.selectedSubCategory.map((x: any) => { return x.item_id })
      });
      this.isSubcategorySelected = this.selectedSubCategory.length > 0;

    }
  }


  onItemDeSelect(item: any) {
    debugger
    this.selectedCategory = this.selectedCategory.filter((x: any) => x.item_id !== item.item_id);
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => { return x.item_id })
    });
    this.getSubcategory()
    this.iscategorySelected = this.selectedCategory.length > 0;

  }

  onSubCateDeSelect(item: any) {
    this.selectedSubCategory = this.selectedSubCategory.filter((x: any) => x.item_id !== item.item_id);
    this.newToolForm.patchValue({
      subCategories: this.selectedSubCategory.map((x: any) => { return x.item_id })
    });
    this.isSubcategorySelected = this.selectedSubCategory.length > 0;

  }


  gettoolSub: any
  preSelectedCategory: any[] = []
  ngOnInit(): void {
    this.getCategory();
    this.newToolForm.patchValue({ _geoloc: "" })

    this.gettoolSub = this.route.paramMap.subscribe(params => {

      this.toolId = params.get('id');
      this.isEditForm = this.route.snapshot.routeConfig?.path?.includes('edit') as any
      if (this.toolId) {
        this.tools.getbyId(this.toolId).subscribe({
          next: (data: any) => {
            this.selectedCategory = data.categories.map((x: any) => {
              return {
                item_id: x.id,
                item_text: x.name
              }
            });

            this.newToolForm.patchValue(data);
            this.newToolForm.patchValue({ _geoloc: "" })
            this.getAddFromCord.getAddressFromCoordinates(data._geoloc.lat, data._geoloc.lng).subscribe({
              next: (address) => {
                this.newToolForm.patchValue({ _geoloc: address });
              },
              error: (error) => console.error("Error fetching address:", error),
            });

            this.previewUrls = data.images
            this.tools.getCategory().subscribe((x: any[]) => {
              this.category = x.map(x => {
                return {
                  item_id: x.id,
                  item_text: x.name
                }
              });

              if (data.subCategories) {
                this.selectedSubCategory = data.subCategories.map((x: any) => {
                  return {
                    item_id: x.id,
                    item_text: x.name
                  }
                });
              }
              this.newToolForm.patchValue({
                subCategories: this.selectedSubCategory.map((x: any) => { return x.item_id })
              });
              this.getSubcategory();

            })

          },
          error: (error) => {
            console.error('There was an error!', error);
          },
          complete: () => {

          }
        });
      }
    });

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




  ngAfterViewInit(): void {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      this.autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement);

      this.autocomplete.addListener("place_changed", () => {
        debugger
        const place = this.autocomplete?.getPlace();
        console.log(place);
        debugger
        console.log(place?.formatted_address);
        this.newToolForm.patchValue({
          streetAddress:place?.formatted_address,
        })
        if (place && place.geometry) {
          this.getPlaces(place);
        } else {
          this.clearLatLng();
        }
      });
      this.addresstext.nativeElement.addEventListener('input', () => {
        if (!this.addresstext.nativeElement.value) {
          this.clearLatLng();
        }
      });
    } else {
      console.error('Google Maps API not loaded correctly');
    }
  }


  clearLatLng(): void {
    this.lat = null;
    this.lng = null;
  }

  getPlaces(place: google.maps.places.PlaceResult): void {
    if (place.geometry && place.geometry.location) {
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
    } else {
      this.clearLatLng();
    }
  }

  getLocationName(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results) {
          console.log('Location name:', results[0].formatted_address);
          this.newToolForm.patchValue({
            _geoloc: results[0].formatted_address
          })
        } else {
          console.log('No results found');
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }

  category: { item_id: any, item_text: any }[] = [];
  subCategory: { item_id: any, item_text: any }[] = [];
  getCategory() {
    this.tools.getCategory().subscribe((x: any[]) => {
      this.category = x.map(x => {
        return {
          item_id: x.id,
          item_text: x.name
        }
      });
    })
  }

  getSubcategory() {
    let ids = this.selectedCategory.map((x: any) => x.item_id).join();
    this.tools.getSubCategory(ids).subscribe((x: any[]) => {
      this.subCategory = x.map(x => {
        return {
          item_id: x.id,
          item_text: x.name
        }
      });
      const subCategoryIds = new Set(this.subCategory.map((z: any) => z.item_id));
      this.selectedSubCategory = this.selectedSubCategory.filter((x: any) => subCategoryIds.has(x.item_id));
    })


  }

  isImageTouch: boolean = false;
  changeTab(e: number) {
    debugger
    let goNext: boolean = false;
    switch (e) {
      case 1:
        goNext = true;
        break;
      case 2:
      
        this.iscategorySelected = this.selectedCategory.length > 0;
        this.isSubcategorySelected = this.selectedSubCategory.length > 0;
        goNext = this.newToolForm.get('brand')?.valid && this.newToolForm.get('model')?.valid && this.newToolForm.get('_geoloc')?.valid && this.newToolForm.get('name')?.valid && (this.selectedCategory.length > 0 && this.selectedSubCategory.length > 0 ) ? true : false;
        break;
      case 3:
        goNext = this.newToolForm.get('description')?.valid ? true : false
        break;
      case 4:
        goNext = this.selectedFiles.length || this.previewUrls.length > 0 ? true : false
        this.isImageTouch = !goNext;
        break;
      case 5:
        goNext = this.newToolForm.get('priceMonthly')?.value > 0 && this.newToolForm.get('priceWeekly')?.value > 0 && this.newToolForm.get('priceDaily')?.value > 0
          ? true : false
        break;
      default:
        goNext = true;


    }

    if (e < 6 && e > 0 && goNext) {
      this.formtab = e

    }
    else {
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
    let x = document.createElement("div");
    let dataHtml = x.innerHTML = e;
    let data = x.innerText;
    console.log(e);
    if (data == "") {
      this.newToolForm.patchValue({
        description: null
      });
    }
    else {
      this.newToolForm.patchValue({
        description: e
      });
    }
  }

  removeImage(item: any) {
    this.previewUrls.splice(item, 1);
    this.uploadService.deleteFile(item)
  }


  selectedFiles: File[] = [];
  previewUrls: (string | ArrayBuffer | null)[] = [];
  selectedFile!: File;
  uploading: boolean = false
  isUploadSucess: boolean = false;
  isUploadfailed: boolean = false
  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.uploading = true
      this.selectedFiles = Array.from(fileInput.files);
      this.isLoading = true

      this.uploadService.uploadImages(this.selectedFiles, 'uploads')
        .then((urls) => {
          this.previewUrls = [...this.previewUrls, ...urls];
          this.uploading = false;
          this.isUploadSucess = true;
          this.isUploadfailed = false
          this.isLoading = false;
        },
          (err) => {
            console.error('Error uploading files:', err);
            this.uploading = false;
            this.isUploadfailed = true;
            this.isUploadSucess = false
            this.isLoading = false
          }
        );

    }
  }





}
