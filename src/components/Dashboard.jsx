import React from 'react';
import { Plus, Edit2, Trash2, LogOut, FileText, Check, Award, Layout } from 'lucide-react';
import './Dashboard.css';

const TEMPLATE_NAMES = {
  modern: 'Moderno',
  classic: 'Clássico',
  tech: 'Técnico',
  minimalist: 'Simples',
  creative: 'Extravagante'
};

export default function Dashboard({ user, onLogout, onCreateResume, onEditResume, onDeleteResume }) {
  const resumeCount = user.resumes ? user.resumes.length : 0;

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
            <p>Seja bem-vindo ao seu painel profissional ({resumeCount} {resumeCount === 1 ? 'currículo ativo' : 'currículos ativos'}).</p>
          </div>
        </div>

        <div className="plan-badge-container">
          <div className="badge premium" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)' }}>
            <Award size={16} />
            <span>Acesso 100% Gratuito</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onLogout} aria-label="Sair da conta">
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
            <button className="btn btn-primary" onClick={onCreateResume} aria-label="Criar novo currículo">
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
                      <p style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span>Atualizado em: {new Date(resume.updatedAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                        {resume.template && (
                          <span className="badge" style={{ fontSize: '0.72rem', padding: '2px 6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <Layout size={10} style={{ marginRight: '3px' }} />
                            {TEMPLATE_NAMES[resume.template] || resume.template}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="resume-item-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditResume(resume.id)}
                      aria-label={`Editar currículo ${resume.title}`}
                    >
                      <Edit2 size={14} /> Editar
                    </button>
                    <button 
                      className="btn btn-accent btn-sm"
                      onClick={() => onDeleteResume(resume.id)}
                      aria-label={`Excluir currículo ${resume.title}`}
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
              <button className="btn btn-primary" onClick={onCreateResume}>
                Criar Primeiro Currículo
              </button>
            </div>
          )}
        </section>

        {/* Gerenciador de Status da Conta */}
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
                  <Check size={14} className="text-success" /> Otimização inteligente em 4 tons
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Análise e score de vagas (ATS)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> 5 Modelos profissionais completos
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Check size={14} className="text-success" /> Assistente de Carreira integrado
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
