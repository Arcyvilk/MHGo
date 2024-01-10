import { Request, Response } from 'express';
import { log } from '@mhgo/utils';

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      // TODO blacklist token
      // const bearerToken = bearerHeader.split(' ')[1];
    }
    res.sendStatus(200);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
