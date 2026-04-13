import type { ReactNode } from 'react'
import type { ResourceType } from '#/types/map'
import { CoconutIcon, CornIcon, PalmIcon, WheatIcon } from '../icons'

interface Props {
  type: ResourceType
  size: number
}

export default function ResourceIcon({ type, size }: Props) {
  const resourceIcons: Record<ResourceType, ReactNode> = {
    palm: <PalmIcon size={size} />,
    wheat: <WheatIcon size={size} />,
    corn: <CornIcon size={size} />,
    coconut: <CoconutIcon size={size} />,
  }

  return resourceIcons[type]
}
