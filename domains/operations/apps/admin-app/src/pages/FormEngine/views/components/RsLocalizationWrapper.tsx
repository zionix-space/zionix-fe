import type {FormViewerWrapperComponentProps} from '@zionix-formEngine/core'
import {ConfigProvider} from 'antd'
import type {Locale} from 'antd/es/locale'
import arEG from 'antd/locale/ar_EG'
import daDK from 'antd/locale/da_DK'
import deDE from 'antd/locale/de_DE'
import enGB from 'antd/locale/en_GB'
import enUS from 'antd/locale/en_US'
import esES from 'antd/locale/es_ES'
import fiFI from 'antd/locale/fi_FI'
import frFR from 'antd/locale/fr_FR'
import huHU from 'antd/locale/hu_HU'
import itIT from 'antd/locale/it_IT'
import jaJP from 'antd/locale/ja_JP'
import koKR from 'antd/locale/ko_KR'
import nlNL from 'antd/locale/nl_NL'
import ptBR from 'antd/locale/pt_BR'
import svSE from 'antd/locale/sv_SE'
import trTR from 'antd/locale/tr_TR'
import zhCN from 'antd/locale/zh_CN'
import zhTW from 'antd/locale/zh_TW'

// Note: Ant Design doesn't have built-in locales for some languages (hi-IN, kk-KZ, sr-RS, es-AR)
// These will fall back to enUS. Custom locale files can be created if needed.

/**
 * Ant Design locale mapping (migrated from RSuite).
 * Maps language codes to Ant Design locale objects.
 */
const antdLocales: Record<string, Locale> = {
  'ar-EG': arEG,
  'de-DE': deDE,
  'en-US': enUS,
  'it-IT': itIT,
  'fr-FR': frFR,
  'es-ES': esES,
  'zh-CN': zhCN,
  'da-DK': daDK,
  'en-GB': enGB,
  'es-AR': esES, // Fallback to es-ES (Ant Design doesn't have es-AR)
  'fi-FI': fiFI,
  'hi-IN': enUS, // Fallback to enUS (Ant Design doesn't have hi-IN)
  'hu-HU': huHU,
  'kk-KZ': enUS, // Fallback to enUS (Ant Design doesn't have kk-KZ)
  'ko-KR': koKR,
  'nl-NL': nlNL,
  'pt-BR': ptBR,
  'sr-RS': enUS, // Fallback to enUS (Ant Design doesn't have sr-RS)
  'sv-SE': svSE,
  'tr-TR': trTR,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
}

export const defaultComponentsLocale = enUS

/**
 * Wrapper component for Ant Design components localization.
 * Migrated from RSuite CustomProvider to Ant Design ConfigProvider.
 * 
 * Key differences from RSuite:
 * - Uses ConfigProvider instead of CustomProvider
 * - Uses 'direction' prop instead of 'rtl' prop
 * - Locale objects have different structure but same purpose
 * 
 * @param props the component props.
 * @param props.language the language object containing the language information.
 * @param props.children the children components to be wrapped.
 * @returns the wrapped components with localization settings applied.
 */
export const RsLocalizationWrapper = ({language, children}: FormViewerWrapperComponentProps) => {
  const locale = antdLocales[language.fullCode] ?? defaultComponentsLocale
  const direction = language.bidi === 'rtl' ? 'rtl' : 'ltr'
  
  return (
    <ConfigProvider locale={locale} direction={direction}>
      {children}
    </ConfigProvider>
  )
}
