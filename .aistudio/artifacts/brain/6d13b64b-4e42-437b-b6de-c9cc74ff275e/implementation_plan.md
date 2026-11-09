# Despliegue Multi-Dispositivo y Sincronización en la Nube en Tiempo Real (ODECO)

Arquitectura y mecanismo de distribución para que todos los funcionarios dependientes de la oficina ODECO puedan acceder de forma concurrente desde sus computadoras de ventanilla y teléfonos celulares, con sincronización centralizada en tiempo real e identificación simplificada por puesto de trabajo.

### Revisión de Usuario y Decisiones Críticas

> [!IMPORTANT]
> Decisiones confirmadas con el Lic. Diego Casillas en la fase de consulta:
> - **Sincronización en la nube en tiempo real**: Los movimientos registrados por los dependientes (salidas a notificación, inspección, auxilio de fila, horas extras y vacaciones) se reflejan de inmediato en la pantalla del Encargado y en todos los dispositivos conectados, sin depender de un `localStorage` aislado por navegador.
> - **Ingreso simplificado para dependientes**: Al abrir el enlace en su PC o celular, el funcionario selecciona directamente su nombre y puesto de ventanilla (ej. *Dra. Carmen Mendoza · Ventanilla 1*). Su dispositivo memoriza la estación para no requerir credenciales complejas diarias.
> - **Protección estricta de la Jefatura**: El panel de supervisión, aprobación de reportes oficiales para superiores y visado de formularios de horas extras permanece blindado exclusivamente para el **Lic. Diego Casillas mediante PIN de seguridad**.

---

### 1. Visión General y Concepto Central

- **Qué resuelve**: Actualmente la aplicación guarda los datos en el navegador local (`localStorage`). Para que los funcionarios trabajen de manera coordinada desde distintas computadoras de oficina o celulares en terreno, el sistema pasa a una arquitectura **centralizada en la nube** soportada por el servidor del contenedor Cloud Run, manteniendo a todos los dispositivos enlazados en tiempo real.
- **Público y dispositivos objetivo**:
  - *Computadoras de escritorio de ventanilla*: Funcionarios de atención continua (08:00 a 16:00).
  - *Teléfonos celulares de campo*: Notificadores e inspectores técnicos que actualizan su estado en terreno.
  - *Terminal principal del Encargado (Lic. Diego Casillas)*: Monitor integral con alertas de sobretiempos, auxilio de cola y partes para la superioridad.
- **Valor clave**: Cero instalación de software (funciona en cualquier navegador Chrome, Edge, Safari o Firefox), despliegue instantáneo mediante Código QR o enlace web, y actualización en vivo entre dependientes y jefatura.

---

### 2. Experiencia de Usuario y Diseño Visual

#### Flujos de Usuario Principales

1. **Flujo de Conexión del Funcionario (Primer Ingreso)**:
   - El funcionario escanea el Código QR colocado en la oficina o abre el enlace compartido (`https://ais-pre-...run.app`).
   - Pantalla de bienvenida institucional: *"Control Operativo ODECO · Identificación de Estación"*.
   - Lista visual de funcionarios activos con su respectiva ventanilla.
   - El funcionario presiona su tarjeta (ej. *Lic. Javier Morales · Ventanilla 2*).
   - El sistema vincula su equipo a ese puesto, ingresando directamente a su **Panel de Escritorio / Ventanilla** con respaldo normativo AETN.
   - En ingresos posteriores, el dispositivo reconoce automáticamente al funcionario asignado.

2. **Flujo de Difusión y Compartición (Para el Lic. Diego Casillas)**:
   - Nuevo botón destacado en la cabecera: **"Conectar Dispositivos / Enlace ODECO"**.
   - Modal interactivo institucional con:
     - **Código QR oficial en pantalla**: Listo para ser escaneado con la cámara de cualquier teléfono celular Android o iPhone.
     - **Enlace directo con botón "Copiar Enlace"**: Para enviarlo por WhatsApp institucional o correo a las computadoras de los escritorios.
     - Guía paso a paso para anclar la aplicación como acceso directo en la barra de tareas de Windows o como Web App en la pantalla de inicio del celular.

3. **Flujo de Sincronización en Vivo**:
   - Cuando un funcionario en ventanilla marca *"Salida a Notificación"* o presiona el *"Botón de Auxilio por Fila de Usuarios"*, la novedad se transmite al servidor central.
   - El monitor del Lic. Diego Casillas recibe la actualización en vivo (tiempo real), emitiendo la alerta sonora de auxilio y actualizando la disponibilidad de ventanillas al instante.

#### Identidad Visual y Estilo

- **Estilo Institucional**: Se apega a las pautas de *SaaS & Dashboard Design* y accesibilidad WCAG AA.
- **Tipografía**: *Plus Jakarta Sans* para interfaz y textos de servicio; cifras monoespaciadas tabulares (`font-mono tabular-nums`) para cronómetros de tiempo restante y códigos de expedientes AETN.
- **Paleta Operativa**: Azul institucional ODECO (`#1D4ED8`), acentos ámbar para llamadas a la acción, esmeralda para ventanillas operativas y carmesí para demoras o alertas perentorias.

---

