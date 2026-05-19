

# EMS — Dashboard de Valor (Grupo 8)

Dashboard de rentabilidad del sistema **Engineering Management Suite**.  
Consume los 6 microservicios del EMS, calcula un índice de rentabilidad ponderado y emite un veredicto: **RENTABLE / EN RIESGO / NO RENTABLE**.

---
## Equipo de desarrollo
- Favio Alejandro Bernal Gonzalez — Lider tecnico / Backend
- Luisa Maria Lopez Rugeles — Lider de calidad / Documentacion
- Carlos Andres Lamus Gomez — Backend / Integracion
- Juan Esteban Roncancio Cardenas — Frontend
- Kevin Santiago Cachaya Collazos — Frontend / Build

---
## Índice

1. [Descripción del módulo](#1-descripción-del-módulo)
2. [Arquitectura](#2-arquitectura)
3. [Requisitos previos](#3-requisitos-previos)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Instalación y ejecución](#5-instalación-y-ejecución)
6. [Puertos](#6-puertos)
7. [Endpoint del backend](#7-endpoint-del-backend)
8. [Algoritmo de rentabilidad](#8-algoritmo-de-rentabilidad)
9. [Componentes del frontend](#9-componentes-del-frontend)
10. [Manejo de errores](#10-manejo-de-errores)
11. [Desarrollo sin los otros microservicios](#11-desarrollo-sin-los-otros-microservicios)
12. [Tests unitarios](#12-tests-unitarios)
13. [Estructura de carpetas](#13-estructura-de-carpetas)

---

## 1. Descripción del módulo

El **Grupo 8** es el Dashboard del EMS. A diferencia de los otros módulos:

- **Es stateless**: no tiene base de datos propia.
- **Agrega datos**: consulta los 6 microservicios en paralelo.
- **Calcula rentabilidad**: aplica un algoritmo de scoring multidimensional.
- **Es tolerante a fallos**: si uno o todos los servicios externos fallan, el sistema sigue respondiendo correctamente.

---

## 2. Arquitectura

```
Browser (:5180)
    │  React + Vite
    │  axios → GET /dashboard/:id
    ▼
Backend Grupo 8 (:3007)
    │  Express + Node.js
    │  Promise.allSettled (paralelo, 5 s timeout)
    ├──► :3001 Trazabilidad  GET /requirements/:id
    ├──► :3002 Calidad        GET /quality/:id
    ├──► :3003 Cronograma     GET /schedule/:id/progress
    ├──► :3004 Riesgos        GET /risks/:id
    ├──► :3005 Costos         GET /costs/:id/total
    └──► :3006 Cambios        GET /changes/:id
```

**Flujo interno del backend:**

```
aggregator.service.js  →  scoring.service.js  →  controller  →  respuesta JSON
  (fetch paralelo)           (algoritmo)
```

---

## 3. Requisitos previos

- **Node.js 18+** y npm
- Los microservicios externos son **opcionales**: si no están corriendo, sus dimensiones aparecen como `unavailable` pero el dashboard funciona.

---

## 4. Variables de entorno

**`backend/.env`**

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `PORT`   | `3007`           | Puerto del servidor Express |

No se requieren variables de entorno en el frontend (la URL del backend está hardcodeada en `src/services/api.js` como `http://localhost:3007`).

---

## 5. Instalación y ejecución

### Backend (puerto 3007)

```bash
cd grupo8-dashboard/backend
npm install
npm run dev        # modo desarrollo con nodemon (auto-reload)
# ó
npm start          # modo producción
```

### Frontend (puerto 5180)

```bash
cd grupo8-dashboard/frontend
npm install
npm run dev        # servidor Vite con HMR
```

Abrir: **http://localhost:5180**

---

## 6. Puertos

| Componente      | Puerto |
|-----------------|--------|
| Frontend        | 5180   |
| Backend Grupo 8 | 3007   |
| Trazabilidad    | 3001   |
| Calidad         | 3002   |
| Cronograma      | 3003   |
| Riesgos         | 3004   |
| Costos          | 3005   |
| Cambios         | 3006   |

---

## 7. Endpoint del backend

### `GET /dashboard/:projectId`

Agrega datos de los 6 microservicios y devuelve el análisis completo de rentabilidad.

**Parámetros de ruta:**
- `projectId` — entero positivo (ej: `1`)

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "projectId": 1,
    "requirements": 10,
    "approvedRequirements": 8,
    "tasks": 0,
    "progress": 70,
    "activeRisks": 2,
    "highRisks": 1,
    "totalCost": 3000,
    "pendingChanges": 1,
    "highImpactPendingChanges": 0,
    "qualityApproved": 7,
    "qualityRejected": 1,
    "rentabilityScore": 75,
    "verdict": "RENTABLE",
    "verdictReason": "8/10 requisitos aprobados",
    "dimensions": {
      "alcance":  { "score": 80, "status": "ok",      "detail": "8/10 requisitos aprobados" },
      "progreso": { "score": 70, "status": "ok",       "detail": "Progreso al 70%" },
      "costos":   { "score": 70, "status": "ok",       "detail": "Costo acumulado: $3.000" },
      "riesgos":  { "score": 65, "status": "warning",  "detail": "2 riesgos activos, 1 de severidad alta" },
      "cambios":  { "score": 95, "status": "ok",       "detail": "1 cambio pendiente, 0 de alto impacto" },
      "calidad":  { "score": 88, "status": "ok",       "detail": "7/8 revisiones aprobadas" }
    },
    "servicesStatus": {
      "trazabilidad": "ok",
      "calidad": "ok",
      "cronograma": "ok",
      "riesgos": "ok",
      "costos": "ok",
      "cambios": "ok"
    }
  }
}
```

**Respuesta con servicio externo caído:**

```json
"riesgos": { "score": null, "status": "unavailable", "detail": "Servicio no disponible" }
```

**Respuestas de error:**

| Status | Caso |
|--------|------|
| `400`  | `projectId` no es un entero positivo |
| `500`  | Error interno inesperado del servidor |

```json
{ "success": false, "message": "projectId debe ser un número entero positivo" }
```

### `GET /health`

Liveness check.

```json
{ "success": true, "data": { "status": "ok", "service": "grupo8-dashboard", "port": "3007" } }
```

---

## 8. Algoritmo de rentabilidad

### Scores por dimensión (0–100)

| Dimensión | Fórmula | ok | warning | critical |
|-----------|---------|-----|---------|----------|
| **Alcance** | `(aprobados / total) × 100` | ≥ 70 | ≥ 40 | < 40 |
| **Progreso** | valor directo 0–100 del servicio | ≥ 60 | ≥ 30 | < 30 |
| **Costos** | `max(0, (1 − costo / BUDGET_BASE) × 100)` | ≥ 50 | ≥ 20 | < 20 |
| **Riesgos** | `max(0, 100 − activos×10 − altos×15)` | ≥ 70 | ≥ 40 | < 40 |
| **Cambios** | `max(0, 100 − pendientes×5 − altosImpacto×20)` | ≥ 70 | ≥ 40 | < 40 |
| **Calidad** | `(aprobados / total) × 100` (si total=0 → 100) | ≥ 75 | ≥ 50 | < 50 |

> **`BUDGET_BASE = 10000`** — constante en `scoring.service.js`, ajustable según el proyecto.  
> La dimensión Costos es **inversa**: más gasto = menor score.

### Score global ponderado

```
pesos: alcance=0.20, progreso=0.20, costos=0.20,
       riesgos=0.20, cambios=0.10, calidad=0.10

rentabilityScore = Σ(score_i × peso_i) / Σ(pesos_disponibles)
rentabilityScore = Math.round(rentabilityScore)
```

Solo se incluyen las dimensiones disponibles (score ≠ null).  
Si faltan servicios, los pesos se renormalizan automáticamente.

### Veredicto

| Rango del score | Veredicto | Color en UI |
|-----------------|-----------|-------------|
| ≥ 70            | **RENTABLE** | Verde |
| ≥ 40            | **EN RIESGO** | Ámbar |
| < 40            | **NO RENTABLE** | Rojo |

### verdictReason

Se selecciona el `detail` de la dimensión con **peor estado**:
1. Primero se busca la dimensión con `status: "critical"` y menor score.
2. Si no hay críticas, la de `status: "warning"` con menor score.
3. Si todo está en "ok", se toma la de menor score.

---

## 9. Componentes del frontend

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **Dashboard** | `pages/Dashboard.jsx` | Página principal. Gestiona el estado global, el navbar con input de projectId y la orquestación de todos los componentes. |
| **VerdictBanner** | `components/VerdictBanner.jsx` | Banner prominente con fondo verde/ámbar/rojo según el veredicto. Muestra veredicto, score y razón. |
| **ScoreGauge** | `components/ScoreGauge.jsx` | Indicador numérico grande (0-100) con barra de progreso animada. Color según rango (verde/ámbar/rojo). |
| **DimensionCard** | `components/DimensionCard.jsx` | Tarjeta de una dimensión: nombre, score, barra de progreso, status con badge y detalle textual. Borde coloreado por status. |
| **ServiceStatusBar** | `components/ServiceStatusBar.jsx` | Fila de 6 píldoras indicando si cada microservicio respondió `ok` o `error` en la última consulta. |

### Estados de la interfaz

| Estado | Qué se muestra |
|--------|---------------|
| Inicial (sin datos) | Pantalla de bienvenida con instrucciones |
| Cargando | Spinner con mensaje |
| Error de red / validación | Banner rojo con descripción del error |
| Datos cargados | Dashboard completo |

---

## 10. Manejo de errores

### Backend

- **Servicios externos caídos**: capturado por `Promise.allSettled`. La dimensión queda con `score: null, status: "unavailable"`.
- **Timeout**: 5 segundos por servicio (configurable en `aggregator.service.js` → `TIMEOUT_MS`).
- **projectId inválido**: retorna `400` antes de hacer ninguna llamada externa.
- **Error inesperado en scoring**: capturado en el controller, retorna `500`.

### Frontend

- **Error de validación**: se muestra antes de hacer la llamada HTTP.
- **Error de red / backend caído**: capturado en el `catch` de `loadData`, mensaje descriptivo.
- **Dimensión unavailable**: `DimensionCard` muestra borde gris y guión en lugar del score.

---

## 11. Desarrollo sin los otros microservicios

El dashboard funciona aunque ningún microservicio esté corriendo. En ese caso:

- Todas las dimensiones aparecen como `unavailable` (borde gris).
- El `rentabilityScore` es `0`.
- El veredicto es `NO RENTABLE`.
- La `ServiceStatusBar` muestra todas las píldoras en rojo.

Para simular respuestas de servicios durante el desarrollo, se puede usar cualquier herramienta de mock HTTP (json-server, Postman mock server, etc.) en los puertos correspondientes, o modificar temporalmente `aggregator.service.js` para retornar datos fijos.

**Ejemplo de mock rápido con json-server** (opcional):
```bash
npx json-server --port 3001 --routes mock-routes.json mock-db.json
```

---

## 12. Tests unitarios

Los tests están embebidos en `scoring.service.js` y se ejecutan directamente con Node:

```bash
cd grupo8-dashboard/backend
npm test
# equivalente a: node src/services/scoring.service.js
```

### Casos cubiertos

| Test | Descripción | Resultado esperado |
|------|-------------|-------------------|
| 1 | Proyecto con todas las métricas favorables | `RENTABLE` |
| 2 | Muchos riesgos altos, costos elevados, bajo progreso | `EN RIESGO` o `NO RENTABLE` |
| 3 | Todos los servicios caídos | `score=0`, todas las dimensiones `unavailable`, sin crash |
| 4 | Verificación numérica exacta (8/10 req, 70% prog, $3000, 2 riesgos, 1 cambio, 7/8 calidad) | `score=75`, `RENTABLE` |

---

## 13. Estructura de carpetas

```
grupo8-dashboard/
├── README.md
├── backend/
│   ├── .env                              ← PORT=3007
│   ├── package.json
│   └── src/
│       ├── app.js                        ← entrada, middlewares, rutas
│       ├── routes/
│       │   └── dashboard.routes.js       ← GET /:projectId
│       ├── controllers/
│       │   └── dashboard.controller.js   ← validación + orquestación
│       └── services/
│           ├── aggregator.service.js     ← llamadas paralelas a 6 servicios
│           └── scoring.service.js        ← algoritmo de rentabilidad + tests
└── frontend/
    ├── index.html
    ├── vite.config.js                    ← puerto 5180
    ├── package.json
    └── src/
        ├── main.jsx                      ← punto de entrada React
        ├── App.jsx                       ← componente raíz
        ├── services/
        │   └── api.js                    ← cliente axios → :3007
        ├── pages/
        │   └── Dashboard.jsx             ← página principal
        └── components/
            ├── VerdictBanner.jsx         ← banner RENTABLE/EN RIESGO/NO RENTABLE
            ├── ScoreGauge.jsx            ← indicador numérico 0-100
            ├── DimensionCard.jsx         ← tarjeta por dimensión (×6)
            └── ServiceStatusBar.jsx      ← estado de los 6 microservicios
```
> Nota: el puerto 3007 está definido en backend/.env y no debe cambiarse.