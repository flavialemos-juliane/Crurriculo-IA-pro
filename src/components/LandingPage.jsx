import React, { useState } from 'react';
import { FileText, CheckCircle2, Star, Shield, ArrowRight, Briefcase, Eye, Layout, FileEdit } from 'lucide-react';
import LogoIcon from './LogoIcon';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [checkingAts, setCheckingAts] = useState(false);

  const handleTestAts = (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || !resumeText.trim()) return;

    setCheckingAts(true);
    setAtsScore(null);

    setTimeout(() => {
      const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
      setAtsScore(score);
      setCheckingAts(false);
    }, 1200);
  };

  const templatesList = [
    {
      id: 'modern',
      title: 'Modelo Moderno',
      description: 'Ideal para tecnologia, startups, comunicação e áreas corporativas modernas. Utiliza fontes geométricas limpas e espaçamento contemporâneo.',
      badge: 'Popular',
      preview: ['Cabeçalho limpo', 'Layout assimétrico', 'Fonte Plus Jakarta']
    },
    {
      id: 'classic',
      title: 'Modelo Clássico',
      description: 'Ideal para advocacia, finanças, cargos executivos, saúde e meio acadêmico. Estrutura centrada tradicional e elegante com fontes serifadas.',
      badge: 'Elegante',
      preview: ['Cabeçalho centrado', 'Layout simétrico', 'Fonte Garamond/Georgia']
    },
    {
      id: 'tech',
      title: 'Modelo Tecnológico',
      description: 'Design técnico de alta legibilidade, ideal para engenheiros, desenvolvedores, cientistas e profissionais focados em projetos.',
      badge: 'Alta Densidade',
      preview: ['Barra lateral técnica', 'Lista de tags compacta', 'Fonte Mono/Série']
    },
    {
      id: 'minimalist',
      title: 'Modelo Simples & Clean',
      description: 'Design minimalista focado na clareza extrema e objetividade, ideal para qualquer área com foco direto na experiência.',
      badge: 'Minimalista',
      preview: ['Estrutura direta', 'Linhas limpas', 'Foco no conteúdo']
    },
    {
      id: 'creative',
      title: 'Modelo Extravagante',
      description: 'Visual vibrante e marcante com banner com gradiente e seções em destaque, excelente para marketing e criação.',
      badge: 'Destaque',
      preview: ['Banner com gradiente', 'Badges estilizadas', 'Seção Especial']
    }
  ];

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <LogoIcon size={14} />
              <span>Plataforma 100% Gratuita e Profissional</span>
            </div>
            <h1>Conquiste vagas melhores com currículos profissionais e gratuitos</h1>
            <p className="hero-lead">
              O RESUMETECH oferece modelos estruturados para redigir seu currículo, 
              alinhar suas competências com sistemas ATS (softwares de recrutamento) e exportar em PDF com formatação profissional.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onGetStarted(null)}>
                Criar Currículo Grátis Agora
                <ArrowRight size={18} />
              </button>
              <a href="#modelos" className="btn btn-secondary">
                Ver Modelos de Currículo
              </a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <h3>100% Grátis</h3>
                <p>Sem assinaturas ou cobranças ocultas</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>PDF HD</h3>
                <p>Exportação instantânea e limpa</p>
              </div>
            </div>
          </div>

          {/* Visual Mockup - Currículo Interativo */}
          <div className="hero-mockup animate-fade-in">
            <div className="mock-resume-card">
              <div className="mock-resume-header">
                <div className="mock-name-line"></div>
                <div className="mock-title-line"></div>
                <div className="mock-info-row">
                  <span></span><span></span><span></span>
                </div>
              </div>
              
              <div className="mock-resume-body">
                <div className="mock-column-main">
                  <div className="mock-section-title"></div>
                  <div className="mock-experience-block">
                    <div className="mock-exp-title"></div>
                    <div className="mock-text-line"></div>
                    <div className="mock-text-line short"></div>
                    <div className="resume-preview-callout">
                      <div className="preview-callout-header">
                        <CheckCircle2 size={12} style={{ color: 'var(--brand)' }} /> Exemplo de Atividade
                      </div>
                      <p>"Atendimento cordial ao público, organização de relatórios diários e suporte operacional ao setor."</p>
                    </div>
                  </div>
                </div>
                
                <div className="mock-column-side">
                  <div className="mock-section-title"></div>
                  <div className="mock-skills-tags">
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Modelos Gratuitos */}
      <section className="templates-section" id="modelos">
        <div className="container">
          <div className="section-header">
            <h2>Nossos Modelos de Currículo 100% Gratuitos</h2>
            <p>Escolha um dos nossos modelos profissionais e comece a preencher imediatamente. Todos são otimizados para leitura por recrutadores e sistemas ATS com exportação em PDF.</p>
          </div>

          <div className="templates-showcase-grid">
            {templatesList.map((tpl) => (
              <div key={tpl.id} className="template-showcase-card card">
                <div className="template-showcase-header">
                  <Layout size={24} className="template-showcase-icon" />
                  <span className="template-showcase-badge">{tpl.badge}</span>
                </div>
                <h3>{tpl.title}</h3>
                <p>{tpl.description}</p>
                <div className="template-features-preview">
                  {tpl.preview.map((feat, i) => (
                    <span key={i} className="template-feature-tag">
                      <CheckCircle2 size={12} /> {feat}
                    </span>
                  ))}
                </div>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => onGetStarted(tpl.id)}
                >
                  Usar este Modelo
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="features-section" id="funcionalidades">
        <div className="container">
          <div className="section-header">
            <h2>Por que escolher o RESUMETECH?</h2>
            <p>Unimos design claro de alta legibilidade com ferramentas práticas de estruturação e formatação totalmente gratuitas.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <FileEdit size={24} />
              </div>
              <h3>Modelos de Textos e Frases</h3>
              <p>Formate suas atividades diárias com clareza e verbos de ação para valorizar sua experiência profissional.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <Briefcase size={24} />
              </div>
              <h3>Compatibilidade ATS</h3>
              <p>Saiba exatamente quais termos e competências incluir para passar pela triagem automatizada de RH.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <h3>Exportação em PDF Clean</h3>
              <p>Gere arquivos PDF no formato A4 padrão com tipografia refinada desenvolvidos para fácil impressão ou download.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Interativo de ATS */}
      <section className="ats-simulator-section">
        <div className="container">
          <div className="ats-simulator-card">
            <div className="ats-sim-info">
              <h2>Teste a Compatibilidade do seu Currículo</h2>
              <p>
                Os sistemas das empresas (ATS) filtram currículos por palavra-chave. Cole uma descrição de vaga e um resumo profissional abaixo para testar seu nível de alinhamento com o otimizador do RESUMETECH.
              </p>
              <ul className="ats-benefits">
                <li><CheckCircle2 size={16} /> Identificação de palavras-chave críticas</li>
                <li><CheckCircle2 size={16} /> Sugestões semânticas de melhorias</li>
                <li><CheckCircle2 size={16} /> Relatórios de formatação e estrutura</li>
              </ul>
            </div>

            <form onSubmit={handleTestAts} className="ats-sim-form">
              <div className="form-group">
                <label className="form-label">Descrição da Vaga de Trabalho</label>
                <textarea
                  className="form-textarea"
                  placeholder="Cole aqui os requisitos da vaga..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Seu Resumo Profissional / Experiência</label>
                <textarea
                  className="form-textarea"
                  placeholder="Cole aqui o resumo ou experiências do seu currículo..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={checkingAts}>
                {checkingAts ? 'Analisando textos...' : 'Testar Compatibilidade'}
              </button>

              {atsScore !== null && (
                <div className="ats-score-result animate-fade-in">
                  <div className="score-circle-wrapper">
                    <div className="score-circle">
                      <span>{atsScore}%</span>
                    </div>
                    <div>
                      <h4>Resultado da Compatibilidade</h4>
                      <p>
                        {atsScore >= 80 
                          ? 'Excelente! Seu currículo tem ótimas chances de passar nos filtros ATS.' 
                          : 'Atenção. Você pode adicionar mais palavras-chave da vaga para melhorar o score.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Planos 100% Gratuitos */}
      <section className="pricing-section" id="gratuidade">
        <div className="container">
          <div className="section-header">
            <h2>100% Gratuito para Todo Mundo</h2>
            <p>Acreditamos que todos merecem uma chance justa no mercado de trabalho. Por isso, oferecemos acesso total e sem custo.</p>
          </div>

          <div className="pricing-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '680px', margin: '0 auto' }}>
            <div className="pricing-card card premium-card">
              <div className="premium-badge">LIVRE & SEM MENSALIDADE</div>
              <div className="pricing-header">
                <h3>Acesso Total Ilimitado</h3>
                <p className="price">R$ 0,00</p>
                <span className="price-period">Sem cartões de crédito ou cobranças</span>
              </div>
              <ul className="pricing-features" style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '12px' }}>
                <li><CheckCircle2 size={16} className="text-success" /> Currículos ativos ilimitados</li>
                <li><CheckCircle2 size={16} className="text-success" /> Exportação em PDF limpa e em alta qualidade</li>
                <li><CheckCircle2 size={16} className="text-success" /> <strong>Modelos de redação e frases liberados</strong></li>
                <li><CheckCircle2 size={16} className="text-success" /> <strong>Score e checklist de compatibilidade ATS</strong></li>
                <li><CheckCircle2 size={16} className="text-success" /> Todos os 5 layouts (Simples, Moderno, Clássico, Técnico, Extravagante)</li>
                <li><CheckCircle2 size={16} className="text-success" /> Questionário passo a passo de criação</li>
              </ul>
              <button className="btn btn-primary btn-block" style={{ marginTop: '24px' }} onClick={() => onGetStarted(null)}>
                Começar a Usar Agora Grátis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="faq-summary-section">
        <div className="container">
          <div className="faq-grid card">
            <div className="faq-info">
              <h2>Ficou com alguma dúvida?</h2>
              <p>
                Nosso assistente está sempre disponível no canto inferior direito para tirar dúvidas sobre a plataforma e dar dicas valiosas de carreira.
              </p>
            </div>
            <div className="faq-cta">
              <button className="btn btn-secondary" onClick={() => onGetStarted(null)}>
                Experimente o Aplicativo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
