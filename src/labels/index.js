import * as labelActions from './label-actions';
import { labelList } from './label-list';
import { firebaseDb } from 'src/firebase';

export { labelActions };
export { labelsReducer } from './label-reducer';
export { Label } from './label';

// TODO: Unused
const colorsRef = firebaseDb.collection('colors');
window.fb = firebaseDb;

export const changeLabelColor = (labelName, colorInHex) => {
  labelList.update(labelName, { colorInHex });
};

export const setLabelWithRandomColor = labelName => {
  colorsRef.get().then(a => {
    const rand = ~~(Math.random() * a.size);
    changeLabelColor(labelName, a.docs[rand].get('colorInHex').substr(1));
  });
};
