# 🌱 AgroXitique — Guia de Demonstração

> Script para apresentação ao júri do Mini Finckathon 2025  
> Duração total: ~5 minutos

---

## Preparação

1. Abrir `index.html` no browser (Chrome ou Edge recomendado)
2. Ter o terminal/GHCi pronto na pasta `haskell/`
3. Garantir que o ecrã é visível para todos os jurados

---

## Roteiro da Demo (5 minutos)

### 1️⃣ Introdução (30 segundos)

> *"Imaginem a Maria Fátima, agricultora em Quelimane, Zambézia. Ela não tem conta bancária, não tem smartphone, mas tem um telemóvel básico com M-Pesa. Hoje, ela não tem como poupar de forma segura nem aceder a crédito para comprar sementes e fertilizantes antes do plantio."*

> *"O AgroXitique resolve isso — é um sistema de poupança colectiva e microcrédito que funciona via USSD, sem internet."*

### 2️⃣ Demonstração do Simulador USSD (2 minutos)

**Acção:** Clicar em **"📞 Marcar *150#"**

> *"A Maria marca *150# no telemóvel e acede ao AgroXitique."*

**Fluxo a demonstrar:**

1. **Menu principal** → Mostrar as opções disponíveis
2. **Opção 1 — Ver Poupança** → Mostrar o progresso do grupo
   > *"O grupo 'Machamba Unida' já poupou 12.400 MT de uma meta de 18.000 para a época de plantio."*
3. **Voltar → Opção 2 — Contribuir** → Fazer uma contribuição
   > *"A Maria contribui 200 MT via M-Pesa. Notem o SMS de confirmação."*
4. **Voltar → Opção 4 — Ver Score** → Mostrar a decomposição do score
   > *"O score sobe automaticamente! Vejam os factores: pontualidade, consistência, bónus de grupo..."*
5. **Opção 1 — Evolução** → Mostrar o histórico
   > *"Ao longo de 5 meses, o score cresceu de 35 para 72 pontos."*
6. **Voltar → Opção 3 — Crédito** → Solicitar crédito
   > *"Com um bom score, o grupo pode solicitar crédito para insumos agrícolas."*
7. **Opção 4 — Simulador** → Mostrar parcelas
   > *"O agricultor vê exactamente quanto vai pagar por mês, com total transparência."*

### 3️⃣ Painel de Analytics (30 segundos)

**Acção:** Clicar nos tabs do painel lateral

> *"No painel à direita, os gestores do programa podem ver em tempo real:"*
- **Tab Dados** → Membros, transacções, indicador de risco
- **Tab Analytics** → Gráficos de poupança e evolução do score
- **Tab Haskell** → Código do motor de scoring

### 4️⃣ Motor Haskell no GHCi (1 minuto)

**Acção:** Mudar para o terminal

```
cd haskell
ghci AgroXitique.hs
```

> *"A lógica do score é implementada em Haskell — Programação Funcional pura."*

```haskell
> demo
```

> *"Vejam: a Maria com 5 meses pontuais tem score 72. O Ernesto com atrasos tem um score muito mais baixo."*

```haskell
> scoreRapido 5 5 8 0 1
```

> *"Funções puras: o mesmo input produz SEMPRE o mesmo output. Isto garante justiça e auditabilidade."*

```haskell
> :l Tests
> runTests
```

> *"Temos testes automatizados para validar toda a lógica."*

### 5️⃣ Impacto e Conclusão (1 minuto)

> *"O AgroXitique transforma o xitique tradicional — que já existe e funciona em Moçambique — num instrumento financeiro digital. Com apenas um telemóvel básico e M-Pesa, os agricultores rurais podem:"*

- ✅ **Poupar em conjunto** de forma segura e transparente
- ✅ **Construir histórico financeiro** pela primeira vez
- ✅ **Aceder a crédito** para insumos na época certa do plantio
- ✅ **Aumentar a produtividade** das suas machambas

> *"A solução é escalável: usa a infra-estrutura M-Pesa já existente e pode ser replicada em todas as províncias de Moçambique."*

> *"AgroXitique — Raízes Digitais. Colheitas Reais."*

---

## Perguntas Frequentes dos Jurados

| Pergunta | Resposta |
|----------|---------|
| **Como geram receita?** | Comissão de 1-2% sobre o crédito concedido, paga pelo grupo |
| **Porquê Haskell?** | Funções puras garantem que o cálculo do score é justo, reproduzível e auditável |
| **E se alguém não pagar?** | Responsabilidade solidária do grupo + penalidade no score colectivo |
| **Como escalam?** | Usando a infra-estrutura M-Pesa existente — nenhum investimento extra em infra |
| **Já existe algo parecido?** | O Xitique Digital do M-Pesa tem 750k adesões, mas não oferece crédito nem scoring |

---

*Prof. Filipe Domingos dos Santos · UniLicungo · LicungoLab · 2025*
