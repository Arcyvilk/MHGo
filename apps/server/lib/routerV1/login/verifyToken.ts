import { Request, Response } from 'express';

export const verifyToken = (req: Request, res: Response, next) => {
  // const { userId: null, verified: false } = req.user;
  // const { privateKey } = process.env;
  // const bearerHeader = req.headers['authorization'];
  // if (typeof bearerHeader !== 'undefined') {
  //   const bearerToken = bearerHeader.split(' ')[1];
  //   jwt.verify(bearerToken, privateKey, function (err, data) {
  //     if (!(err && typeof data === 'undefined')) {
  //       req.user = { username: data.username, verified: true };
  //       next();
  //     }
  //   });
  // }
  return res.sendStatus(403);
};
