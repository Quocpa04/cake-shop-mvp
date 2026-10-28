import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { ApiError } from './errors.js';

export function issueToken(user) { return jwt.sign({ sub: user.id, role: user.role, phone: user.phone }, config.jwtSecret, { expiresIn: '12h', issuer: 'cake-shop-api', audience: 'cake-shop-clients' }); }
export function requireAuth(store, roles = []) {
  return (req, _res, next) => {
    try {
      const raw = req.headers.authorization;
      if (!raw?.startsWith('Bearer ')) throw new ApiError(401, 'UNAUTHENTICATED', 'Vui lòng đăng nhập');
      const payload = jwt.verify(raw.slice(7), config.jwtSecret, { issuer: 'cake-shop-api', audience: 'cake-shop-clients' });
      const user = store.load().users.find((item) => item.id === payload.sub);
      if (!user) throw new ApiError(401, 'TOKEN_REVOKED', 'Tài khoản không còn hợp lệ');
      if (roles.length && !roles.includes(user.role)) throw new ApiError(403, 'FORBIDDEN_ROLE', 'Bạn không có quyền thực hiện thao tác này');
      req.user = user; next();
    } catch (error) { next(error instanceof ApiError ? error : new ApiError(401, 'INVALID_TOKEN', 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn')); }
  };
}
