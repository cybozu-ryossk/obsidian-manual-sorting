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

- **Configure per-folder sort order** from the plugin settings screen
- **Folders without a setting** use Obsidian's global sort order
- **Seamlessly switch** between per-folder and global sort modes

## 🕹️ Usage

1. Open `Settings` → `Manual Sorting`
2. Under "Per-Folder Sort Orders", click `Add`
3. Enter a folder path and choose the desired sort order

## 📥 Installation
- **Via the Obsidian Plugins marketplace**: https://obsidian.md/plugins?id=manual-sorting
- **Using the [BRAT plugin](github.com/TfTHacker/obsidian42-brat)**: `Add Beta Plugin` → `kh4f/manual-sorting`
- **Manually**: extract the [latest release](https://github.com/kh4f/manual-sorting/releases/latest) `manual-sorting-x.y.z.zip` into `vault/.obsidian/plugins/manual-sorting/`

## 📋 Specifications

- Drag-and-drop sorting is removed. Sort order is configured exclusively from the plugin settings screen.
- Users can assign a sort order to any folder individually (e.g. alphabetical, by modified time).
- Folders with no configured sort order fall back to Obsidian's global sort order.
- The "Change sort order" menu in the file explorer is unmodified; it still controls the global sort order.
- The settings tab shows a list of all per-folder sort order configurations.
- Each configured folder has a sort order dropdown and a delete button to revert to the global sort order.
- A new configuration can be added by entering a folder path and selecting a sort order.
- When a folder is renamed, its sort order configuration is updated automatically.
- When a folder is deleted, its sort order configuration is removed automatically.

## 💖 Credits
- **Inspiration**: [Obsidian Bartender](https://github.com/nothingislost/obsidian-bartender), [Custom File Explorer sorting](https://github.com/SebastianMC/obsidian-custom-sort)
- **Huge thanks** to [@Zweikeks](https://github.com/Zweikeks), [@Azmoinal](https://github.com/Azmoinal), [@SublimePeace](https://github.com/SublimePeace), [@Anonym0usPlayer](https://github.com/Anonym0usPlayer) for testing and feedback!
- **Special thanks** to [@Mara-Li](https://github.com/Mara-Li) for contributions!

<br>

<div align="center">
  <b>MIT License © 2025-2026 <a href="https://github.com/kh4f">kh4f</a></b>
</div>