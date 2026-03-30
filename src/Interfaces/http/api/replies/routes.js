import express from 'express';

const createRepliesRouter = (handler, authentication) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authentication, handler.postReplyHandler);
  router.delete('/:replyId', authentication, handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
