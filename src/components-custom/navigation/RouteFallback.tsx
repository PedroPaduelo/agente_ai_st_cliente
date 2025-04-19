import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Um componente que detecta se a aplicação está sendo servida diretamente 
 * por uma URL que não seja a raiz e redireciona para a versão correta se necessário.
 * 
 * Este componente deve ser usado no topo da sua aplicação.
 */
export function RouteFallback() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    // Verifica se estamos em produção e se a rota atual não é a rota raiz
    const isProd = import.meta.env.PROD;
    const isDirectAccess = !window.location.hash && window.location.pathname !== '/';
    
    if (isProd && isDirectAccess) {
      // Se estamos em produção e acessando diretamente uma rota,
      // forçamos um redirecionamento para a rota raiz
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  
  return null;
}
