export const fetcher = (url: string, options: any = {}) => {
  return fetch(url, updateOptions(options));
};

const updateOptions = (options: any) => {
  const update = { ...options };
  const bearer = JSON.parse(localStorage.MHGO_AUTH ?? {})?.bearer;
  if (bearer) {
    update.headers = {
      ...update.headers,
      Authorization: `Bearer ${bearer}`,
    };
  }
  return update;
};
