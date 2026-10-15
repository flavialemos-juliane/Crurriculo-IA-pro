import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';
import LogoIcon from './components/LogoIcon';

const DEFAULT_RESUME_TEMPLATES = [
  {
    id: 'demo-1',
    title: 'Exemplo: Atendimento & Vendas',
    name: 'Ana Carolina dos Santos',
    email: 'ana.santos@exemplo.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo - SP',
    education: 'Ensino Médio Completo / Cursos Profissionalizantes',
    age: '26 anos',
    extraNotes: 'Disponibilidade para início imediato, facilidade de deslocamento e bom trabalho em equipe.',
    summary: 'Profissional dedicada e comunicativa, com experiência em atendimento ao público, rotinas administrativas e organização de setores. Foco em pontualidade, excelente relacionamento interpessoal e qualidade nas entregas diárias.',
    experiences: [
      {
        id: 'exp-1',
        role: 'Atendente e Auxiliar de Atendimento',
        company: 'Comércio & Serviços Brasil',
        period: 'Mar/2022 - Presente',
        description: 'Atendimento presencial e telefônico a clientes com foco em cordialidade e rapidez. Esclarecimento de dúvidas, registro e organização de pedidos, e apoio direto na organização do setor.'
      }
    ],
    skills: ['Atendimento ao Cliente', 'Boa Comunicação', 'Informática Básica', 'Organização', 'Trabalho em Equipe', 'Pontualidade'],
    template: 'modern',
    updatedAt: new Date().toISOString()
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'auth', 'dashboard', 'builder'
  const [activeResumeId, setActiveResumeId] = useState(() => localStorage.getItem('resumetech_active_resume_id') || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('resumetech_theme') || 'light');
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('resumetech_scheme') || 'violet'); // 'violet', 'emerald', 'sapphire', 'gold'
  const [pendingTemplate, setPendingTemplate] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Carregar sessão existente e preferências do localStorage
  useEffect(() => {
    const session = localStorage.getItem('resumetech_session');
    if (session) {
      try {
        const parsedUser = JSON.parse(session);
        const users = JSON.parse(localStorage.getItem('resumetech_users') || '[]');
        const latestUserData = users.find(u => u.id === parsedUser.id) || parsedUser;
        setCurrentUser(latestUserData);

        const savedActiveId = localStorage.getItem('resumetech_active_resume_id');
        const savedView = localStorage.getItem('resumetech_view');
        if (savedActiveId && latestUserData.resumes?.some(r => r.id === savedActiveId) && savedView === 'builder') {
          setActiveResumeId(savedActiveId);
          setCurrentView('builder');
        } else {
          setCurrentView('dashboard');
        }
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      }
    }
  }, []);

  // Monitorar tema e esquema de cores
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    localStorage.setItem('resumetech_theme', theme);
    localStorage.setItem('resumetech_scheme', colorScheme);
  }, [theme, colorScheme]);

  // Monitorar título e persistência de visualização
  useEffect(() => {
    localStorage.setItem('resumetech_view', currentView);
    if (currentView === 'builder') {
      document.title = 'Editando Currículo | RESUMETECH';
    } else if (currentView === 'dashboard') {
      document.title = 'Meu Painel de Currículos | RESUMETECH';
    } else {
      document.title = 'RESUMETECH | Criador de Currículos Profissionais';
    }
  }, [currentView]);

  const handleSetActiveResume = (id) => {
    setActiveResumeId(id);
    if (id) {
      localStorage.setItem('resumetech_active_resume_id', id);
    } else {
      localStorage.removeItem('resumetech_active_resume_id');
    }
  };

  const handleLoginSuccess = (user) => {
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

    if (pendingTemplate) {
      handleCreateResume(pendingTemplate, user);
      setPendingTemplate(null);
    } else {
      setCurrentView('dashboard');
    }
    showToast(`Bem-vindo, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleSetActiveResume(null);
    localStorage.removeItem('resumetech_session');
    localStorage.removeItem('resumetech_view');
    setCurrentView('landing');
    showToast('Você saiu da sua conta.');
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
  const handleCreateResume = (initialTemplate = 'modern', userTarget = currentUser) => {
    const target = userTarget || currentUser;
    if (!target) return;

    const newResume = {
      id: Date.now().toString(),
      title: `Currículo #${target.resumes.length + 1}`,
      name: target.name,
      email: target.email,
      phone: '',
      location: '',
      education: '',
      age: '',
      extraNotes: '',
      summary: '',
      experiences: [],
      skills: [],
      template: initialTemplate || 'modern',
      updatedAt: new Date().toISOString()
    };

    const updatedUser = {
      ...target,
      resumes: [...target.resumes, newResume]
    };
    updateUserInDatabase(updatedUser);
    handleSetActiveResume(newResume.id);
    setCurrentView('builder');
    showToast('Novo currículo criado!');
  };

  const handleEditResume = (id) => {
    handleSetActiveResume(id);
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
      if (activeResumeId === id) {
        handleSetActiveResume(null);
      }
      showToast('Currículo excluído com sucesso.');
    }
  };

  const handleSaveResume = (updatedResume) => {
    const updatedResumes = currentUser.resumes.map(r => r.id === updatedResume.id ? updatedResume : r);
    const updatedUser = {
      ...currentUser,
      resumes: updatedResumes
    };
    updateUserInDatabase(updatedUser);
    showToast('Currículo salvo com sucesso!');
  };

  const handleGetStarted = (templateId = null) => {
    if (templateId) {
      setPendingTemplate(templateId);
    }
    if (currentUser) {
      handleCreateResume(templateId);
    } else {
      setCurrentView('auth');
    }
  };

  const activeResume = currentUser?.resumes.find(r => r.id === activeResumeId);

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
      {/* Top Navbar Geral */}
      <nav className="global-navbar">
        <div className="container navbar-container">
          <div className="nav-brand" onClick={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}>
            <div className="nav-logo-icon">
              <LogoIcon size={18} />
            </div>
            <span className="brand-text">
              RESUME<strong style={{ color: 'var(--brand)' }}>TECH</strong>
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
                title="Tonalidade Violeta"
                aria-label="Tonalidade Violeta"
              />
              <button 
                className={`scheme-dot emerald ${colorScheme === 'emerald' ? 'active' : ''}`}
                onClick={() => setColorScheme('emerald')}
                title="Tonalidade Verde Esmeralda"
                aria-label="Tonalidade Verde Esmeralda"
              />
              <button 
                className={`scheme-dot sapphire ${colorScheme === 'sapphire' ? 'active' : ''}`}
                onClick={() => setColorScheme('sapphire')}
                title="Tonalidade Azul Safira"
                aria-label="Tonalidade Azul Safira"
              />
              <button 
                className={`scheme-dot gold ${colorScheme === 'gold' ? 'active' : ''}`}
                onClick={() => setColorScheme('gold')}
                title="Tonalidade Dourada"
                aria-label="Tonalidade Dourada"
              />
            </div>

            {/* Seletor de Tema Claro/Escuro */}
            <button 
              className="theme-toggle-btn" 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
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

      {/* Notificação Toast Flutuante */}
      {toast && (
        <aside className="toast-container" role="status" aria-live="polite" aria-atomic="true">
          <div className={`toast-item ${toast.type}`}>
            <CheckCircle2 size={18} />
            <span>{toast.message}</span>
          </div>
        </aside>
      )}

      {/* Conteúdo das Telas */}
      <main id="main-content" className="main-content-flow" tabIndex={-1}>
        {currentView === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        
        {currentView === 'auth' && (
          <Auth onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser}
            onLogout={handleLogout}
            onCreateResume={() => handleCreateResume()}
            onEditResume={handleEditResume}
            onDeleteResume={handleDeleteResume}
          />
        )}

        {currentView === 'builder' && currentUser && activeResume && (
          <ResumeBuilder 
            key={activeResume.id}
            resume={activeResume}
            userPlan="free"
            onSave={handleSaveResume}
            showToast={showToast}
            onBack={() => {
              handleSetActiveResume(null);
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
                  <LogoIcon size={16} />
                </div>
                <h3>RESUMETECH</h3>
              </div>
              <p>Plataforma 100% gratuita para criação de currículos profissionais de alta qualidade.</p>
            </div>
            <div className="footer-links-side">
              <span>© {new Date().getFullYear()} RESUMETECH. 100% Gratuito. Todos os direitos reservados.</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
