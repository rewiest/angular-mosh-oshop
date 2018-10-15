import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { ShoppingCartService } from './shopping-cart.service';
import { Order } from './models/order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() {
    return this.db.list('/orders').snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map((a: AngularFireAction<DatabaseSnapshot<Order>>) =>
        ({key: a.key, ...a.payload.val() }));
      })
    );
  }

  getOrdersByUser(userId: string) {
    return this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId)).snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map((a: AngularFireAction<DatabaseSnapshot<Order>>) =>
        ({key: a.key, ...a.payload.val() }));
      })
    );
  }

  get(orderId) {
    return this.db.object('/orders/' + orderId).snapshotChanges()
    .pipe(
      map((a: AngularFireAction<DatabaseSnapshot<Order>>) =>
         ({key: a.key, ...a.payload.val() }))
    );
  }

}
