import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle, 
  Briefcase, FileText, Target, Award, Copy, Check, RefreshCw
} from 'lucide-react';
import './AiAssistant.css';

// Base de Conhecimento Ampliada para o Consultor de IA
const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['ats', 'filtro', 'rh', 'robo', 'triagem', 'leitura automatica'],
    topic: 'Otimização para ATS',
    answer: '🎯 **Dicas de Otimização ATS (Applicant Tracking Systems):**\n\n1. **Use fontes limpas**: Inter, Roboto ou Arial.\n2. **Sem gráficos complexos**: Evite tabelas, colunas excessivas ou barras de progresso dentro do arquivo.\n3. **Palavras-Chave exatas**: Inclua os termos que aparecem nos requisitos da vaga.\n4. **Formato PDF**: Exporte diretamente na nossa plataforma em PDF texto limpo.'
  },
  {
    keywords: ['resumo', 'perfil', 'introducao', 'apresentacao', 'sobre mim'],
    topic: 'Resumo Profissional',
    answer: '✍️ **Como criar um Resumo de Alto Impacto:**\n\n- **Estrutura Recomendada**: [Cargo principal] com [X anos de experiência] em [suas 3 principais especialidades].\n- Exemplo: *"Desenvolvedor Full Stack com 4+ anos em React e Node.js. Especialista em arquiteturas escaláveis e redução de latência em sistemas de alto tráfego."*'
  },
  {
    keywords: ['habilidades', 'skills', 'competencias', 'hard skill', 'soft skill'],
    topic: 'Habilidades no Currículo',
    answer: '💡 **Equilíbrio de Competências:**\n\n- **Hard Skills**: Tecnologias, softwares, idiomas, certificações técnicas.\n- **Soft Skills**: Comunicação assertiva, resolução de problemas, liderança colaborativa, adaptabilidade.\n- *Dica*: Escolha de 6 a 10 habilidades diretamente alinhadas à vaga desejada.'
  },
  {
    keywords: ['experiencia', 'conquistas', 'resultados', 'metricas', 'verbos'],
    topic: 'Descrição de Experiências',
    answer: '🚀 **Fórmula de Ação + Conquista:**\n\nComece cada bullet point com **verbos de ação** seguidos por um **resultado mensurável**:\n\n- *"Liderei refatoração de código que reduziu o tempo de carregamento em 35%."*\n- *"Gerenciei carteira de 40+ clientes, elevando o NPS em 18 pontos."*'
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
      text: '👋 **Olá! Sou o Assistente Neural do CurrículoIA Pro.**\n\nPosso atuar como seu **Consultor de Carreira**, **Reescritor de Frases**, **Simulador de Entrevistas** ou **Analisador de Vagas**. Como posso te impulsionar hoje?',
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

  // Alternar Modos da IA
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    let welcomeMsg = '';

    if (mode === 'consultant') {
      welcomeMsg = '💡 **Modo Consultor de Carreira & ATS Ativado.** Pergunta qualquer dúvida sobre estruturação de currículo, palavras-chave, salários ou otimização ATS!';
    } else if (mode === 'writer') {
      welcomeMsg = '✍️ **Modo Reescritor de Impacto Ativado.** Cole uma frase simples ou descrição de trabalho para eu transformar em um tópico executivo de alto valor com verbos de ação!';
    } else if (mode === 'interviewer') {
      welcomeMsg = `💼 **Modo Simulador de Entrevista Ativado.** Escolha a área abaixo e responda à pergunta:\n\n❓ *"${INTERVIEW_QUESTIONS[interviewRole][0]}"*`;
      setInterviewQuestionIndex(0);
    } else if (mode === 'jobMatch') {
      welcomeMsg = '🎯 **Modo Analisador de Vagas Ativado.** Cole o texto completo de uma vaga de emprego para eu extrair os requisitos essenciais, competências-chave e palavras-chave recomendadas!';
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
        botResponse = `✨ **Sugestão de Reescrita de Alto Impacto:**\n\n> "${userQuery}"\n\n🚀 **Versão Executiva Otimizada:**\n"Atuação estratégica com foco em ${userQuery.toLowerCase()}, aplicando boas práticas de gestão e entregando resultados mensuráveis que otimizaram os processos operacionais em +25%."\n\n*Dica*: Você pode copiar esse texto e usar diretamente no seu currículo!`;
      } else if (activeMode === 'interviewer') {
        // Avaliador de Resposta de Entrevista
        const currentQ = INTERVIEW_QUESTIONS[interviewRole][interviewQuestionIndex];
        const nextIdx = (interviewQuestionIndex + 1) % INTERVIEW_QUESTIONS[interviewRole].length;
        setInterviewQuestionIndex(nextIdx);

        botResponse = `📊 **Análise da sua Resposta para a Entrevista:**\n\n✅ **Pontos Fortes**: Demonstrou clareza na exposição das ideias e boa articulação profissional.\n💡 **Oportunidade de Melhoria**: Tente incluir números ou dados específicos no Método STAR (Situação, Tarefa, Ação, Resultado).\n\n⭐ **Nota da Resposta**: 8.8/10\n\n---\n❓ **Próxima Pergunta:**\n*"${INTERVIEW_QUESTIONS[interviewRole][nextIdx]}"*`;
      } else if (activeMode === 'jobMatch') {
        // Analisador de Requisitos de Vaga
        botResponse = `🎯 **Análise Inteligente da Vaga:**\n\n🔑 **Palavras-Chave Obrigatórias Extradas:**\n- Comunicação Estratégica\n- Gestão de Projetos / Processos\n- Análise de Dados & Métricas\n- Trabalho em Equipe Multifuncional\n\n⚡ **Competências Recomendadas para Adicionar:**\n1. Resolução Ágil de Conflitos\n2. Ferramentas de Gestão Digital\n3. Visão Orientada a Resultados (KPIs)\n\n📌 *Dica: Insira essas exatas palavras no seu resumo e na lista de habilidades para pontuar mais alto nos robôs ATS!*`;
      } else {
        // Modo Consultor de Carreira
        const queryLower = userQuery.toLowerCase();
        const matchedTopic = AI_KNOWLEDGE_BASE.find(item => 
          item.keywords.some(kw => queryLower.includes(kw))
        );

        if (matchedTopic) {
          botResponse = matchedTopic.answer;
        } else {
          botResponse = `🤖 **Dica da IA para "${userQuery}":**\n\nPara maximizar as chances do seu currículo ser selecionado:\n1. Mantenha as informações organizadas cronologicamente.\n2. Destaque conquistas com métricas quantificáveis.\n3. Utilize palavras-chave específicas da vaga desejada.\n\nQuer que eu ajude a **reescrever um trecho** ou **simular uma entrevista**? Basta mudar de modo nas abas acima!`;
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
        <button className="ai-floating-btn animate-fade-in" onClick={() => setIsOpen(true)}>
          <div className="pulse-ring"></div>
          <Sparkles className="icon-glow" size={24} />
          <span className="btn-badge">IA 3.0</span>
        </button>
      )}

      {/* Janela de Chat */}
      {isOpen && (
        <div className="ai-chat-window animate-fade-in">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar">
                <Sparkles size={18} />
              </div>
              <div>
                <h4>Assistente Neural CurrículoIA</h4>
                <span className="status-online">IA Multimodal Gratuita</span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Abas de Modos da IA */}
          <div className="ai-mode-selector">
            <button 
              className={`mode-tab ${activeMode === 'consultant' ? 'active' : ''}`}
              onClick={() => handleModeChange('consultant')}
            >
              <Bot size={13} /> Consultor ATS
            </button>
            <button 
              className={`mode-tab ${activeMode === 'writer' ? 'active' : ''}`}
              onClick={() => handleModeChange('writer')}
            >
              <FileText size={13} /> Reescritor
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
              <Target size={13} /> Analisar Vaga
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
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
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
                  <Bot size={14} />
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
                <button onClick={() => handleQuickQuestion('Desenvolvia sites em React e corrigia bugs')}>
                  💡 Exemplo 2
                </button>
              </>
            )}
            {activeMode === 'interviewer' && (
              <>
                <button onClick={() => handleQuickQuestion('Busco estruturar minha resposta focando em liderança e metas claras.')}>
                  💬 Dica de resposta
                </button>
              </>
            )}
            {activeMode === 'jobMatch' && (
              <>
                <button onClick={() => handleQuickQuestion('Vaga: Desenvolvedor Front-end com React, TypeScript, Git e experiência com testes unitários e metodologia ágil Scrum.')}>
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
                activeMode === 'writer' ? 'Cole uma frase para a IA reescrever...' :
                activeMode === 'interviewer' ? 'Escreva sua resposta para a pergunta acima...' :
                activeMode === 'jobMatch' ? 'Cole os requisitos ou texto da vaga...' :
                'Pergunte algo ao Consultor de IA...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
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
