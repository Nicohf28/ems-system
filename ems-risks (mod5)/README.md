# EMS - Módulo de Gestión de Riesgos (Equipo 5)

![Estado](https://img.shields.io/badge/Estado-Terminado-green?style=for-the-badge)
![Equipo](https://img.shields.io/badge/Equipo-5-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-3004-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-5177-purple?style=for-the-badge)

Microservicio desarrollado para el proyecto **Engineering Management Suite (EMS)**.

Este módulo es responsable de la **gestión de riesgos del proyecto**, permitiendo:

- Registrar riesgos
- Consultar riesgos por proyecto
- Clasificar riesgos por severidad
- Actualizar el estado de los riesgos

---

# Información del Equipo

**Equipo:** 5  
**Módulo:** Gestión de Riesgos  
**Puerto Backend:** `3004`  
**Puerto Frontend:** `5177`

---

# Tecnologías Utilizadas

## Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-525252?style=for-the-badge)

---

## Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## Persistencia

![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)

---

# Estructura del Proyecto

```bash
ems-risk-module/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
│
└── README.md
```

---

# Modelo de Riesgo

```json
{
  "id": 1,
  "projectId": 1,
  "risk": "Retraso backend",
  "severity": "high",
  "status": "active"
}
```

---

# Valores Permitidos

## Severidad (`severity`)

- `low`
- `medium`
- `high`

## Estado (`status`)

- `active`
- `mitigated`
- `closed`

---

# Endpoints de la API

## Crear Riesgo

### POST `/risks`

### Request

```json
{
  "projectId": 1,
  "risk": "Retraso backend",
  "severity": "high",
  "status": "active"
}
```

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

---

## Consultar Riesgos por Proyecto

### GET `/risks/:projectId`

### Respuesta Exitosa

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "projectId": 1,
      "risk": "Retraso backend",
      "severity": "high",
      "status": "active"
    }
  ]
}
```

---

# Instalación del Proyecto

## 1. Clonar repositorio

```bash
git clone <url-del-repositorio>
```

---

## 2. Ejecutar Backend

```bash
cd backend
npm install
npm run dev
```

Servidor disponible en:

```bash
http://localhost:3004
```

---

## 3. Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en:

```bash
http://localhost:5177
```

---

# Reglas de Desarrollo

Reglas obligatorias del proyecto:

- Usar **camelCase**
- IDs numéricos únicamente
- Respuestas siempre en formato JSON
- Header obligatorio:

```bash
Content-Type: application/json
```

- Respetar status codes oficiales:
  - `200` Consulta exitosa
  - `201` Creación exitosa
  - `400` Error de validación
  - `404` No encontrado
  - `500` Error interno

- No cambiar nombres de endpoints
- No cambiar estructura de respuestas
- No cambiar nombres de propiedades JSON

---

# Flujo Git Recomendado

## Nombres de ramas

```bash
feature/backend-api
feature/frontend-ui
fix/validaciones
docs/readme
```

## Ejemplos de commits

```bash
feat: agregar endpoint POST /risks
feat: crear formulario de registro de riesgos
fix: validar campo severity
docs: actualizar README
```

---

# Integración con el Ecosistema EMS

Este microservicio debe integrarse con:

- **Equipo 1** → Aplicación Principal
- **Equipo 8** → Dashboard

Endpoint oficial consumido por otros módulos:

```bash
GET http://localhost:3004/risks/:projectId
```

---

# Objetivo Final

Construir un microservicio funcional compatible con el ecosistema EMS, capaz de ejecutarse localmente y comunicarse correctamente mediante HTTP REST y JSON bajo las reglas oficiales de integración.
