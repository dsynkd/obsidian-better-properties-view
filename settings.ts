import { App, PluginSettingTab, Setting } from 'obsidian';
import BetterFilePropertiesViewPlugin from './main';

export interface BetterFilePropertiesViewSettings {
	propertyName: string;
    hideMetadataContainer: boolean;
}

export const DEFAULT_SETTINGS: BetterFilePropertiesViewSettings = {
	propertyName: 'cover',
    hideMetadataContainer: true
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
			.setName('Property Name')
			.setDesc('The frontmatter property name to look for and display as an image')
			.addText(text => text
				.setPlaceholder('cover')
				.setValue(this.plugin.settings.propertyName)
				.onChange(async (value) => {
					this.plugin.settings.propertyName = value || 'cover';
					await this.plugin.saveSettings();
					this.plugin.updateFilePropertiesView();
				}));
        
		new Setting(containerEl)
			.setName('Hide metadata container')
			.setDesc('Hides the metadata container if Properties View is active')
			.addToggle(value => value
				.setValue(this.plugin.settings.hideMetadataContainer)
				.onChange(async (value) => {
					this.plugin.settings.hideMetadataContainer = value;
					await this.plugin.saveSettings();
					this.plugin.updateFilePropertiesView();
				}));
	}
}
