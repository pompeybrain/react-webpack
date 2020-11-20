const servers = {
  dev: '/api/',
  production: 'http://192.168.1.102:8021',
};

function getApiUrl(url: string) {
  return servers.dev + url;
}
export { servers, getApiUrl };
