import { Meteor } from 'meteor/meteor'
import { I18N } from 'meteor/ostrio:i18n'
import settings from './i18n/i18n'
import en from './i18n/en'
import ru from './i18n/ru'

global.i18nConfig = {
  settings: settings,
  en: en,
  ru: ru
}

Meteor.startup(function () {
  global.i18n = new I18N({driver: 'Object', i18n: global.i18nConfig})
})
