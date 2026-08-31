export const environment = {
  production: false,
  apiProtocol: 'https',
  apiHost: 'audisoft-webapi-production.up.railway.app',
  apiPort: '',
  
  get apiUrl() {
    const cleanHost = this.apiHost.replace(/^https?:\/\//, '');
    const portPart = this.apiPort ? `:${this.apiPort}` : '';
    return `${this.apiProtocol}://${cleanHost}${portPart}/api`;
  }
};