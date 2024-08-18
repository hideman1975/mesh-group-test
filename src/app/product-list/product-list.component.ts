import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from '../models/product';
import { FormControl, Validators } from '@angular/forms';
//import { ModalDirective } from '@ngx-bootstrap/modal/';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
 // @ViewChild('myModal') public myModal: any;
  // title = "http-interceptor-fakebackend";
  products: IProduct[] = [];
  //employeeName = "";
  //selectedDepart = "";
  //id = "";
 // image = "https://robohash.org/default_product.jpg?size=300x300&set=set1";
 // capacity: number | null = null;

  showLoading = false;
  closeResult: string = '';

 // email = new FormControl('', [Validators.required, Validators.max(30)]);

  // model = new User();
  activeProduct: IProduct = {
    id: '',
    full_name: '',
    unit: '',
    emp_avatar: "https://robohash.org/default_product.jpg?size=300x300&set=set1",
    capacity: null
  };

  Series: string[] = [
    'GT230',
    'B540',
    'GF412',
    'JH760',
  ];

  constructor (
    private productService: ProductService,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getAllProductsFromServer();
  }
  //#region  actions
  /**
   * Delete Action
   * @param empId employee unique id
   */
  onDeleteAction(empId: string) {
    this.deleteProductFromServer(empId);
  }

  onEditAction(product: IProduct) {
    // this.id = product.id;
    // this.employeeName = product.full_name;
    // this.selectedDepart = product.unit;
    // this.image = product.emp_avatar;
    // this.capacity = product.capacity;
    
    this.activeProduct.id = product.id
    this.activeProduct.capacity = product.capacity;
    this.activeProduct.emp_avatar = product.emp_avatar;
    this.activeProduct.full_name = product.full_name
    this.activeProduct.unit = product.unit;
  }

  
  /**
   * Create a new employee object and send to the server to save.
   */
  onAddProductAction() {
    // create new employee object
    let newProduct = {
      id: this.activeProduct.id, // generate uuid on server.
      full_name: this.activeProduct.full_name,
      unit: this.activeProduct.unit,
      capacity: this.activeProduct.capacity,
      emp_avatar:
        "https://robohash.org/" +
        this.activeProduct.full_name.toLowerCase().trim().replace(/\s/g, "") +
        ".jpg?size=300x300&set=set1",
    };
    // validate inputs
    // if (!this.isValid(newProduct)) return;
    // add employee
    //this.addProductToServer(newProduct);
  }

  onEditProductAction() {
    // let newProduct = {
    //   id: this.id, // generate uuid on server.
    //   full_name: this.employeeName,
    //   unit: this.selectedDepart,
    //   emp_avatar: this.image,
    //   capacity: this.capacity
    // };
    // validate inputs
    // if (!this.isValid(newProduct)) return;
    let newProduct = {
      id: this.activeProduct.id, // generate uuid on server.
      full_name: this.activeProduct.full_name,
      unit: this.activeProduct.unit,
      emp_avatar: this.activeProduct.emp_avatar,
      capacity: this.activeProduct.capacity
    };

    this.editProductToServer(newProduct);
  }
  //#endregion actions
  //#region  Communication between fake backend and UI methods.
  /**
   * Add a new product object to server with http post.
   * @param newProduct 
   */
  addProductToServer(newProduct: IProduct) {
    // show spinner
    this.showLoading = true;
    this.productService.addProduct(newProduct).subscribe(
      (resp) => {
        if (resp.status == 200) {
          // add to list
          this.products.push(resp.body);
          this.clearCurrentProduct();
        }
      },
      (err) => console.error("Error Occured When Add A New Employee " + err),
      () => (this.showLoading = false) // close spinner
    );
  }

  editProductToServer(product: IProduct) {
   console.log('edit', product)
    // show spinner
    this.showLoading = true;
    this.productService.editProduct(product).subscribe(
      (resp) => {
        if (resp.status == 200) {
          // add to list
          //this.products.push(resp.body);
          let index = this.products.findIndex(item => item.id === product.id)
          this.products[index] = resp.body;
          this.clearCurrentProduct();
          // this.selectedDepart = "";
          // this.employeeName = "";
          // this.id = "";
        }
      },
      (err) => console.error("Error Occured When Add A New Employee " + err),
      () => (this.showLoading = false) // close spinner
    );
  }
  /**
   * Get All Products from local .json file for a first time.
   */
  getAllProductsFromServer() {
    this.showLoading = true;
    this.productService.getAllProducts().subscribe(
      (resp) => {
        if (resp.status == 200) {
          this.products = resp.body;
        }
      },
      (err) => console.error("Error Occured When Get All Products " + err),
      () => (this.showLoading = false)
    );
  }
  /**
   * Delete an employee from server with given employee uuid.
   * @param empId user public uuid
   */
  deleteProductFromServer(empId: any) {
    this.showLoading = true;
    this.productService.deleteProduct(empId).subscribe(
      (resp) => {
        if (resp.status == 200) {
          const deletedEmpId = resp.body;
          // delete from array.
          this.products = this.products.filter((f) => f.id !== deletedEmpId);
        }
      },
      (err) => console.error("Error Occured When Delete An Employee " + err),
      () => (this.showLoading = false)
    );
  }
  //#endregion  Communication between fake backend and UI methods.
  /**
   * Validate employee object taken from form.
   * @param emp 
   */
  // isValid(emp: any): boolean {
  //   if (
  //     emp.full_name == undefined ||
  //     emp.full_name == null ||
  //     emp.full_name == ""
  //   ) {
  //     alert("Please Enter Full Name");
  //     return false;
  //   }
  //   if (emp.unit == undefined || emp.unit == null || emp.unit == "") {
  //     alert("Please Select A Department");
  //     return false;
  //   }
  //   return true;
  // }
    // Modal methods --------------------
  open(content: TemplateRef<Component>) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // if (this.activeProduct.id === '') {
      //   console.log('if empty id')
      //   this.onAddProductAction();
      // } else {
      //   console.log('if not empty id')
      //   this.onEditProductAction();
      // }
    }, (reason) => {
      console.log('if dismissed', reason)
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.clearCurrentProduct();
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  // -------------------------------------


  clearCurrentProduct() {
    // this.id = "";
    // this.employeeName = "";
    // this.selectedDepart = "";
    // this.image = "https://robohash.org/default_product.jpg?size=300x300&set=set1";
    // this.capacity = null;
    this.activeProduct = {
      id: '',
      full_name: '',
      unit: '',
      emp_avatar: "https://robohash.org/default_product.jpg?size=300x300&set=set1",
      capacity: null
    };
  }

  onSubmit(form: any) {
    if (this.activeProduct.id === '') {
      this.activeProduct.emp_avatar = 
      "https://robohash.org/" +
      this.activeProduct.full_name.toLowerCase().trim().replace(/\s/g, "") +
      ".jpg?size=300x300&set=set1";
      this.addProductToServer(this.activeProduct);
    } else {
      this.editProductToServer(this.activeProduct);
    }
    
    this.clearCurrentProduct();
    this.modalService.dismissAll();
  }
}

// export class User {
//   public name!: string;
//   public email!: string;
//   public password!: string;
//   public hobbies!: string;
// }
