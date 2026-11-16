# Sala 7

Web app para ver películas, series y anime, y leer manga. Catálogos de Cinemeta y AniList, reproductores incrustados, cuentas y sincronización con Supabase (correo y Google).

## Estructura

```
index.html            marcado de la página
public/               logo e iconos (logo.svg, icon-180.png)
src/main.js           punto de entrada (estilos + app)
src/app.js            lógica de la aplicación
src/config.js         claves de Supabase (leídas de .env si existe)
src/styles/           base.css · modern.css · mono.css · motion.css
```

## Usar

Necesitas Node 18 o superior.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # genera la carpeta dist/
npm run preview   # prueba local de dist/
```

## Supabase (opcional)

Por defecto usa el proyecto ya configurado. Para usar el tuyo, copia `.env.example` a `.env` y rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`.
La tabla necesaria es `user_data(user_id uuid, data jsonb, updated_at timestamptz)` con RLS por usuario.

## Publicar

- **Netlify:** conecta el repositorio; `netlify.toml` ya define `npm run build` y `dist`.
- **GitHub Pages:** en Settings → Pages elige «GitHub Actions». El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`.
