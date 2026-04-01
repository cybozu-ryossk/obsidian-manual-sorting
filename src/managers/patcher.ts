import { TFolder } from 'obsidian'
import { around } from 'monkey-around'
import { Logger } from '@/utils'
import type ManualSortingPlugin from '@/plugin'
import type { FileTreeItem, FileExplorerView } from 'obsidian-typings'

export class Patcher {
	private explorerUninstaller: ReturnType<typeof around> | null = null
	private log = new Logger('PATCHER', '#988bff')

	constructor(private plugin: ManualSortingPlugin) {}

	patchExplorer() {
		const patcher = this
		const plugin = this.plugin
		const fileExplorerView = plugin.getFileExplorerView()

		this.explorerUninstaller = around(Object.getPrototypeOf(fileExplorerView) as FileExplorerView, {
			getSortedFolderItems: original => function (this: FileExplorerView, folder: TFolder, bypass?: boolean): FileTreeItem[] {
				const sortedItems = original.call(this, folder)
				if (bypass) return sortedItems
				const folderPath = folder.path
				const hiddenFolders = plugin.settings.hiddenFolders
				const visibleItems = hiddenFolders.length > 0
					? sortedItems.filter(item => !hiddenFolders.includes(item.file.path))
					: sortedItems
				const customOrder = plugin.settings.customOrder[folderPath]
				if (!customOrder || customOrder.length === 0) return visibleItems
				const inOrder = visibleItems.filter(item => customOrder.includes(item.file.path))
				const notInOrder = visibleItems.filter(item => !customOrder.includes(item.file.path))
				inOrder.sort((a, b) => customOrder.indexOf(a.file.path) - customOrder.indexOf(b.file.path))
				patcher.log.info(`Applied custom order to folder '${folderPath}'`)
				return [...inOrder, ...notInOrder]
			},
		})
	}

	unpatchExplorer() {
		if (!this.explorerUninstaller) return
		this.explorerUninstaller()
		this.explorerUninstaller = null
		this.log.info('Explorer unpatched')
	}
}
