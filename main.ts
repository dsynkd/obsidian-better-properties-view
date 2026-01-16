import { Plugin, TFile } from 'obsidian';
import { BetterFilePropertiesViewSettings, DEFAULT_SETTINGS, BetterFilePropertiesViewSettingTab } from './settings';

export default class BetterFilePropertiesViewPlugin extends Plugin {
	settings: BetterFilePropertiesViewSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new BetterFilePropertiesViewSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				this.updateFilePropertiesView();
			})
		);

		this.registerEvent(
			this.app.metadataCache.on('changed', () => {
				this.updateFilePropertiesView();
			})
		);

		this.updateFilePropertiesView();
	}

	onunload() {
        document.body.removeClass('hide-metadata-container')
		this.removePropertyImage();
	}

	public updateFilePropertiesView() {
		this.removePropertyImage();

		const activeLeaf = this.app.workspace.activeLeaf;
		if (!activeLeaf) return;

		const file = this.app.workspace.getActiveFile();
		if (!file || !(file instanceof TFile)) return;

		const metadata = this.app.metadataCache.getFileCache(file);
		if (!metadata || !metadata.frontmatter) return;

		const propertyName = this.settings.propertyName;
		const propertyValue = metadata.frontmatter[propertyName];

		if (!propertyValue) return;

		// Find the file properties view container
		const container = document.querySelector(
			'div.workspace-leaf-content[data-type="file-properties"] div.view-content'
		);
		if (!container) return;

		// Create and append the image
		const imageContainer = document.createElement('div');
		imageContainer.className = 'better-file-properties-image-container';

		const image = document.createElement('img');
		image.className = 'better-file-properties-image';
		image.src = propertyValue;

		// If thumbnail does not exist, remove element
		image.onerror = () => {
			imageContainer.remove();
		};

		imageContainer.appendChild(image);
		container.prepend(imageContainer);
        this.updateMetadataContainer()
	}

    private updateMetadataContainer() {
        document.body.removeClass('hide-metadata-container')
        if(this.isFilePropertiesViewActive()) {
            document.body.addClass('hide-metadata-container')
        }
    }

    private isFilePropertiesViewActive() {
        const el = document.querySelector('div.workspace-tab-header[data-type="file-properties"]')
        return el && el.hasClass('is-active')
    }

	private removePropertyImage() {
		const imageContainer = document.querySelector(
			'div.workspace-leaf-content[data-type="file-properties"] div.view-content .better-file-properties-image-container'
		);
		if (imageContainer) {
			imageContainer.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
