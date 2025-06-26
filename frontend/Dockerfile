FROM node:18

WORKDIR /app

# Najpierw kopiujemy tylko zależności
COPY frontend/package*.json ./

# Instalujemy paczki (next, react itd.)
RUN npm install

# Potem dopiero cały kod źródłowy (żeby nie nadpisać node_modules)
COPY frontend/ .

CMD ["npm", "run", "dev"]
