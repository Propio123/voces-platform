## Instrucciones rápidas para agentes AI (proyecto `voces`)

Este repositorio contiene una app Ionic/Angular (frontend) y un pequeño servidor Express (backend) que usa Firebase Admin y OpenRouter/OpenAI.
Apunta a lo esencial para ser productivo aquí.

- Estructura clave (archivos relevantes):
  - `server.js` — servidor Express; inicializa Firebase Admin y expone `app.locals.db` (Firestore) a las rutas.
  - `routes/chat.js`, `routes/salary.js` — endpoints que consumen LLMs vía `utils/openrouter.js` y guardan resultados en Firestore.
  - `utils/openrouter.js` — wrapper HTTP para OpenRouter; usa la variable de entorno `OPENROUTER_API_KEY`.
  - `src/app/functions/index.js` — ejemplo de función que usa Google Generative AI y retorna JSON parseable.
  - `src/app/guards/auth.guard.ts` y `src/app/app.routes.ts` — patrón de rutas: lazy-loaded components + `authGuard` para páginas protegidas (`dashboard-user`, `dashboard-ong`).

- Variables de entorno / secrets (obligatorias para ejecutar localmente):
  - `OPENROUTER_API_KEY` — clave para OpenRouter (utilizada por `utils/openrouter.js`).
  - `SERVICE_ACCOUNT_PATH` — ruta al `serviceAccountKey.json` para Firebase Admin (por defecto `./serviceAccountKey.json`).
  - `PORT` — puerto del servidor Express (opcional, por defecto 3000).

- Flujo y convenciones importantes (solo lo que está en el código):
  - El backend lee / escribe en Firestore y expone `db` como `req.app.locals.db` en las rutas (ver `server.js` y `routes/*.js`).
  - Las rutas siempre guardan tanto la entrada del usuario como la respuesta cruda del modelo en colecciones: `chats`, `evaluaciones_salariales`.
  - Prompts y respuestas: los archivos `routes/*.js` fuerzan respuestas en español neutro y, en algunos casos, en formato JSON (ej. `src/app/functions/index.js` devuelve JSON que se parsea). Mantener este comportamiento.
  - Modelos y parámetros se pasan explícitamente a `callOpenRouter(...)` desde las rutas; respeta la elección de modelo cuando edites endpoints.

- Flujo del frontend:
  - Rutas en `src/app/app.routes.ts` usan `loadComponent()` (lazy components). Mantén esa convención al agregar páginas.
  - `authGuard` usa `@angular/fire/auth` y `auth.currentUser` para permitir o redirigir a `/login`.

- Comandos de desarrollo relevantes (extraídos de `package.json`):
  - `npm start` — ejecuta `ng serve` (frontend dev server).
  - `npm run build` — `ng build`.
  - `npm test` — `ng test` (Karma/Jasmine).
  - `npm run watch` — `ng build --watch --configuration development`.

- Reglas prácticas que los agentes deben seguir (derivadas del código):
  1. Siempre generar respuestas en español neutro para endpoints `/chat-advice` y `/evaluate-salary`.
  2. Para el endpoint de evaluación salarial, devolver un análisis conciso y almacenar `raw` (no eliminar campos crudos en la persistencia).
  3. No exponer claves ni contenidos sensibles en respuestas; los logs crudos se guardan pero no deben incluirse en la respuesta al cliente.
  4. Si un cambio implica mover secrets o claves (p.ej. API keys embebidas), sugiera migrarlas a variables de entorno y actualice `.env`/documentación.

- Ejemplos concretos a usar como referencia:
  - Protección de rutas: `src/app/guards/auth.guard.ts` — navegar a `/login` si `auth.currentUser` es falsy.
  - Llamada LLM + almacenamiento: `routes/salary.js` (usa `callOpenRouter(...)`, guarda en `evaluaciones_salariales`).
  - Wrapper de petición: `utils/openrouter.js` — retorna `{ text, raw }` y lanza error si la API falla.

- Riesgos y notas operativas:
  - `src/app/functions/index.js` contiene una clave de ejemplo para Google Generative AI; NO SUPONGAS QUE ES VÁLIDA — moverla a entorno.
  - Si el servidor se ejecuta localmente, coloca `serviceAccountKey.json` en la raíz o define `SERVICE_ACCOUNT_PATH`.

Si algo está incompleto o quieres que expanda alguna sección (por ejemplo: añadir ejemplos de tests unitarios, CI, o plantillas de PR), dime qué parte y la detallo.
