import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from '@/components-custom/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Inbox } from '@/pages/Inbox';
import { Transbordos } from '@/pages/Transbordos';
import { Retries } from '@/pages/Retries';
import { Performance } from '@/pages/Performance';
import { FormExamplePage } from '@/pages/FormExamplePage';
import { CpfConsultations } from '@/pages/CpfConsultations';

function App() {
  // Determina qual Router usar baseado no ambiente
  const useHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === 'true';
  // Usamos HashRouter em produção para evitar problemas com refresh da página
  const Router = useHashRouter ? HashRouter : BrowserRouter;
  const basename = import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : undefined;
  


  

  return (
    <Router basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/transbordos" element={<Transbordos />} />
          <Route path="/retries" element={<Retries />} />
          <Route path="/cpf-consultations" element={<CpfConsultations />} />
          <Route path="/form-example" element={<FormExamplePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {/* Add React Query DevTools - only visible in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          buttonPosition="bottom-right"
        />
      )}
    </Router>
  );
}

export default App;
