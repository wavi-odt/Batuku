function decodeJwtPayload(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

// Role é sempre lido do JWT — nunca de um valor guardado em separado.
export function getRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    // Tenta os formatos mais comuns de Spring Security
    if (typeof payload.role === 'string') {
        return payload.role.toLowerCase();
    }
    if (Array.isArray(payload.roles) && payload.roles.length) {
        return payload.roles[0].toLowerCase().replace('role_', '');
    }
    if (Array.isArray(payload.authorities) && payload.authorities.length) {
        const match = payload.authorities.find(a =>
            typeof a === 'string' && (a.toLowerCase().includes('artist') || a.toLowerCase().includes('fan'))
        );
        if (match) return match.toLowerCase().replace('role_', '');
    }

    // Fallback: mostra o payload no console para facilitar debug
    if (import.meta.env.DEV) {
        console.warn('[auth] Não foi possível extrair role do JWT. Payload:', payload);
    }
    return 'fan';
}

export function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Guarda apenas o token — o role é sempre derivado do JWT
export function saveAuth(token) {
    localStorage.setItem('token', token);
}

export function logout() {
    localStorage.removeItem('token');
}
