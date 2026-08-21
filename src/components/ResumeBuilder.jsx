import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  ArrowLeft, Save, Download, Sparkles, Plus, Trash2, HelpCircle, Key, Layout, 
  CheckCircle, ChevronRight, User, ShieldCheck, FileCheck, Wand2, Sliders, 
  ChevronDown, ChevronUp, Copy, Check, FileText, Award, Briefcase, Printer
} from 'lucide-react';
import './ResumeBuilder.css';

// Sugestões de IA por Tom
const AI_TONE_SUGGESTIONS = {
  executive: {
    label: '👑 Executivo / Gestão',
    summary: 'Executivo(a) sênior orientado a resultados com vasta experiência em gestão estratégica, governança de processos e otimização operacional. Histórico comprovado de liderança de equipes de alta performance, expansão de receitas e implementação de soluções de alto impacto corporativo.',
    experience: 'Liderei iniciativas estratégicas de otimização operacional, gerenciando recursos multifuncionais e entregando aumento de 32% no ROI departamental com redução de custos em tempo recorde.'
  },
  tech: {
    label: '⚡ Técnico / Especialista',
    summary: 'Especialista técnico focado em desenvolvimento de arquiteturas escaláveis, automação de processos e implementação de melhores práticas (Clean Code, CI/CD). Sólido domínio em análises estruturadas e metodologias ágeis.',
    experience: 'Desenvolvi e mantive sistemas críticos de alta disponibilidade, reduzindo a latência de chamadas em 40% e garantindo cobertura de testes automatizados em 90%+.'
  },
  concise: {
    label: '🎯 Direto / Objetivo',
    summary: 'Profissional altamente focado e disciplinado, especialista no cumprimento ágil de metas operacionais e entregas de alta qualidade.',
    experience: 'Gestão direta de fluxos operacionais e atendimento de demandas críticas, garantindo cumprimento de prazos com 100% de precisão nos indicadores de qualidade.'
  },
  creative: {
    label: '💡 Criativo / Inovador',
    summary: 'Profissional inovador e apaixonado por transformar desafios complexos em soluções simples e experiências memoráveis por meio do pensamento sistêmico.',
    experience: 'Idealizei e executei campanhas interativas que elevaram o engajamento do público em 50% e posicionaram os produtos como referência no segmento.'
  }
};

const SKILL_BUNDLES = [
  { label: '💻 Tecnologia & Dev', skills: ['React.js', 'Node.js', 'TypeScript', 'Git & GitHub', 'SQL', 'APIs RESTful', 'Docker', 'Scrum'] },
  { label: '🎨 Design & Produto', skills: ['Figma', 'UI/UX Design', 'Design System', 'Wireframing', 'Adobe Photoshop', 'Prototipagem'] },
  { label: '📊 Gestão & Negócios', skills: ['Gestão de Projetos', 'Negociação', 'Análise de KPIs', 'Liderança', 'Power BI', 'Planejamento Estratégico'] },
  { label: '🎯 Vendas & Marketing', skills: ['Vendas B2B', 'CRM Salesforce', 'Prospecção Ativa', 'Inbound Marketing', 'Customer Success', 'Pitch de Vendas'] }
];

const PREDEFINED_QUALITIES = [
  'Liderança de Equipes',
  'Comunicação Assertiva',
  'Trabalho em Equipe',
  'Resolução de Problemas',
  'Organização & Foco',
  'Criatividade',
  'Proatividade',
  'Adaptabilidade',
  'Pensamento Crítico',
  'Gestão do Tempo'
];

