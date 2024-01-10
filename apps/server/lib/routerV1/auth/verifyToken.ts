import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next) => {
  const privateKey = process.env.PRIVATE_KEY;
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader === 'undefined') return res.sendStatus(403);

  const bearerToken = bearerHeader.split(' ')[1];
  jwt.verify(bearerToken, privateKey, (err, data) => {
    if (!err && data) {
      // @ts-ignore
      req.user = { userId: data.userId, verified: true };
      return next();
    } else return res.sendStatus(403);
  });
};

export const verifyAdminToken = (req: Request, res: Response, next) => {
  // TODO Admin token
  return next();
};
