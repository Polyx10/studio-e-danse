// Rate limiting simple basé sur IP
// Pour une solution plus robuste en production, utiliser Upstash Redis ou Vercel KV

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Nettoyer les entrées expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Nombre maximum de requêtes
  windowMs: number; // Fenêtre de temps en millisecondes
}

export function rateLimit(identifier: string, config: RateLimitConfig): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // Initialiser ou récupérer l'entrée
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  // Incrémenter le compteur
  store[key].count++;

  // Vérifier si la limite est dépassée
  if (store[key].count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

// Fonction helper pour extraire l'IP de la requête
export function getClientIp(request: Request): string {
  // Vérifier les en-têtes Vercel
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}
