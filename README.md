# Backend – API de bicicletas y pedidos

API REST hecha con **Express 5**, **TypeScript**, **Sequelize 6** y **MySQL**. Gestiona marcas, bicicletas, fichas técnicas, clientes, pedidos y líneas de pedido.

---

## 1. Puesta en marcha

### Requisitos
- Node.js 20 o superior
- MySQL en marcha, con una base de datos creada (por defecto `dsw_products`)

### Instalación

```bash
npm install
```

### Variables de entorno (`.env`)

Se leen en `src/config/env.ts`. Si falta alguna, se usa el valor por defecto.

| Variable | Por defecto | Para qué sirve |
|---|---|---|
| `PORT` | `3000` | Puerto (ojo: `server.ts` ahora escucha en 3000 fijo) |
| `DB_HOST` | `localhost` | Servidor MySQL |
| `DB_PORT` | `3306` | Puerto MySQL |
| `DB_NAME` | `dsw_products` | Nombre de la base de datos |
| `DB_USER` | `root` | Usuario |
| `DB_PASSWORD` | (la tuya) | Contraseña |

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca con `tsx watch src/server.ts` (se reinicia al guardar) |
| `npm run build` | Compila TypeScript a `dist/` con `tsc` |
| `npm start` | Ejecuta la versión compilada `dist/server.js` |

Al arrancar, el servidor: define las asociaciones, comprueba la conexión, sincroniza tablas con `sequelize.sync({ alter: true })` y escucha en `http://localhost:3000`. Todas las rutas cuelgan de `/api`.

---

## 2. Estructura del proyecto

```
Backend/
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── server.ts              ← punto de entrada: asociaciones, sync y listen
    ├── app.ts                 ← otra app Express (ahora mismo no se usa)
    ├── config/
    │   ├── env.ts             ← lee el .env
    │   └── database.ts        ← crea la conexión Sequelize
    ├── models/
    │   └── associations.ts    ← relaciones entre modelos
    ├── routes/
    │   └── index.ts           ← monta cada módulo bajo /api/...
    └── modules/
        ├── brands/            ← marcas
        ├── bicycles/          ← bicicletas
        ├── bicycleDetails/    ← ficha técnica (1:1 con bicicleta)
        ├── customers/         ← clientes
        ├── orders/            ← pedidos
        └── order-items/       ← líneas de pedido (tabla intermedia)
```

Cada módulo tiene sus cuatro archivos: `*.model.ts`, `*.service.ts`, `*.controller.ts` y `*.routes.ts`.

---

## 3. Arquitectura por capas

Una petición recorre siempre el mismo camino:

```
Cliente (Postman)
   │  GET /api/orders/1
   ▼
routes/index.ts        →  decide el módulo por el prefijo (/orders)
   ▼
orders.routes.ts       →  decide el método por la ruta (/:id → getById)
   ▼
orders.controller.ts   →  lee req, valida, llama al service y responde con res
   ▼
orders.service.ts      →  lógica y consultas a la base de datos
   ▼
orders.model.ts        →  define la tabla; Sequelize genera el SQL
   ▼
MySQL
```

| Capa | Responsabilidad | Qué NO debe hacer |
|---|---|---|
| **Route** | Asociar método HTTP + URL con una función del controller | Lógica |
| **Controller** | Leer `req`, validar datos, elegir código HTTP, devolver `res` | Consultas a la BD |
| **Service** | Consultas Sequelize y reglas de negocio | Usar `req` / `res` |
| **Model** | Definir columnas, tipos y validaciones | Lógica de negocio |

---

## 4. Archivos de configuración

### `src/config/env.ts`
Carga el `.env` con `dotenv` y exporta un objeto `env` con valores ya convertidos (`Number(...)`) y por defecto.

### `src/config/database.ts`
Crea y exporta `sequelize`, la conexión única que usan todos los modelos (`dialect: "mysql"`, `logging: false`).

