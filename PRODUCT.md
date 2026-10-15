# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudantes universitários brasileiros criando currículos para estágios e primeiros empregos. Usuários com pouco experiência profissional que precisam de orientação para estruturar e otimizar seus currículos.

## Product Purpose

Facilitar a criação de currículos profissionais para estudantes, oferecendo templates prontos, otimização inteligente de textos e análise de compatibilidade com sistemas ATS. O produto existe para reduzir a barreira de entrada no mercado de trabalho para iniciantes.

## Positioning

Gerador de currículos 100% gratuito com otimização inteligente de textos e templates profissionais, sem necessidade de cadastro complexo ou planos pagos.

## Operating Context

- Usuários acessam via navegador desktop ou mobile
- Criação de currículo em etapas (wizard de 4 passos)
- Edição por seções (perfil, resumo, experiências, habilidades)
- Exportação via PDF ou impressão
- Dados salvos localmente no navegador (localStorage)

## Capabilities and Constraints

- **Funcionalidades confirmadas:**
  - 5 templates de currículo (Minimalist, Modern, Classic, Tech, Creative)
  - 4 esquemas de cores (violet, emerald, sapphire, gold)
  - Modo claro/escuro
  - Otimização inteligente de textos (4 tons: Executivo, Técnico, Conciso, Criativo)
  - Geração de carta de apresentamento (template-based)
  - Cálculo de pontuação ATS (client-side)
  - Exportação PDF via html2pdf.js
  - Simulador interativo de ATS na landing page
  - Assistente flutuante com 4 modos (Consultor de Carreira, Reescrita, Simulador de Entrevista, Análise de Vaga)

- **Restrições técnicas:**
  - Sem backend - todos os dados ficam no localStorage
  - Senhas armazenadas em texto plano (limitação do escopo TCC)
  - Funcionalidades de otimização são simulações (setTimeout + templates)
  - Sem autenticação real
  - Sem testes automatizados

- **Terminologia:**
  - "ATS" = Applicant Tracking System (sistema de rastreamento de candidatos)
  - "TCC" = Trabalho de Conclusão de Curso

## Brand Commitments

- Nome: RESUMETECH
- Idioma: Português brasileiro (pt-BR)
- Voz: Profissional mas acessível, orientativo
- Compromisso: 100% gratuito (sem planos pagos)

## Evidence on Hand

- Código fonte completo em React + Vite
- 5 templates funcionais com preview
- Sistema de design com 4 esquemas de cores
- Landing page com demonstração interativa
- Dashboard com gerenciamento de múltiplos currículos

## Product Principles

1. **Acessibilidade**: Qualquer estudante deve conseguir criar um bom currículo sem experiência prévia
2. **Simplicidade**: Interface intuitiva com wizard guiado para novos usuários
3. **Gratuidade**: Todas as funcionalidades disponíveis sem pagamento
4. **Qualidade visual**: Templates profissionais que competem com produtos pagos
5. **Privacidade**: Dados ficam no dispositivo do usuário (localStorage)

## Accessibility & Inclusion

- Interface responsiva para desktop e mobile
- Contraste adequado nos esquemas de cores
- Textos claros em português brasileiro
