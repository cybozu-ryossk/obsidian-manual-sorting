import { Plugin, TAbstractFile, TFolder } from 'obsidian'
import { SettingsTab } from '@/components'
import { Patcher, ExplorerManager } from '@/managers'
import { DEFAULT_SETTINGS } from '@/constants'
import { Logger } from '@/utils'
import type { FileExplorerView } from 'obsidian-typings'
import type { PluginSettings } from '@/types'

export default class ManualSortingPlugin extends Plugin {
	private patcher = new Patcher(this)
	public explorerManager = new ExplorerManager(this)
	private log = new Logger('CORE', '#ff4828')
	public settings!: PluginSettings

	async onload() {
		await this.loadSettings()
		Logger.logLevel = this.settings.debugMode ? 'debug' : 'silent'
		if (process.env.DEV) this.log.info('Loading Manual Sorting in dev mode')
		this.addSettingTab(new SettingsTab(this.app, this))
		this.app.workspace.onLayoutReady(() => this.initialize())
	}

	onunload() {
		this.patcher.unpatchExplorer()
		this.getFileExplorerView().sort()
		this.log.info('Manual Sorting unloaded')
	}

	async initialize() {
		await this.explorerManager.waitForExplorerElement()
		this.patcher.patchExplorer()
		this.explorerManager.refreshExplorer()
		this.explorerManager.refreshExplorerOnMount()
		this.registerVaultHandlers()
	}

	registerVaultHandlers() {
		this.app.vault.on('rename', (item: TAbstractFile, oldPath: string) => {
			const oldDir = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/'
			const newDir = item.path.substring(0, item.path.lastIndexOf('/')) || '/'

			if (item instanceof TFolder) {
				this.log.info(`Folder renamed from '${oldPath}' to '${item.path}'`)
				this.updateOrderForFolderRename(oldPath, item.path)
			} else {
				if (oldDir === newDir && this.settings.customOrder[oldDir]) {
					this.log.info(`File renamed from '${oldPath}' to '${item.path}'`)
					this.settings.customOrder[oldDir] = this.settings.customOrder[oldDir]
						.map(p => (p === oldPath ? item.path : p))
				} else if (this.settings.customOrder[oldDir]) {
					this.settings.customOrder[oldDir] = this.settings.customOrder[oldDir]
						.filter(p => p !== oldPath)
					if (this.settings.customOrder[oldDir].length === 0)
						delete this.settings.customOrder[oldDir]
				}
			}
			void this.saveSettings()
		})

		this.app.vault.on('delete', (item: TAbstractFile) => {
			this.log.info(`Item deleted: '${item.path}'`)
			const dir = item.path.substring(0, item.path.lastIndexOf('/')) || '/'
			const orders = this.settings.customOrder

			if (orders[dir]) {
				orders[dir] = orders[dir].filter(p => p !== item.path)
				if (orders[dir].length === 0) delete orders[dir]
			}

			if (item instanceof TFolder) {
				for (const key of Object.keys(orders)) {
					if (key === item.path || key.startsWith(item.path + '/'))
						delete orders[key]
				}
			}
			void this.saveSettings()
		})
	}

	private updateOrderForFolderRename(oldPrefix: string, newPrefix: string) {
		const updated: Record<string, string[]> = {}
		for (const [key, children] of Object.entries(this.settings.customOrder)) {
			const newKey = key === oldPrefix ? newPrefix
				: key.startsWith(oldPrefix + '/') ? newPrefix + key.slice(oldPrefix.length)
				: key
			updated[newKey] = children.map(p =>
				p === oldPrefix ? newPrefix
				: p.startsWith(oldPrefix + '/') ? newPrefix + p.slice(oldPrefix.length)
				: p,
			)
		}
		this.settings.customOrder = updated
	}

	async loadSettings() {
		const savedSettings = (await this.loadData() || {}) as Partial<PluginSettings>
		this.settings = {
			...DEFAULT_SETTINGS,
			...Object.fromEntries((Object.keys(DEFAULT_SETTINGS) as (keyof PluginSettings)[])
				.filter(k => k in savedSettings).map(k => [k, savedSettings[k]]),
			),
		}
		this.log.info('Settings loaded:', this.settings)
	}

	async saveSettings() {
		await this.saveData(this.settings)
		this.log.info('Settings saved:', this.settings)
	}

	async onExternalSettingsChange() {
		await this.loadSettings()
		this.log.warn('Settings changed externally')
		this.getFileExplorerView().sort()
	}

	getFileExplorerView = () =>
		this.app.workspace.getLeavesOfType('file-explorer')[0].view as FileExplorerView
}