### `src/server.ts`
1. Crea la app Express, activa `express.json()` y monta `/api`.
2. `defineAssociations()` registra las relaciones.
3. `sequelize.authenticate()` prueba la conexión.
4. `sequelize.sync({ alter: true })` crea o ajusta las tablas.
5. `app.listen(3000)`.

> Importante: `defineAssociations()` debe llamarse **antes** de `sync()`, porque las claves foráneas se crean según las asociaciones.

### `src/routes/index.ts`

| Prefijo | Módulo |
|---|---|
| `/api/bicycles` | Bicicletas |
| `/api/brands` | Marcas |
| `/api/bicycle-details` | Fichas técnicas |
| `/api/orders` | Pedidos |
| `/api/customers` | Clientes |
| `/api/order-items` | Líneas de pedido |

---

## 5. Modelo de datos y relaciones

```
Brand ──1:N──► bicycle ──1:1──► BicycleDetail
                  │
                  └──N:M──► Order ◄──N:1── customer
                     (a través de OrderItem)
```

| Relación | Definición en `associations.ts` | Borrado |
|---|---|---|
| Marca → Bicicletas | `Brand.hasMany(bicycle, as: "bicycles")` / `bicycle.belongsTo(Brand, as: "brand")` | `RESTRICT`: no se puede borrar una marca con bicicletas |
| Bicicleta → Ficha | `bicycle.hasOne(BicycleDetail, as: "detail")` / `BicycleDetail.belongsTo(bicycle, as: "bicycle")` | `CASCADE`: borrar la bici borra su ficha |
| Cliente → Pedidos | `customer.hasMany(Order, as: "orders")` / `Order.belongsTo(customer, as: "customer")` | `CASCADE` (porque `customerId` no admite `null`) |
| Pedido ↔ Bicicleta | `belongsToMany` a través de `OrderItem` (`as: "bicycles"` / `as: "orders"`) | |
| Pedido → Líneas | `Order.hasMany(OrderItem, as: "items")` / `OrderItem.belongsTo(Order, as: "order")` | `CASCADE` |
| Bicicleta → Líneas | `bicycle.hasMany(OrderItem, as: "orderItems")` / `OrderItem.belongsTo(bicycle, as: "bicycle")` | |

El **alias** (`as`) es lo que se escribe después en los `include`. Si no coincide exactamente, Sequelize lanza error.

### Tablas

**brands**: `id`, `name`, `createdAt`, `updatedAt`

**bicycles**: `id`, `brandId` (FK), `model` (máx. 150), `description` (opcional), `price` DECIMAL(10,2), `stock` UNSIGNED (por defecto 0)

**bicycle_details**: `id`, `bicycleId` (FK, **único**), `frameMaterial` (`Aluminium` | `Carbon` | `Steel` | `Titanium`), `wheelSize` DECIMAL(4,1), `weight` DECIMAL(5,2), `suspension` (opcional)

**customers**: `id`, `name`, `email` (**único**, validado con `isEmail`), `createdAt`, `updatedAt`

**orders**: `id`, `customerId` (FK), `orderDate` (por defecto ahora), `status` (`pending` | `paid` | `shipped` | `cancelled`, por defecto `pending`)

**order_items**: `id`, `orderId` (FK), `bicycleId` (FK), `quantity` (mín. 1), `unitPrice` DECIMAL(10,2) (mín. 0)

> Dos estilos de modelo conviven en el proyecto: `sequelize.define(...)` (bicycle) y `class X extends Model` + `X.init(...)` (el resto). Hacen lo mismo; la clase da mejor tipado con TypeScript.

---

## 6. Endpoints

Base: `http://localhost:3000/api`

### Marcas – `/brands`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/brands` | Lista todas | 200 |
| GET | `/brands/:id` | Una marca | 200 / 404 |
| POST | `/brands` | Crear | 201 |
| PUT | `/brands/:id` | Actualizar | 200 / 404 |
| DELETE | `/brands/:id` | Borrar | 200 / 404 |

