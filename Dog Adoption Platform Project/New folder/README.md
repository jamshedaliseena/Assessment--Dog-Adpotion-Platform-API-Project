# Dog Adoption Platform API

An Express and MongoDB REST API with JWT authentication, password hashing, CORS, validation, ownership checks, filters, and pagination.

## Setup

1. Copy `.env` values to your MongoDB Atlas connection string and a long random `JWT_SECRET`.
2. Run `npm install`.
3. Run `npm start` (or `npm run dev`).
4. Run `npm test` to run the Mocha/Chai integration suite. Tests use an in-memory MongoDB.

## Endpoints

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create `{ username, password }`; returns a 24-hour token. |
| POST | `/api/auth/login` | No | Log in with `{ username, password }`. |
| POST | `/api/dogs` | Bearer token | Create `{ name, description }`. |
| POST | `/api/dogs/:id/adopt` | Bearer token | Adopt with `{ thankYouMessage }`. |
| DELETE | `/api/dogs/:id` | Bearer token | Remove an available dog you own. |
| GET | `/api/dogs/registered?status=available&page=1&limit=10` | Bearer token | List dogs you registered. `status` may be `available` or `adopted`. |
| GET | `/api/dogs/adopted?page=1&limit=10` | Bearer token | List dogs you adopted. |

All protected requests require `Authorization: Bearer <token>`. Pagination defaults to page 1 and limit 10 (maximum 100). Error responses use appropriate 400, 401, 403, 404, 409, and 500 status codes.
