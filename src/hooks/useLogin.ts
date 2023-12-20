export enum STATUS {
  PENDING = 'pending',
  ERROR = 'error',
  SUCCESS = 'succes',
}

// TODO This is mock atm
export const useLogin = () => {
  const onLogOut = async (): Promise<STATUS> =>
    new Promise(resolve => {
      let status = STATUS.PENDING;

      setTimeout(() => {
        if (Date.now() % 2 === 0) status = STATUS.ERROR;
        else status = STATUS.SUCCESS;

        resolve(status);
      }, 1000);
    });

  const onDeleteAccount = async (): Promise<STATUS> =>
    new Promise(resolve => {
      let status = STATUS.PENDING;

      setTimeout(() => {
        if (Date.now() % 2 === 0) status = STATUS.ERROR;
        else status = STATUS.SUCCESS;

        resolve(status);
      }, 1000);
    });

  return { onLogOut, onDeleteAccount };
};
