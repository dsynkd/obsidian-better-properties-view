import { Plugin, TFile } from 'obsidian'
import { BetterFilePropertiesViewSettings, DEFAULT_SETTINGS, BetterFilePropertiesViewSettingTab } from './settings'

export default class BetterFilePropertiesViewPlugin extends Plugin {
	settings: BetterFilePropertiesViewSettings
	private lastThumbnailKey: string | null = null

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new BetterFilePropertiesViewSettingTab(this.app, this))

		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				this.updateFilePropertiesView()
				this.updateMetadataContainer()
			})
		)

		this.registerEvent(
			this.app.metadataCache.on('changed', () => {
				this.updateFilePropertiesView()
				this.updateMetadataContainer()
			})
		)

		this.updateFilePropertiesView()
		this.updateMetadataContainer()
	}

	onunload() {
		document.body.removeClass('hide-metadata-container')
		this.removePropertyImage()
	}

	public updateFilePropertiesView() {
		if (!this.settings.showThumbnail) {
			this.removePropertyImage()
			this.lastThumbnailKey = null
			return
		}

		const file = this.app.workspace.getActiveFile()
		if (!file || !(file instanceof TFile)) {
			this.removePropertyImage()
			this.lastThumbnailKey = null
			return
		}

		const metadata = this.app.metadataCache.getFileCache(file)
		if (!metadata || !metadata.frontmatter) {
			this.removePropertyImage()
			this.lastThumbnailKey = null
			return
		}

		const coverKeyPart = this.settings.coverPropertyName
		const cover = metadata.frontmatter[coverKeyPart]
		if (cover == null || cover === '') {
			this.removePropertyImage()
			this.lastThumbnailKey = null
			return
		}

		const coverStr = typeof cover === 'string' ? cover : String(cover)
		const thumbnailKey = `${file.path}\0${coverKeyPart}\0${coverStr}`

		const container = document.querySelector(
			'div.workspace-leaf-content[data-type="file-properties"] div.view-content'
		)
		if (!container) return

		if (this.lastThumbnailKey === thumbnailKey) {
			const existing = container.querySelector('.better-file-properties-image-container')
			if (existing?.isConnected) return
		}

		this.removePropertyImage()

		const imageContainer = document.createElement('div')
		imageContainer.className = 'better-file-properties-image-container'

		const image = document.createElement('img')
		image.className = 'better-file-properties-image'
		image.src = coverStr

		image.onerror = () => {
			imageContainer.remove()
			this.lastThumbnailKey = null
		}

		imageContainer.appendChild(image)
		container.prepend(imageContainer)
		this.lastThumbnailKey = thumbnailKey
	}

    public updateMetadataContainer() {
        const shouldHide =
            this.settings.hideMetadataContainer && this.isFilePropertiesViewActive()
        const isHidden = document.body.classList.contains('hide-metadata-container')
        if (shouldHide === isHidden) return
        if (shouldHide) document.body.addClass('hide-metadata-container')
        else document.body.removeClass('hide-metadata-container')
    }

    private isFilePropertiesViewActive() {
        const el = document.querySelector('div.workspace-tab-header[data-type="file-properties"]')
        return el?.hasClass('is-active')
    }

	private removePropertyImage() {
		const imageContainer = document.querySelector(
			'div.workspace-leaf-content[data-type="file-properties"] div.view-content .better-file-properties-image-container'
		)
		if (imageContainer) {
			imageContainer.remove()
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
