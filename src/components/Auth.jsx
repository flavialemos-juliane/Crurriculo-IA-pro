import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import './Auth.css';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
        // Fluxo de Login
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          setSuccess('Login realizado com sucesso! Redirecionando...');
          setTimeout(() => {
            onLoginSuccess(user);
          }, 1000);
        } else {
          setError('E-mail ou senha incorretos.');
          setLoading(false);
        }
      } else {
        // Fluxo de Cadastro
        const userExists = users.some(u => u.email === email);
        if (userExists) {
          setError('Este endereço de e-mail já está cadastrado.');
          setLoading(false);
        } else {
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            plan: 'free', // plano padrão inicial
            resumes: []
          };
          users.push(newUser);
          localStorage.setItem('resumetech_users', JSON.stringify(users));
          
          setSuccess('Conta criada com sucesso! Redirecionando para o painel...');
          setTimeout(() => {
            onLoginSuccess(newUser);
          }, 1200);
        }
      }
    }, 1000);
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="nav-logo-icon" style={{ display: 'inline-flex', verticalAlign: 'middle', marginRight: '10px' }}>
              <Sparkles size={20} />
            </div>
            <h2 style={{ display: 'inline-block' }}>
              Currículo<span style={{ color: 'var(--brand)' }}>IA</span> <span className="brand-badge-pro">PRO</span>
            </h2>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Simplifique e otimize sua recolocação com IA 100% Grátis' : 'Junte-se à nova era de currículos inteligentes totalmente gratuitos'}
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

        {error && <div className="auth-alert alert-error">{error}</div>}
        {success && <div className="auth-alert alert-success">{success}</div>}

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
              />
            </div>
          </div>

          {isLogin ? (
            <div className="forgot-password">
              <a href="#recuperar" onClick={(e) => { e.preventDefault(); setError('Simulação: Link de redefinição enviado para seu e-mail.'); }}>Esqueceu a senha?</a>
            </div>
          ) : (
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