```json
{ "name": "Orbea" }
```

### Bicicletas – `/bicycles`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/bicycles` | Todas, con su marca | 200 |
| GET | `/bicycles/:id` | Una, con su marca | 200 / 404 |
| POST | `/bicycles` | Crear | 201 / 400 |
| PUT | `/bicycles/:id` | Actualizar (solo los campos enviados) | 200 / 404 |
| DELETE | `/bicycles/:id` | Borrar | 204 / 404 |

En el body, la marca se envía como **`brand`** (el id), no como `brandId`; el controller lo traduce. Son obligatorios `brand`, `model` y `price`.

```json
{
  "brand": 1,
  "model": "Orca M20",
  "description": "Carretera",
  "price": 1899.99,
  "stock": 5
}
```

El PUT sí permite cambiar el precio (`{ "price": 1799.99 }`). Los errores se pasan con `next(error)` al middleware de errores de Express.

### Fichas técnicas – `/bicycle-details`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/bicycle-details` | Todas las bicicletas con su ficha (`include`) |
| GET | `/bicycle-details/carbon` | Bicicletas con cuadro de carbono |
| GET | `/bicycle-details/steel` | … de acero |
| GET | `/bicycle-details/aluminium` | … de aluminio |
| GET | `/bicycle-details/titanium` | … de titanio |
| GET | `/bicycle-details/:id` | Una ficha por su id |
| POST | `/bicycle-details` | Crear ficha |
| PUT | `/bicycle-details/:id` | Actualizar ficha (`bicycleId` no se puede cambiar) |
| DELETE | `/bicycle-details/:id` | Borrar ficha |

```json
{
  "bicycleId": 1,
  "frameMaterial": "Carbon",
  "wheelSize": 28,
  "weight": 7.8,
  "suspension": null
}
```

Reglas del service: la bicicleta debe existir y no puede tener ya una ficha (relación 1:1).

### Clientes – `/customers`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/customers` | Todos | 200 |
| GET | `/customers/:name_search/orders` | Clientes cuyo nombre contiene el texto **y** que tienen pedidos | 200 |
| GET | `/customers/:id` | Uno | 200 / 400 / 404 |
| POST | `/customers` | Crear | 201 / 400 |
| PUT | `/customers/:id` | Actualizar | 200 / 404 |
| DELETE | `/customers/:id` | Borrar | 204 / 404 |

Ejemplo de búsqueda: `GET /api/customers/ana/orders`.

```json
{ "name": "Ana García", "email": "ana.garcia@example.com" }
```

### Pedidos – `/orders`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/orders` | Todos, más recientes primero, con cliente | 200 |
| GET | `/orders/customers/:customerId` | Pedidos de un cliente | 200 / 400 |
| GET | `/orders/:id` | Uno | 200 / 400 / 404 |
| POST | `/orders` | Crear | 201 / 400 |
| PUT | `/orders/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/orders/:id` | Borrar | 204 / 404 |

```json
{
  "customerId": 1,
  "orderDate": "2026-10-07T10:30:00",
  "status": "pending"
}
```

`orderDate` y `status` son opcionales. Si la fecha lleva `Z` al final se interpreta como UTC; sin `Z`, como hora local.

### Líneas de pedido – `/order-items`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/order-items` | Todas, con su bicicleta | 200 |
| GET | `/order-items/order/:orderId` | Líneas de un pedido | 200 / 400 |
| GET | `/order-items/:id` | Una, con bicicleta y pedido | 200 / 404 |
| POST | `/order-items` | Crear | 201 / 400 |
| PUT | `/order-items/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/order-items/:id` | Borrar | 204 / 404 |

```json
{ "orderId": 1, "bicycleId": 1, "quantity": 2, "unitPrice": 349.99 }
```

