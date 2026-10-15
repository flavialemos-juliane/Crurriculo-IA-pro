import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import LogoIcon from './LogoIcon';
import './Auth.css';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Carregar último login salvo ou primeiro da lista de logins salvos
  const getInitialCredentials = () => {
    try {
      const savedLast = localStorage.getItem('resumetech_last_login');
      if (savedLast) {
        const parsed = JSON.parse(savedLast);
        return { email: parsed.email || '', password: parsed.password || '' };
      }
      const savedList = JSON.parse(localStorage.getItem('resumetech_saved_logins') || '[]');
      if (savedList.length > 0) {
        return { email: savedList[0].email || '', password: savedList[0].password || '' };
      }
    } catch {
      // ignore
    }
    return { email: '', password: '' };
  };

  const initialCreds = getInitialCredentials();
  const [email, setEmail] = useState(initialCreds.email);
  const [password, setPassword] = useState(initialCreds.password);
  const [name, setName] = useState('');
  const [alwaysSaveLogin, setAlwaysSaveLogin] = useState(true);
  const [savedLogins, setSavedLogins] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resumetech_saved_logins') || '[]');
    } catch {
      return [];
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para salvar login na lista de contas salvas
  const saveLoginData = (userData) => {
    try {
      // Salvar credencial atual para preenchimento futuro
      localStorage.setItem('resumetech_last_login', JSON.stringify({
        email: userData.email,
        password: userData.password
      }));

      // Atualizar lista de logins salvos
      const existing = JSON.parse(localStorage.getItem('resumetech_saved_logins') || '[]');
      const filtered = existing.filter(item => item.email.toLowerCase() !== userData.email.toLowerCase());
      const updatedList = [
        {
          id: userData.id,
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          password: userData.password,
          savedAt: new Date().toLocaleDateString('pt-BR')
        },
        ...filtered
      ].slice(0, 5); // manter os 5 mais recentes

      localStorage.setItem('resumetech_saved_logins', JSON.stringify(updatedList));
      setSavedLogins(updatedList);
    } catch (err) {
      console.error('Erro ao salvar login:', err);
    }
  };

  const handleSelectSavedLogin = (savedItem) => {
    setEmail(savedItem.email);
    setPassword(savedItem.password || '');
    setError('');
    setSuccess(`Conta "${savedItem.email}" selecionada.`);
  };

  const handleRemoveSavedLogin = (e, emailToRemove) => {
    e.stopPropagation();
    const updated = savedLogins.filter(item => item.email !== emailToRemove);
    localStorage.setItem('resumetech_saved_logins', JSON.stringify(updated));
    setSavedLogins(updated);
    
    // Se o último login salvo for este, limpar
    try {
      const last = JSON.parse(localStorage.getItem('resumetech_last_login') || '{}');
      if (last.email === emailToRemove) {
        localStorage.removeItem('resumetech_last_login');
      }
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Obter usuários cadastrados localmente
      const users = JSON.parse(localStorage.getItem('resumetech_users') || '[]');

      if (isLogin) {
        // Fluxo de Login: Sempre salvar o login e permitir acesso contínuo
        let user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        
        if (!user) {
          // Se o usuário ainda não foi cadastrado, cria automaticamente para NUNCA barrar o login
          const generatedName = email.split('@')[0];
          const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
          user = {
            id: Date.now().toString(),
            name: formattedName,
            email: email.trim(),
            password: password,
            plan: 'free',
            resumes: []
          };
          users.push(user);
          localStorage.setItem('resumetech_users', JSON.stringify(users));
        } else {
          // Atualizar senha se necessário
          user.password = password;
          const userIdx = users.findIndex(u => u.id === user.id);
          if (userIdx !== -1) {
            users[userIdx] = user;
            localStorage.setItem('resumetech_users', JSON.stringify(users));
          }
        }

        // Sempre salvar os dados de login no dispositivo
        if (alwaysSaveLogin) {
          saveLoginData(user);
        }

        setSuccess('Login realizado com sucesso! Dados salvos neste dispositivo.');
        setTimeout(() => {
          onLoginSuccess(user);
        }, 900);
      } else {
        // Fluxo de Cadastro
        let user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (user) {
          user.name = name;
          user.password = password;
          localStorage.setItem('resumetech_users', JSON.stringify(users));
        } else {
          user = {
            id: Date.now().toString(),
            name,
            email: email.trim(),
            password,
            plan: 'free',
            resumes: []
          };
          users.push(user);
          localStorage.setItem('resumetech_users', JSON.stringify(users));
        }

        if (alwaysSaveLogin) {
          saveLoginData(user);
        }

        setSuccess('Conta criada e salva com sucesso! Redirecionando...');
        setTimeout(() => {
          onLoginSuccess(user);
        }, 900);
      }
    }, 600);
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="nav-logo-icon" style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '10px' }}>
              <LogoIcon size={20} />
            </div>
            <h2 style={{ display: 'inline-block' }}>
              RESUME<span style={{ color: 'var(--brand)' }}>TECH</span>
            </h2>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Simplifique e otimize sua recolocação 100% Grátis' : 'Junte-se à nova era de currículos inteligentes totalmente gratuitos'}
          </p>
        </div>

        {/* Abas Alternadoras */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Criar Conta
          </button>
        </div>

        {error && <div className="auth-alert alert-error" role="alert">{error}</div>}
        {success && <div className="auth-alert alert-success" role="status">{success}</div>}

        {/* Seção de Contas e Logins Salvos */}
        {isLogin && savedLogins.length > 0 && (
          <div className="saved-logins-section">
            <div className="saved-logins-header">
              <span className="saved-logins-title">
                <CheckCircle size={14} style={{ color: 'var(--brand)' }} /> Logins Salvos neste Aparelho:
              </span>
            </div>
            <div className="saved-logins-list">
              {savedLogins.map((item) => (
                <div 
                  key={item.email} 
                  className={`saved-login-chip ${email.toLowerCase() === item.email.toLowerCase() ? 'active' : ''}`}
                  onClick={() => handleSelectSavedLogin(item)}
                  title={`Clique para selecionar ${item.email}`}
                >
                  <div className="saved-login-info">
                    <span className="saved-login-name">{item.name || item.email.split('@')[0]}</span>
                    <span className="saved-login-email">{item.email}</span>
                  </div>
                  <button 
                    type="button" 
                    className="saved-login-remove" 
                    onClick={(e) => handleRemoveSavedLogin(e, item.email)}
                    title="Remover este login salvo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nome completo"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Endereço de E-mail</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Endereço de e-mail"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Senha"
              />
            </div>
          </div>

          {/* Opção de sempre salvar login */}
          <div className="save-login-option">
            <label className="save-login-label">
              <input 
                type="checkbox" 
                checked={alwaysSaveLogin} 
                onChange={(e) => setAlwaysSaveLogin(e.target.checked)} 
              />
              <span>Sempre salvar login neste dispositivo</span>
            </label>
            {isLogin && (
              <a 
                href="#recuperar" 
                className="forgot-link" 
                onClick={(e) => { e.preventDefault(); setError('Simulação: Link de redefinição enviado para seu e-mail.'); }}
              >
                Esqueceu a senha?
              </a>
            )}
          </div>

          {!isLogin && (
            <div className="terms-checkbox">
              <input type="checkbox" id="terms" defaultChecked required />
              <label htmlFor="terms">
                Aceito os <a href="#termos" onClick={(e) => e.preventDefault()}>Termos de Serviço</a> e a <a href="#privacidade" onClick={(e) => e.preventDefault()}>Política de Privacidade</a>.
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="spinner">Aguarde...</span>
            ) : (
              <>
                {isLogin ? 'Entrar na Plataforma' : 'Criar minha Conta'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="security-badge">
            <ShieldCheck size={14} />
            <span>Ambiente seguro e criptografado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
