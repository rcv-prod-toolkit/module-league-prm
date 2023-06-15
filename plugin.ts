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
      const bilanz = stripHtml(t.Bilanz).result.split('-')

      return {
        place: parseInt(stripHtml('#').result),
        logo: t.Teilnehmer.match(/(?<=img data-src=").*?(?=")/)[0],
        name: t.Teilnehmer.match(/(?<=class="table-cell-item name">).*?(?=<)/)[0],
        wins: parseInt(bilanz[0]),
        losses: parseInt(bilanz[1]),
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
