# SceneIt — Backend (Express + JWT)

Backend REST API for SceneIt. Uses **Express**, **JWT auth**, and **CORS** (for the Vite frontend).

## Stack

- Node.js / Express
- JSON Web Tokens (`jsonwebtoken`)
- CORS (`cors`)
- *(Optional)* Prisma for DB access (e.g., in `routes/show.js`)

---

## Quick start

### 1) Install
```bash
cd backend
npm install

2) Environment

Create backend/.env:
JWT_SECRET=change_me_for_dev
# If using Prisma:
# DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public

3) Run the server
node server.js
# or, with nodemon:
# npx nodemon server.js
Server starts on http://localhost:8080

CORS (browser access)

Frontend runs on http://localhost:5173
. CORS is enabled so the browser can call the API with an Authorization header.
// server.js (excerpt)
import cors from "cors";

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));


Endpoints
Health (public)

GET /health → { "ok": true }

Auth (dev helper)

POST /auth/login
Mints a short-lived JWT (no real password check yet).
Response:
{
  "token": "<JWT>",
  "user": { "id": 1, "email": "tester@example.com", "role": "tester" }
}

Auth probe (protected)

GET /private/ping
Requires Authorization: Bearer <token> → { "ok": true, "user": <decoded JWT> }

Shows API (protected)

Mounted with verifyToken:

GET /shows — list all shows

GET /shows/:id — get one show

POST /shows — create a show

PUT /shows/:id — full update

PATCH /shows/:id — partial update

DELETE /shows/:id — delete show

Request body example (for POST /shows):
{
  "title": "Breaking Bad",
  "genre": "Drama",
  "description": "Chemistry teacher turned meth kingpin",
  "producer": "Vince Gilligan",
  "release_year": 2008
}
Auth header (all protected routes)
Authorization: Bearer <your-JWT>
Postman checklist

POST http://localhost:8080/auth/login → copy token

GET http://localhost:8080/private/ping with header
Authorization: Bearer <token> → 200

GET http://localhost:8080/shows with header → 200 (without token → 401)

POST http://localhost:8080/shows with header + JSON body → 201

Postman Test (save token automatically):
const json = pm.response.json();
pm.environment.set("token", json.token);

Middleware: middleware/auth.js

verifyToken:

Reads Authorization header

Verifies JWT with JWT_SECRET (falls back to "dev_secret" in dev)

Attaches req.user (decoded payload)

Returns 401 for missing/invalid/expired tokens

Sample data (for testing)

Use these payloads with POST /shows:
``{ "title":"Game of Thrones","genre":"Fantasy","description":"Nine noble families wage war for control of Westeros.","producer":"David Benioff & D.B. Weiss","release_year":2011 }```

`` `  { "title":"Stranger Things","genre":"Sci-Fi/Horror","description":"Kids uncover government experiments and supernatural forces.","producer":"The Duffer Brothers","release_year":2016 }```
``` { "title":"The Bear","genre":"Drama","description":"A young chef takes over a family sandwich shop.","producer":"Christopher Storer","release_year":2022 } ````
