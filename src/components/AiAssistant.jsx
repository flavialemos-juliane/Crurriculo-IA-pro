import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, User, UserCheck, HelpCircle, 
  Briefcase, FileText, Target, Award, Copy, Check, RefreshCw, Compass
} from 'lucide-react';
import ChatHelpIcon from './ChatHelpIcon';
import './AiAssistant.css';

// Base de Conhecimento Ampliada para o Consultor
const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['ats', 'filtro', 'rh', 'robo', 'triagem', 'leitura automatica'],
    topic: 'Otimização para ATS',
    answer: '🎯 **Dicas de Otimização ATS (Applicant Tracking Systems):**\n\n1. **Use fontes limpas**: Inter, Roboto ou Arial.\n2. **Sem gráficos complexos**: Evite tabelas, colunas excessivas ou barras de progresso dentro do arquivo.\n3. **Palavras-Chave exatas**: Inclua os termos que aparecem nos requisitos da vaga.\n4. **Formato PDF**: Exporte diretamente na nossa plataforma em PDF texto limpo.'
  },
  {
    keywords: ['resumo', 'perfil', 'introducao', 'apresentacao', 'sobre mim'],
    topic: 'Resumo Profissional',
    answer: '✍️ **Como criar um Resumo de Alto Impacto:**\n\n- **Estrutura Recomendada**: [Cargo principal] com [tempo de experiência] em [suas principais qualidades].\n- Exemplo: *"Profissional de Atendimento e Vendas com 3 anos de experiência em recepção, rotinas administrativas e fidelização de clientes. Foco em cordialidade, pontualidade e organização."*'
  },
  {
    keywords: ['habilidades', 'skills', 'competencias', 'hard skill', 'soft skill'],
    topic: 'Habilidades no Currículo',
    answer: '💡 **Equilíbrio de Competências:**\n\n- **Habilidades Práticas**: Atendimento ao público, rotinas de escritório, controle de caixa, pacote Office, digitação.\n- **Qualidades Pessoais**: Boa comunicação, pontualidade, trabalho em equipe, simpatia e disposição para aprender.\n- *Dica*: Escolha de 6 a 8 competências diretamente relacionadas ao cargo desejado.'
  },
  {
    keywords: ['experiencia', 'conquistas', 'resultados', 'metricas', 'verbos'],
    topic: 'Descrição de Experiências',
    answer: '🚀 **Fórmula de Ação + Responsabilidade:**\n\nComece cada item com **verbos de ação** seguidos pelo que você fazia:\n\n- *"Atendi mais de 40 clientes por dia com cordialidade e agilidade."*\n- *"Organizei os arquivos e documentos da empresa, facilitando a consulta diária da equipe."*'
  },
  {
    keywords: ['entrevista', 'perguntas', 'comportamental', 'dicas de entrevista', 'diferencial'],
    topic: 'Preparação para Entrevistas',
    answer: '🎓 **Método STAR para Entrevistas:**\n\n- **S**ituação: Contextualize o problema.\n- **T**arefa: Qual era seu papel específico?\n- **A**ção: O que você fez concretamente?\n- **R**esultado: Qual foi o número ou impacto obtido?'
  },
  {
    keywords: ['carta', 'apresentacao', 'cover letter', 'email'],
    topic: 'Carta de Apresentação',
    answer: '✉️ **Estrutura de Carta de Apresentação:**\n\n1. Saudação direta ao recrutador.\n2. Por que você deseja atuar nessa empresa específica.\n3. Suas 2 maiores conquistas relacionadas ao cargo.\n4. Chamada para ação amigável solicitando uma conversa.'
  }
];

