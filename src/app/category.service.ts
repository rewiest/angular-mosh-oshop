import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { map } from '../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/categories', ref => ref.orderByChild('name')).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map((a: AngularFireAction<DatabaseSnapshot<{key: string, name: string}>>) =>
            ({key: a.key, ...a.payload.val() }));
        })
      );
  }

  get(categoryId) {
    return this.db.object('/categories/' + categoryId).valueChanges()
      .pipe(
        map((a: {key: string, name: string}) => {
          return ({
            key: categoryId,
            name: a.name
          });
        })
      );
  }

}
