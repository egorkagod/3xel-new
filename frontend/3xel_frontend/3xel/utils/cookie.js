export function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(name + '='))
    ?.split('=')[1];
}
