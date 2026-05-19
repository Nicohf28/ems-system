# EMS - Equipo 1
## Aplicación Principal e Integración

Proyecto desarrollado para la materia de gestión de proyectos de ingeniería basado en arquitectura de microservicios.

---

NOMBRE CARPETA:
ems-integracion-equipo1

# Integrantes

- David Felipe Arevalo Morales
- Cristian Alejandro Molina Cardenas
- Felipe Ocampo Sierra
- Juan David Solina Vaca

---

# Descripción

El sistema EMS permite:

- Crear proyectos
- Listar proyectos
- Integrar múltiples microservicios
- Mostrar un resumen global del proyecto
- Consumir APIs REST externas

---

# Arquitectura

## Backend
- Node.js
- Express
- Axios
- CORS

## Frontend
- React
- Vite
- Axios

---

# Microservicios Integrados

| Servicio | Puerto |
|---|---|
| Principal | 3000 |
| Riesgos | 3004 |

---

# Estructura del Proyecto

```txt
Backend/
Frontend/
```

---

# Instalación

## Backend

```bash
cd Backend
npm install
npm run dev
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# Endpoints

## Crear Proyecto

```http
POST /projects
```

Body:

```json
{
  "name": "Proyecto EMS",
  "description": "Sistema de gestión"
}
```

---

## Listar Proyectos

```http
GET /projects
```

---

## Resumen Global

```http
GET /projects/:projectId/summary
```

---

# Integración de Microservicios

El sistema consume el microservicio de riesgos mediante Axios:

```txt
http://localhost:3004/risks/:projectId
```

---

# Manejo de Errores

El sistema implementa:

- try/catch
- respuestas estándar JSON
- manejo de fallos de microservicios
- status codes HTTP

---

# Tecnologías Utilizadas

- Node.js
- Express
- React
- Axios
- Vite
- CSS3

---

# Resultado Final

El sistema permite:

✅ Crear proyectos  
✅ Visualizar proyectos  
✅ Integrar microservicios  
✅ Mostrar dashboard  
✅ Consumir APIs REST  
✅ Manejo de errores  
✅ Arquitectura cliente-servidor  

---