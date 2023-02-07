import type { PluginContext } from '@rcv-prod-toolkit/types'
import { Tabletojson } from 'tabletojson';
import { Team } from './types/Team';
import { stripHtml } from "string-strip-html";

module.exports = async (ctx: PluginContext) => {
  const namespace = ctx.plugin.module.getName()
  let teams: Team[] = []

  // Register new UI page
  ctx.LPTE.emit({
    meta: {
      type: 'add-pages',
      namespace: 'ui',
      version: 1
    },
    pages: [
      {
        name: `League PRM Tables`,
        frontend: 'frontend',
        id: `op-${namespace}`
      }
    ]
  })

  ctx.LPTE.on(namespace, 'request-table', async (e: any) => {
    const tables = await Tabletojson.convertUrl(
      e.link,
      { stripHtmlFromCells: false }
    );
  
    teams = tables[0].map((t: any) => {
      return {
        place: parseInt(stripHtml(t.Platz).result),
        logo: t.Teilnehmer.match(/(?<=img data-src=").*?(?=")/)[0],
        name: t.Teilnehmer.match(/(?<=class="table-cell-item">).*?(?=<)/)[0],
        wins: parseInt(stripHtml(t.Gewonnen).result),
        losses: parseInt(stripHtml(t.Verloren).result),
      }
    })

    ctx.LPTE.emit({
      meta: {
        type: 'update',
        namespace,
        version: 1
      },
      teams
    })
  })


  ctx.LPTE.on(namespace, 'request', (e: any) => {
    ctx.LPTE.emit({
      meta: {
        type: e.meta.reply as string,
        namespace: 'reply',
        version: 1
      },
      teams
    })
  })

  // Emit event that we're ready to operate
  ctx.LPTE.emit({
    meta: {
      type: 'plugin-status-change',
      namespace: 'lpt',
      version: 1
    },
    status: 'RUNNING'
  })
}
