import axios from "axios";

// Configurações globais do axios
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Define as configurações padrão quando cria a instância
const apiAxios = axios.create({
  baseURL: 'http://127.0.0.1:3050/'
});

export default apiAxios;