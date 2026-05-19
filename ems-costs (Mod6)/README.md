# EMS - Microservicio de Costos (Equipo 6)

## Descripción

Microservicio de **Costos** del sistema EMS, desarrollado por el **Equipo 6**. Permite registrar costos asociados a proyectos, consultar los costos de un proyecto específico y calcular el total de costos por proyecto.

## Tecnologías

| Componente | Tecnología |
|------------|------------|
| Backend    | Node.js + Express |
| Frontend   | React + Vite |
| Comunicación | REST API (JSON) |
| Persistencia | Array en memoria |
| HTTP Client | Axios |
| Routing | react-router-dom |

## Estructura del Proyecto

```
grupo6-costos/
├── backend/
│   ├── models/Cost.js
│   ├── routes/costRoutes.js
│   ├── controllers/costController.js
│   ├── services/costService.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/CostForm.jsx
│   │   ├── components/CostTable.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── .gitignore
└── README.md
```

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### Backend (puerto 3005)

```bash
cd backend
npm run dev
```

### Frontend (puerto 5178)

```bash
cd frontend
npm run dev
```

## Variables de Entorno

### backend/.env

```
PORT=3005
```

### frontend/.env

```
VITE_API_URL=http://localhost:3005
```

## Endpoints

### POST /costs

Registra un nuevo costo.

```bash
curl -X POST http://localhost:3005/costs \
  -H "Content-Type: application/json" \
  -d '{"projectId": 1, "concept": "Frontend", "amount": 500}'
```

**Respuesta 201:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "projectId": 1,
    "concept": "Frontend",
    "amount": 500
  }
}
```

**Respuesta 400 (concept vacío):**

```json
{
  "success": false,
  "message": "concept es obligatorio y no puede estar vacío"
}
```

### GET /costs/:projectId

Obtiene todos los costos de un proyecto.

```bash
curl http://localhost:3005/costs/1
```

**Respuesta 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "projectId": 1,
      "concept": "Frontend",
      "amount": 500
    }
  ]
}
```

### GET /costs/:projectId/total

Obtiene el total de costos de un proyecto.

```bash
curl http://localhost:3005/costs/1/total
```

**Respuesta 200:**

```json
{
  "success": true,
  "data": {
    "totalCost": 500
  }
}
```

**Si no hay costos:**

```json
{
  "success": true,
  "data": {
    "totalCost": 0
  }
}
```

## Modelo de Datos

```json
{
  "id": 1,
  "projectId": 1,
  "concept": "Frontend",
  "amount": 500
}
```

## Validaciones

- **id**: Autoincremental, inicia en 1
- **projectId**: Numérico, entero positivo (se convierte si llega como string)
- **concept**: Obligatorio, se aplica `trim()`, no puede quedar vacío
- **amount**: Numérico, mayor a 0, admite decimales

## Reglas Cumplidas

- ✅ Puerto backend: 3005 (leído desde `.env`)
- ✅ Puerto frontend: 5178
- ✅ Convención camelCase en todo el código
- ✅ IDs numéricos autoincrementales iniciando en 1
- ✅ Formato de respuesta éxito: `{ "success": true, "data": ... }`
- ✅ Formato de respuesta error: `{ "success": false, "message": "..." }`
- ✅ HTTP status codes: 200, 201, 400, 404, 500
- ✅ `app.use(cors())` y `app.use(express.json())`
- ✅ Persistencia en array en memoria (sin base de datos)
- ✅ Arquitectura MVC: Model → Service → Controller → Routes
- ✅ Validaciones en controller con try/catch
- ✅ Frontend con React + Vite
- ✅ Comunicación vía Axios con base URL desde `VITE_API_URL`
- ✅ Botones: Guardar, Refrescar, Actualizar
- ✅ Tabla con columnas: id, concept, amount
- ✅ Total de costos del proyecto consultado
- ✅ react-router-dom instalado y configurado
- ✅ Sin MySQL, PostgreSQL, MongoDB ni Docker

## Autor

**Equipo 6 – Costos**
