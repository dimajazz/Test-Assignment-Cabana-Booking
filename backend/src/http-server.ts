import http from 'node:http';

import { createStore } from './store/createStore';
import { shrinkToCabanaPublic } from './utils/shrinkToCabanaPublic';
import { ReservationService } from './utils/reservationService';
import { PayloadValidationAppError, ReservationAppError } from './exceptions/exceptions';
import { Reservation } from './types/booking';

const store = createStore();

function sendJson(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(data));
}

/** HTTP SERVER IMPLEMENTATION */
const HTTP_PORT = 8085;
const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify frontend URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization'); // Allowed headers

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Ensure JSON content type
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method!) &&
    !req.headers['content-type']?.includes('application/json')
  ) {
    return sendJson(res, 400, { error: 'Content-Type must be application/json' });
  }

  // ROUTES
  if (req.method === 'GET' && req.url === '/api/map') {
    return getMap(res);
  }

  if (req.method === 'POST' && req.url === '/api/reserve') {
    return reserveCabana(req, res);
  }

  // 404 fallback
  return sendJson(res, 404, { error: 'Not Found' });
});

async function reserveCabana(req: http.IncomingMessage, res: http.ServerResponse) {
  /* POST /api/reserve */
  let body = '';
  req.on('data', chunk => (body += chunk));

  req.on('end', async () => {
    let payload: Reservation;

    try {
      payload = JSON.parse(body);
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON' });
    }

    try {
      const result = await ReservationService.reserveCabana(payload, store);

      return sendJson(res, 201, {
        message: 'Cabana reserved successfully',
        reservation: result
      })
    } catch (error: any) {
      if (error instanceof PayloadValidationAppError) {
        return sendJson(res, 400, { error: error.message });
      }
      else if (error instanceof ReservationAppError) {
        return sendJson(res, 409, { error: error.message });
      }
      else {
        return sendJson(res, 500, { error: 'Internal server error', err: error.message });
      }
    }
  });
}

function getMap(res: http.ServerResponse) {
  /* GET /api/map */
  const cabanasList = Array.from(store.cabanas.values()).map(shrinkToCabanaPublic);

  try {
    return sendJson(res, 200, { grid: store.grid, cabanas: cabanasList });
  } catch (error) {
    return sendJson(res, 500, { error: 'Internal server error' });
  }
}

function startHttpServer() {
  httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server running at http://localhost:${HTTP_PORT}/`);
  });
}

export { httpServer, startHttpServer };