MySQL devuelve los `DECIMAL` como texto (`"349.99"`). Es normal.

---

## 7. Códigos HTTP usados

| Código | Cuándo |
|---|---|
| 200 OK | Lectura o actualización correcta |
| 201 Created | Recurso creado |
| 204 No Content | Borrado correcto (sin cuerpo) |
| 400 Bad Request | Datos o parámetros inválidos |
| 404 Not Found | El recurso no existe |
| 500 Internal Server Error | Error inesperado (BD, código) |

---

## 8. Cómo crear un método nuevo (guía paso a paso)

Un método nuevo toca siempre **las 3 capas**, en este orden: **service → controller → route**. Si además necesita una tabla nueva, se empieza por el modelo (ver 8.2).

### 8.1 Ejemplo completo: «pedidos de un estado» → `GET /api/orders/status/:status`

**Paso 1 – Service** (`orders.service.ts`): la consulta, sin `req` ni `res`.

```typescript
static async findByStatus(status: "pending" | "paid" | "shipped" | "cancelled") {
    return Order.findAll({
        where: { status },
        include: [{ model: customer, as: "customer", attributes: ["id", "name", "email"] }],
        order: [["orderDate", "DESC"]],
    });
}
```

**Paso 2 – Controller** (`orders.controller.ts`): validar, llamar al service, responder.

```typescript
static async getByStatus(req: Request, res: Response) {
    try {
        const status = String(req.params.status);
        if (!VALID_STATUS.includes(status as OrderStatus)) {
            return res.status(400).json({ message: `status debe ser uno de: ${VALID_STATUS.join(", ")}` });
        }

        const orders = await OrderService.findByStatus(status as OrderStatus);
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los pedidos por estado" });
    }
}
```

**Paso 3 – Route** (`orders.routes.ts`): **antes** de `/:id`.

```typescript
router.get("/status/:status", OrderController.getByStatus);
router.get("/:id", OrderController.getById);   // las rutas fijas siempre antes
```

**Paso 4 – Probar:** `GET http://localhost:3000/api/orders/status/paid`

### 8.2 Plantilla para un módulo entero nuevo (ej. `suppliers`)

1. **Carpeta** `src/modules/suppliers/` con `suppliers.model.ts`, `.service.ts`, `.controller.ts`, `.routes.ts`.
2. **Modelo**: `class supplier extends Model` + `supplier.init({...}, { sequelize, tableName: "suppliers" })`.
3. **Asociaciones**: añadir en `defineAssociations()` el `hasMany` / `belongsTo` con su alias, e importar el modelo.
4. **Service**: `getAll`, `getById`, `create`, `update`, `delete` como métodos `static`.
5. **Controller**: un método por operación, con `try/catch` y validación.
6. **Routes**: `Router()` y los `router.get/post/put/delete`; terminar con `export default router`.
7. **`routes/index.ts`**: `router.use("/suppliers", supplierRoutes)`.
8. Reiniciar: `sync({ alter: true })` crea la tabla.

### 8.3 Checklist de errores típicos al añadir un método

- [ ] ¿Importé en el controller el service y los tipos (`Request`, `Response`, `NextFunction`)?
- [ ] ¿El nombre del parámetro en la ruta (`:orderId`) es **idéntico** al de `req.params.orderId`?
- [ ] ¿Las rutas fijas (`/search`, `/status/:x`) van **antes** de `/:id`?
- [ ] ¿El `as` del `include` coincide con el de `associations.ts`?
- [ ] ¿El tipo de las claves foráneas coincide en las dos tablas (INTEGER con INTEGER)?
- [ ] ¿Convertí `req.params` (siempre texto) con `Number(...)`?
- [ ] ¿Devuelvo siempre una respuesta (`return res...`) en cada rama?

---

## 9. Problemas detectados en el código actual

Revisados en el zip. Conviene corregirlos:

