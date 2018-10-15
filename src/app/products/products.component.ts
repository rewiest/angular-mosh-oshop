import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../product.service';
import { ShoppingCartService } from './../shopping-cart.service';
import { Product } from './../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) :
    this.products;
  }

  private populateProducts() {
    this.productService.getAll().subscribe(products => {
      this.products = products;

      this.route.queryParamMap.subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
    });
  }

  // Instead of nesting Observables, can use switchMap
  //
  // private populateProducts() {
  //   productService.getAll()
  //     .pipe(
  //       switchMap(products => {
  //       this.products = products;
  //       return route.queryParamMap;
  //       })
  //     )
  //     .subscribe(params => {
  //       this.category = params.get('category');
  //       this.applyFilter();
  //     });
  // }

}
