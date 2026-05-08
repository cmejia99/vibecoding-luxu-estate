# Checklist de Mejores Prácticas: Real Estate en Next.js

Una guía condensada de los pilares técnicos, arquitectura y features para plataformas inmobiliarias premium (Luxe Estate).

## 1. Arquitectura Next.js & Performance
- [ ] **App Router**: Utilizar la estructura moderna (`app/`) para aprovechar React Server Components.
- [ ] **SSR & ISR**: Renderizar las propiedades bajo demanda (SSR) o actualizarlas en segundo plano (ISR).
- [ ] **Optimización de Imágenes (`next/image`)**: Uso estricto para pre-carga, lazy-loading y auto-conversión a WebP/AVIF.
- [ ] **Optimización de Fuentes**: Usar `next/font` para tipografías personalizadas sin bloqueos de renderizado.
- [ ] **Paginación en Servidor**: Evitar sobrecargar el navegador; cargar propiedades por bloques o páginas.

## 2. SEO & Compartición Social (Visibilidad)
- [ ] **Metadatos Dinámicos**: Implementar `generateMetadata` (títulos y descripciones exactas por inmueble).
- [ ] **Tarjetas Open Graph (OG)**: Etiquetas dinámicas para mostrar foto, precio y título al compartir en WhatsApp/Redes.
- [ ] **Schema Markup (JSON-LD)**: Marcado tipo `RealEstateListing` para destacar en los resultados de Google (Rich Snippets).
- [ ] **Sitemap Automatizado**: Generación dinámica de `sitemap.xml` directamente desde la base de datos.

## 3. UX/UI Premium (Diseño Inmersivo)
- [ ] **Filtros en URL (Search Params)**: Guardar el estado (ej. `?precio=5m&camas=4`) para que las búsquedas sean compartibles.
- [ ] **Micro-interacciones**: Transiciones fluidas y efectos hover (Tailwind / Framer Motion) para una sensación de alta gama.
- [ ] **Galerías Visuales**: Layouts asimétricos (Bento Grid) en Desktop y carruseles táctiles (swipe) en Móvil.
- [ ] **Modo Pantalla Completa**: Visor de imágenes inmersivo sin distracciones de la interfaz.

## 4. Backend & Base de Datos (Supabase)
- [ ] **Server Actions**: Manejar formularios de "Contacto" o "Agendar Visita" de forma segura, sin APIs intermedias.
- [ ] **Invalidación de Caché**: Ejecutar `revalidatePath` al modificar un precio en BD para actualizar la web al instante.
- [ ] **PostGIS (Geoespacial)**: Habilitar extensión en Supabase para búsquedas por mapa o proximidad (radio en KM).
- [ ] **Seguridad RLS**: Políticas de seguridad a nivel de fila (Row Level Security) para proteger perfiles y favoritos.

## 5. Features Inmobiliarios Diferenciadores
- [ ] **Mapas Contextuales**: Google Maps/Mapbox mostrando la propiedad y puntos de interés (colegios, zonas comerciales).
- [ ] **Calculadora de Hipotecas**: Widget dinámico para estimar cuotas mensuales basado en enganche/tasas.
- [ ] **Tours Virtuales 3D**: Estructura preparada para soportar iFrames de plataformas como Matterport.
- [ ] **Exportación a PDF**: Botón para autogenerar y descargar el "Brochure" o ficha técnica del inmueble.
- [ ] **Motor de Recomendaciones**: Sección dinámica de "Propiedades Similares en la zona" al final de cada anuncio.
- [ ] **Wishlist (Favoritos)**: Funcionalidad de autenticación para que usuarios guarden propiedades de interés.