1. **`customers.controller.ts` no importa `NextFunction`.** Con `tsx` arranca igual (no comprueba tipos), pero `npm run build` falla. Solución: `import { Request, Response, NextFunction } from "express";`
2. **`OrderItem.bicycleId` es `INTEGER.UNSIGNED`, pero `bicycles.id` es `INTEGER` con signo.** MySQL puede rechazar la clave foránea con `ER_FK_INCOMPATIBLE_COLUMNS`. Deben ser idénticos: pon `DataTypes.INTEGER` en `bicycleId`.
3. **`server.ts` crea su propia app y `app.ts` no se usa.** Está duplicado. Lo limpio sería que `server.ts` importe `app` de `app.ts` y solo haga el `listen`.
4. **El email duplicado devuelve 500.** Mejor capturar `SequelizeUniqueConstraintError` y responder 409.
5. **`sync({ alter: true })`** es cómodo en desarrollo, pero en producción se usan migraciones.
6. **El puerto está fijo en 3000** en `server.ts`; `env.PORT` existe pero no se usa.
7. **Estilos mezclados**: unos controllers usan `next(error)` (bicycles) y otros `res.status(500)` (orders, customers); unos son `static` y otros se instancian (`brands`, `bicycleDetails`).
8. **Rutas de búsqueda distintas** entre módulos: `/customers/:name_search/orders` frente a `/orders/customers/:customerId`. No es un error, pero conviene tenerlo presente al probar.
9. Pequeños detalles: parámetro `ddata` en `brand.service.ts`; el modelo `customer` y `bicycle` en minúscula frente a `Brand` y `Order` en mayúscula.

---

## 10. JSON de ejemplo para probar (todas las tablas)

Header en todas las peticiones con body: `Content-Type: application/json` (en Postman: Body → raw → JSON).

### Orden recomendado

Las claves foráneas obligan a crear primero los registros "padre":

1. `brands` → 2. `bicycles` → 3. `bicycle-details`
4. `customers` → 5. `orders` → 6. `order-items`

Los `id` de los ejemplos (`1`) suponen que es el primer registro de cada tabla. Si no, usa el `id` que te devuelva la respuesta.

### 1. Marcas · `POST /api/brands`

```json
{ "name": "Orbea" }
```

```json
{ "name": "Trek" }
```

`PUT /api/brands/1`:

```json
{ "name": "Orbea Bikes" }
```

### 2. Bicicletas · `POST /api/bicycles`

La marca se envía como `brand` (el id de la marca).

```json
{
  "brand": 1,
  "model": "Orca M20",
  "description": "Bicicleta de carretera ligera",
  "price": 1899.99,
  "stock": 5
}
```

```json
{
  "brand": 2,
  "model": "Marlin 7",
  "price": 749.5,
  "stock": 12
}
```

`PUT /api/bicycles/1` (solo los campos que cambian):

```json
{ "price": 1799.99, "stock": 3 }
```

### 3. Fichas técnicas · `POST /api/bicycle-details`

`frameMaterial` solo admite `Aluminium`, `Carbon`, `Steel` o `Titanium`. Cada bicicleta solo puede tener una ficha.

```json
{
  "bicycleId": 1,
  "frameMaterial": "Carbon",
  "wheelSize": 28,
  "weight": 7.8,
  "suspension": null
}
```

```json
{
  "bicycleId": 2,
  "frameMaterial": "Aluminium",
  "wheelSize": 29,
  "weight": 13.4,
  "suspension": "Horquilla 100 mm"
}
```

`PUT /api/bicycle-details/1`:

```json
{ "weight": 7.5 }
```

### 4. Clientes · `POST /api/customers`

El `email` debe ser válido y único.

```json
{ "name": "Ana García", "email": "ana.garcia@example.com" }
```

```json
{ "name": "Luis Pérez", "email": "luis.perez@example.com" }
```

`PUT /api/customers/1`:

```json
{ "name": "Ana García López" }
```

