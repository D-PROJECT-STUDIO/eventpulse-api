const eventBody = {
  type: 'object',
  required: ['title', 'description', 'category', 'date', 'city', 'venue', 'capacity'],
  properties: {
    title: { type: 'string', example: 'Cairo Tech Day' },
    description: { type: 'string', example: 'Technology talks and workshops' },
    category: { type: 'string', example: '64f000000000000000000001' },
    date: { type: 'string', format: 'date-time' },
    city: { type: 'string', example: 'Cairo' },
    venue: { type: 'string', example: 'Smart Village' },
    capacity: { type: 'integer', example: 100 }
  }
};

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EventPulse API',
    version: '1.0.0',
    description: 'API for events, registrations, and announcements'
  },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Create an attendee account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Account created' }, 422: { description: 'Invalid input' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Login successful' }, 401: { description: 'Wrong credentials' } }
      }
    },
    '/api/events': {
      get: {
        summary: 'List events',
        parameters: [
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'city', schema: { type: 'string' } },
          { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' } },
          { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['date', 'registrations'] } },
          { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'] } }
        ],
        responses: { 200: { description: 'Event list' } }
      },
      post: {
        summary: 'Create an event',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: eventBody } } },
        responses: { 201: { description: 'Event created' }, 401: { description: 'Login required' }, 403: { description: 'Admin only' }, 422: { description: 'Invalid input' } }
      }
    },
    '/api/events/{id}': {
      get: {
        summary: 'Get one event',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Event found' }, 404: { description: 'Event not found' } }
      },
      patch: {
        summary: 'Update an event',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: eventBody } } },
        responses: { 200: { description: 'Event updated' }, 403: { description: 'Admin only' } }
      },
      delete: {
        summary: 'Delete an event',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Event deleted' }, 403: { description: 'Admin only' } }
      }
    }
  }
};

export default swaggerSpec;
