// Each project's share image, from its demo poster or first screenshot; its
// article pages use it too.
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { shareImage } from '../../lib/share-image'

export const getStaticPaths = (async () =>
  (await getCollection('projects')).map((project) => {
    // The schema turns the path into image metadata, so the path is read from
    // the JSON file, which it is relative to.
    const file = project.filePath!
    const { demo } = JSON.parse(readFileSync(file, 'utf8'))
    return {
      params: { slug: project.id },
      props: {
        source: resolve(dirname(file), demo.poster ?? demo.images[0].src),
      },
    }
  })) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await shareImage(props.source)), {
    headers: { 'Content-Type': 'image/png' },
  })
