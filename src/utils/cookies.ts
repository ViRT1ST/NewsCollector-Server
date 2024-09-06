import Cookies, { CookieSetOptions } from 'universal-cookie';

const daysToExpiration = 89;

function createCookieOptions() {
  const options: CookieSetOptions = {
    path: '/',
    sameSite: 'lax',
    expires: new Date(Date.now() + daysToExpiration * 24 * 60 * 60 * 1000)
  };

  return options;
}

export function getCookies() {
  return new Cookies().getAll();
}

export function setCookies(obj: object) {
  const cookies = new Cookies();

  Object.entries(obj).forEach(([key, value]) => {
    const cookieOptions = createCookieOptions();
    cookies.set(key, value, cookieOptions);
  });
}

export function removeCookies(arr: string[]) {
  const cookies = new Cookies();
  
  arr.forEach((item) => cookies.remove(item, { path: '/' }));
}
