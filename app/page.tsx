'use client';

import Layout from '../src/components/Layout';
import { useI18nStore } from '../src/i18n/i18n';

export default function Home() {
  const { t } = useI18nStore();
  
  return (
    <Layout>
      <div className="welcome-message">
        <h1>{t('ui.welcome')}</h1>
      </div>
    </Layout>
  );
}
