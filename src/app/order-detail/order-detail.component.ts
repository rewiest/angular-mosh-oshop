import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../order.service';
import { Order } from '../models/order';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent {
  order: Order;
  id;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.orderService.get(this.id)
        .pipe(take(1))
        .subscribe(order => {
          this.order = order;
        });
    }
  }

  get totalPrice() {
    let sum = 0;
    for (let i = 0; i < this.order.items.length; i++)
      sum += this.order.items[i].totalPrice;
    return sum;
  }

}
