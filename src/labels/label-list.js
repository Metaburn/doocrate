import { FirebaseList } from 'src/firebase';
import { Label } from './label';
import { createLabel, loadLabel, removeLabel, updateLabel } from './label-actions'


export const labelList = new FirebaseList({
  onAdd: createLabel,
  onChange: updateLabel,
  onLoad: loadLabel,
  onRemove: removeLabel
}, Label);
