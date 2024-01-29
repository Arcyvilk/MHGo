import { Request, Response } from 'express';

export const validateAdventure = (req: Request, res: Response, next) => {
  const adventure = req.headers['x-adventure'];

  if (typeof adventure === 'undefined') return res.sendStatus(404);
  res.locals.adventure = adventure;

  return next();
};
