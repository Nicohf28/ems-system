# Equipo 3 — Cronograma CCM (Critical Chain Method)

Lucas Guzman Quijano/
Juan Angel Renteria Puerto/ 
Daniel Ricardo Ballen Rueda/
Jose Ernesto Navarro Herrera/
Angie Dayana Retiz Guerrero

## Sistema EMS · Puerto Backend: 3003 · Puerto Frontend: 5175

---

## Estructura del proyecto

```
equipo3-cronograma/
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── routes/scheduleRoutes.js
│       ├── controllers/scheduleController.js
│       ├── services/ccmService.js
│       └── models/taskModel.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/Navbar.jsx, TaskForm.jsx
        ├── pages/Tasks.jsx, CCM.jsx
        ├── services/api.js
        └── styles/global.css
```

---

## Ejecución

### Backend
```bash
cd backend
npm install
npm run dev
# Corre en http://localhost:3003
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:5175
```

---

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /schedule | Crear tarea |
| GET | /schedule/:projectId | Listar tareas del proyecto |
| GET | /schedule/:projectId/progress | Progreso promedio (%) |
| GET | /schedule/:projectId/ccm | Análisis CCM completo |
| PUT | /schedule/:id | Actualizar tarea |
| DELETE | /schedule/:id | Eliminar tarea |

---

## Algoritmo CCM

### Modelo de tarea
```json
{
  "id": 1,
  "projectId": 1,
  "task": "Diseñar frontend",
  "days": 5,
  "progress": 50,
  "pessimistic": 8,
  "aggressive": 3,
  "dependencies": [],
  "type": "normal"
}
```
- **days**: estimado normal
- **pessimistic**: tiempo pesimista (para calcular buffers)
- **aggressive**: tiempo agresivo 50% (para cadena crítica)
- **dependencies**: array de IDs de tareas predecesoras

### Cadena Crítica
Ruta más larga usando tiempos agresivos (50%). Se calcula con ordenamiento topológico.

### Project Buffer (PB)
`PB = √(Σ((pessimistic - aggressive)/2)²)` sobre tareas de la cadena crítica.

### Feeding Buffers (FB)
`FB = √(Σ varianzas)` de cada cadena alimentadora.

### Crashing
Reducir duración de tareas críticas añadiendo recursos.
- Costo por día = $100 (configurable)

### Fast Tracking
Solapar tareas críticas en un 50% para ganar tiempo sin costo adicional.



