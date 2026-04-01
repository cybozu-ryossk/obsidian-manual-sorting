import { TFolder } from 'obsidian'
import { Logger } from '@/utils'
import type ManualSortingPlugin from '@/plugin'
import type { FileOrder } from '@/types'

export class OrderManager {
	private log = new Logger('ORDER-MANAGER', '#00ccff')

	constructor(private plugin: ManualSortingPlugin) {}

	rename(oldPath: string, newPath: string) {
		this.log.info(`Renaming '${oldPath}' to '${newPath}'`)
		const order = this.plugin.settings.customOrder
		const oldDir = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/'

		if (order[oldDir]) {
			order[oldDir].children = order[oldDir].children.map((path: string) => (path === oldPath ? newPath : path))
		}
		const isFolder = oldPath in order
		if (isFolder) this.renameFolder(oldPath, newPath)

		void this.plugin.saveSettings()
		this.logOrder('Updated order after renaming item:')
	}

	move(oldPath: string, newPath: string, targetSiblingPath: string, position: 'before' | 'after') {
		this.log.info(`Moving '${oldPath}' to '${newPath}' (${position} '${targetSiblingPath}')`)
		const order = this.plugin.settings.customOrder
		const oldDir = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/'
		const newDir = newPath.substring(0, newPath.lastIndexOf('/')) || '/'
		const isFolder = oldPath in order
		const isDirChanged = oldDir !== newDir

		if (order[oldDir]) {
			order[oldDir].children = order[oldDir].children.filter(path => path !== oldPath)
		}

		if (!order[newDir]) {
			order[newDir] = { children: [], sortOrder: 'custom' }
		}

		let insertIdx = 0
		if (targetSiblingPath) {
			const siblingIdx = order[newDir].children.indexOf(targetSiblingPath)
			insertIdx = position === 'before' ? siblingIdx : siblingIdx + 1
		}
		order[newDir].children.splice(insertIdx, 0, newPath)

		if (isFolder) this.renameFolder(oldPath, newPath)

		this.logOrder('Updated order after moving item:')
		if (!isDirChanged) {
			this.log.info('Directory did not change, calling sort on File Explorer manually')
			this.plugin.getFileExplorerView().sort()
		}
	}

	remove(path: string) {
		this.log.info(`Removing item: '${path}'`)
		const order = this.plugin.settings.customOrder
		const dir = path.substring(0, path.lastIndexOf('/')) || '/'
		const isFolder = path in order

		if (order[dir]) {
			order[dir].children = order[dir].children.filter(p => p !== path)
		}
		if (isFolder) delete order[path]

		this.logOrder('Updated order after removing item:')
	}

	reconcileOrder() {
		this.log.info('Updating order...')
		const currentOrder = this.getCurrentOrder()
		const savedOrder = this.plugin.settings.customOrder
		const newOrder = this.matchSavedOrder(currentOrder, savedOrder)
		this.plugin.settings.customOrder = newOrder
		this.logOrder('Order updated:')
	}

	resetOrder() {
		this.plugin.settings.customOrder = { '/': { children: [], sortOrder: 'custom' } }
	}

	private logOrder(message: string) {
		this.log.infoCompact(message, JSON.stringify(this.plugin.settings.customOrder, null, 4))
	}

	private getCurrentOrder() {
		const currentOrder: FileOrder = {}
		const explorerView = this.plugin.getFileExplorerView()

		const indexFolder = (folder: TFolder) => {
			const sortedItems = explorerView.getSortedFolderItems(folder, true)
			const sortedItemPaths = sortedItems.map(item => item.file.path)
			currentOrder[folder.path] = { children: sortedItemPaths, sortOrder: 'custom' }

			for (const item of sortedItems) {
				const itemObject = item.file
				if (itemObject instanceof TFolder) indexFolder(itemObject)
			}
		}

		indexFolder(this.plugin.app.vault.root)
		return currentOrder
	}

	private matchSavedOrder(currentOrder: FileOrder, savedOrder: FileOrder) {
		const result: FileOrder = {}

		for (const folder in savedOrder) {
			if (!(folder in currentOrder)) continue
			const prevOrder = savedOrder[folder]
			const currentFiles = currentOrder[folder]
			// Keep only files that still exist; don't add new files to custom order
			const existingFiles = prevOrder.children.filter(file => currentFiles.children.includes(file))
			if (existingFiles.length > 0) {
				result[folder] = { children: existingFiles, sortOrder: 'custom' }
			}
		}

		return result
	}

	private removeFolder(path: string) {
		const order = this.plugin.settings.customOrder
		order[path].children.forEach((childPath: string) => {
			const isFolder = childPath in order
			if (isFolder) this.removeFolder(childPath)
		})
		delete order[path]
	}

	private renameFolder(oldPath: string, newPath: string) {
		if (oldPath === newPath) return
		const order = this.plugin.settings.customOrder
		order[newPath] = order[oldPath]
		delete order[oldPath]
		order[newPath].children = order[newPath].children.map((path: string) => {
			const newChildPath = path.replace(oldPath, newPath)
			const isFolder = path in order
			if (isFolder) this.renameFolder(path, newChildPath)
			return newChildPath
		})
	}
}