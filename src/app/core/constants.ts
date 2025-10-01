export const API_BASE = 'http://localhost:5000/api/v1';
// export const API_BASE = 'https://am-boutique-0f0e746f58d5.herokuapp.com/api/v1';


export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
  },
  CUSTOMERS: {
    BASE: `${API_BASE}/customers`,
  },
  PRODUCTS: {
    BASE: `${API_BASE}/products`,
  },
  SUPPLIERS: {
    BASE: `${API_BASE}/suppliers`,
  },
  SALES: {
    BASE: `${API_BASE}/sales`,
  },
  PURCHASES: {
    BASE: `${API_BASE}/purchases`,
  },
  CATEGORIES: {
    BASE: `${API_BASE}/categories`,
  },
    SUBCATEGORIES: {
    BASE: `${API_BASE}/subcategories`,
  },
};
