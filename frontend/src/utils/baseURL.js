/*const getBaseUrl=()=>{
    return "http://localhost:5000"
}

export default getBaseUrl;*/

// src/utils/baseURL.js
/*export default function getBaseUrl() {
  // In Docker, set this to something like: http://bookstore-backend:5000
  // In local dev, it can be: http://localhost:5000
  return import.meta.env.VITE_API_URL || "http://localhost:5000";
}
*/
export default function getBaseUrl() {
  // If VITE_API_URL is set, use it.
  // Otherwise, use same-origin (ALB) and route via /api
  return import.meta.env.VITE_API_URL || window.location.origin;
}
