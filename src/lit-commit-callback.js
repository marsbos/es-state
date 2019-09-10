import { directive } from 'lit-html';

export const commitCallback = directive((committer) => (part) => {
  committer((value) => {
    part.setValue(value); 
    part.commit();
  });
});
