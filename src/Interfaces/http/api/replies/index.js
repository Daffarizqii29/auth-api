import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';

export default (container, authentication) => {
  const repliesHandler = new RepliesHandler(container);
  return createRepliesRouter(repliesHandler, authentication);
};
