import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { map } from '../../node_modules/rxjs/operators';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list('/products').snapshotChanges()
      .pipe(
        map(actions => {
          // return actions.map(a => ({key: a.key, ...a.payload.val() }));
          return actions.map((a: AngularFireAction<DatabaseSnapshot<Product>>) =>
            ({key: a.key, ...a.payload.val() }));
          // return actions.map((a: AngularFireAction<DatabaseSnapshot<Product>>) => {
          //   return ({
          //     key: a.key,
          //     title: a.payload.val().title,
          //     price: a.payload.val().price,
          //     category: a.payload.val().category,
          //     imageUrl: a.payload.val().imageUrl,
          //   });
          // });
        })
      );
  }

  get(productId) {
    return this.db.object('/products/' + productId).valueChanges()
      .pipe(
        map((a: Product) => {
          return ({
            key: productId,
            title: a.title,
            price: a.price,
            category: a.category,
            imageUrl: a.imageUrl,
          });
        })
      );
  }

  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    return this.db.object('/products/' + productId).remove();
  }

}
