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
  iscategorySelected: boolean = true;
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
      _geoloc: [{ lat: 51.509865, lng: -0.118092 }],
      isDeliveryAvailable: [false],
      isPublished: [false],
    });
  }

  AddToolHandler() {
    this.newToolForm.patchValue({
      images: this.previewUrls,
      _geoloc: { lat: this.lat, lng: this.lng },
      categories: this.selectedCategory.map((x: any) => x.item_id)
    })
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

  }
  onSelectAll(items: any) {
    this.selectedCategory = items;
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => { return x.item_id })
    });
    this.iscategorySelected = this.selectedCategory.length > 0;

  }
  onItemDeSelect(item: any) {
    this.selectedCategory = this.selectedCategory.filter((x: any) => x.item_id !== item.item_id);
    this.newToolForm.patchValue({
      categories: this.selectedCategory.map((x: any) => { return x.item_id })
    });
    this.iscategorySelected = this.selectedCategory.length > 0;

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
            debugger
            this.newToolForm.patchValue(data);
            this.newToolForm.patchValue({ _geoloc: "" })
            this.getAddFromCord.getAddressFromCoordinates(data._geoloc.lat, data._geoloc.lng).subscribe({
              next: (address) => {
                this.newToolForm.patchValue({ _geoloc: address });
              },
              error: (error) => console.error("Error fetching address:", error),
            });

            this.previewUrls = data.images
            this.preSelectedCategory = data.categories.map((x: any) => x.name)
            this.tools.getCategory().subscribe((x: any[]) => {
              this.category = x.map(x => {
                return {
                  item_id: x.id,
                  item_text: x.name
                }
              });

              this.selectedCategory = this.category.filter((x: any) => this.preSelectedCategory.some(xx => xx == x.item_text))
              console.log("this.preSelectedCategory", this.selectedCategory);
              console.log("this.preSelectedCategory", this.preSelectedCategory);
              console.log("this.preSelectedCategory", this.category);
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
        console.log(place?.formatted_address);

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
  changeTab(e: number) {
    let goNext: boolean = false;
    switch (e) {
      case 1:
        goNext = true;
        break;
      case 2:
        goNext = this.newToolForm.get('brand')?.valid && this.newToolForm.get('name')?.valid && this.selectedCategory.length > 0 ? true : false;
        this.iscategorySelected = this.selectedCategory.length > 0;
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
    console.log(e);
    this.newToolForm.patchValue({
      description: e
    });
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



  // getAddressFromCoordinates(lat: number, lng: number) {

  //   const geocoder = new google.maps.Geocoder();
  //   const latlng = new google.maps.LatLng(lat, lng);

  //   geocoder.geocode({ location: latlng }, (results: any, status: any) => {
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       if (results[0]) {
  //         const formattedAddress = results[0].formatted_address;
  //         console.log("Address:", formattedAddress);
  //         this.newToolForm.patchValue({ _geoloc: formattedAddress })
  //       } else {
  //         console.error("No address found.");
  //       }
  //     } else {
  //       console.error("Geocoder failed due to: " + status);
  //     }
  //   });
  // }

}
