# 🌱 AgroXitique

> **Poupança Colectiva e Crédito Agrícola Digital via M-Pesa**  
> Sistema USSD para comunidades rurais de Moçambique — sem internet, sem smartphone

[![Mini Finckathon 2025](https://img.shields.io/badge/Mini%20Finckathon-2025-1B4332?style=flat-square&logo=vodafone&logoColor=white)](https://www.vodacom.co.mz)
[![UniLicungo](https://img.shields.io/badge/UniLicungo-LicungoLab-52B788?style=flat-square)](https://www.unilicungo.ac.mz)
[![Haskell](https://img.shields.io/badge/Haskell-Programação%20Funcional-5D4F85?style=flat-square&logo=haskell&logoColor=white)](https://www.haskell.org)

---

## 📋 Índice

- [O Problema](#-o-problema)
- [A Solução](#-a-solução)
- [Funcionalidades](#-funcionalidades)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Como Executar](#-como-executar)
- [Motor de Scoring (Haskell)](#-motor-de-scoring-haskell)
- [Estrutura do Projecto](#-estrutura-do-projecto)
- [Equipa](#-equipa)
- [Licença](#-licença)

---

## 🔴 O Problema

Os agricultores rurais de Moçambique, especialmente na Zambézia, estão **excluídos do sistema financeiro digital**:

| Dado | Fonte |
|------|-------|
| **4%** dos rurais têm acesso à banca móvel (vs. 31% urbanos) | INE, Censo 2017 |
| **2,8%** do crédito bancário chega à agricultura | CIFAM/MADER 2024 |
| **1 t/ha** de produtividade do milho (África do Sul: 5 t/ha) | IGM 2025 |
| **<2%** de uso de fertilizantes na Zambézia | IGM 2025 |

Sem acesso a crédito para insumos agrícolas, a produtividade mantém-se baixa e o ciclo de pobreza perpetua-se.

---

## 🌱 A Solução

O **AgroXitique** digitaliza e formaliza o conceito tradicional de **xitique** (poupança colectiva rotativa) e acrescenta-lhe uma camada de crédito agrícola e histórico financeiro digital.

### Como funciona:

```
📲 Agricultor marca *150#
    ↓
👥 Cria ou junta-se a um Círculo AgroXitique (grupo de 5-15 pessoas)
    ↓
💰 Contribui mensalmente via M-Pesa (ex: 200 MT/mês)
    ↓
📊 Sistema calcula score de crédito automaticamente
    ↓
🏦 Grupo solicita microcrédito para insumos agrícolas
    ↓
🌾 Reembolso em parcelas após a colheita
```

**Tudo via USSD — funciona em qualquer telemóvel, sem internet.**

---

## ⭐ Funcionalidades

### Módulo 1 — Poupança Colectiva
- Grupos de 5 a 15 agricultores formam um "Círculo AgroXitique"
- Contribuição mensal via M-Pesa
- Transparência total com SMS de confirmação

### Módulo 2 — Score de Crédito Rural
- Score calculado com **Programação Funcional (Haskell)**
- 5 factores: pontualidade, consistência, tamanho do grupo, histórico, indicações
- Funções puras garantem resultados reproduzíveis e auditáveis

### Módulo 3 — Microcrédito Agrícola
- Crédito colectivo para fertilizantes e sementes
- Reembolso pós-colheita (alinhado ao calendário agrário)
- Responsabilidade solidária do grupo

### Módulo 4 — Analytics e Gestão
- Painel de evolução da poupança e score
- Indicador de risco do grupo
- Simulador de parcelas de crédito
- Gestão de membros e alertas SMS

---

## 🏗 Arquitectura Técnica

```
┌─────────────────────────────────────────┐
│  🧑‍🌾 Agricultor (Telemóvel Básico)      │
├─────────────────────────────────────────┤
│  📡 Canal USSD (*150#)                  │
│     Sem dados, sem app, sem smartphone  │
├─────────────────────────────────────────┤
│  📱 M-Pesa API (Vodacom Moçambique)    │
│     Infra-estrutura existente           │
├─────────────────────────────────────────┤
│  ⚙️ AgroXitique Engine                  │
│     • Motor de scoring (Haskell)        │
│     • Gestão de grupos e transacções    │
│     • Alertas e notificações SMS        │
├─────────────────────────────────────────┤
│  🗄️ Base de Dados                       │
│     Histórico, perfis, scores           │
└─────────────────────────────────────────┘
```

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Canal de Acesso | USSD (*150#) |
| Pagamentos | M-Pesa API — Vodacom MZ |
| Lógica de Negócio | Haskell (scoring) + JavaScript (simulador) |
| Notificações | SMS automático |
| Frontend (Demo) | HTML5 + CSS3 + JavaScript |

---

## 🚀 Como Executar

### Simulador USSD (Frontend)

Basta abrir o ficheiro `index.html` num browser:

```bash
# Abrir directamente
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

### Motor de Scoring (Haskell — GHCi)

```bash
# Entrar na pasta haskell
cd haskell

# Carregar no GHCi
ghci AgroXitique.hs

# Executar a demo completa
> demo

# Testar funções individuais
> calcPontualidade 5 6
> calcBonusGrupo 8
> classificar 72
> calcularParcela 4000 3 4
> scoreRapido 5 5 8 0 1
> progresso 12400 18000

# Executar testes
> :l Tests
> runTests
```

---

## λ Motor de Scoring (Haskell)

O score de crédito é calculado com **funções puras** em Haskell:

```haskell
-- Função pura: mesmo input → mesmo output
calcularScore :: [Contribuicao] -> Int -> ScoreResult

-- Composição de factores independentes
scoreTotal = pontualidade + consistencia + bonusGrupo
           + historicoCredito + indicacoes + penalidades
```

### Factores do Score

| Factor | Peso | Descrição |
|--------|------|-----------|
| Pontualidade | 40% | Contribuições feitas antes da data limite |
| Consistência | 30% | Meses consecutivos activos |
| Tamanho do grupo | 10% | Bónus por grupos maiores |
| Histórico de crédito | 15% | Reembolsos bem-sucedidos |
| Indicações | 5% | Novos membros indicados |

### Porquê Haskell?

- **Funções puras** — O mesmo input produz sempre o mesmo score (justiça e auditabilidade)
- **Composabilidade** — Cada factor é uma função independente
- **Testabilidade** — Cada regra testável isoladamente no GHCi
- **Transparência** — Código declarativo, fácil de auditar

---

## 📁 Estrutura do Projecto

```
AgroXitique/
├── index.html              # Simulador USSD (frontend)
├── css/
│   └── style.css           # Design system premium
├── js/
│   ├── data.js             # Modelo de dados centralizado
│   ├── scoring.js          # Motor de scoring (JS funcional)
│   ├── screens.js          # Definição dos ecrãs USSD
│   ├── simulator.js        # Controlador do simulador
│   └── analytics.js        # Painel de analytics
├── haskell/
│   ├── Types.hs            # Tipos algébricos do domínio
│   ├── Scoring.hs          # Motor de scoring (funções puras)
│   ├── Risk.hs             # Simulação de risco
│   ├── AgroXitique.hs      # Módulo principal + demo
│   └── Tests.hs            # Suite de testes
├── docs/
│   ├── README.md           # Este ficheiro
│   ├── DEMO_GUIDE.md       # Guia de demonstração
│   ├── ARCHITECTURE.md     # Arquitectura técnica
│   └── SUBMISSION.md       # Respostas ao formulário
├── projecto.js             # Gerador de proposta (DOCX)
└── slides.js               # Gerador de slides (PPTX)
```

---

## 👥 Equipa

**LicungoLab** — Universidade Licungo, Quelimane

| Papel | Nome |
|-------|------|
| Professor Orientador | **Filipe Domingos dos Santos** |
| Estudantes | *(a definir)* |

**Cadeira:** Programação Funcional (Haskell)  
**Evento:** Mini Finckathon 2025 — M-Pesa & Fundação Vodacom

---

## 📄 Licença

Projecto académico desenvolvido para o Mini Finckathon 2025.  
Universidade Licungo · LicungoLab · Quelimane, Moçambique.

---

> **🌱 AgroXitique** — *Raízes Digitais. Colheitas Reais.*
