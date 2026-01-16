import { App, PluginSettingTab, Setting } from 'obsidian';
import BetterFilePropertiesViewPlugin from './main';

export interface BetterFilePropertiesViewSettings {
	coverPropertyName: string;
    hideMetadataContainer: boolean;
    showThumbnail: boolean;
}

export const DEFAULT_SETTINGS: BetterFilePropertiesViewSettings = {
	coverPropertyName: 'cover',
    hideMetadataContainer: true,
    showThumbnail: true
}

export class BetterFilePropertiesViewSettingTab extends PluginSettingTab {
	plugin: BetterFilePropertiesViewPlugin;

	constructor(app: App, plugin: BetterFilePropertiesViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Show Thumbnail')
			.setDesc('Display thumbnail images from the frontmatter property')
			.addToggle(value => value
				.setValue(this.plugin.settings.showThumbnail)
				.onChange(async (value) => {
					this.plugin.settings.showThumbnail = value;
					await this.plugin.saveSettings();
					this.plugin.updateFilePropertiesView();
					this.display();
				}));
			
		if (this.plugin.settings.showThumbnail) {
			new Setting(containerEl)
				.setName('Thumbnail Property Name')
				.setDesc('The frontmatter property name to look for and display as an image')
				.addText(text => text
					.setPlaceholder('cover')
					.setValue(this.plugin.settings.coverPropertyName)
					.onChange(async (value) => {
						this.plugin.settings.coverPropertyName = value || 'cover';
						await this.plugin.saveSettings();
						this.plugin.updateFilePropertiesView();
					}));
		}
        
		new Setting(containerEl)
			.setName('Hide metadata container')
			.setDesc('Hides the metadata container if Properties View is active')
			.addToggle(value => value
				.setValue(this.plugin.settings.hideMetadataContainer)
				.onChange(async (value) => {
					this.plugin.settings.hideMetadataContainer = value;
					await this.plugin.saveSettings();
					this.plugin.updateMetadataContainer();
				}));
	}
}