### 5. Pedidos · `POST /api/orders`

Completo:

```json
{
  "customerId": 1,
  "orderDate": "2026-10-07T10:30:00",
  "status": "pending"
}
```

Mínimo (fecha actual y estado `pending`):

```json
{ "customerId": 1 }
```

`PUT /api/orders/1`:

```json
{ "status": "shipped" }
```

Valores válidos de `status`: `pending`, `paid`, `shipped`, `cancelled`.

### 6. Líneas de pedido · `POST /api/order-items`

```json
{
  "orderId": 1,
  "bicycleId": 1,
  "quantity": 2,
  "unitPrice": 1799.99
}
```

```json
{
  "orderId": 1,
  "bicycleId": 2,
  "quantity": 1,
  "unitPrice": 749.5
}
```

`PUT /api/order-items/1`:

```json
{ "quantity": 3, "unitPrice": 1699.99 }
```

### Peticiones GET y DELETE (sin body)

```
GET    /api/brands
GET    /api/bicycles
GET    /api/bicycles/1
GET    /api/bicycle-details
GET    /api/bicycle-details/carbon
GET    /api/bicycle-details/1
GET    /api/customers
GET    /api/customers/1
GET    /api/customers/ana/orders
GET    /api/orders
GET    /api/orders/1
GET    /api/orders/customers/1
GET    /api/order-items
GET    /api/order-items/1
GET    /api/order-items/order/1
DELETE /api/order-items/1
DELETE /api/orders/1
DELETE /api/customers/1
```

### Pruebas de errores (deberían fallar a propósito)

| Petición | Resultado esperado |
|---|---|
| `GET /api/orders/abc` | 400 `id no válido` |
| `GET /api/orders/9999` | 404 `Pedido no encontrado` |
| `POST /api/orders` con `{ "customerId": 1, "status": "otro" }` | 400 `status debe ser uno de...` |
| `POST /api/order-items` con `"quantity": 0` | 400 `quantity debe ser un entero mayor o igual que 1` |
| `POST /api/customers` con un email repetido | 500 (mejora pendiente: devolver 409) |
| `POST /api/bicycles` con `"brand": 999` | error de clave foránea (la marca no existe) |
| `POST /api/bicycle-details` con una bicicleta que ya tiene ficha | 500 `The bicycle already has a technical specification` |
| `DELETE /api/brands/1` con bicicletas asociadas | error: `RESTRICT` impide borrar la marca |

---

## 11. Estructuras básicas del CRUD (plantillas)

Cambia `Item` por tu modelo y `item` por su nombre.

### Service

```typescript
// item.service.ts
import { Item } from "./item.model";

export class ItemService {
    static async getAll() {
        return await Item.findAll();
    }

    static async getById(id: number) {
        return await Item.findByPk(id);
    }

    static async create(data: { name: string }) {
        return await Item.create(data);
    }

    static async update(id: number, data: { name?: string }) {
        const item = await Item.findByPk(id);
        if (!item) return null;            // el controller responde 404
        return await item.update(data);
    }

    static async delete(id: number) {
        const item = await Item.findByPk(id);
        if (!item) return false;           // el controller responde 404
        await item.destroy();
        return true;
    }
}
```

Con relaciones, añade el `include` en `getAll` y `getById`:

```typescript
Item.findAll({ include: [{ model: Otro, as: "alias" }] });
```

### Controller

```typescript
// item.controller.ts
import { Request, Response } from "express";
import { ItemService } from "./item.service";

export class ItemController {
    static async getAll(req: Request, res: Response) {
        try {
            const items = await ItemService.getAll();
            return res.status(200).json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener los items" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const item = await ItemService.getById(id);
            if (!item) {
                return res.status(404).json({ message: "Item no encontrado" });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al obtener el item" });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name } = req.body;
            if (!name || typeof name !== "string") {
                return res.status(400).json({ message: "name es obligatorio" });
            }

            const item = await ItemService.create({ name });
            return res.status(201).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al crear el item" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const { name } = req.body;
            const item = await ItemService.update(id, { name });
            if (!item) {
                return res.status(404).json({ message: "Item no encontrado" });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al actualizar el item" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "id no válido" });
            }

            const deleted = await ItemService.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Item no encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error al eliminar el item" });
        }
    }
}
```