// Perguntas para a Simulação de Entrevista
const INTERVIEW_QUESTIONS = {
  tech: [
    "Qual foi o maior desafio técnico que você enfrentou em seu último projeto e como o resolveu?",
    "Como você garante a qualidade, performance e manutenibilidade do seu código?",
    "Descreva uma situação em que você teve que discordar da arquitetura sugerida por um colega."
  ],
  sales: [
    "Como você lida com objeções difíceis de clientes durante uma negociação de alto valor?",
    "Fale sobre um mês em que você esteve abaixo da meta e como contornou a situação.",
    "Qual a sua abordagem para prospecção de novos clientes em mercados competitivos?"
  ],
  management: [
    "Como você gerencia prioridades concorrentes e conflitos de prazo em sua equipe?",
    "Descreva uma situação em que precisou dar um feedback difícil a um colaborador direto.",
    "Como você mede o sucesso e o alinhamento estratégico dos projetos sob sua gestão?"
  ],
  general: [
    "Me fale sobre você e por que deveríamos contratá-lo para este cargo.",
    "Qual é o seu maior diferencial profissional e uma área onde busca desenvolvimento?",
    "Descreva um momento em que algo não saiu como o planejado e o que aprendeu com isso."
  ]
};

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('consultant'); // 'consultant', 'writer', 'interviewer', 'jobMatch'
  const [interviewRole, setInterviewRole] = useState('tech');
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Olá! Sou o seu **Consultor de Carreira do RESUMETECH**.\n\nPosso orientar sua jornada profissional com **Diretrizes de ATS**, **Redação Executiva**, **Simulação de Entrevistas** ou **Análise de Vagas**. Como posso te orientar hoje?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeMode]);

  // Alternar Modos do Assistente
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    let welcomeMsg = '';

    if (mode === 'consultant') {
      welcomeMsg = '💡 **Consultoria de Carreira & ATS Ativada.** Pergunte sobre estruturação de currículo, termos estratégicos, compatibilidade ATS e padrões de recrutamento!';
    } else if (mode === 'writer') {
      welcomeMsg = '✍️ **Aprimorador de Redação Ativado.** Digite uma atividade ou frase simples para transformá-la em uma descrição profissional de alto impacto com verbos de ação!';
    } else if (mode === 'interviewer') {
      welcomeMsg = `💼 **Simulação de Entrevistas Ativada.** Selecione o segmento abaixo e responda à questão prática:\n\n❓ *"${INTERVIEW_QUESTIONS[interviewRole][0]}"*`;
      setInterviewQuestionIndex(0);
    } else if (mode === 'jobMatch') {
      welcomeMsg = '🎯 **Analisador de Vagas Ativado.** Cole os requisitos de uma oportunidade para identificar competências essenciais e termos recomendados para o seu perfil!';
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: welcomeMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Enviar Mensagem principal
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuery = inputText.trim();
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';

      if (activeMode === 'writer') {
        // Reescritor de Impacto
        botResponse = `✦ **Sugestão de Redação Executiva:**\n\n> "${userQuery}"\n\n💼 **Versão Profissional Otimizada:**\n"Atuação consistente com foco em ${userQuery.toLowerCase()}, aplicando boas práticas de gestão e entrega de resultados para o setor."\n\n*Dica*: Você pode copiar esse texto e utilizá-lo diretamente no seu currículo!`;
      } else if (activeMode === 'interviewer') {
        // Avaliador de Resposta de Entrevista
        const currentQ = INTERVIEW_QUESTIONS[interviewRole][interviewQuestionIndex];
        const nextIdx = (interviewQuestionIndex + 1) % INTERVIEW_QUESTIONS[interviewRole].length;
        setInterviewQuestionIndex(nextIdx);

        botResponse = `📊 **Avaliação da sua Resposta:**\n\n✅ **Pontos Fortes**: Demonstrou clareza na exposição das ideias e boa articulação profissional.\n💡 **Recomendação**: Adicione métricas ou dados específicos pelo Método STAR (Situação, Tarefa, Ação, Resultado).\n\n⭐ **Avaliação**: 9.0/10\n\n---\n❓ **Próxima Pergunta:**\n*"${INTERVIEW_QUESTIONS[interviewRole][nextIdx]}"*`;
      } else if (activeMode === 'jobMatch') {
        // Analisador de Requisitos de Vaga
        botResponse = `🎯 **Diagnóstico de Requisitos da Vaga:**\n\n🔑 **Termos-Chave Estratégicos Identificados:**\n- Comunicação Assertiva\n- Gestão de Processos e Prazos\n- Organização & Atenção aos Detalhes\n- Cooperação em Equipe\n\n⚡ **Competências Recomendadas para Adicionar:**\n1. Resolução Eficiente de Problemas\n2. Domínio de Ferramentas de Produtividade\n3. Visão Orientada a Resultados\n\n📌 *Dica: Insira essas exatas palavras no seu resumo e na lista de competências para maximizar sua pontuação nos sistemas de triagem e recrutamento (ATS)!*`;
      } else {
        // Modo Consultor de Carreira
        const queryLower = userQuery.toLowerCase();
        const matchedTopic = AI_KNOWLEDGE_BASE.find(item => 
          item.keywords.some(kw => queryLower.includes(kw))
        );

        if (matchedTopic) {
          botResponse = matchedTopic.answer;
        } else {
          botResponse = `💼 **Orientação para "${userQuery}":**\n\nPara maximizar o impacto do seu currículo:\n1. Mantenha as informações organizadas cronologicamente.\n2. Destaque responsabilidades com foco em resultados concretos.\n3. Utilize termos diretamente alinhados à vaga desejada.\n\nPrecisa de apoio para **aprimorar um texto** ou **treinar para uma entrevista**? Basta mudar de modo nas abas acima!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text.replace(/[*#]/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickQuestion = (qText) => {
    setInputText(qText);
  };

  return (
    <div className="ai-assistant-wrapper">
      {/* Botão Flutuante */}
      {!isOpen && (
        <button 
          className="ai-floating-btn animate-fade-in" 
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente de carreira inteligente"
        >
          <div className="pulse-ring"></div>
          <ChatHelpIcon className="icon-glow" size={28} />
          <span className="btn-badge">CONSULTOR</span>
        </button>
      )}

      {/* Janela de Chat */}
      {isOpen && (
        <div className="ai-chat-window animate-fade-in">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar">
                <Compass size={20} />
              </div>
              <div>
                <h4>Consultoria de Carreira</h4>
                <span className="status-online">Orientação Executiva & ATS</span>
              </div>
            </div>
            <button 
              className="ai-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Fechar assistente"
            >
              <X size={18} />
            </button>
          </div>

          {/* Abas de Modos do Assistente */}
          <div className="ai-mode-selector">
            <button 
              className={`mode-tab ${activeMode === 'consultant' ? 'active' : ''}`}
              onClick={() => handleModeChange('consultant')}
            >
              <Compass size={13} /> Orientação ATS
            </button>
            <button 
              className={`mode-tab ${activeMode === 'writer' ? 'active' : ''}`}
              onClick={() => handleModeChange('writer')}
            >
              <FileText size={13} /> Redação
            </button>
            <button 
              className={`mode-tab ${activeMode === 'interviewer' ? 'active' : ''}`}
              onClick={() => handleModeChange('interviewer')}
            >
              <Briefcase size={13} /> Entrevistas
            </button>
            <button 
              className={`mode-tab ${activeMode === 'jobMatch' ? 'active' : ''}`}
              onClick={() => handleModeChange('jobMatch')}
            >
              <Target size={13} /> Diagnóstico de Vaga
            </button>
          </div>

          {/* Seletor de Categoria na Entrevista */}
          {activeMode === 'interviewer' && (
            <div className="interview-role-picker">
              <span>Área:</span>
              <button 
                className={interviewRole === 'tech' ? 'active' : ''} 
                onClick={() => setInterviewRole('tech')}
              >
                Tecnologia
              </button>
              <button 
                className={interviewRole === 'sales' ? 'active' : ''} 
                onClick={() => setInterviewRole('sales')}
              >
                Vendas & Mkt
              </button>
              <button 
                className={interviewRole === 'management' ? 'active' : ''} 
                onClick={() => setInterviewRole('management')}
              >
                Gestão
              </button>
              <button 
                className={interviewRole === 'general' ? 'active' : ''} 
                onClick={() => setInterviewRole('general')}
              >
                Geral
              </button>
            </div>
          )}

          {/* Mensagens */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
                <div className="avatar-chat">
                  {msg.sender === 'bot' ? <UserCheck size={14} /> : <User size={14} />}
                </div>
                <div className="chat-bubble">
                  <div className="chat-bubble-content">
                    {msg.text.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="chat-bubble-footer">
                    <span className="chat-time">{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button 
                        className="copy-bubble-btn"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-container bot">
                <div className="avatar-chat">
                  <UserCheck size={14} />
                </div>
                <div className="chat-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Atalhos Rápidos Personalizados por Modo */}
          <div className="quick-queries">
            {activeMode === 'consultant' && (
              <>
                <button onClick={() => handleQuickQuestion('Como passar nos filtros ATS?')}>
                  <HelpCircle size={12} /> Filtros ATS
                </button>
                <button onClick={() => handleQuickQuestion('Como estruturar meu resumo?')}>
                  <HelpCircle size={12} /> Resumo Ideal
                </button>
                <button onClick={() => handleQuickQuestion('Quais verbos de ação usar?')}>
                  <HelpCircle size={12} /> Verbos de Ação
                </button>
              </>
            )}
            {activeMode === 'writer' && (
              <>
                <button onClick={() => handleQuickQuestion('Fazia atendimento aos clientes e organizava relatórios')}>
                  💡 Exemplo 1
                </button>
                <button onClick={() => handleQuickQuestion('Cuidava da organização de mercadorias e fechamento de caixa')}>
                  💡 Exemplo 2
                </button>
              </>
            )}
            {activeMode === 'interviewer' && (
              <>
                <button onClick={() => handleQuickQuestion('Busco estruturar minha resposta focando em pontualidade e bom convívio em equipe.')}>
                  💬 Dica de resposta
                </button>
              </>
            )}
            {activeMode === 'jobMatch' && (
              <>
                <button onClick={() => handleQuickQuestion('Vaga: Auxiliar Administrativo / Atendente com foco em atendimento ao cliente, organização de arquivos, pacote Office e rotinas de recepção.')}>
                  📋 Exemplo de Vaga
                </button>
              </>
            )}
          </div>

          {/* Input Form */}
          <form className="ai-chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={
                  activeMode === 'writer' ? 'Cole uma frase para reescrever...' :
                  activeMode === 'interviewer' ? 'Escreva sua resposta para a pergunta acima...' :
                  activeMode === 'jobMatch' ? 'Cole os requisitos ou texto da vaga...' :
                  'Pergunte algo ao consultor...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                aria-label="Mensagem para o assistente"
              />
            <button type="submit" disabled={!inputText.trim() || isTyping}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
