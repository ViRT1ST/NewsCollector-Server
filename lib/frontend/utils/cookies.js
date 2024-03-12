import Cookies from 'universal-cookie';

const daysToExpiration = 89;

const makeCookieOptions = () => {
  const addToCurrentDate = daysToExpiration * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(Date.now() + addToCurrentDate);
  return { path: '/', sameSite: 'lax', expires: expirationDate };
};

const getCookies = () => {
  return new Cookies().getAll();
};

const createCookies = (obj) => {
  const cookies = new Cookies();

  Object.entries(obj).forEach(([key, value]) => {
    cookies.set(key, value, makeCookieOptions());
  });
};

const removeCookies = (arr) => {
  const cookies = new Cookies();

  arr.forEach((item) => cookies.remove(item, { path: '/' }));
};

export {
  getCookies,
  createCookies,
  removeCookies
};
