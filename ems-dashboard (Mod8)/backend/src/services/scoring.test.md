# Casos de prueba validados — scoring.service.js

| Test | Entrada | Resultado esperado | Estado |
|------|---------|-------------------|--------|
| 1 | Proyecto saludable | RENTABLE, score=95 | PASS |
| 2 | Metricas criticas | NO RENTABLE, score=16 | PASS |
| 3 | Servicios caidos | score=0, unavailable | PASS |
| 4 | Verificacion numerica | score=75, RENTABLE | PASS |

Validado por: Luisa Maria Lopez Rugeles — Lider de calidad
