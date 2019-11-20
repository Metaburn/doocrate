import { List } from 'immutable';
import { CommentsState } from './reducer';
import { getVisibleComments } from './selectors';
import { Comment } from './comment';

describe('Comments selectors', () => {
  let comments;

  beforeEach(() => {
    comments = new CommentsState({
      list: new List([
        new Comment({ body: 'comment-1' }),
        new Comment({ body: 'comment-2' }),
      ]),
    });
  });

  describe('getVisibleComments()', () => {
    it('should return list of all comments', () => {
      const commentList = getVisibleComments({ comments });
      expect(commentList.size).toBe(2);
    });
  });
});
