import { App, PluginSettingTab, Setting, TFolder } from 'obsidian'
import { Logger } from '@/utils'
import type ManualSortingPlugin from '@/plugin'

export class SettingsTab extends PluginSettingTab {
	private selectedFolderPath = '/'
	private folderToHide = ''

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

		this.containerEl.createEl('h3', { text: 'Manual Item Order' })
		this.containerEl.createEl('p', {
			text: "Select a folder to configure the order of its contents. Folders without a custom order use Obsidian's global sort order.",
			cls: 'setting-item-description',
		})

		const allFolderPaths = this.app.vault.getAllFolders(true).map(f => f.path).sort()

		// Ensure selectedFolderPath is still valid
		if (!allFolderPaths.includes(this.selectedFolderPath)) {
			this.selectedFolderPath = '/'
		}

		new Setting(this.containerEl)
			.setName('Folder')
			.addDropdown(drop => {
				for (const path of allFolderPaths) {
					drop.addOption(path, path === '/' ? '/ (root)' : path)
				}
				drop.setValue(this.selectedFolderPath)
				drop.onChange(value => {
					this.selectedFolderPath = value
					this.display()
				})
			})

		this.renderFolderPanel()
		this.renderHiddenFoldersPanel(allFolderPaths)
	}

	private renderFolderPanel(): void {
		const folderPath = this.selectedFolderPath
		const folder = folderPath === '/'
			? this.app.vault.getRoot()
			: this.app.vault.getAbstractFileByPath(folderPath)

		if (!(folder instanceof TFolder)) return

		const customOrder: string[] = this.plugin.settings.customOrder[folderPath] ?? []
		const allChildren = folder.children

		const orderedItems = customOrder
			.map(p => allChildren.find(c => c.path === p))
			.filter(c => !!c)

		const unorderedItems = allChildren
			.filter(c => !customOrder.includes(c.path))
			.sort((a, b) => a.name.localeCompare(b.name))

		// --- Custom Order section ---
		this.containerEl.createEl('h4', { text: 'Custom Order' })

		if (orderedItems.length === 0) {
			this.containerEl.createEl('p', {
				text: 'No items in the custom order for this folder. Add items from the list below.',
				cls: 'setting-item-description',
			})
		}

		for (let i = 0; i < orderedItems.length; i++) {
			const item = orderedItems[i]
			const isFolder = item instanceof TFolder

			new Setting(this.containerEl)
				.setName(item.name)
				.setDesc(isFolder ? '📁' : '📄')
				.addExtraButton(btn => btn
					.setIcon('arrow-up')
					.setTooltip('Move up')
					.setDisabled(i === 0)
					.onClick(async () => {
						const order = this.plugin.settings.customOrder[folderPath]
						;[order[i - 1], order[i]] = [order[i], order[i - 1]]
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}),
				)
				.addExtraButton(btn => btn
					.setIcon('arrow-down')
					.setTooltip('Move down')
					.setDisabled(i === orderedItems.length - 1)
					.onClick(async () => {
						const order = this.plugin.settings.customOrder[folderPath]
						;[order[i], order[i + 1]] = [order[i + 1], order[i]]
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}),
				)
				.addExtraButton(btn => btn
					.setIcon('x')
					.setTooltip('Remove from custom order')
					.onClick(async () => {
						this.plugin.settings.customOrder[folderPath] =
							this.plugin.settings.customOrder[folderPath].filter(p => p !== item.path)
						if (this.plugin.settings.customOrder[folderPath].length === 0)
							delete this.plugin.settings.customOrder[folderPath]
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}),
				)
		}

		if (orderedItems.length > 0) {
			new Setting(this.containerEl)
				.addButton(btn => btn
					.setButtonText('Reset order')
					.setWarning()
					.onClick(async () => {
						delete this.plugin.settings.customOrder[folderPath]
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}),
				)
		}

		// --- Unordered Items section ---
		if (unorderedItems.length > 0) {
			this.containerEl.createEl('h4', { text: 'Unordered Items' })
			this.containerEl.createEl('p', {
				text: "Items not yet in the custom order. They appear after ordered items using Obsidian's global sort.",
				cls: 'setting-item-description',
			})

			for (const item of unorderedItems) {
				const isFolder = item instanceof TFolder
				new Setting(this.containerEl)
					.setName(item.name)
					.setDesc(isFolder ? '📁' : '📄')
					.addButton(btn => btn
						.setButtonText('Add')
						.onClick(async () => {
							if (!this.plugin.settings.customOrder[folderPath])
								this.plugin.settings.customOrder[folderPath] = []
							this.plugin.settings.customOrder[folderPath].push(item.path)
							await this.plugin.saveSettings()
							this.plugin.getFileExplorerView().sort()
							this.display()
						}),
					)
			}
		}
	}

	private renderHiddenFoldersPanel(allFolderPaths: string[]): void {
		const hiddenFolders = this.plugin.settings.hiddenFolders

		this.containerEl.createEl('h3', { text: 'Hidden Folders' })
		this.containerEl.createEl('p', {
			text: 'Folders in this list will not be displayed in the file explorer.',
			cls: 'setting-item-description',
		})

		if (hiddenFolders.length === 0) {
			this.containerEl.createEl('p', {
				text: 'No folders are hidden.',
				cls: 'setting-item-description',
			})
		}

		for (const path of hiddenFolders) {
			new Setting(this.containerEl)
				.setName(path)
				.addButton(btn => btn
					.setButtonText('Unhide')
					.onClick(async () => {
						this.plugin.settings.hiddenFolders = this.plugin.settings.hiddenFolders.filter(p => p !== path)
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}),
				)
		}

		const availableFolders = allFolderPaths.filter(p => p !== '/' && !hiddenFolders.includes(p))
		if (availableFolders.length === 0) return

		if (!availableFolders.includes(this.folderToHide)) {
			this.folderToHide = availableFolders[0]
		}

		new Setting(this.containerEl)
			.setName('Hide folder')
			.addDropdown(drop => {
				for (const path of availableFolders) {
					drop.addOption(path, path)
				}
				drop.setValue(this.folderToHide)
				drop.onChange(value => {
					this.folderToHide = value
				})
			})
			.addButton(btn => btn
				.setButtonText('Hide')
				.onClick(async () => {
					if (!this.folderToHide) return
					if (!this.plugin.settings.hiddenFolders.includes(this.folderToHide)) {
						this.plugin.settings.hiddenFolders.push(this.folderToHide)
						await this.plugin.saveSettings()
						this.plugin.getFileExplorerView().sort()
						this.display()
					}
				}),
			)
	}
}
