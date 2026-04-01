import { App, PluginSettingTab, Setting } from 'obsidian'
import { Logger } from '@/utils'
import type ManualSortingPlugin from '@/plugin'

export class SettingsTab extends PluginSettingTab {
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

		this.containerEl.createEl('h3', { text: 'Manually Sorted Items' })

		const customOrder = this.plugin.settings.customOrder
		const folderEntries = Object.entries(customOrder).filter(([, entry]) => entry.children.length > 0)

		if (folderEntries.length === 0) {
			this.containerEl.createEl('p', {
				text: 'No items have been manually sorted yet.',
				cls: 'setting-item-description',
			})
			return
		}

		for (const [folderPath, entry] of folderEntries) {
			this.containerEl.createEl('h4', {
				text: folderPath === '/' ? '/ (root)' : folderPath,
				cls: 'manual-sorting-folder-heading',
			})

			for (const childPath of [...entry.children]) {
				const name = childPath.substring(childPath.lastIndexOf('/') + 1) || childPath

				new Setting(this.containerEl)
					.setName(name)
					.setDesc(childPath)
					.addButton(btn => btn
						.setIcon('x')
						.setTooltip('Remove from manual order')
						.onClick(async () => {
							customOrder[folderPath].children = customOrder[folderPath].children.filter(p => p !== childPath)
							if (customOrder[folderPath].children.length === 0) {
								delete customOrder[folderPath]
							}
							await this.plugin.saveSettings()
							this.plugin.getFileExplorerView().sort()
							this.display()
						}),
					)
			}
		}
	}
}
