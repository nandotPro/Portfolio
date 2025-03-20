import React from 'react';
import { motion } from 'framer-motion';
import { useI18nStore, LanguageCode } from '../../i18n/i18n';
import styles from '../../styles/modules/footer.module.css';
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
          <span>
            {currentLanguage === 'pt-BR' ? 'Português (Brasil)' : 
             currentLanguage === 'en-US' ? 'English' : '中文'}
          </span>
        </span>
      </div>
      
      <div className={styles.footerRight}>
        <div className={styles.languageSelector}>
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              className={`${styles.languageButton} ${currentLanguage === lang.code ? styles.active : ''}`}
              onClick={() => setLanguage(lang.code)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer; 