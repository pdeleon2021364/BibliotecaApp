import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { buildApp, closeDb } from './setup.js';

let app;
let registeredUserId;
let registeredUserEmail;
let testUsername;

const TEST_PASSWORD = 'Test1234!';
const TEST_PHONE = '55551234';

beforeAll(async () => {
  app = await buildApp();
}, 30000);

afterAll(async () => {
  await closeDb();
});

describe('Health Check', () => {
  it('GET /api/v1/health - Debe retornar status Healthy', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Healthy');
    expect(res.body.service).toBe('KinalSports Authentication Service');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('404 Not Found', () => {
  it('GET /api/v1/ruta-inexistente - Debe retornar 404', async () => {
    const res = await request(app).get('/api/v1/ruta-inexistente');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('no encontrada');
  });
});

describe('POST /api/v1/auth/register', () => {
  it('Debe registrar un nuevo usuario exitosamente', async () => {
    const timestamp = Date.now();
    testUsername = `testuser_${timestamp}`;
    registeredUserEmail = `test_${timestamp}@mail.com`;

    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', testUsername)
      .field('email', registeredUserEmail)
      .field('password', TEST_PASSWORD)
      .field('phone', TEST_PHONE);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe(testUsername);
    expect(res.body.user.email).toBe(registeredUserEmail);
    expect(res.body.user.name).toBe('Juan');
    expect(res.body.user.surname).toBe('Perez');
    expect(res.body.user.phone).toBe(TEST_PHONE);
    expect(res.body.user.status).toBe(false);
    expect(res.body.emailVerificationRequired).toBe(true);
    expect(res.body.user.id).toBeDefined();
    registeredUserId = res.body.user.id;
  });

  it('Debe fallar si el email ya existe', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', 'otro_usuario')
      .field('email', registeredUserEmail)
      .field('password', TEST_PASSWORD)
      .field('phone', '12345678');

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('Debe fallar si el username ya existe', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', testUsername)
      .field('email', 'otro@mail.com')
      .field('password', TEST_PASSWORD)
      .field('phone', '12345678');

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('Debe fallar con campos obligatorios faltantes', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Juan' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('Debe fallar con email inválido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', 'testinvalid')
      .field('email', 'no-es-email')
      .field('password', TEST_PASSWORD)
      .field('phone', '12345678');

    expect(res.status).toBe(400);
  });

  it('Debe fallar con teléfono inválido (menos de 8 dígitos)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', 'testphone')
      .field('email', 'testphone@mail.com')
      .field('password', TEST_PASSWORD)
      .field('phone', '123');

    expect(res.status).toBe(400);
  });

  it('Debe fallar con contraseña muy corta', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Juan')
      .field('surname', 'Perez')
      .field('username', 'testshortpwd')
      .field('email', 'shortpwd@mail.com')
      .field('password', '123')
      .field('phone', '12345678');

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/verify-email', () => {
  it('Debe retornar error si el token es inválido (corto)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: 'token_invalido_random_1234567890abcdef' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Debe retornar error si no se envía token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('Debe fallar si el email no está verificado', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        emailOrUsername: registeredUserEmail,
        password: TEST_PASSWORD,
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('verificar');
  });

  it('Debe fallar con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        emailOrUsername: 'noexiste@mail.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Debe fallar con campos faltantes', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ emailOrUsername: 'test@mail.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/v1/auth/forgot-password', () => {
  it('Debe retornar siempre éxito por seguridad (email no existente)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'noexiste@mail.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Debe retornar éxito con email existente', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: registeredUserEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/v1/auth/reset-password', () => {
  it('Debe fallar con token inválido (corto)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: 'token_invalido_random_1234567890abcdef',
        newPassword: 'NewPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('Debe fallar sin campos requeridos', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/resend-verification', () => {
  it('Debe retornar error para email no existente', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resend-verification')
      .send({ email: 'noexiste@mail.com' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('Debe retornar error si el email no es válido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/resend-verification')
      .send({ email: 'invalido' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/profile/by-id', () => {
  it('Debe retornar error si no se envía userId', async () => {
    const res = await request(app)
      .post('/api/v1/auth/profile/by-id')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('requerido');
  });

  it('Debe retornar error si el userId no existe', async () => {
    const res = await request(app)
      .post('/api/v1/auth/profile/by-id')
      .send({ userId: 'usr_nonexistent' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/auth/profile (sin token)', () => {
  it('Debe retornar 401 sin token', async () => {
    const res = await request(app).get('/api/v1/auth/profile');
    expect(res.status).toBe(401);
  });

  it('Debe retornar 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', 'Bearer token_invalido');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/v1/auth/profile (sin token)', () => {
  it('Debe retornar 401 sin token', async () => {
    const res = await request(app)
      .put('/api/v1/auth/profile')
      .send({ name: 'NuevoNombre' });
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/v1/auth/profile/avatar (sin token)', () => {
  it('Debe retornar 401 sin token', async () => {
    const res = await request(app).delete('/api/v1/auth/profile/avatar');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/refresh (sin token)', () => {
  it('Debe retornar error si no se envía refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('requerido');
  });

  it('Debe retornar error con refresh token inválido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'token_inexistente' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('Debe retornar 200 incluso con token inexistente (idempotente)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: 'token_inexistente' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('cerrada');
  });
});

describe('User Admin Routes (sin autenticación)', () => {
  it('PUT /api/v1/users/:userId/role - Debe retornar 401', async () => {
    const res = await request(app)
      .put('/api/v1/users/usr_fake/role')
      .send({ roleName: 'ADMIN_ROLE' });
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users/:userId/roles - Debe retornar 401', async () => {
    const res = await request(app).get('/api/v1/users/usr_fake/roles');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users/by-role/:roleName - Debe retornar 401', async () => {
    const res = await request(app).get('/api/v1/users/by-role/USER_ROLE');
    expect(res.status).toBe(401);
  });
});
