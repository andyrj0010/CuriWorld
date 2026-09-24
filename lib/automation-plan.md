# Automatización diaria

Flujo recomendado:

1. Recopilar temas desde fuentes fiables (NASA, NOAA, organismos científicos, museos, universidades, publicaciones y APIs).
2. Eliminar duplicados.
3. Generar un borrador con IA.
4. Exigir una lista de fuentes y comprobar que cada afirmación importante tenga respaldo.
5. Rechazar contenido sin evidencia, clickbait engañoso, pseudociencia presentada como hecho y contenido copiado.
6. Crear/obtener imagen con licencia compatible.
7. Crear versión corta para redes.
8. Guardar como `draft`.
9. Publicar automáticamente solo cuando las reglas de verificación lo permitan; inicialmente es mejor revisión humana.
10. Actualizar sitemap y feeds.

Para escalar: PostgreSQL + almacenamiento S3/R2 + cron + cola de trabajos + CDN.