### Routes

Las rutas fijas van antes de `/:id`.

```typescript
import { Router } from "express";
import { ItemController } from "./item.controller";

const router = Router();

router.get("/", ItemController.getAll);
router.get("/:id", ItemController.getById);
router.post("/", ItemController.create);
router.put("/:id", ItemController.update);
router.delete("/:id", ItemController.delete);

export default router;
```

### Resumen de respuestas

El service devuelve `null` o `false` cuando no encuentra el registro y el controller lo traduce a 404. Códigos: GET 200, POST 201, PUT 200, DELETE 204, id mal formado 400, error inesperado 500.

---

## 12. Mini guía de `associations.ts`

### Reglas básicas

1. Cada relación se declara **en los dos sentidos**: uno con `hasMany` o `hasOne`, y otro con `belongsTo`.
2. El `belongsTo` va en el modelo que **tiene la clave foránea** (`Order` tiene `customerId`).
3. `foreignKey` es el nombre de la columna que enlaza. Debe ser **el mismo en las dos líneas**.
4. `as` es el alias. Después lo escribes igual en el `include`.
5. La clave foránea debe tener **el mismo tipo** que la clave primaria a la que apunta (`INTEGER` con `INTEGER`; si no, `ER_FK_INCOMPATIBLE_COLUMNS`).
6. Importa todos los modelos que uses y ejecuta `defineAssociations()` antes de `sync()`.

### Los tres tipos

**1:N (uno a muchos)**: una marca tiene muchas bicicletas.

```typescript
Brand.hasMany(bicycle, { foreignKey: "brandId", as: "bicycles" });
bicycle.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });
```

**1:1 (uno a uno)**: una bicicleta tiene una ficha. Añade `unique: true` en `bicycleId` del modelo de la ficha.

```typescript
bicycle.hasOne(BicycleDetail, { foreignKey: "bicycleId", as: "detail", onDelete: "CASCADE" });
BicycleDetail.belongsTo(bicycle, { foreignKey: "bicycleId", as: "bicycle" });
```

**N:M (muchos a muchos)**: pedidos y bicicletas, a través de `OrderItem`.

```typescript
Order.belongsToMany(bicycle, { through: OrderItem, foreignKey: "orderId", otherKey: "bicycleId", as: "bicycles" });
bicycle.belongsToMany(Order, { through: OrderItem, foreignKey: "bicycleId", otherKey: "orderId", as: "orders" });
```

En `belongsToMany`, `foreignKey` es la columna que apunta **a este modelo** y `otherKey` la que apunta **al otro**. Si además quieres acceder a las líneas directamente, añade el `hasMany` / `belongsTo` con `OrderItem` (como ya tienes).

### Cómo se usan en una consulta

```typescript
Order.findAll({
    include: [{ model: customer, as: "customer" }],   // as = el de la asociación
});
```

- `required: true` hace un INNER JOIN (solo los que tienen relación).
- `where` dentro del `include` filtra por la tabla unida.
- Se pueden anidar: `include: [{ model: OrderItem, as: "items", include: [{ model: bicycle, as: "bicycle" }] }]`.

### Qué pasa al borrar (`onDelete`)

| Valor | Efecto |
|---|---|
| `CASCADE` | Borra también los hijos |
| `RESTRICT` | Impide borrar el padre si tiene hijos |
| `SET NULL` | Pone la clave a `null` (solo si la columna admite `null`) |

### Checklist para añadir una relación nueva

