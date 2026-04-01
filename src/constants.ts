import type { PluginSettings } from '@/types'

export const DEFAULT_SETTINGS: PluginSettings = {
	customOrder: {},
	debugMode: !!process.env.DEV,
}
