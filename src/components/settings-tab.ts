import { App, PluginSettingTab, Setting } from 'obsidian'
import { Logger } from '@/utils'
import { SORT_ORDER_LABELS } from '@/constants'
import type ManualSortingPlugin from '@/plugin'
import type { FileExplorerViewSortOrder } from 'obsidian-typings'

export class SettingsTab extends PluginSettingTab {
	private selectedFolderPath: string | null = null

	constructor(app: App, public plugin: ManualSortingPlugin) {
		super(app, plugin)
	}

	display(): void {
		this.containerEl.empty()

		new Setting(this.containerEl)
			.setName('Debug Mode')
			.setDesc('Show debug logs in the console.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.debugMode)
				.onChange(async enableDebugMode => {
					this.plugin.settings.debugMode = enableDebugMode
					Logger.logLevel = enableDebugMode ? 'debug' : 'silent'
					await this.plugin.saveSettings()
				}),
			)

		this.containerEl.createEl('h3', { text: 'Per-Folder Sort Orders' })
		this.containerEl.createEl('p', {
			text: "Configure a sort order for specific folders. Folders without a setting use Obsidian's global sort order.",
			cls: 'setting-item-description',
		})

		const folderSortOrders = this.plugin.settings.folderSortOrders
		const configuredFolders = Object.keys(folderSortOrders).sort()

		if (this.selectedFolderPath !== null && !configuredFolders.includes(this.selectedFolderPath)) {
			this.selectedFolderPath = null
		}

		if (configuredFolders.length === 0) {
			this.containerEl.createEl('p', {
				text: 'No per-folder sort orders configured yet.',
				cls: 'setting-item-description',
			})
		}

		for (const folderPath of configuredFolders) {
			const isSelected = folderPath === this.selectedFolderPath
			const wrapperEl = this.containerEl.createDiv('ms-folder-entry-wrapper')

			const entry = new Setting(wrapperEl)
				.setName(folderPath === '/' ? '/ (root)' : folderPath)
				.addExtraButton(btn => {
					btn.setIcon(isSelected ? 'chevron-down' : 'chevron-right')
						.setTooltip(isSelected ? 'Collapse' : 'Expand')
						.onClick(() => {
							this.selectedFolderPath = isSelected ? null : folderPath
							this.display()
						})
				})

			entry.nameEl.style.cursor = 'pointer'
			entry.nameEl.addEventListener('click', () => {
				this.selectedFolderPath = isSelected ? null : folderPath
				this.display()
			})

			if (isSelected) {
				this.renderFolderSections(folderPath, wrapperEl)
			}
		}

		this.containerEl.createEl('h4', { text: 'Add folder sort order' })
		this.renderAddSection()
	}

	private renderFolderSections(folderPath: string, container: HTMLElement): void {
		const folderSortOrders = this.plugin.settings.folderSortOrders
		const sectionsEl = container.createDiv('ms-folder-sections')

		sectionsEl.createEl('h4', { text: 'Sort Order', cls: 'ms-section-heading' })

		new Setting(sectionsEl)
			.addDropdown(drop => {
				for (const [value, label] of Object.entries(SORT_ORDER_LABELS)) {
					drop.addOption(value, label)
				}
				drop.setValue(folderSortOrders[folderPath])
				drop.onChange(async (value) => {
					folderSortOrders[folderPath] = value as FileExplorerViewSortOrder
					await this.plugin.saveSettings()
					this.plugin.getFileExplorerView().sort()
				})
			})
			.addButton(btn => btn
				.setIcon('trash-2')
				.setTooltip('Remove this folder sort order')
				.setWarning()
				.onClick(async () => {
					delete folderSortOrders[folderPath]
					this.selectedFolderPath = null
					await this.plugin.saveSettings()
					this.plugin.getFileExplorerView().sort()
					this.display()
				}),
			)
	}

	private renderAddSection(): void {
		let selectedFolderPath = '/'
		let selectedSortOrder: FileExplorerViewSortOrder = 'alphabetical'

		const allFolders = this.app.vault.getAllFolders(true)
			.map(f => f.path)
			.sort()

		new Setting(this.containerEl)
			.setName('Folder')
			.addDropdown(drop => {
				for (const path of allFolders) {
					drop.addOption(path, path === '/' ? '/ (root)' : path)
				}
				drop.setValue(selectedFolderPath)
				drop.onChange(value => { selectedFolderPath = value })
			})

		new Setting(this.containerEl)
			.setName('Sort order')
			.addDropdown(drop => {
				for (const [value, label] of Object.entries(SORT_ORDER_LABELS)) {
					drop.addOption(value, label)
				}
				drop.setValue(selectedSortOrder)
				drop.onChange(value => { selectedSortOrder = value as FileExplorerViewSortOrder })
			})
			.addButton(btn => btn
				.setButtonText('Add')
				.setCta()
				.onClick(async () => {
					this.plugin.settings.folderSortOrders[selectedFolderPath] = selectedSortOrder
					this.selectedFolderPath = selectedFolderPath
					await this.plugin.saveSettings()
					this.plugin.getFileExplorerView().sort()
					this.display()
				}),
			)
	}
}
