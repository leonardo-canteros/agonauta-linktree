import { copyFile, mkdir } from 'node:fs/promises'

await mkdir('dist/proyectos', { recursive: true })
await copyFile('dist/index.html', 'dist/proyectos/index.html')
