// hooks/useWayback.ts

import { useEffect, useState } from 'react'
import type { WaybackConfigRaw, WaybackItem } from '#/types/map'

const CONFIG_URL =
  'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json'

// Extract tanggal dari itemTitle, e.g. "World Imagery (Wayback 2023-12-07)" → "2023-12-07"
function extractDateLabel(itemTitle: string): string {
  const match = itemTitle.match(/\(Wayback (\d{4}-\d{2}-\d{2})\)/)
  return match?.[1] ?? itemTitle
}

// Parse raw config object → sorted array WaybackItem
function parseConfig(raw: WaybackConfigRaw): WaybackItem[] {
  return Object.entries(raw)
    .map(([key, entry]) => ({
      ...entry,
      releaseNum: Number(key),
      dateLabel: extractDateLabel(entry.itemTitle),
    }))
    .sort((a, b) => {
      // Sort terbaru ke terlama berdasarkan dateLabel
      return b.dateLabel.localeCompare(a.dateLabel)
    })
}

export function useWaybackReleases() {
  const [releases, setReleases] = useState<WaybackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(CONFIG_URL)
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const raw: WaybackConfigRaw = await res.json()
        setReleases(parseConfig(raw))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchReleases()
  }, [])

  return { releases, loading, error }
}

// itemURL dari config masih pakai {level}/{row}/{col}
// perlu di-replace ke format {z}/{y}/{x} yang dimengerti Mapbox
export function getWaybackTileUrl(item: WaybackItem): string {
  const tileUrl = item.itemURL
    .replace('{level}', '{z}')
    .replace('{row}', '{y}')
    .replace('{col}', '{x}')
  return tileUrl
}
