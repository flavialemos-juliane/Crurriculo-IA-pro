import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CreditCard, LogOut, FileText, Check, AlertCircle, Award } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ user, onLogout, onCreateResume, onEditResume, onDeleteResume, onUpgradePlan, onDowngradePlan }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('monthly'); // 'monthly' ou 'yearly'
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    setPaymentLoading(true);

    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        onUpgradePlan(selectedCycle);
        setShowUpgradeModal(false);
        setPaymentSuccess(false);
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
      }, 1500);
    }, 1500);
  };

  const isPremium = user.plan === 'premium' || user.plan === 'premium_monthly' || user.plan === 'premium_yearly';
  const planLabel = user.plan === 'premium_yearly' ? 'Assinatura Premium Anual' : 
                    (user.plan === 'premium' || user.plan === 'premium_monthly' ? 'Assinatura Premium Mensal' : 'Plano Gratuito');

  return (
    <div className="dashboard-wrapper container animate-fade-in">
      {/* Top Banner / User Profiler */}
      <header className="dashboard-header card">
        <div className="user-profile-info">
          <div className="user-avatar-initials">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-details">
            <h2>Olá, {user.name}!</h2>
            <p>Seja bem-vindo ao seu painel profissional.</p>
          </div>
        </div>

        <div className="plan-badge-container">
          <div className="badge premium" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
            <Award size={16} />
            <span>Acesso 100% Gratuito</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Lista de Currículos */}
        <section className="resumes-section">
          <div className="section-title-row">
            <h3>Meus Currículos</h3>
            <button className="btn btn-primary" onClick={onCreateResume}>
              <Plus size={18} />
              Criar Novo
            </button>
          </div>

          {user.resumes && user.resumes.length > 0 ? (
            <div className="resumes-list">
              {user.resumes.map((resume) => (
                <div key={resume.id} className="resume-item card">
                  <div className="resume-item-main">
                    <div className="resume-icon-box">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4>{resume.title || 'Sem título'}</h4>
                      <p>Atualizado em: {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="resume-item-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditResume(resume.id)}
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button 
                      className="btn btn-accent btn-sm"
                      onClick={() => onDeleteResume(resume.id)}
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-resumes card">
              <FileText size={48} className="empty-icon" />
              <h4>Nenhum currículo criado ainda</h4>
              <p>Comece a construir seu currículo inteligente agora mesmo de forma rápida.</p>
              <button className="btn btn-secondary" onClick={onCreateResume}>
                Criar Primeiro Currículo
              </button>
            </div>
          )}
        </section>

        {/* Gerenciador de Assinatura */}
        <aside className="subscription-sidebar">
          <div className="card subscription-card">
            <h3>Status da Conta</h3>
            
            <div className="premium-sidebar-info">
              <div className="status-indicator success">
                <Check size={18} />
                <span>Acesso 100% Gratuito Liberado!</span>
              </div>
              <p className="sidebar-description">
                Sua conta possui acesso livre e completo a todas as ferramentas inteligentes de criação e otimização de currículos sem nenhum custo.
              </p>
              <ul className="mini-features" style={{ marginTop: '16px', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Exportação ilimitada em PDF
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Otimização de textos por IA
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Análise e score de vagas (ATS)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Currículos ativos ilimitados
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h3>{selectedCycle === 'yearly' ? 'Assinatura Premium Anual' : 'Assinatura Premium Mensal'}</h3>
              <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>✕</button>
            </div>
            
            {paymentSuccess ? (
              <div className="payment-success-view text-center">
                <div className="success-icon-check">
                  <Check size={36} />
                </div>
                <h4>Pagamento Aprovado!</h4>
                <p>Seja bem-vindo ao clube Premium. Suas ferramentas de IA e múltiplos layouts foram desbloqueados.</p>
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="payment-form">
                <div className="payment-summary">
                  <span>RESUMETECH Premium ({selectedCycle === 'yearly' ? 'Anual' : 'Mensal'})</span>
                  <strong>{selectedCycle === 'yearly' ? 'R$ 238,80 / ano' : 'R$ 29,90 / mês'}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Nome no Cartão</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="JOÃO SILVA" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Número do Cartão</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="0000 0000 0000 0000" 
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    required 
                  />
                </div>

                <div className="form-row-double">
                  <div className="form-group">
                    <label className="form-label">Validade</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="MM/AA" 
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC / CVV</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="123" 
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={paymentLoading}>
                  {paymentLoading ? 'Processando pagamento...' : 'Confirmar Assinatura'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
