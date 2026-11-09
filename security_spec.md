# Security Specification & Invariants - ODECO Control Operativo

## 1. Data Invariants
1. **Identidad del Personal**: Cada registro de salida (`leave`) debe estar asociado a un funcionario existente y validado (`staffId`).
2. **Integridad de Salidas al Baño**: Las salidas por necesidad fisiológica (`salida_bano`) no tienen límite de tiempo ni penalidad por demora.
3. **Control de Horas Extras y Solicitudes**: Las solicitudes (`requests`) requieren la firma/visado formal del Encargado de Reclamos Lic. Diego Casillas antes de ser elevadas a Jefatura de Departamento o Gerencia Comercial.
4. **Mensajería Contact Center**: Los mensajes son bidireccionales y deben preservar los roles fidedignos (`supervisor` o `contact_center`).
5. **Inviolabilidad de Identificadores**: Los IDs de documentos deben respetar el formato `^[a-zA-Z0-9_\-]+$` y longitud máxima de 128 caracteres.

## 2. Dirty Dozen Security Payloads
1. **Payload 1 (ID Inyection)**: Intento de inyectar caracteres especiales en `{staffId}` -> Rechazado por `isValidId`.
2. **Payload 2 (Ghost Field)**: Inyección de un campo oculto `adminOverride: true` en la colección `staff` -> Rechazado por validación de campos.
3. **Payload 3 (Oversized Payload)**: Mensaje de Contact Center con más de 1000 caracteres -> Rechazado por `size() <= 1000`.
4. **Payload 4 (Invalid Status)**: Salida con estado no permitido `status: "destroyed"` -> Rechazado por enum check.
5. **Payload 5 (Unregistered Category)**: Salida con categoría adulterada `category: "vacaciones_ilegales"` -> Validado en esquema.
6. **Payload 6 (Oversized Staff Name)**: Funcionario con nombre de más de 200 caracteres -> Rechazado por límite volumétrico.
7. **Payload 7 (Spoofed Request Status)**: Modificación directa a estado arbitrario sin firma del Encargado -> Bloqueado.
8. **Payload 8 (Queue Alert Severity Bypass)**: Alerta con severidad inválida `severity: "apocalipsis"` -> Rechazado por enum permitido.
9. **Payload 9 (Blanket Read Catch-all)**: Consulta no autorizada a rutas no declaradas -> Denegado por default deny catch-all `/{document=**}`.
10. **Payload 10 (Null Path ID)**: Operación sin ID válido -> Rechazado por `isValidId`.
11. **Payload 11 (Oversized Destination)**: Destino de comisión con 10KB de texto -> Rechazado por `destination.size() <= 300`.
12. **Payload 12 (Malicious JSON Prototype Injection)**: Intento de modificar propiedades de prototipo -> Bloqueado por Firestore Rules nativas.