### 3. Decisiones de Producto y Trade-Offs

- **Decisión 1: Servidor de Estado Centralizado en Express (`server.ts` con API REST + Live Polling/SSE)**
  - *Enfoque*: Aprovechar el runtime de Node.js/Express ya integrado en la aplicación (`express: ^4.21.2`, `tsx: ^4.21.0`), montando el servidor en el puerto 3000 con endpoints dedicados (`/api/state`, `/api/leaves`, `/api/requests`, `/api/alert`, `/api/staff`) respaldados por almacenamiento persistente en disco del contenedor.
  - *Por qué*: No requiere que el usuario acepte términos de servicios externos adicionales en la nube ni configuraciones complejas de API Keys; funciona de manera nativa e inmediata en el dominio público de Cloud Run provisto para la applet, con soporte automático para múltiples dispositivos concurrentes.
  - *Alternativa descartada*: Depender únicamente de `localStorage` local, ya que aísla los datos impidiendo la supervisión real entre diferentes computadoras.
- **Decisión 2: Inicio de Sesión Rápido por Selección de Puesto de Trabajo**
  - *Enfoque*: Selección visual del funcionario y número de ventanilla con persistencia de sesión en el navegador cliente.
  - *Por qué*: Elimina la fricción de recordar contraseñas en plena atención al usuario, cumpliendo con la preferencia expresa del Lic. Diego Casillas sin descuidar la seguridad de la jefatura, la cual se mantiene resguardada con PIN.

---

### 4. Arquitectura Técnica y Estrategia de Datos

#### Diagrama de Arquitectura del Sistema Multi-Dispositivo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             ARQUITECTURA DE SINCRONIZACIÓN EN TIEMPO REAL ODECO             │
│            Servicio Cloud Run · Acceso Concurrente PC y Teléfonos           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────┐      ┌────────────────────────┐                 │
│  │ PC VENTANILLA 1        │      │ CELULARES EN TERRENO   │                 │
│  │ (Dra. Carmen Mendoza)  │      │ (Notificadores/Campo)  │                 │
│  └───────────┬────────────┘      └───────────┬────────────┘                 │
│              │                               │                              │
│              │    HTTP REST / Live Sync      │                              │
│              ▼                               ▼                              │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │         SERVIDOR FULL-STACK EXPRESS (server.ts)        │                 │
│  │  - Puerto 3000 / AI Studio Cloud Run Service           │                 │
│  │  - Rutas de sincronización:                            │                 │
│  │    • GET/POST /api/state     (Estado global en vivo)   │                 │
│  │    • POST     /api/leaves    (Salidas y retornos)      │                 │
│  │    • POST     /api/requests  (Horas extras/vacaciones) │                 │
│  │    • POST     /api/alert     (Auxilio de ventanilla)   │                 │
│  │    • POST     /api/staff     (Padrón de personal)      │                 │
│  │  - Persistencia centralizada en /data/odeco_store.json │                 │
│  └───────────────────────────┬────────────────────────────┘                 │
│                              │                                              │
│                              │ Sincronización continua                      │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │        TERMINAL DE JEFATURA (Lic. Diego Casillas)      │                 │
│  │  - Monitor en vivo de ventanillas y salidas            │                 │
│  │  - Alarma en tiempo real de auxilio por congestión     │                 │
│  │  - Visado formal de solicitudes de horas extras        │                 │
│  │  - Generación del Parte Oficial para Superiores y AETN │                 │
│  └────────────────────────────────────────────────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Endpoints de la API Central de Sincronización

```typescript
// Endpoints en server.ts
GET  /api/state         // Devuelve el estado unificado actual (staff, leaves, alert, requests, cases)
POST /api/leaves/create // Registra nueva salida o comisión externa desde cualquier terminal
POST /api/leaves/return // Registra el retorno a ventanilla
POST /api/alert/trigger // Activa alarma de auxilio por congestión de fila de usuarios
POST /api/alert/resolve // Resuelve alarma de fila
POST /api/alert/respond // Registra apoyo de ventanilla cercana
POST /api/requests      // Registra solicitud de horas extras, compensación o vacaciones
POST /api/requests/sign // Firma/visado oficial por Lic. Diego Casillas
POST /api/staff         // Altas, bajas o edición de dependientes
```

---

### Verificación y Pruebas Planificadas

1. **Prueba de Conexión Cruzada Multi-Dispositivo**: Abrir la aplicación simultáneamente en dos pestañas/dispositivos (uno simulando la PC de ventanilla y otro el monitor de jefatura); registrar una salida en una y verificar que aparezca inmediatamente en la otra.
2. **Prueba de Generación de QR y Enlace**: Validar que el modal de compartir muestre el enlace exacto de Cloud Run y renderice el Código QR de acceso rápido.
3. **Prueba de Persistencia en Servidor**: Reiniciar el navegador y confirmar que los registros de personal, solicitudes y comisiones se mantengan intactos desde el servidor.
4. **Prueba de Blindaje del Panel de Jefatura**: Verificar que los dependientes que ingresan desde su enlace solo puedan acceder a su ventanilla y a solicitudes, sin poder ingresar al panel de supervisión de Diego Casillas sin su PIN.
