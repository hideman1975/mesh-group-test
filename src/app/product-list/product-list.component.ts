import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProductService } from '../product.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from '../models/product';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: IProduct[] = [];
  showLoading = false;
  closeResult: string = '';
  activeProduct: IProduct = {
    id: '',
    full_name: '',
    unit: '',
    emp_avatar: "https://robohash.org/default_product.jpg?size=300x300&set=set1",
    capacity: null
  };

  Models: string[] = [
    'GT230',
    'B540',
    'GF412',
    'JH760',
  ];

  constructor(
    private productService: ProductService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllProductsFromServer();
  }

  /**
   * Delete Action
   * @param empId employee unique id
   */
  onDeleteAction(empId: string) {
    this.deleteProductFromServer(empId);
  }

  onEditAction(product: IProduct) {
    this.activeProduct.id = product.id
    this.activeProduct.capacity = product.capacity;
    this.activeProduct.emp_avatar = product.emp_avatar;
    this.activeProduct.full_name = product.full_name
    this.activeProduct.unit = product.unit;
  }

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
          this.products.push(resp.body);
          this.clearCurrentProduct();
        }
      },
      (err) => console.error("Error Occured When Add A New Employee " + err),
      () => (this.showLoading = false) // close spinner
    );
  }

  editProductToServer(product: IProduct) {
    // show spinner
    this.showLoading = true;
    this.productService.editProduct(product).subscribe(
      (resp) => {
        if (resp.status == 200) {
          let index = this.products.findIndex(item => item.id === product.id)
          this.products[index] = resp.body;
          this.clearCurrentProduct();
        }
      },
      (err) => console.error("Error Occured When Add A New Employee " + err),
      () => (this.showLoading = false) // close spinner
    );
  }
  /**
   * Get All Products
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
   * Delete a product from server with given product uuid.
   * @param empId product public uuid
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

  // Modal methods --------------------
  open(content: TemplateRef<Component>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
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
      return `with: ${reason}`;
    }
  }
  // -------------------------------------

  clearCurrentProduct() {
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
