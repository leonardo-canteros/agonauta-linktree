# Proyectos del equipo

Sitio de una página para presentar los proyectos de ocho emprendedores. Agronautas es la línea agropecuaria, no el nombre del equipo.

## Desarrollo

```sh
npm install
npm run dev
```

La página se abre en `/proyectos/`. `npm run build` genera `dist/` y una copia de `index.html` en `dist/proyectos/` para que esa ruta funcione al abrirla directamente en un alojamiento estático. `npm run preview` permite probar la compilación.

## Contenido

Los nombres, descripciones, estados, enlaces y canales oficiales se editan en `src/data.js`. Dejá `links: []` o `contact: []` cuando no haya un destino verificado. Si se incorpora un logo real, guardalo en `public/` y asigná su ruta en el campo `logo` del proyecto.

## Publicación

El sitio incluye configuración para Vercel (`vercel.json`), Netlify (`public/_redirects`) y el alojamiento de Sites (`.openai/hosting.json`). La ruta para imprimir en el QR es la URL pública final seguida de `/proyectos/`.
