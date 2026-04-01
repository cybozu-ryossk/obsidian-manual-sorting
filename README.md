<div align="center">
	<h1>📌 Manual Sorting</h1>
	An Obsidian plugin that enables <b>manual DnD sorting</b> in the file explorer
	<br><br>
	<p>
		<a href='https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugin-stats.json#:~:text="manual%2Dsorting"' target="_blank"><img src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=303145&labelColor=c52828&label=Downloads&query=%24%5B%22manual-sorting%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=flat-square" alt="Downloads Badge"></a>
		<a href="https://github.com/kh4f/manual-sorting/releases"><img src="https://img.shields.io/github/v/tag/kh4f/manual-sorting?color=303145&labelColor=c52828&label=%F0%9F%8F%B7%EF%B8%8F%20Release&style=flat-square" alt="Version Badge"></a>
		<a href="https://github.com/kh4f/manual-sorting/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kh4f/manual-sorting?color=303145&labelColor=c52828&label=%F0%9F%9B%A1%EF%B8%8F%20License&style=flat-square" alt="License Badge"></a>
		<a href="https://github.com/kh4f/manual-sorting/issues?q=is%3Aissue+is%3Aopen+label%3Abug"><img src="https://img.shields.io/github/issues/kh4f/manual-sorting/bug?color=303145&labelColor=c52828&label=%F0%9F%90%9B%20Bugs&style=flat-square" alt="Open Bugs Badge"></a>
	</p>
	<p>
		<b>
			<a href="#-features">Features</a>&nbsp; •&nbsp;
			<a href="#-usage">Usage</a>&nbsp; •&nbsp;
			<a href="#-installation">Installation</a>&nbsp; •&nbsp;
			<a href="#-credits">Credits</a>
		</b>
	</p>
	<br>
	<img align="center" max-width="800" style="border-radius: 5px;" src="https://github.com/user-attachments/assets/a39a5a76-bff8-415d-9410-86022557860e" alt="demo">
	<br><br>
</div>

## 🔥 Features

- **Configure item order per folder** from the plugin settings screen
- **Reorder files and folders** using up/down buttons — no drag-and-drop needed
- **Folders without a custom order** use Obsidian's global sort order

## 🕹️ Usage

1. Open `Settings` → `Manual Sorting`
2. Select a folder from the dropdown
3. Use the up/down buttons to reorder items within that folder

## 📥 Installation
- **Via the Obsidian Plugins marketplace**: https://obsidian.md/plugins?id=manual-sorting
- **Using the [BRAT plugin](github.com/TfTHacker/obsidian42-brat)**: `Add Beta Plugin` → `kh4f/manual-sorting`
- **Manually**: extract the [latest release](https://github.com/kh4f/manual-sorting/releases/latest) `manual-sorting-x.y.z.zip` into `vault/.obsidian/plugins/manual-sorting/`

## 📋 Specifications

- Drag-and-drop sorting is removed. Item order is configured exclusively from the plugin settings screen.
- The settings tab has a folder selector dropdown at the top. Selecting a folder loads the item order panel for that folder.
- The item order panel shows all files and subfolders currently inside the selected folder, in their current custom order.
- Items in the custom order are listed with up/down buttons to move them and a remove button to drop them from the custom order.
- Items not yet in the custom order appear below the ordered list as "unordered items" and can be individually added to the bottom of the custom order.
- There is also a "Reset order" button that clears the entire custom order for the selected folder.
- When a folder has a custom order, the file explorer displays its items in that order; items not in the custom order are appended after the ordered items using Obsidian's global sort order.
- Folders without any custom order fall back entirely to Obsidian's global sort order.
- The "Change sort order" menu in the file explorer is unmodified; it still controls the global sort order for unconfigured folders.
- When a file or folder is renamed within the same parent, its entry in the custom order is updated automatically.
- When a file or folder is deleted, its entry is removed from the custom order automatically.
- A toggle setting "Show dot files/folders" controls whether files and folders whose name starts with "." are shown in the file explorer. When disabled (default: enabled), all dot items are hidden from the file explorer.
- A folder can be marked as "hidden" from the plugin settings screen. Hidden folders are not displayed in the file explorer.
- The settings tab includes a "Hidden Folders" section where folders can be added to or removed from the hidden list.
- The hidden folders list shows the path of each hidden folder with a button to unhide it.
- There is an input or picker to add a new folder to the hidden list.

## 💖 Credits
- **Inspiration**: [Obsidian Bartender](https://github.com/nothingislost/obsidian-bartender), [Custom File Explorer sorting](https://github.com/SebastianMC/obsidian-custom-sort)
- **Huge thanks** to [@Zweikeks](https://github.com/Zweikeks), [@Azmoinal](https://github.com/Azmoinal), [@SublimePeace](https://github.com/SublimePeace), [@Anonym0usPlayer](https://github.com/Anonym0usPlayer) for testing and feedback!
- **Special thanks** to [@Mara-Li](https://github.com/Mara-Li) for contributions!

<br>

<div align="center">
  <b>MIT License © 2025-2026 <a href="https://github.com/kh4f">kh4f</a></b>
</div>