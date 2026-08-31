export const environment = {
  production: false,
  // Puedes cambiar la IP, el protocolo o el puerto aquí globalmente
  apiProtocol: 'https',
  apiHost: 'localhost',
  apiPort: '7298',
  
  // Propiedad calculada o directa para la base de la API
  get apiUrl() {
    return `${this.apiProtocol}://${this.apiHost}:${this.apiPort}/api`;
  }
};