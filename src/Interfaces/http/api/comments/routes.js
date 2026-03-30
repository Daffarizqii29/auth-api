import express from 'express';

const createCommentsRouter = (handler, authentication) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authentication, handler.postCommentHandler);
  router.delete('/:commentId', authentication, handler.deleteCommentHandler);
  router.put('/:commentId/likes', authentication, handler.putCommentLikeHandler);

  return router;
};

export default createCommentsRouter;
