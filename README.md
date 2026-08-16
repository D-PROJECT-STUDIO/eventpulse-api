# EventPulse API

EventPulse is a backend API for an event platform. Attendees can view events, register for them, and read announcements. Admins can manage events and send live announcements.

## Technologies

- Node.js and Express
- MongoDB and Mongoose
- JWT and bcryptjs
- Socket.io
- express-validator
- Jest and Supertest
- Swagger and Postman
- Vercel

## Run locally

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your MongoDB connection and JWT secret to `.env`.
5. Run `npm run seed`.
6. Run `npm run dev`.

The local API runs at `http://localhost:3000`.

The seed script creates this admin account:

- Email: `admin@eventpulse.com`
- Password: `admin123`

## Environment variables

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventpulse
JWT_SECRET=add-a-long-random-secret-here
JWT_EXPIRES_IN=7d
```

## Main endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create an attendee account |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/events` | Public | List, filter, search, sort, and paginate events |
| GET | `/api/events/:id` | Public | Get one event with category and organizer |
| POST | `/api/events` | Admin | Create an event |
| PATCH | `/api/events/:id` | Admin | Update an event |
| DELETE | `/api/events/:id` | Admin | Delete an event |
| POST | `/api/registrations` | Attendee | Register for an event |
| GET | `/api/registrations/my` | Attendee | Get the current user's registrations |
| DELETE | `/api/registrations/:id` | Attendee | Cancel the current user's registration |
| GET | `/api/announcements/:eventId` | Public | Get announcement history |
| POST | `/api/announcements` | Admin | Save and broadcast an announcement |
| GET | `/health` | Public | Check the server and database |
| GET | `/api-docs` | Public | Open Swagger documentation |

The events list supports these query values:

- `category`
- `city`
- `startDate` and `endDate`
- `search`
- `page` and `limit`
- `sortBy=date` or `sortBy=registrations`
- `order=asc` or `order=desc`

## Socket.io

A client joins an event room by sending `join-event` with the event id. New announcements are received through the `announcement` event.

## Tests

Run all tests with:

```bash
npm test
```

## Postman

The Postman collection and development environment are inside the `postman` folder.

## Live API

Deployment link: https://eventpulse-api-zeta.vercel.app