export default function ResumeBuilder({ resume, onSave, onBack, userPlan, onTriggerUpgrade }) {
  // Estado do Wizard (Questionário Inicial)
  // Mostrar apenas se o currículo estiver completamente vazio (ou for novo)
  const [showWizard, setShowWizard] = useState(
    !resume.name && !resume.summary && resume.experiences.length === 0 && resume.skills.length <= 1
  );
  const [wizardStep, setWizardStep] = useState(1);
  const [wizPronoun, setWizPronoun] = useState('');
  const [wizSeniority, setWizSeniority] = useState('');
  const [wizObjective, setWizObjective] = useState('');
  const [wizQualities, setWizQualities] = useState([]);

  // Estados principais do currículo
  const [activeTab, setActiveTab] = useState('profile');
  const [title, setTitle] = useState(resume.title || 'Meu Currículo Inteligente');
  const [name, setName] = useState(resume.name || '');
  const [email, setEmail] = useState(resume.email || '');
  const [phone, setPhone] = useState(resume.phone || '');
  const [location, setLocation] = useState(resume.location || '');
  const [education, setEducation] = useState(resume.education || '');
  const [age, setAge] = useState(resume.age || '');
  const [extraNotes, setExtraNotes] = useState(resume.extraNotes || '');
  const [summary, setSummary] = useState(resume.summary || '');
  const [experiences, setExperiences] = useState(resume.experiences || []);
  const [skills, setSkills] = useState(resume.skills || []);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern', 'classic', 'tech'

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiTargetField, setAiTargetField] = useState(null);
  const [selectedTone, setSelectedTone] = useState('executive'); // 'executive', 'tech', 'concise', 'creative'
  const [showAtsDrawer, setShowAtsDrawer] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Cálculo Dinâmico de Pontuação ATS
  const calculateAtsScore = () => {
    let score = 0;
    const checks = [];

    if (name.trim().length > 3) {
      score += 15;
      checks.push({ text: 'Nome completo configurado', passed: true });
    } else {
      checks.push({ text: 'Informe seu nome completo (+15%)', passed: false });
    }

    if (email.trim().includes('@') && phone.trim().length >= 8) {
      score += 15;
      checks.push({ text: 'E-mail e telefone de contato informados', passed: true });
    } else {
      checks.push({ text: 'Adicione e-mail e telefone (+15%)', passed: false });
    }

    if (summary.trim().length >= 35) {
      score += 25;
      checks.push({ text: 'Resumo profissional consistente (>35 caracteres)', passed: true });
    } else {
      checks.push({ text: 'Amplie o resumo profissional (+25%)', passed: false });
    }

    if (experiences.length >= 1 && experiences.some(e => e.description.trim().length > 15)) {
      score += 25;
      checks.push({ text: 'Experiência cadastrada com descrição', passed: true });
    } else {
      checks.push({ text: 'Cadastre ao menos 1 experiência com descrição (+25%)', passed: false });
    }

    if (skills.length >= 4) {
      score += 20;
      checks.push({ text: 'Adicionadas 4 ou mais competências-chave', passed: true });
    } else {
      checks.push({ text: 'Adicione pelo menos 4 competências (+20%)', passed: false });
    }

    return { score, checks };
  };

  const atsAudit = calculateAtsScore();

  // Motor Dinâmico de IA que Analisa e Reescreve o Texto Digitado pelo Cliente
  const generateSmartRewrittenText = (field, rawText, tone, skillsList = [], jobTitle = '', expRole = '', expCompany = '') => {
    const cleanInput = (rawText || '').trim();
    const lowerInput = cleanInput.toLowerCase();
    const skillsText = skillsList.length > 0 ? skillsList.slice(0, 4).join(', ') : 'competências-chave da área';
    const areaTitle = expRole || (jobTitle ? jobTitle.replace(/^Currículo:\s*/i, '') : 'sua área de atuação');
    const companyText = expCompany ? ` na empresa ${expCompany}` : '';

    // Identificação inteligente de palavras-chave e contexto do cliente
    let detectedDomain = '';
    if (lowerInput.includes('atend') || lowerInput.includes('client') || lowerInput.includes('suporte') || lowerInput.includes('sac')) {
      detectedDomain = 'atendimento ao cliente, suporte operacional e excelência em relacionamento';
    } else if (lowerInput.includes('venda') || lowerInput.includes('comercial') || lowerInput.includes('negocia') || lowerInput.includes('metas')) {
      detectedDomain = 'vendas diretas, negociação comercial e prospecção estratégica de contas';
    } else if (lowerInput.includes('desenvolv') || lowerInput.includes('program') || lowerInput.includes('sistem') || lowerInput.includes('código') || lowerInput.includes('react') || lowerInput.includes('web') || lowerInput.includes('tech')) {
      detectedDomain = 'desenvolvimento de software, arquitetura de sistemas e boas práticas de programação';
    } else if (lowerInput.includes('design') || lowerInput.includes('figma') || lowerInput.includes('ux') || lowerInput.includes('ui') || lowerInput.includes('layout')) {
      detectedDomain = 'design de interfaces (UI/UX), prototipagem e construção de experiências digitais centrais no usuário';
    } else if (lowerInput.includes('projet') || lowerInput.includes('gestão') || lowerInput.includes('equipe') || lowerInput.includes('lideran') || lowerInput.includes('gerenc')) {
      detectedDomain = 'gestão de projetos, liderança de equipes multifuncionais e otimização de processos corporativos';
    } else if (lowerInput.includes('finan') || lowerInput.includes('contáb') || lowerInput.includes('relat') || lowerInput.includes('custo') || lowerInput.includes('caixa')) {
      detectedDomain = 'análise financeira, controle orçamentário e elaboração de relatórios gerenciais para tomada de decisão';
    } else if (cleanInput.length > 15) {
      detectedDomain = cleanInput.replace(/^(eu|trabalhei|faço|fazia|sou|atuo)\s+/i, '');
    } else {
      detectedDomain = areaTitle;
    }

    if (field === 'summary') {
      if (cleanInput.length >= 10) {
        switch (tone) {
          case 'executive':
            return `Profissional orientado(a) a resultados com sólida bagagem em ${detectedDomain}. A partir de atuação prática focada em ${cleanInput.toLowerCase()}, destaca-se pela liderança de rotinas operacionais, aplicação estratégica de ${skillsText} e implementação de processos que otimizam entregas e agregam valor corporativo.`;
          case 'tech':
            return `Especialista técnico(a) com consistente histórico de execução em ${detectedDomain}. Com experiência direta em "${cleanInput}", atua com foco em rigor metodológico, utilização de ${skillsText} e automação de fluxos para garantir entregas de alta qualidade e performance.`;
          case 'concise':
            return `Profissional focado(a) e objetivo(a) com experiência direta em ${cleanInput.toLowerCase()}. Competência comprovada em ${skillsText}, resolução ágil de problemas operacionais e cumprimento rigoroso de metas estabelecidas.`;
          case 'creative':
            return `Profissional inovador(a) com visão estratégica aplicada a ${detectedDomain}. Destaque em transformar a rotina de ${cleanInput.toLowerCase()} através do uso inteligente de ${skillsText}, comunicação assertiva e forte engajamento em equipes colaborativas.`;
          default:
            return `Profissional qualificado(a) com sólida atuação em ${cleanInput.toLowerCase()}. Especialista em ${skillsText} com foco em alta produtividade, otimização de tempo e entrega contínua de valor.`;
        }
      } else {
        return `Profissional qualificado(a) e motivado(a) com foco de atuação em ${areaTitle}. Possui competências consolidadas em ${skillsText}, destacando-se pela capacidade de aprendizado rápido, organização estruturada e colaboração ativa em equipes de alta performance.`;
      }
    } else {
      // Para Experiências Profissionais (descrição digitada)
      if (cleanInput.length >= 10) {
        switch (tone) {
          case 'executive':
            return `• Liderança e execução de atividades estratégicas como ${areaTitle}${companyText}, focando em ${cleanInput.toLowerCase()}.\n• Otimização de fluxos de trabalho com aplicação de ${skillsText}, aumentando a produtividade da área em 30%.\n• Acompanhamento contínuo de KPIs e suporte gerencial na resolução de problemas operacionais.`;
          case 'tech':
            return `• Atuação técnica especializada na função de ${areaTitle}${companyText}, sendo responsável por ${cleanInput.toLowerCase()}.\n• Aplicação de ${skillsText} na solução de demandas complexas, garantindo alta precisão e redução de falhas em 35%.\n• Automação de processos operacionais e integração ágil com a equipe.`;
          case 'concise':
            return `• Atuação direta como ${areaTitle}${companyText}, com foco no desenvolvimento de ${cleanInput.toLowerCase()}.\n• Cumprimento de metas estabelecidas com base em ${skillsText} e entregas dentro dos prazos.\n• Resolução rápida de pendências e suporte contínuo às demandas operacionais.`;
          case 'creative':
            return `• Atuação inovadora como ${areaTitle}${companyText}, redesenhando os processos de ${cleanInput.toLowerCase()}.\n• Introdução de melhores práticas com ${skillsText}, elevando o engajamento e a qualidade das entregas em +40%.\n• Comunicação assertiva e forte colaboração com parceiros e clientes estratégicos.`;
          default:
            return `• Execução diária de atividades como ${areaTitle}${companyText}, com foco em ${cleanInput.toLowerCase()}.\n• Aplicação de ${skillsText} para otimização de tempo e garantia dos padrões de qualidade da empresa.`;
        }
      } else {
        return `• Atuação na função de ${areaTitle}${companyText}, gerenciando rotinas operacionais e entregas prioritárias.\n• Aplicação direta de ${skillsText} para garantia de eficiência e cumprimento de metas departamentais.\n• Elaboração de relatórios de acompanhamento e colaboração ativa em equipe.`;
      }
    }
  };

  // Simulação de Otimização por IA baseada na Descrição do Cliente
  const handleImproveWithAi = (field, currentText, expId = null, toneOverride = selectedTone, expRole = '', expCompany = '') => {
    setAiGenerating(true);
    setAiTargetField(expId ? { type: 'experience', id: expId } : { type: 'summary' });
    setAiSuggestion('');

    setTimeout(() => {
      const resultText = generateSmartRewrittenText(field, currentText, toneOverride, skills, title, expRole, expCompany);
      setAiSuggestion(resultText);
      setAiGenerating(false);
    }, 1100);
  };

  // Gerar Carta de Apresentação com IA
  const handleGenerateCoverLetter = () => {
    setShowCoverLetterModal(true);
    setCoverLetterText('Gerando sua Carta de Apresentação Personalizada...');

    setTimeout(() => {
      const generatedLetter = `Prezada Equipe de Recrutamento e Seleção,

Escrevo para demonstrar meu forte interesse nas oportunidades da sua organização. Com base na minha jornada como ${title.replace('Currículo: ', '') || 'Profissional da área'}, construí uma trajetória fundamentada em resultados concretos, eficiência operacional e constante evolução técnica.

No meu histórico recente, atuei com foco em ${skills.slice(0, 3).join(', ') || 'competências estratégicas'}, onde pude contribuir diretamente para o alcance de metas desafiadoras e resolução ágil de problemas.

Acredito que meu perfil e competências em ${skills.slice(3, 6).join(', ') || 'trabalho em equipe e comunicação'} estão alinhados aos valores e objetivos da empresa. Estou à disposição para agendarmos uma entrevista onde poderei detalhar minhas conquistas.

Atenciosamente,
${name || 'Candidato(a)'}
${email ? `E-mail: ${email}` : ''} ${phone ? `| Tel: ${phone}` : ''}`;

      setCoverLetterText(generatedLetter);
    }, 1000);
  };

  const handleApplyAiSuggestion = () => {
    if (aiTargetField.type === 'summary') {
      setSummary(aiSuggestion);
    } else if (aiTargetField.type === 'experience') {
      handleUpdateExperience(aiTargetField.id, 'description', aiSuggestion);
    }
    setAiSuggestion('');
    setAiTargetField(null);
  };

  // Handlers do Wizard
  const handleToggleQuality = (quality) => {
    if (wizQualities.includes(quality)) {
      setWizQualities(wizQualities.filter(q => q !== quality));
    } else {
      if (wizQualities.length < 5) {
        setWizQualities([...wizQualities, quality]);
      }
    }
  };

  const handleCompleteWizard = () => {
    if (wizObjective.trim()) {
      setTitle(`Currículo: ${wizObjective.trim()}`);
    }

    const generatedSummary = generateSmartRewrittenText(
      'summary',
      wizObjective ? `Objetivo de carreira como ${wizObjective}` : '',
      selectedTone,
      wizQualities,
      wizObjective
    );

    setSummary(generatedSummary);

    if (wizQualities.length > 0) {
      setSkills(prev => Array.from(new Set([...prev, ...wizQualities])));
    }

    setShowWizard(false);
  };

  // Handlers de Experiências Profissionais
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      role: '',
      company: '',
      period: '',
      description: ''
    };
    setExperiences(prev => [...prev, newExp]);
  };

  const handleRemoveExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const handleUpdateExperience = (id, field, value) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    }));
  };

  // Handlers de Habilidades / Competências
  const handleAddSkill = (skillName) => {
    const trimmed = skillName ? skillName.trim() : '';
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = () => {
    const updatedResume = {
      ...resume,
      title,
      name,
      email,
      phone,
      location,
      education,
      age,
      extraNotes,
      summary,
      experiences,
      skills,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedResume);
  };

  const handleExportPdf = () => {
    const element = document.getElementById('resume-document-to-print');
    if (!element) {
      window.print();
      return;
    }

    setIsExportingPdf(true);
    const cleanName = name ? name.trim().replace(/\s+/g, '_') : 'Curriculo';

    const opt = {
      margin:       0,
      filename:     `${cleanName}_Curriculo.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsExportingPdf(false);
    }).catch((err) => {
      console.warn('Fallback para janela de impressão nativa:', err);
      setIsExportingPdf(false);
      const originalTitle = document.title;
      document.title = `${cleanName}_Curriculo.pdf`;
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    });
  };

  const handlePrintWindow = () => {
    const originalTitle = document.title;
    const cleanName = name ? name.trim().replace(/\s+/g, '_') : 'Curriculo';
    document.title = `${cleanName}_Curriculo.pdf`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="builder-wrapper animate-fade-in">
      {/* ----------------- TELA DO WIZARD (Questionário) ----------------- */}
      {showWizard && (
        <div className="wizard-overlay">
          <div className="wizard-card card animate-fade-in">
            <div className="wizard-header">
              <span className="wizard-step-indicator">Passo {wizardStep} de 4</span>
              <h2>Currículo Personalizado com IA</h2>
              <p>Responda algumas perguntas rápidas para que nossa inteligência crie a base perfeita para você.</p>
              <div className="wizard-progress-bar">
                <div className="progress-fill" style={{ width: `${(wizardStep / 4) * 100}%` }}></div>
              </div>
            </div>

            <div className="wizard-body">
              {/* Passo 1: Identificação */}
              {wizardStep === 1 && (
                <div className="wizard-step-content text-left">
                  <h3>Como você se identifica no ambiente profissional?</h3>
                  
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">Pronomes de Preferência</label>
                    <div className="wizard-options-grid">
                      <button 
                        className={`wiz-option-btn ${wizPronoun === 'ele' ? 'active' : ''}`}
                        onClick={() => setWizPronoun('ele')}
                      >
                        Ele/Dele
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizPronoun === 'ela' ? 'active' : ''}`}
                        onClick={() => setWizPronoun('ela')}
                      >
                        Ela/Dela
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizPronoun === 'neutro' ? 'active' : ''}`}
                        onClick={() => setWizPronoun('neutro')}
                      >
                        Elu/Delu (Neutro)
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizPronoun === 'outro' ? 'active' : ''}`}
                        onClick={() => setWizPronoun('outro')}
                      >
                        Não informar
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '24px' }}>
                    <label className="form-label">Nível de Senioridade</label>
                    <div className="wizard-options-grid">
                      <button 
                        className={`wiz-option-btn ${wizSeniority === 'estagio' ? 'active' : ''}`}
                        onClick={() => setWizSeniority('estagio')}
                      >
                        Estágio / Trainee
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizSeniority === 'junior' ? 'active' : ''}`}
                        onClick={() => setWizSeniority('junior')}
                      >
                        Júnior
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizSeniority === 'pleno' ? 'active' : ''}`}
                        onClick={() => setWizSeniority('pleno')}
                      >
                        Pleno
                      </button>
                      <button 
                        className={`wiz-option-btn ${wizSeniority === 'senior' ? 'active' : ''}`}
                        onClick={() => setWizSeniority('senior')}
                      >
                        Sênior
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Passo 2: Objetivo */}
              {wizardStep === 2 && (
                <div className="wizard-step-content text-left">
                  <h3>Qual o seu cargo desejado ou objetivo de carreira?</h3>
                  <p className="field-help-text" style={{ marginBottom: '16px' }}>Exemplo: Desenvolvedor Front-end, Gerente de Projetos, Assistente Administrativo.</p>
                  
                  <div className="form-group">
                    <label className="form-label">Objetivo Profissional</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Designer UX/UI Sênior" 
                      value={wizObjective}
                      onChange={(e) => setWizObjective(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Passo 3: Qualidades / Strengths */}
              {wizardStep === 3 && (
                <div className="wizard-step-content text-left">
                  <h3>Selecione suas principais qualidades profissionais (Máximo 5)</h3>
                  <p className="field-help-text" style={{ marginBottom: '16px' }}>Esses atributos serão destacados estrategicamente no seu perfil.</p>
                  
                  <div className="qualities-selector-box">
                    {PREDEFINED_QUALITIES.map((q) => (
                      <button 
                        key={q}
                        className={`quality-badge-btn ${wizQualities.includes(q) ? 'selected' : ''}`}
                        onClick={() => handleToggleQuality(q)}
                      >
                        {wizQualities.includes(q) && <CheckCircle size={12} />}
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Passo 4: Geração */}
              {wizardStep === 4 && (
                <div className="wizard-step-content text-center">
                  <div className="wizard-success-logo">
                    <Sparkles size={40} className="text-warning" />
                  </div>
                  <h3>Tudo pronto para a IA estruturar seu perfil!</h3>
                  <p style={{ maxWidth: '440px', margin: '12px auto 24px', fontSize: '0.9rem' }}>
                    Nosso otimizador criará o seu Resumo Profissional e listará suas Competências automaticamente. Você poderá editar cada detalhe a seguir.
                  </p>
                </div>
              )}
            </div>

            <div className="wizard-footer">
              {wizardStep > 1 ? (
                <button className="btn btn-secondary" onClick={() => setWizardStep(wizardStep - 1)}>
                  Voltar
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={() => setShowWizard(false)}>
                  Pular Questionário
                </button>
              )}

              {wizardStep < 4 ? (
                <button 
                  className="btn btn-primary" 
                  disabled={wizardStep === 2 && !wizObjective.trim()} 
                  onClick={() => setWizardStep(wizardStep + 1)}
                >
                  Continuar <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleCompleteWizard}>
                  Gerar Currículo Otimizado
                  <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CONSTRUTOR DE CURRÍCULO PRINCIPAL ----------------- */}
      <header className="builder-topbar">
        <div className="topbar-left">
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            <ArrowLeft size={16} /> Painel
          </button>
          <input 
            type="text" 
            className="builder-title-input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div className="topbar-right">
          {/* Badge de Auditoria ATS Dinâmica */}
          <button 
            className={`ats-score-badge ${atsAudit.score >= 80 ? 'high' : atsAudit.score >= 50 ? 'medium' : 'low'}`}
            onClick={() => setShowAtsDrawer(!showAtsDrawer)}
            title="Clique para ver o diagnóstico de compatibilidade com robôs ATS"
          >
            <ShieldCheck size={16} />
            <span>ATS: {atsAudit.score}%</span>
            {showAtsDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handleGenerateCoverLetter}>
            <FileText size={15} /> Carta de Apresentação
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handleSave}>
            <Save size={15} /> Salvar
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handlePrintWindow} title="Abrir janela de impressão do navegador">
            <Printer size={15} /> Imprimir
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            title="Baixar arquivo PDF direto no seu computador"
          >
            <Download size={15} /> {isExportingPdf ? 'Gerando PDF...' : 'Baixar PDF'}
          </button>
        </div>
      </header>

      {/* Painel Expansível de Diagnóstico ATS */}
      {showAtsDrawer && (
        <div className="ats-audit-drawer card animate-fade-in">
          <div className="ats-drawer-header">
            <div>
              <h4>📊 Auditoria de Compatibilidade com Sistemas ATS</h4>
              <p>Sua pontuação atual é de <strong>{atsAudit.score}%</strong>. Confira o checklist automático:</p>
            </div>
            <button className="close-drawer-btn" onClick={() => setShowAtsDrawer(false)}>✕</button>
          </div>
          <div className="ats-checks-grid">
            {atsAudit.checks.map((c, i) => (
              <div key={i} className={`ats-check-item ${c.passed ? 'passed' : 'failed'}`}>
                {c.passed ? <CheckCircle size={15} color="var(--success)" /> : <HelpCircle size={15} color="var(--warning)" />}
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Carta de Apresentação */}
      {showCoverLetterModal && (
        <div className="wizard-overlay">
          <div className="cover-letter-modal card animate-fade-in">
            <div className="wizard-header">
              <h3>✉️ Carta de Apresentação Gerada por IA</h3>
              <p>Personalizada com base nas suas qualificações e no título do currículo.</p>
            </div>
            <div className="cover-letter-body">
              <textarea 
                className="form-textarea cover-textarea"
                rows={10}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
              />
            </div>
            <div className="wizard-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(coverLetterText);
                  alert('Carta de apresentação copiada para a área de transferência!');
                }}
              >
                <Copy size={16} /> Copiar Texto
              </button>
              <button className="btn btn-primary" onClick={() => setShowCoverLetterModal(false)}>
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="builder-layout">
        {/* Formulário - Painel Esquerdo */}
        <div className="builder-form-panel card">
          {/* Navegação Interna */}
          <div className="builder-tabs">
            <button 
              className={`builder-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Dados Pessoais
            </button>
            <button 
              className={`builder-tab ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Sobre
            </button>
            <button 
              className={`builder-tab ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => setActiveTab('experiences')}
            >
              Experiências
            </button>
            <button 
              className={`builder-tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Competências
            </button>
          </div>

          <div className="builder-tab-content">
            {/* Aba Dados Pessoais */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Ana Maria da Silva" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Ex: ana.silva@exemplo.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="form-row-double">
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: (11) 98765-4321" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cidade/UF</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: São Paulo - SP" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-row-double">
                  <div className="form-group">
                    <label className="form-label">Escolaridade / Formação</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Ensino Superior Completo, Pós-Graduação..." 
                      value={education} 
                      onChange={(e) => setEducation(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Idade / Data Nasc.</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: 28 anos ou 15/04/1995" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Observações / Informações Especiais</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    placeholder="Ex: Disponibilidade para viagens, CNH B, habilitação profissional ou diferenciais..." 
                    value={extraNotes} 
                    onChange={(e) => setExtraNotes(e.target.value)} 
                  ></textarea>
                  <p className="field-help-text" style={{ marginTop: '4px' }}>
                    Estes detalhes serão exibidos em destaque (seção ESPECIAL) no seu currículo.
                  </p>
                </div>
              </div>
            )}

            {/* Aba Sobre */}
            {activeTab === 'summary' && (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Sobre</label>
                  <textarea 
                    className="form-textarea summary-textarea" 
                    placeholder="Escreva brevemente sobre sua jornada profissional, principais conquistas e diferenciais..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  ></textarea>
                  <p className="field-help-text" style={{ marginTop: '8px' }}>
                    Apresente uma síntese clara das suas qualificações, anos de experiência e diferenciais profissionais.
                  </p>
                </div>
              </div>
            )}

            {/* Aba Experiências */}
            {activeTab === 'experiences' && (
              <div className="animate-fade-in experiences-list-builder">
                {/* Header Explicativo e Modelos Rápidos */}
                <div className="exp-section-intro card" style={{ marginBottom: '16px', background: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', margin: 0 }}>💼 Minhas Experiências Profissionais</h4>
                      <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}>Cadastre os cargos anteriores. Utilize nossa IA integrada para estruturar suas conquistas com verbos de ação.</p>
                    </div>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleAddExperience}
                    >
                      <Plus size={14} /> Nova Experiência
                    </button>
                  </div>

                  {/* Atalhos de Exemplo */}
                  <div className="quick-exp-templates" style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>💡 Exemplo Rápido:</span>
                    <button 
                      className="bundle-skill-btn"
                      onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: 'Desenvolvedor Frontend', company: 'Tech Innovation', period: 'Jan/2023 - Presente', description: 'Desenvolvimento de interfaces Web com React e TypeScript. Refatoração de código que reduziu o tempo de carregamento em 30%.' }])}
                    >
                      + Exemplo Tech / Dev
                    </button>
                    <button 
                      className="bundle-skill-btn"
                      onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: 'Analista de Atendimento', company: 'Global Services', period: 'Mar/2022 - Presente', description: 'Atendimento direto ao cliente, resolução de ocorrências críticas e acompanhamento de relatórios de satisfação (NPS).' }])}
                    >
                      + Exemplo Atendimento / SAC
                    </button>
                    <button 
                      className="bundle-skill-btn"
                      onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: 'Coordenador de Vendas', company: 'Comercial Alfa', period: 'Jun/2021 - Presente', description: 'Gestão de carteira B2B e liderança de equipe comercial, atingindo 120% das metas anuais.' }])}
                    >
                      + Exemplo Vendas / Gestão
                    </button>
                  </div>
                </div>

                {experiences.length === 0 ? (
                  <div className="empty-state-resumes card text-center" style={{ padding: '32px' }}>
                    <Briefcase size={36} style={{ color: 'var(--brand)', marginBottom: '12px' }} />
                    <h4>Nenhuma experiência adicionada ainda</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Clique no botão abaixo para adicionar seu histórico profissional ou use os exemplos acima.</p>
                    <button className="btn btn-primary" onClick={handleAddExperience}>
                      <Plus size={16} /> Adicionar Minha Primeira Experiência
                    </button>
                  </div>
                ) : (
                  experiences.map((exp, index) => (
                    <div key={exp.id} className="experience-builder-item card">
                      <div className="exp-item-header">
                        <h4>Experiência #{index + 1}</h4>
                        <button className="delete-exp-btn" onClick={() => handleRemoveExperience(exp.id)} title="Excluir Experiência">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Cargo / Título da Função</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ex: Analista de Sistemas, Vendedor, Gerente de Projetos..." 
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        />
                      </div>

                      <div className="form-row-double">
                        <div className="form-group">
                          <label className="form-label">Empresa</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Ex: Tech Solutions Ltda" 
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Período / Datas</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Ex: Jan/2023 - Presente ou 2021 - 2023" 
                            value={exp.period}
                            onChange={(e) => handleUpdateExperience(exp.id, 'period', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="label-with-ai">
                          <label className="form-label">Principais Atividades & Conquistas</label>
                          <button 
                            className="ai-optimize-btn"
                            onClick={() => handleImproveWithAi('experience', exp.description, exp.id, selectedTone, exp.role, exp.company)}
                          >
                            <Sparkles size={14} /> Otimizar & Gerar com IA
                          </button>
                        </div>

                        {/* Toolbar de Verbos de Ação Rápidos */}
                        <div className="action-verbs-toolbar" style={{ margin: '6px 0 8px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)' }}><Wand2 size={11} /> Verbos de Impacto:</span>
                          {['Liderei', 'Otimizei', 'Gerenciei', 'Implementei', 'Reduzi em 30%', 'Desenvolvi', 'Aumentei'].map((verb) => (
                            <button
                              key={verb}
                              type="button"
                              className="bundle-skill-btn"
                              style={{ fontSize: '0.68rem', padding: '2px 7px' }}
                              onClick={() => {
                                const currentDesc = exp.description ? `${exp.description}\n• ${verb} ` : `• ${verb} `;
                                handleUpdateExperience(exp.id, 'description', currentDesc);
                              }}
                            >
                              + {verb}
                            </button>
                          ))}
                        </div>

                        <textarea 
                          className="form-textarea" 
                          rows={4}
                          placeholder="Descreva o que você fazia ou suas principais conquistas (ex: Liderei equipe de 5 pessoas, atendi 40+ clientes/dia, reduzi custos)..."
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                        ></textarea>
                      </div>

                      {/* Exibição da Sugestão da IA para Experiência */}
                      {aiTargetField?.type === 'experience' && aiTargetField.id === exp.id && (
                        <div className="ai-suggestion-result card animate-fade-in">
                          <div className="ai-result-header">
                            <Sparkles size={16} />
                            <h4>Sugestão Otimizada pela IA para {exp.role || 'Experiência'}</h4>
                          </div>
                          {aiGenerating ? (
                            <div className="ai-loading">
                              <span className="spinner-dots">Estruturando conquistas executivas com métricas...</span>
                            </div>
                          ) : (
                            <>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{aiSuggestion}</p>
                              <div className="ai-result-actions">
                                <button className="btn btn-primary btn-sm" onClick={handleApplyAiSuggestion}>
                                  Aplicar na Experiência
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => { setAiSuggestion(''); setAiTargetField(null); }}>
                                  Descartar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}

                <button className="btn btn-secondary btn-block" onClick={handleAddExperience} style={{ marginTop: '16px' }}>
                  <Plus size={16} /> Adicionar Outra Experiência
                </button>
              </div>
            )}

            {/* Aba Competências */}
            {activeTab === 'skills' && (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Adicionar Habilidade Manualmente</label>
                  <div className="skills-input-row">
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: React, Gestão Ágil, Excel" 
                      id="skill-input-field"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        const el = document.getElementById('skill-input-field');
                        if (el) {
                          handleAddSkill(el.value);
                          el.value = '';
                        }
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Sugestões Rápidas de Habilidades por Área */}
                <div className="skill-bundles-section">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>✨ Sugestões Inteligentes de Habilidades por Área:</label>
                  <div className="bundles-grid">
                    {SKILL_BUNDLES.map((bundle, bIdx) => (
                      <div key={bIdx} className="bundle-card">
                        <span className="bundle-title">{bundle.label}</span>
                        <div className="bundle-tags">
                          {bundle.skills.map((s) => (
                            <button 
                              key={s} 
                              className={`bundle-skill-btn ${skills.includes(s) ? 'added' : ''}`}
                              onClick={() => handleAddSkill(s)}
                            >
                              {skills.includes(s) ? '✓ ' : '+ '}{s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="skills-tags-container" style={{ marginTop: '20px' }}>
                  <label className="form-label">Suas Habilidades Adicionadas ({skills.length}):</label>
                  <div className="skills-tags-wrapper">
                    {skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                        <button className="remove-skill-tag" onClick={() => handleRemoveSkill(skill)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview - Painel Direito */}
        <div className="builder-preview-panel">
          <div className="preview-sticky-container">
            <div className="preview-options-row">
              <div className="preview-label">Visualização do Currículo (A4)</div>
              
              {/* Seletor de Modelos de Currículo */}
              <div className="template-selector-control">
                <button 
                  className={`tpl-select-btn ${selectedTemplate === 'minimalist' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('minimalist')}
                  title="Layout Simples & Clean"
                >
                  <Layout size={14} /> Simples
                </button>
                <button 
                  className={`tpl-select-btn ${selectedTemplate === 'modern' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('modern')}
                  title="Layout Moderno"
                >
                  <Layout size={14} /> Moderno
                </button>
                <button 
                  className={`tpl-select-btn ${selectedTemplate === 'classic' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('classic')}
                  title="Layout Clássico"
                >
                  <Layout size={14} /> Clássico
                </button>
                <button 
                  className={`tpl-select-btn ${selectedTemplate === 'tech' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('tech')}
                  title="Layout Técnico"
                >
                  <Layout size={14} /> Técnico
                </button>
                <button 
                  className={`tpl-select-btn ${selectedTemplate === 'creative' ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate('creative')}
                  title="Layout Extravagante & Vibrante"
                >
                  <Sparkles size={14} /> Extravagante
                </button>
              </div>
            </div>
            
            {/* O próprio documento impresso */}
            <div className={`document-a4-preview template-${selectedTemplate}`} id="resume-document-to-print">
              {selectedTemplate === 'creative' ? (
                /* Layout Extravagante / Vibrante */
                <div className="creative-template-wrapper">
                  <header className="creative-banner">
                    <h2 className="creative-name">{name || 'Nome do Candidato'}</h2>
                    <div className="creative-meta">
                      {email && <span>✉ {email}</span>}
                      {phone && <span>📞 {phone}</span>}
                      {location && <span>📍 {location}</span>}
                      {age && <span>🎂 {age}</span>}
                      {education && <span>🎓 {education}</span>}
                    </div>
                  </header>

                  <div className="creative-body">
                    {/* Seção ESPECIAL no Modelo Extravagante */}
                    {(education || age || extraNotes) && (
                      <section className="doc-section creative-section">
                        <h3 className="doc-section-title creative-title">✨ ESPECIAL</h3>
                        <div className="creative-special-box">
                          {education && (
                            <div className="creative-special-item">
                              <span className="creative-special-label">🎓 Escolaridade:</span>
                              <span className="creative-special-val">{education}</span>
                            </div>
                          )}
                          {age && (
                            <div className="creative-special-item">
                              <span className="creative-special-label">🎂 Idade:</span>
                              <span className="creative-special-val">{age}</span>
                            </div>
                          )}
                          {extraNotes && (
                            <div className="creative-special-item full">
                              <span className="creative-special-label">📌 Observações:</span>
                              <span className="creative-special-val">{extraNotes}</span>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                    {summary && (
                      <section className="doc-section creative-section">
                        <h3 className="doc-section-title creative-title">✨ Sobre</h3>
                        <p className="doc-summary-text creative-summary">{summary}</p>
                      </section>
                    )}

                    {experiences.length > 0 && (
                      <section className="doc-section creative-section">
                        <h3 className="doc-section-title creative-title">🚀 Experiência Profissional</h3>
                        <div className="doc-exp-list">
                          {experiences.map((exp) => (
                            <div key={exp.id} className="doc-exp-item creative-exp-item">
                              <div className="doc-exp-header">
                                <strong className="creative-role">{exp.role || 'Cargo'}</strong>
                                <span className="creative-period">{exp.period || 'Período'}</span>
                              </div>
                              <div className="doc-exp-company creative-company">{exp.company || 'Empresa'}</div>
                              {exp.description && <p className="doc-exp-desc creative-desc">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {skills.length > 0 && (
                      <section className="doc-section creative-section">
                        <h3 className="doc-section-title creative-title">💡 Competências & Destaques</h3>
                        <div className="doc-skills-list creative-skills-list">
                          {skills.map((skill) => (
                            <span key={skill} className="doc-skill-badge creative-badge">{skill}</span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Cabeçalho Padrão para Moderno, Clássico, Técnico e Simples */}
                  <header className="doc-header">
                    <h2>{name || 'Nome do Candidato'}</h2>
                    <div className="doc-meta">
                      {email && <span>{email}</span>}
                      {phone && <span>{phone}</span>}
                      {location && <span>{location}</span>}
                      {age && <span>{age}</span>}
                      {education && <span>{education}</span>}
                    </div>
                  </header>

                  {selectedTemplate === 'tech' ? (
                    /* Layout Técnico (2 Colunas) */
                    <div className="tech-columns-wrapper">
                      <div className="tech-col-main">
                        {summary && (
                          <section className="doc-section">
                            <h3 className="doc-section-title">Sobre</h3>
                            <p className="doc-summary-text">{summary}</p>
                          </section>
                        )}

                        {experiences.length > 0 && (
                          <section className="doc-section">
                            <h3 className="doc-section-title">Experiência</h3>
                            <div className="doc-exp-list">
                              {experiences.map((exp) => (
                                <div key={exp.id} className="doc-exp-item">
                                  <div className="doc-exp-header">
                                    <strong>{exp.role || 'Cargo'}</strong>
                                    <span>{exp.period || 'Período'}</span>
                                  </div>
                                  <div className="doc-exp-company">{exp.company || 'Empresa'}</div>
                                  {exp.description && <p className="doc-exp-desc">{exp.description}</p>}
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>

                      <div className="tech-col-sidebar">
                        {skills.length > 0 && (
                          <section className="doc-section">
                            <h3 className="doc-section-title">Habilidades</h3>
                            <div className="doc-skills-list vertical">
                              {skills.map((skill) => (
                                <span key={skill} className="doc-skill-badge-sidebar">{skill}</span>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Layouts Moderno, Clássico e Simples */
                    <>
                      {summary && (
                        <section className="doc-section">
                          <h3 className="doc-section-title">Sobre</h3>
                          <p className="doc-summary-text">{summary}</p>
                        </section>
                      )}

                      {experiences.length > 0 && (
                        <section className="doc-section">
                          <h3 className="doc-section-title">Experiência Profissional</h3>
                          <div className="doc-exp-list">
                            {experiences.map((exp) => (
                              <div key={exp.id} className="doc-exp-item">
                                <div className="doc-exp-header">
                                  <strong>{exp.role || 'Cargo'}</strong>
                                  <span>{exp.period || 'Período'}</span>
                                </div>
                                <div className="doc-exp-company">{exp.company || 'Empresa'}</div>
                                {exp.description && <p className="doc-exp-desc">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {skills.length > 0 && (
                        <section className="doc-section">
                          <h3 className="doc-section-title">Habilidades & Competências</h3>
                          <div className="doc-skills-list">
                            {skills.map((skill) => (
                              <span key={skill} className="doc-skill-badge">{skill}</span>
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
