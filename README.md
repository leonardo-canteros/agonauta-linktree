# Proyectos del equipo

Directorio de una página para presentar los proyectos de ocho emprendedores. Agronautas es la línea agropecuaria, no el nombre del equipo.

## Desarrollo

```sh
npm install
npm run dev
```

La página se abre en `/proyectos/`. `npm run build` genera `dist/` y una copia de `index.html` en `dist/proyectos/` para que esa ruta funcione al abrirla directamente en un alojamiento estático. `npm run preview` permite probar la compilación.

## Contenido

Los nombres, descripciones cortas, estados, enlaces y canales oficiales se editan en `src/data.js`. Dejá `links: []` o `contact: []` cuando no haya un destino verificado. El logo original de Agronautas se guarda en `public/` y su ruta se asigna en `site.logo`.

## Publicación

El sitio incluye configuración para Vercel (`vercel.json`), Netlify (`public/_redirects`) y el alojamiento de Sites (`.openai/hosting.json`). La ruta para imprimir en el QR es la URL pública final seguida de `/proyectos/`.
