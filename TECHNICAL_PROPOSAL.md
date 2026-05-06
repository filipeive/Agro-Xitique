# Proposta Técnica: Sistema AgroXitique
**Solução de Micro-finanças Digital para a Inclusão Rural em Moçambique**

---

## 1. Introdução
A agricultura familiar em Moçambique, especialmente na província da Zambézia, enfrenta um desafio crítico: a falta de histórico financeiro digital. Sem dados, os agricultores não têm acesso a crédito formal para comprar sementes ou fertilizantes. O **AgroXitique** resolve este problema digitalizando o hábito cultural da poupança colectiva (Xitique) através do canal USSD (*150#) da Vodacom M-Pesa.

## 2. A Solução Tecnológica
O sistema foi concebido para ser resiliente, seguro e acessível:
-   **Interface USSD**: Funciona em qualquer telemóvel, eliminando a barreira dos smartphones e da internet cara.
-   **Segurança Multinível**: Acesso protegido por ID de Grupo e validação obrigatória via PIN M-Pesa, garantindo a privacidade dos saldos e a integridade das transacções.
-   **Onboarding Fluído**: Geração dinâmica de credenciais com notificações SMS automáticas para os novos grupos.

## 3. Fundamentação Académica (Programação Funcional)
O grande diferencial do AgroXitique é o seu motor de **Credit Scoring**, modelado em **Haskell**.
-   **Confiabilidade**: O uso de funções puras garante que o cálculo do score é determinístico e livre de efeitos colaterais indesejados.
-   **Tipagem Forte**: O sistema de tipos do Haskell impede erros comuns de lógica financeira, como transacções negativas ou sobreposição de datas de reembolso.
-   **Auditabilidade**: A lógica funcional permite que cada passo do cálculo de risco seja auditado, facilitando parcerias com bancos comerciais (ex: Millennium BIM).

## 4. Impacto Social e Inclusão
-   **Histórico Digital**: Agricultores rurais começam a construir um "passaporte financeiro" baseado nas suas contribuições a tempo.
-   **Empoderamento Feminino**: Digitaliza e protege as poupanças de grupos de mulheres, muitas vezes as principais gestoras das machambas familiares.
-   **Aumento de Produtividade**: O acesso a crédito para insumos pode elevar a produtividade do milho de 1 t/ha para níveis competitivos regionalmente.

## 5. Próximos Passos
-   **Integração Real**: Conectar os ecrãs USSD à API oficial do M-Pesa para transacções em tempo real.
-   **Módulo de Seguros**: Implementar o Seguro Agrícola Paramétrico (baseado em dados climáticos) também modelado em Haskell.

---
**AgroXitique: Raízes Digitais, Colheitas Reais.**  
*Equipa LicungoLab · Universidade Licungo · Quelimane, Moçambique*
