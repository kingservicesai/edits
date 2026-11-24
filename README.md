# edits

Abre un chat de Codex Cloud con este repositorio, adjunta tu material y describe la edición que quieres. Las instrucciones en `AGENTS.md` indican a Codex qué herramientas usar y cómo preparar las dependencias cuando hagan falta.

Para que Codex descubra las skills de Remotion y HyperFrames desde el inicio, puedes añadir este comando al script de configuración del entorno de Codex Cloud asociado al repositorio.

```bash
bash scripts/setup-video-skills.sh
```

En un entorno recién creado sin ese comando, Codex puede ejecutar la instalación al necesitar una skill si el entorno tiene acceso a GitHub. La instalación obtiene las skills de versiones fijadas de los repositorios oficiales.
