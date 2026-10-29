# Convertidor WebP a PNG / JPG

Extensión para navegadores basados en Chromium (Chrome, Brave, Edge) que permite **descargar imágenes WebP convertidas a PNG o JPG** directamente desde el menú contextual.

## El problema

Muchos sitios web (Google Imágenes, por ejemplo) sirven sus imágenes en formato **WebP**, que no es compatible con todas las aplicaciones. Al intentar guardarlas, el archivo se descarga como `.web` o `.webp` y muchas herramientas no pueden abrirlo.

## La solución

Esta extensión añade la opción **"Convertir imagen..."** al menú contextual (clic derecho) con dos formatos disponibles:

- **PNG**: conserva la transparencia.
- **JPG**: fondo blanco aplicado automáticamente (JPG no soporta transparencia).

La conversión se realiza localmente mediante `canvas`, sin enviar ningún dato a servidores externos.

## Instalación manual

1. Descarga o clona este repositorio.
2. Abre `chrome://extensions/` en tu navegador.
3. Activa el **Modo de desarrollador**.
4. Haz clic en **Cargar descomprimida** y selecciona la carpeta del proyecto.

## Estructura del proyecto

```
.
├── manifest.json     # Configuración de la extensión (Manifest V3)
├── background.js     # Menú contextual y lógica de conversión
└── icons/
    └── icon.png      # Icono de la extensión (128x128)
```

## Limitaciones

- Algunas imágenes protegidas por políticas **CORS** no pueden procesarse desde la página. En ese caso se muestra una notificación de error.
- El formato de salida se genera con la calidad estándar del navegador.

## Licencia

MIT
