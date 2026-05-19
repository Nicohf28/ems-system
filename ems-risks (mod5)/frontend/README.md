# Frontend EMS - Gestión de Riesgos

Frontend React + Vite para el módulo de Gestión de Riesgos del Equipo 5.

## Contrato que consume

Backend esperado:

```txt
http://localhost:3004
```

Endpoints usados:

```txt
POST /risks
GET /risks/:projectId
```

El frontend envía este JSON al guardar:

```json
{
  "projectId": 1,
  "risk": "Retraso backend",
  "severity": "high",
  "status": "active"
}
```

Valores permitidos:

- severity: `low`, `medium`, `high`
- status: `active`, `mitigated`, `closed`

## Cómo ejecutar

Primero corre el backend:

```bash
cd backend
npm install
npm run dev
```

Luego corre este frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en:

```txt
http://localhost:5177
```

## Validaciones incluidas

- Campos vacíos.
- `projectId` numérico, entero y mayor que cero.
- Estados válidos.
- Severidades válidas.
- Respuesta del backend con estructura `{ success: true, data: [] }` al consultar.

## Nota sobre el botón Actualizar

El backend actual solo tiene `POST /risks` y `GET /risks/:projectId`. Por eso el botón **Actualizar** vuelve a consultar la lista con `GET /risks/:projectId` y no inventa un endpoint `PUT`, para no romper el contrato de integración.
