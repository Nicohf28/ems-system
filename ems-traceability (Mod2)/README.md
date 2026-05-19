# EMS - Módulo 2: Trazabilidad

Microservicio de trazabilidad desarrollado para el sistema EMS bajo arquitectura de microservicios.

## 1) Este módulo permite:

- Crear requisitos
- Consultar requisitos por proyecto
- Actualizar requisitos
- Integrarse con otros módulos mediante HTTP REST

## 2) Tecnologías utilizadas:

## Backend

- Node.js
- Express

## Frontend

- React
- Vite
- Axios
- Arquitectura

## 3) El sistema está dividido en:

- ems-trazabilidad-backend/
- ems-trazabilidad-frontend/

## 4) Requisitos previos:

## Instalar

- Node.js 18+
- npm

## Verificar instalación

- node -v
- npm -v

## 5) Clonar repositorio:
git clone [https://github.com/USUARIO/ems-trazabilidad.git](https://github.com/USUARIO/ems-trazabilidad.git)

## 6) Entrar al proyecto:
- cd ems-trazabilidad

## 7) Instalación Backend:

### 7.1) Entrar al backend
- cd ems-trazabilidad-backend

## 7.2) Instalar dependencias
- npm install

## 8) Configuración Backend:

### 8.1) Crear archivo .env
- PORT=3001

(Puerto para Prototipo)

## 9) Ejecutar Backend:
- npm run dev

## 10) Servidor esperado:
Servidor ejecutándose en puerto 3001

### Backend disponible en
[http://localhost:3001](http://localhost:3001)

## 11) Instalación Frontend:

### 11.1) Abrir nueva terminal.

### 11.2) Entrar al frontend
- cd ems-trazabilidad-frontend

### 11.3) Instalar dependencias
- npm install

### 11.4) Ejecutar Frontend
- npm run dev

### Frontend disponible en
[http://localhost:5174](http://localhost:5174)

## 12) Endpoints oficiales:
## Crear requisito
POST /requirements

### Body

{
"projectId": 1,
"title": "Login",
"description": "El sistema debe permitir login",
"status": "pending"
}

## Consultar requisitos por proyecto
GET /requirements/:projectId

### Ejemplo

GET /requirements/1

## Actualizar requisito
PUT /requirements/:id

### Ejemplo body
{
"status": "approved"
}

## 13) Estados válidos:
El campo status solo acepta...

- pending
- approved
- rejected

## 14) Integración con otros módulos:
Este módulo se integra con...
- Gestión de proyectos
- Calidad
- Dashboard principal

La integración se realiza mediante HTTP REST usando JSON.

## 15) Flujo esperado:
- El módulo de proyectos crea un proyecto
- Se obtiene el projectId
- Este módulo registra requisitos asociados

## 16) Notas:
- El sistema usa almacenamiento en memoria para simplificar el prototipo.
- Los datos se reinician al apagar el backend.
- El objetivo principal es garantizar integración estable entre microservicios.
