export const environment = {
  production: false,
  apiProtocol: 'https',
  apiHost: 'localhost',
  apiPort: '7298',
  
  get apiUrl() {
    return `${this.apiProtocol}://${this.apiHost}:${this.apiPort}/api`;
  }
};