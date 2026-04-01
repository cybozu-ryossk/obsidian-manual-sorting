import type { PluginSettings } from '@/types'
import type { FileExplorerViewSortOrder } from 'obsidian-typings'

export const DEFAULT_SETTINGS: PluginSettings = {
	folderSortOrders: {},
	debugMode: !!process.env.DEV,
}

export const SORT_ORDER_LABELS: Record<FileExplorerViewSortOrder, string> = {
	alphabetical: 'File name (A to Z)',
	alphabeticalReverse: 'File name (Z to A)',
	byModifiedTime: 'Modified time (new to old)',
	byModifiedTimeReverse: 'Modified time (old to new)',
	byCreatedTime: 'Created time (new to old)',
	byCreatedTimeReverse: 'Created time (old to new)',
}