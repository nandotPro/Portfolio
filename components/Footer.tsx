import React from 'react';
import { useI18nStore, LanguageCode } from '../i18n/i18n';
import styles from './Footer.module.css';
import { VscGlobe } from 'react-icons/vsc';

const Footer: React.FC = () => {
  const { currentLanguage, setLanguage } = useI18nStore();
  
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'pt-BR', label: 'PT-BR' },
    { code: 'en-US', label: 'EN' },
    { code: 'zh-CN', label: 'CN' }
  ];
  
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <span className={styles.footerItem}>
          <VscGlobe className={styles.footerIcon} />
          {currentLanguage === 'pt-BR' ? 'Português (Brasil)' : 
           currentLanguage === 'en-US' ? 'English' : '中文'}
        </span>
      </div>
      
      <div className={styles.footerRight}>
        <div className={styles.languageSelector}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.languageButton} ${currentLanguage === lang.code ? styles.active : ''}`}
              onClick={() => setLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Footer); 