# VehiclePartsPro Frontend - Backend Integrated

This frontend is connected to the ASP.NET Core VehiclePartsPro backend API.

## Backend URL

Default API URL:

```text
https://localhost:7113
```

If your backend is running on a different URL, create a `.env` file in the frontend root:

```text
VITE_API_BASE_URL=https://localhost:7113
```

or:

```text
VITE_API_BASE_URL=http://localhost:5165
```

Use HTTPS if your backend is launched with the Visual Studio HTTPS profile.

## Run backend first

Open the backend project in Visual Studio and run it. Check Swagger:

```text
https://localhost:7113/swagger
```

If Swagger opens, the backend is running.

## Run frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Admin login

```text
Email: admin@vehicleparts.com
Password: Admin@123
```

## Integrated backend features

- Login with JWT token
- Customer registration
- Admin dashboard stats
- Parts CRUD
- Low stock alerts generate/resolve
- Vendors CRUD
- Purchase invoices create/list
- Staff create/list/delete
- Sales invoices create/list
- Customer profile update
- Customer vehicles add/list/delete
- Customer appointments create/list/cancel
- Customer reviews create/list
- Financial reports

## Notes

Some frontend screens exist but the backend does not currently expose matching customer endpoints for them:

- Customer purchase history list: backend only has admin customer history endpoint.
- Customer unavailable part request: no backend API endpoint exists yet, so this page saves locally in browser localStorage.

