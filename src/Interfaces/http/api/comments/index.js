import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';

export default (container, authentication) => {
  const commentsHandler = new CommentsHandler(container);
  return createCommentsRouter(commentsHandler, authentication);
};
