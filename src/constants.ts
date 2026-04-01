import type { PluginSettings } from '@/types'

export const DEFAULT_SETTINGS: PluginSettings = {
	customOrder: {},
	hiddenFolders: [],
	showDotItems: true,
	debugMode: !!process.env.DEV,
}