1. Añadir la columna FK en el modelo hijo, con el mismo tipo que el `id` del padre.
2. Importar ambos modelos en `associations.ts`.
3. Escribir las dos líneas (`hasMany` + `belongsTo`, o `hasOne` + `belongsTo`) con el mismo `foreignKey` y un `as` en cada una.
4. Si la tabla ya existía con otro tipo, borrarla y reiniciar (`sync` no corrige tipos incompatibles).
5. Usar el `as` exacto en el `include`.

---

## 13. Consultas con operadores (`Op`)

Para filtrar con condiciones (mayor que, menor que, entre, contiene...) se usa el objeto `Op` de Sequelize, el mismo que ya se usa con `Op.like` en la búsqueda de clientes.

```typescript
import { Op } from "sequelize";
```

La estructura es `where: { columna: { [Operador]: valor } }`. Los corchetes `[Op.gt]` son obligatorios.

### Ejemplo completo: bicicletas con precio mayor que 400

**Service** (`bicycles.service.ts`)

```typescript
static async findByMinPrice(minPrice: number) {
    return bicycle.findAll({
        where: { price: { [Op.gt]: minPrice } },
        include: [{ model: Brand, as: "brand" }],
        order: [["price", "ASC"]],
    });
}
```

**Controller** (`bicycle.controller.ts`)

```typescript
static async getByMinPrice(req: Request, res: Response, next: NextFunction) {
    try {
        const minPrice = Number(req.params.min);
        if (Number.isNaN(minPrice)) {
            res.status(400).json({ message: "min no válido" });
            return;
        }

        const bicycles = await bicycleService.findByMinPrice(minPrice);
        res.json(bicycles);
    } catch (error) {
        next(error);
    }
}
```

**Route** (antes de `/:id`)

```typescript
router.get("/price/:min", bicycleController.getByMinPrice);
```

Prueba: `GET /api/bicycles/price/400`

Si te lo piden con query string (`GET /api/bicycles/price?min=400`), cambia solo la lectura en el controller y la ruta pasa a ser `router.get("/price", ...)`:

```typescript
const minPrice = Number(req.query.min);
```

### Operadores disponibles

| Operador | Significa | Ejemplo |
|---|---|---|
| `Op.gt` | mayor que `>` | `price: { [Op.gt]: 400 }` |
| `Op.gte` | mayor o igual `>=` | `price: { [Op.gte]: 400 }` |
| `Op.lt` | menor que `<` | `price: { [Op.lt]: 400 }` |
| `Op.lte` | menor o igual `<=` | `price: { [Op.lte]: 400 }` |
| `Op.ne` | distinto `!=` | `stock: { [Op.ne]: 0 }` |
| `Op.between` | entre dos valores | `price: { [Op.between]: [400, 1000] }` |
| `Op.like` | contiene texto | `model: { [Op.like]: "%Orca%" }` |
| `Op.in` | uno de una lista | `brandId: { [Op.in]: [1, 2] }` |

### Combinar condiciones

Varias columnas en el mismo `where` se unen con **AND** automáticamente:

```typescript
where: {
    price: { [Op.gt]: 400 },
    stock: { [Op.gt]: 0 },
}
```

Para **OR**, se usa `Op.or`:

```typescript
where: {
    [Op.or]: [
        { price: { [Op.gt]: 1500 } },
        { stock: { [Op.lt]: 3 } },
    ],
}
```

Dos condiciones sobre **la misma columna** (un rango) se escriben dentro del mismo objeto:

```typescript
where: { price: { [Op.gt]: 400, [Op.lt]: 1000 } }
```

### Filtro sobre una tabla relacionada

Va dentro del `include`, junto con `required: true`:

```typescript
Order.findAll({
    include: [{
        model: OrderItem,
        as: "items",
        where: { unitPrice: { [Op.gt]: 400 } },
        required: true,
    }],
});
```

Devuelve solo los pedidos que tienen alguna línea con `unitPrice` mayor que 400.
