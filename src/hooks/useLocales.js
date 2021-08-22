import { useTranslation } from 'react-i18next';
// material
import { enUS, arEG } from '@material-ui/core/locale';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: 'https://img.icons8.com/color/30/000000/great-britain.png'
  },
  {
    label: 'Arabic',
    value: 'ar',
    systemValue: arEG,

    icon: 'https://img.icons8.com/color/30/000000/egypt.png'
  }
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

  const handleChangeLanguage = (newlang) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS
  };
}
