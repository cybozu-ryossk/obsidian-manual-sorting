import type { PluginSettings } from '@/types'

export const DEFAULT_SETTINGS: PluginSettings = {
	customOrder: {},
	hiddenFolders: [],
	debugMode: !!process.env.DEV,
}
