import { firebaseDb } from './firebase';
/*
 Represent a Firebase collection.
 If given a rootPath and rootDocId then this might be under a sub collection.
 For example - /projects/PROJECT-ID/tasks
 rootPath = projects
 rootDocId = PROJECT-ID
 path = tasks
 */
export class FirebaseList {
  constructor(
    actions,
    modelClass,
    path = null,
    query = null,
    orderBy = null,
    rootPath = null,
    rootDocId = null,
  ) {
    this._actions = actions;
    this._modelClass = modelClass;
    this._path = path;
    this._query = query;
    this._orderBy = orderBy;
    this._rootPath = rootPath;
    this._rootDocId = rootDocId;
  }

  get path() {
    return this._path;
  }

  set path(value) {
    this._path = value;
  }

  get query() {
    return this._query;
  }

  set orderBy(value) {
    this._orderBy = value;
  }

  set rootPath(value) {
    this._rootPath = value;
  }

  get rootPath() {
    return this._rootPath;
  }

  set rootDocId(value) {
    this._rootDocId = value;
  }

  get rootDocId() {
    return this._rootDocId;
  }

  get orderBy() {
    return this._orderBy;
  }

  set query(value) {
    this._query = value;
  }

  get collectionPath() {
    if (this._rootPath && this._rootDocId) {
      return firebaseDb
        .collection(this._rootPath)
        .doc(this._rootDocId)
        .collection(this._path);
    } else {
      return firebaseDb.collection(`${this._path}`);
    }
  }

  cleanObjectBeforeSend(obj) {
    const stringified = JSON.stringify(obj);

    // We need to parse string back to object and return it
    const parsed = JSON.parse(stringified);

    return parsed;
  }

  push(value) {
    return this.collectionPath.add(value);
  }

  pushBatch(values) {
    const batch = firebaseDb.batch();

    values.forEach(value => {
      const ref = this.collectionPath.doc();
      batch.set(ref, value);
    });

    return batch.commit();
  }

  remove(id) {
    return this.collectionPath.doc(id).delete();
  }

  set(id, value) {
    return this.collectionPath.doc(id).set(this.cleanObjectBeforeSend(value));
  }

  update(id, value) {
    return this.collectionPath
      .doc(id)
      .update(this.cleanObjectBeforeSend(value));
  }

  subscribe(emit) {
    // This list might be under a root collection
    let collection = this.collectionPath;
    if (this._query) {
      collection = collection.where(
        this._query[0],
        this._query[1],
        this._query[2],
      );
    }
    if (this._orderBy) {
      collection = collection.orderBy(
        this._orderBy.name,
        this._orderBy.direction,
      );
    }
    let initialized = false;
    let list = [];

    let unsubscribe = collection.onSnapshot(snapshot => {
      if (!initialized) {
        emit(this._actions.onLoad(snapshot.docs));
        initialized = true;
        return;
      }
      const isLocalChange = snapshot.metadata.hasPendingWrites;
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          if (initialized) {
            emit(
              this._actions.onAdd(
                this.unwrapSnapshot(change.doc),
                isLocalChange,
              ),
            );
          } else {
            list.push(this.unwrapSnapshot(change.doc));
          }
        }
        if (change.type === 'modified') {
          this._actions.onChange &&
            emit(this._actions.onChange(this.unwrapSnapshot(change.doc)));
        }
        if (change.type === 'removed') {
          this._actions.onRemove &&
            emit(this._actions.onRemove(this.unwrapSnapshot(change.doc)));
        }
      });
    });

    this._unsubscribe = () => unsubscribe();
  }

  unsubscribe() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  unwrapSnapshot(snapshot) {
    let data = snapshot.data();
    data.id = snapshot.id;
    return new this._modelClass(data);
  }
}

/*
 Mapping from a firebase collection to a simple array
 We are adding the id and a function that allow to perform object.get
 */
export function firebaseCollectionToList(collection) {
  if (collection) {
    return collection.map(document => {
      return Object.assign(document.data(), {
        get: object => document[object],
        id: document.id,
      });
    });
  }
}
