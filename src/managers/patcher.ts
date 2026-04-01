import { TFile, TFolder } from 'obsidian'
import { around } from 'monkey-around'
import { Logger } from '@/utils'
import type ManualSortingPlugin from '@/plugin'
import type { FileTreeItem, FileExplorerView } from 'obsidian-typings'
import type { FileExplorerViewSortOrder } from 'obsidian-typings'

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
				const customSortOrder = plugin.settings.folderSortOrders[folder.path]
				if (!customSortOrder) return sortedItems
				patcher.log.info(`Applying custom sort '${customSortOrder}' to folder '${folder.path}'`)
				return patcher.sortItems(sortedItems, customSortOrder)
			},
		})
	}

	private sortItems(items: FileTreeItem[], sortOrder: FileExplorerViewSortOrder): FileTreeItem[] {
		return [...items].sort((a, b) => {
			switch (sortOrder) {
				case 'alphabetical':
					return a.file.name.localeCompare(b.file.name)
				case 'alphabeticalReverse':
					return b.file.name.localeCompare(a.file.name)
				case 'byModifiedTime': {
					const aTime = a.file instanceof TFile ? a.file.stat.mtime : 0
					const bTime = b.file instanceof TFile ? b.file.stat.mtime : 0
					return bTime - aTime || a.file.name.localeCompare(b.file.name)
				}
				case 'byModifiedTimeReverse': {
					const aTime = a.file instanceof TFile ? a.file.stat.mtime : 0
					const bTime = b.file instanceof TFile ? b.file.stat.mtime : 0
					return aTime - bTime || a.file.name.localeCompare(b.file.name)
				}
				case 'byCreatedTime': {
					const aTime = a.file instanceof TFile ? a.file.stat.ctime : 0
					const bTime = b.file instanceof TFile ? b.file.stat.ctime : 0
					return bTime - aTime || a.file.name.localeCompare(b.file.name)
				}
				case 'byCreatedTimeReverse': {
					const aTime = a.file instanceof TFile ? a.file.stat.ctime : 0
					const bTime = b.file instanceof TFile ? b.file.stat.ctime : 0
					return aTime - bTime || a.file.name.localeCompare(b.file.name)
				}
				default:
					return 0
			}
		})
	}

	unpatchExplorer() {
		if (!this.explorerUninstaller) return
		this.explorerUninstaller()
		this.explorerUninstaller = null
		this.log.info('Explorer unpatched')
	}
}
