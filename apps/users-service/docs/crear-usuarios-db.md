# Crear usuarios en la base de datos

```bash
curl -X POST http://localhost:3001/internal/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos.com",
    "password": "123456",
    "name": "Admin",
    "phone": "999888777"
  }'
```

## Login 

```bash
curl -X POST http://localhost:3002/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@pos.com","password":"123456"}'

```
