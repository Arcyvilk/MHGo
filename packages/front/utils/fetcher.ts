export const fetcher = async (url: string, options: any = {}) =>
  await fetch(url, updateOptions(options));

const updateOptions = (options: any) => {
  const update = { ...options };
  const bearer = JSON.parse(localStorage?.MHGO_AUTH ?? '{}')?.bearer;
  const adventure = JSON.parse(localStorage?.MHGO_ADVENTURE ?? '{}')?.id;

  update.headers = {
    ...update.headers,
    ...(adventure ? { 'X-Adventure': adventure } : {}),
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
  };
  return update;
};
