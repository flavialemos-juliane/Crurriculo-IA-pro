import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import AiAssistant from './components/AiAssistant';
import { Sparkles, Sun, Moon, Laptop, Palette } from 'lucide-react';

const DEFAULT_RESUME_TEMPLATES = [
  {
    id: 'demo-1',
    title: 'Exemplo: Desenvolvedor Full Stack',
    name: 'Roberto Souza Ramos',
    email: 'roberto.ramos@exemplo.com',
    phone: '(11) 99999-8888',
    location: 'São Paulo - SP',
    education: 'Ensino Superior Completo em Ciência da Computação',
    age: '28 anos',
    extraNotes: 'Disponibilidade para viagens e modelo híbrido. CNH B e Inglês Avançado.',
    summary: 'Desenvolvedor Full Stack com 4 anos de experiência em JavaScript, React, Node.js e bancos de dados SQL/NoSQL. Focado em otimização de performance de sistemas e arquiteturas escaláveis.',
    experiences: [
      {
        id: 'exp-1',
        role: 'Desenvolvedor Frontend Pleno',
        company: 'Vanguard Tech',
        period: 'Mar/2022 - Presente',
        description: 'Trabalhei no desenvolvimento de interfaces interativas e otimização de aplicações Web de alto tráfego. Liderei refatoração de código legado que melhorou o tempo de carregamento em 30%.'
      }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Git', 'Clean Code'],
    updatedAt: new Date().toISOString()
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'builder'
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [theme, setTheme] = useState('light');
  const [colorScheme, setColorScheme] = useState('violet'); // 'violet', 'emerald', 'sapphire', 'gold'

  // Carregar sessão existente e preferências do localStorage
  useEffect(() => {
    const savedScheme = localStorage.getItem('resumetech_scheme') || 'violet';
    setColorScheme(savedScheme);

    const session = localStorage.getItem('resumetech_session');
    if (session) {
      const parsedUser = JSON.parse(session);
      // Sincronizar dados mais atualizados do banco local de usuários
      const users = JSON.parse(localStorage.getItem('resumetech_users') || '[]');
      const latestUserData = users.find(u => u.id === parsedUser.id);
      if (latestUserData) {
        setCurrentUser(latestUserData);
        setCurrentView('dashboard');
      } else {
        setCurrentUser(parsedUser);
        setCurrentView('dashboard');
      }
    }
  }, []);

  // Monitorar tema, esquema de cor e título dinâmico da página
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    localStorage.setItem('resumetech_scheme', colorScheme);
  }, [theme, colorScheme]);

  useEffect(() => {
    if (currentView === 'builder') {
      document.title = 'Editando Currículo | CurrículoIA PRO';
    } else if (currentView === 'dashboard') {
      document.title = 'Meu Painel de Currículos | CurrículoIA PRO';
    } else {
      document.title = 'CurrículoIA PRO | Otimizador & Criador de Currículos Inteligentes com IA';
    }
  }, [currentView]);

  const handleLoginSuccess = (user) => {
    // Garantir que novos usuários comecem com pelo menos um template demonstrativo para testar as ferramentas facilmente
    if (user.resumes.length === 0) {
      user.resumes = [...DEFAULT_RESUME_TEMPLATES];
      const users = JSON.parse(localStorage.getItem('resumetech_users') || '[]');
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index].resumes = user.resumes;
        localStorage.setItem('resumetech_users', JSON.stringify(users));
      }
    }
    setCurrentUser(user);
    localStorage.setItem('resumetech_session', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('resumetech_session');
    setCurrentView('landing');
  };

  const handleUpgradePlan = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, plan: 'premium' };
    updateUserInDatabase(updatedUser);
  };

  const handleDowngradePlan = () => {
    if (!currentUser) return;
    if (window.confirm('Tem certeza que deseja cancelar sua assinatura Premium? Você perderá acesso aos recursos avançados de IA e exportações premium.')) {
      const updatedUser = { ...currentUser, plan: 'free' };
      updateUserInDatabase(updatedUser);
    }
  };

  const updateUserInDatabase = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('resumetech_session', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('resumetech_users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('resumetech_users', JSON.stringify(users));
    }
  };

  // Funções de Gerenciamento de Currículo no State / DB
  const handleCreateResume = () => {
    if (!currentUser) return;

    const newResume = {
      id: Date.now().toString(),
      title: `Currículo #${currentUser.resumes.length + 1}`,
      name: currentUser.name,
      email: currentUser.email,
      phone: '',
      location: '',
      summary: '',
      experiences: [],
      skills: [],
      updatedAt: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      resumes: [...currentUser.resumes, newResume]
    };
    updateUserInDatabase(updatedUser);
    setActiveResumeId(newResume.id);
    setCurrentView('builder');
  };

  const handleEditResume = (id) => {
    setActiveResumeId(id);
    setCurrentView('builder');
  };

  const handleDeleteResume = (id) => {
    if (window.confirm('Deseja realmente excluir este currículo? Esta ação não pode ser desfeita.')) {
      const updatedResumes = currentUser.resumes.filter(r => r.id !== id);
      const updatedUser = {
        ...currentUser,
        resumes: updatedResumes
      };
      updateUserInDatabase(updatedUser);
    }
  };

  const handleSaveResume = (updatedResume) => {
    const updatedResumes = currentUser.resumes.map(r => r.id === updatedResume.id ? updatedResume : r);
    const updatedUser = {
      ...currentUser,
      resumes: updatedResumes
    };
    updateUserInDatabase(updatedUser);
    alert('Alterações salvas com sucesso!');
  };

  const activeResume = currentUser?.resumes.find(r => r.id === activeResumeId);

  return (
    <div className="app-layout">
      {/* Top Navbar Geral */}
      <nav className="global-navbar">
        <div className="container navbar-container">
          <div className="nav-brand" onClick={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}>
            <div className="nav-logo-icon">
              <Sparkles size={18} />
            </div>
            <span className="brand-text">
              Currículo<strong style={{ color: 'var(--brand)' }}>IA</strong> <span className="brand-badge-pro">PRO</span>
            </span>
          </div>

          <div className="nav-menu">
            {currentView === 'landing' && (
              <>
                <a href="#funcionalidades" className="nav-link">Recursos</a>
                <a href="#modelos" className="nav-link">Modelos</a>
                <a href="#gratuidade" className="nav-link">100% Grátis</a>
              </>
            )}
            
            {/* Seletor de Tonalidade Visual */}
            <div className="color-scheme-selector" title="Alterar Tonalidade Visual do Site">
              <button 
                className={`scheme-dot violet ${colorScheme === 'violet' ? 'active' : ''}`}
                onClick={() => setColorScheme('violet')}
                title="Tonalidade Violet AI"
              />
              <button 
                className={`scheme-dot emerald ${colorScheme === 'emerald' ? 'active' : ''}`}
                onClick={() => setColorScheme('emerald')}
                title="Tonalidade Emerald Tech"
              />
              <button 
                className={`scheme-dot sapphire ${colorScheme === 'sapphire' ? 'active' : ''}`}
                onClick={() => setColorScheme('sapphire')}
                title="Tonalidade Electric Sapphire"
              />
              <button 
                className={`scheme-dot gold ${colorScheme === 'gold' ? 'active' : ''}`}
                onClick={() => setColorScheme('gold')}
                title="Tonalidade Amber Gold Luxe"
              />
            </div>

            {/* Seletor de Tema Claro/Escuro */}
            <button 
              className="theme-toggle-btn" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Alternar Modo Claro / Escuro"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {currentUser ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setCurrentView('dashboard')}>
                Ir para o Painel
              </button>
            ) : (
              currentView !== 'auth' && (
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('auth')}>
                  Entrar / Criar Conta Grátis
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Conteúdo das Telas */}
      <main className="main-content-flow">
        {currentView === 'landing' && (
          <LandingPage 
            onGetStarted={() => setCurrentView('auth')} 
            onChoosePlan={() => {
              if (currentUser) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('auth');
              }
            }} 
          />
        )}
        
        {currentView === 'auth' && (
          <Auth onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser}
            onLogout={handleLogout}
            onCreateResume={handleCreateResume}
            onEditResume={handleEditResume}
            onDeleteResume={handleDeleteResume}
            onUpgradePlan={handleUpgradePlan}
            onDowngradePlan={handleDowngradePlan}
          />
        )}

        {currentView === 'builder' && currentUser && activeResume && (
          <ResumeBuilder 
            resume={activeResume}
            userPlan="premium"
            onSave={handleSaveResume}
            onBack={() => setCurrentView('dashboard')}
            onTriggerUpgrade={() => {
              setCurrentView('dashboard');
            }}
          />
        )}
      </main>

      {/* Rodapé Padrão da Plataforma */}
      {currentView !== 'builder' && (
        <footer className="global-footer">
          <div className="container footer-container">
            <div className="footer-brand-side">
              <div className="footer-logo">
                <div className="nav-logo-icon">
                  <Sparkles size={16} />
                </div>
                <h3>CurrículoIA Pro</h3>
              </div>
              <p>Plataforma 100% gratuita para criação de currículos profissionais otimizados por Inteligência Artificial.</p>
            </div>
            <div className="footer-links-side">
              <span>© {new Date().getFullYear()} CurrículoIA Pro. 100% Gratuito. Todos os direitos reservados.</span>
            </div>
          </div>
        </footer>
      )}

      {/* Assistente de Inteligência Artificial Geral */}
      <AiAssistant />
    </div>
  );
}

