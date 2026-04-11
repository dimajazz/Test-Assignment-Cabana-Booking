import request from 'supertest';

import { httpServer } from '../../src/http-server';
import { ReservationService } from '../../src/utils/reservationService';
import { PayloadValidationAppError, ReservationAppError } from '../../src/exceptions/exceptions';
import { Cabana } from '../../src/types/map';

describe('HTTP Server', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // GET /api/map
  it('GET /api/map returns 200 and correct structure', async () => {
    const res = await request(httpServer)
      .get('/api/map')

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('grid');
    expect(res.body).toHaveProperty('cabanas');
    expect(Array.isArray(res.body.cabanas)).toBe(true);
    expect(Array.isArray(res.body.grid)).toBe(true);
  });

  it('returns 404 for unknown route', async () => {
    const res = await request(httpServer)
      .get('/api/does-not-exist')
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });

  // POST /api/reserve
  it('POST /api/reserve with invalid JSON returns 400', async () => {
    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'application/json')
      .send('{ invalid json }');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid JSON');
  });

  it('POST /api/reserve without Content-Type returns 400', async () => {
    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'wrong/mime/type')
      .send("{ cabana: { x: 1, y: 2 }, guest: { room: '237', guestName: 'Jack' } }");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Content-Type must be application/json');
  });

  it('POST /api/reserve with invalid payload returns 400', async () => {
    jest.spyOn(ReservationService, 'reserveCabana')
      .mockRejectedValue(
        new PayloadValidationAppError('Invalid payload structure')
      );

    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'application/json')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid payload structure');
  });

  it('POST /api/reserve with reservation error returns 409', async () => {
    jest.spyOn(ReservationService, 'reserveCabana')
      .mockRejectedValue(
        new ReservationAppError('Invalid booking credentials!')
      );

    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'application/json')
      .send({ cabana: {}, guest: {} });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Invalid booking credentials!');
  });

  it('POST /api/reserve success returns 201 and reservation', async () => {
    const fakeCabana: Cabana = {
      id: 'cabana-1:2',
      x: 1,
      y: 2,
      isReserved: true,
      guestName: 'Jack Torrance'
    };

    jest.spyOn(ReservationService, 'reserveCabana')
      .mockResolvedValue(fakeCabana);

    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'application/json')
      .send({
        cabana: { x: 1, y: 2 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Cabana reserved successfully');
    expect(res.body.reservation).toEqual(fakeCabana);
  });

  it('POST /api/reserve unexpected error returns 500', async () => {
    jest.spyOn(ReservationService, 'reserveCabana')
      .mockRejectedValue(new Error('You will never leave the hotel!'))

    const res = await request(httpServer)
      .post('/api/reserve')
      .set('content-type', 'application/json')
      .send({
        cabana: { x: 1, y: 2 },
        guest: { room: '237', guestName: 'Jack Torrance' }
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
    expect(res.body.err).toBe('You will never leave the hotel!');
  });
});
