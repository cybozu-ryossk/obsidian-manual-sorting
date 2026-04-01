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
			if (!(item instanceof TFolder)) return
			const orders = this.settings.folderSortOrders
			if (!(oldPath in orders)) return
			this.log.info(`Folder renamed from '${oldPath}' to '${item.path}'`)
			orders[item.path] = orders[oldPath]
			delete orders[oldPath]
			void this.saveSettings()
		})

		this.app.vault.on('delete', (item: TAbstractFile) => {
			if (!(item instanceof TFolder)) return
			const orders = this.settings.folderSortOrders
			if (!(item.path in orders)) return
			this.log.info(`Folder deleted: '${item.path}'`)
			delete orders[item.path]
			void this.saveSettings()
		})
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
