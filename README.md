# Portal IC

Portal web institucional para estudiantes de Ingeniería en Computadores – TEC.

**Stack:** Next.js 15 · TypeScript · TailwindCSS · Supabase · Google OAuth

---

## Requisitos previos

- Node.js ≥ 20
- Una cuenta en [Supabase](https://supabase.com) (free tier)
- Un proyecto de Supabase creado

---

## 1. Instalar dependencias

```bash
cd portal-ic
npm install
```

---

## 2. Configurar Supabase

### 2.1 Base de datos

En el **SQL Editor** de tu proyecto Supabase, ejecuta los archivos en este orden:

```sql
-- 1. Tablas:
\i supabase/schema.sql

-- 2. Políticas RLS:
\i supabase/rls.sql

-- 3. Storage:
\i supabase/storage.sql

-- 4. Funciones FTS:
\i supabase/functions.sql

-- 5. Admins (editar correos primero):
\i supabase/seed.sql
```

> **⚠️ IMPORTANTE:** Edita `supabase/seed.sql` y reemplaza los correos placeholder con los 3 correos reales autorizados antes de ejecutar.

### 2.2 Google OAuth

1. Ir a **Supabase Dashboard → Authentication → Providers → Google**
2. Activar Google
3. Crear credenciales en [Google Console](https://console.cloud.google.com):
   - **Application type:** Web application
   - **Authorized redirect URI:** `https://<tu-proyecto>.supabase.co/auth/v1/callback`
4. Pegar `Client ID` y `Client Secret` en Supabase

---

## 3. Variables de entorno

Crea `.env.local` copiando `.env.example`:

```bash
cp .env.example .env.local
```

Completa los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Estos valores se encuentran en **Supabase → Settings → API**.

---

## 4. Correr en desarrollo

```bash
npm run dev
```
7

Abre [http://localhost:3000](http://localhost:3000).

---

## 5. Estructura del proyecto

```
portal-ic/
├── app/
│   ├── (public)/          # Layout público con Header + Footer
│   │   ├── page.tsx       # Home /
│   │   ├── buscar/        # Búsqueda global /buscar
│   │   ├── preguntas/     # FAQ /preguntas + /preguntas/[slug]
│   │   ├── noticias/      # Noticias /noticias + /noticias/[slug]
│   │   ├── calendario/    # Calendario /calendario
│   │   ├── contactos/     # Directorio /contactos
│   │   └── acerca/        # Acerca /acerca
│   ├── admin/             # Panel admin protegido
│   │   ├── login/         # /admin/login (Google OAuth)
│   │   ├── preguntas/     # CRUD FAQ
│   │   ├── noticias/      # CRUD Noticias
│   │   ├── calendario/    # CRUD Eventos
│   │   ├── contactos/     # CRUD Contactos
│   │   └── reportes/      # Reportes públicos
│   └── auth/callback/     # OAuth callback route
├── components/
│   ├── layout/            # Header, Footer, AdminSidebar
│   └── shared/            # ReportButton, etc.
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts
│   ├── utils/             # slug.ts, date.ts
│   └── constants.ts       # Labels, colores, config
├── types/
│   └── database.ts        # Tipos TypeScript del schema
├── supabase/
│   ├── schema.sql         # Tablas + índices + triggers
│   ├── rls.sql            # Políticas Row Level Security
│   ├── storage.sql        # Buckets + políticas Storage
│   ├── functions.sql      # Full-Text Search (Postgres)
│   └── seed.sql           # Correos admin (editar antes de usar)
└── middleware.ts          # Protección rutas /admin/*
```

---

## 6. Deploy en Vercel

1. Push a GitHub:
   ```bash
   git init && git add . && git commit -m "feat: initial portal-ic setup"
   git remote add origin https://github.com/TU-USUARIO/portal-ic.git
   git push -u origin main
   ```

2. Importar proyecto en [Vercel](https://vercel.com/new)

3. Agregar variables de entorno en **Vercel → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (tu dominio de Vercel, ej: `https://portal-ic.vercel.app`)

4. En Supabase → Auth → URL Configuration, agregar:
   - **Site URL:** `https://portal-ic.vercel.app`
   - **Redirect URLs:** `https://portal-ic.vercel.app/auth/callback`

5. En Google OAuth Console, agregar URI de redirect de producción:
   - `https://<tu-proyecto>.supabase.co/auth/v1/callback`

---

## 7. Primer uso del admin

1. Ir a `https://tu-dominio/admin/login`
2. Click en "Ingresar con Google"
3. Login con uno de los correos del `seed.sql`
4. Si el correo está en `admins_allowlist` → acceso al dashboard

---

## 8. Convenciones de desarrollo

- **No hardcoding** de credenciales – usar siempre `.env.local`
- **Slugs** se generan automáticamente desde el título al crear
- **Markdown** se usa para contenido de artículos y noticias
- **Status** siempre inicializa en `draft` – publicar manualmente desde el admin
- **Storage:** imágenes ≤ 1MB, PDFs ≤ 10MB
- Agregar nuevos módulos siguiendo la misma estructura de carpetas

---

## 9. Módulos futuros

El sistema está diseñado para escalar. Para agregar un nuevo módulo:

1. Crear tabla en `supabase/schema.sql` con misma estructura base
2. Agregar RLS en `supabase/rls.sql`
3. Agregar tipo en `types/database.ts`
4. Crear rutas en `app/(public)/nuevo-modulo/` y `app/admin/nuevo-modulo/`
5. Agregar al `NAV_LINKS` en `lib/constants.ts`
6. Agregar a la función `search_all` en `supabase/functions.sql`
