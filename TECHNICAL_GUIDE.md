# 🛠️ Guia Técnico AgroXitique: De Haskell ao M-Pesa

Este documento foi criado para guiar os estudantes da cadeira de **Programação Funcional** na exploração e expansão do sistema AgroXitique.

---

## 🏗️ 1. Arquitetura do Sistema
O sistema é dividido em duas camadas principais, respeitando a separação entre **Lógica Pura** (Inteligência) e **Efeitos Colaterais** (Interface).

### Camada de Inteligência (Haskell)
Localizada em `/haskell`, esta camada lida com o que a Programação Funcional faz de melhor: **Cálculo de Risco**.
-   **Pureza**: As funções de scoring recebem dados e devolvem um valor. Não há variáveis globais ou estado mutável.
-   **Tipos de Dados**: Definimos `Membro`, `Grupo` e `Transacao` como tipos algébricos, garantindo que a lógica de negócio é verificada em tempo de compilação.
-   **Desafio para os Estudantes**: Vejam o ficheiro `Scoring.hs` e tentem implementar uma função que penalize o score se um membro atrasar o pagamento por mais de 3 meses.

### Camada de Simulação (JavaScript)
Localizada em `/js`, esta camada emula o comportamento de um telemóvel.
-   **State Management**: Utilizamos um objecto central `AgroData` que actua como a nossa "única fonte da verdade".
-   **Declarative UI**: No ficheiro `screens.js`, os ecrãs não são código imperativo, mas sim uma "tabela" de definições. Isto é muito semelhante a como definiríamos uma máquina de estados em Haskell.

---

## 🧩 2. Como estender o Sistema (Passo-a-Passo)

### Adicionar um novo menu USSD:
1.  Abra o ficheiro `js/screens.js`.
2.  Crie um novo objecto dentro de `screens`. Exemplo:
    ```javascript
    meu_novo_menu: {
        title: "Novo Serviço",
        body: () => "Bem-vindo! \n1. Opção A \n0. Voltar",
        handler: (inp) => {
            if (inp === "1") return "proximo_ecra";
            return "main";
        }
    }
    ```
3.  Ligue este menu a um menu existente alterando o `handler` do pai.

---

## 🧠 3. Conceitos de FP Aplicados
Explique isto aos juízes do Hackathon:
1.  **Imutabilidade**: As transacções no AgroXitique são tratadas como um "Append-Only Log". Não editamos transacções passadas; adicionamos novas, tal como numa lista em Haskell.
2.  **Funções de Ordem Superior**: Usamos `map`, `filter` e `reduce` no JavaScript para calcular as estatísticas do Analytics, garantindo que os dados originais permanecem intactos.
3.  **Composição**: A interface USSD é composta por pequenos módulos (Header, Body, Keypad) que se encaixam de forma modular.

---

## 🚀 4. Dicas para a Apresentação
-   **Ênfase na Inclusão**: O sistema funciona em qualquer telemóvel "burro" (Feature Phone), não requer internet 4G/5G.
-   **Segurança**: Destaquem o uso do PIN M-Pesa para todas as operações sensíveis.
-   **Escalabilidade**: Mostrem como a lógica em Haskell permite processar milhões de grupos com segurança matemática.

---
**Boa sorte, equipa! Vamos revolucionar o Agro-Fintech em Moçambique!** 🇲🇿🌱
