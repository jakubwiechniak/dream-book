# DreamBook – platforma rezerwacyjna

**DreamBook** to pełnostackowa aplikacja webowa inspirowana Booking.com. Umożliwia użytkownikom przeglądanie i rezerwację noclegów, dodawanie ofert, zarządzanie rezerwacjami oraz wiele innych funkcjonalności.

Projekt składa się z dwóch głównych komponentów:
- `backend/` – aplikacja Django (Python)
- `frontend/` – aplikacja Next.js (React)

---

## Wymagania

- Docker + Docker Compose *(zalecane)*
- Alternatywnie:
  - Python 3.13+
  - Node.js 18+
  - npm

---

## Szybki start z Docker Compose

1. Zainstaluj:
   - Docker
   - Docker Compose

2. W katalogu głównym uruchom:

```bash
docker-compose up --build
```

## Awaryjny sposób uruchomienia, jakby docker nie poszedł

W podkatalogu "backend":
```bash
pip install -r requirements.txt
python manage.py runserver
```

W podkatalogu "frontend":
```bash
npm install
npm run dev
```