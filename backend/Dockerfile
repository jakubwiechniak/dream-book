FROM python:3.13.3-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Najpierw kopiujemy tylko requirements.txt, żeby korzystać z cache
COPY backend/requirements.txt .

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Teraz dopiero kopiujemy cały kod
COPY backend/ .

# Uruchamiamy serwer deweloperski
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
