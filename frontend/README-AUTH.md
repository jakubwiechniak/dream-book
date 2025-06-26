# Flask Backend Integration - Frontend Setup

Frontend przygotowany do integracji z Flask backend API.

## 🔧 Dodane Funkcjonalności

### 1. **System Autentykacji**

- **Context API** (`contexts/auth-context.tsx`) - zarządzanie stanem użytkownika
- **Auth utilities** (`lib/auth.ts`) - funkcje logowania, rejestracji, zarządzania tokenami
- **Protected routes** - middleware sprawdzający autoryzację
- **Token refresh** - automatyczne odświeżanie tokenów

### 2. **API Client**

- **HTTP Client** (`lib/api-client.ts`) - klient z interceptorami
- **Automatyczne dodawanie tokenów** do requestów
- **Error handling** - obsługa błędów API
- **Token refresh** - automatyczne odświeżanie wygasłych tokenów
- **TypeScript interfaces** - typy dla API responses

### 3. **Routing i Middleware**

- **Next.js middleware** - ochrona tras przed nieautoryzowanym dostępem
- **Redirect handling** - przekierowania po logowaniu
- **Role-based access** - podstawy do autoryzacji opartej na rolach

### 4. **Komponenty UI**

- **Zaktualizowany Header** - menu użytkownika z dropdown
- **Auth pages** - strony logowania i rejestracji połączone z API
- **Protected components** - HOC do ochrony komponentów

## 🚀 Konfiguracja

### 1. **Zmienne środowiskowe**

```bash
cp .env.example .env.local
```

Wypełnij w `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. **Struktura Flask API**

Frontend oczekuje następujących endpointów:

```
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
GET  /auth/me

GET  /hotels
GET  /hotels/:id
POST /hotels/search

GET  /bookings
POST /bookings

GET  /reviews
POST /reviews

GET  /admin/users      (admin only)
PATCH /admin/users/:id (admin only)
```

### 3. **Przykładowe Response Format**

```typescript
// Login Response
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "guest|landlord|admin",
    "isActive": true,
    "joinedAt": "2023-01-01T00:00:00Z"
  },
  "expires_in": 3600
}
```

## 📋 Backend Requirements

### Flask Auth Endpoints:

```python
# POST /auth/login
{
  "email": "string",
  "password": "string"
}

# POST /auth/register
{
  "email": "string",
  "password": "string",
  "name": "string",
  "role": "guest" | "landlord"
}

# GET /auth/me (requires Authorization header)
# Returns current user info

# POST /auth/refresh (requires refresh token)
# Returns new access token
```

## 🔒 Security Features

- **JWT Token Management** - automatic handling
- **Secure Storage** - localStorage with error handling
- **Token Expiration** - automatic refresh before expiry
- **CORS Ready** - configured for Flask backend
- **Error Boundaries** - graceful error handling

## 🎯 Next Steps

1. **Uruchom Flask backend** na porcie 5000
2. **Zaimplementuj endpoints** według specyfikacji
3. **Testuj integrację** z frontendem
4. **Dodaj CORS** w Flask (`flask-cors`)

## 📝 Przykład Flask Setup

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/auth/login', methods=['POST'])
def login():
    # Your login logic
    return {
        "access_token": "...",
        "refresh_token": "...",
        "user": {...},
        "expires_in": 3600
    }
```

Frontend jest teraz gotowy do pełnej integracji z Flask backend!
