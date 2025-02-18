import { write } from 'bun'

await write(
  'himnario-adventista/src/index.ts',
  `import { Cromo } from 'cromo'
import { cors } from './middleware/cors'
import { log } from './middleware/log'
import path from 'path'

const dir = path.resolve(__dirname, '../')
process.chdir(dir)

const cromo = new Cromo()

cromo.setMiddleware([cors, log])

cromo.start((server) => {
  console.info(\`➜  Local:   \${server.url}\`)
})`,
)

await write(
  'himnario-adventista/api/index.ts',
  `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ responseInit }) => {
  const index = file('./index.html')
  return new Response(index, responseInit)
}`,
)

await write(
  'himnario-adventista/api/assets/[...slug].ts',
  `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ url, responseInit }) => {
  let path = decodeURIComponent(url.pathname)
  const pathSegments = path.split('/').filter(Boolean)

  if (pathSegments.length > 2) {
    path = path.replace(/_/g, ' ').replace('.mp3', '.ogg')
  }

  const asset = file(\`.\${path}\`)
  return new Response(asset, responseInit)
}`,
)
