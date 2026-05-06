// ═══════════════════════════════════════════════════════════════
// AgroXitique — Motor de Scoring (Programação Funcional)
// Implementação em JavaScript usando princípios funcionais puros
// ═══════════════════════════════════════════════════════════════

const AgroScoring = (() => {
    // ── Funções utilitárias puras ──────────────────────────────
    const clamp = (min, max) => (value) =>
        Math.max(min, Math.min(max, value));

    const clampScore = clamp(0, 100);

    const pipe = (...fns) => (x) =>
        fns.reduce((acc, fn) => fn(acc), x);

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);

    const percentage = (part, total) =>
        total === 0 ? 0 : Math.round((part / total) * 100);

    // ── Factores de scoring (funções puras) ───────────────────

    /**
     * Pontualidade — 40% do score
     * +10 pontos por cada contribuição feita a tempo
     * Normalizado para escala 0-40
     */
    const calcularPontualidade = (contribuicoesPontuais, totalMeses) => {
        if (totalMeses === 0) return 0;
        const ratio = contribuicoesPontuais / totalMeses;
        return Math.round(ratio * 40);
    };

    /**
     * Consistência — 30% do score
     * Baseada em meses consecutivos activos
     * Normalizado para escala 0-30
     */
    const calcularConsistencia = (mesesActivos, totalMeses) => {
        if (totalMeses === 0) return 0;
        const ratio = mesesActivos / Math.max(totalMeses, 6);
        return Math.round(ratio * 30);
    };

    /**
     * Tamanho do grupo — 10% do score
     * Bónus por grupos maiores e mais estáveis
     */
    const calcularBonusGrupo = (numMembros) => {
        if (numMembros >= 12) return 10;
        if (numMembros >= 8) return 7;
        if (numMembros >= 5) return 5;
        return 2;
    };

    /**
     * Histórico de crédito — 15% do score
     * +5 pontos por cada reembolso bem-sucedido, max 15
     */
    const calcularHistoricoCredito = (reembolsosFeitos) => {
        return Math.min(15, reembolsosFeitos * 5);
    };

    /**
     * Indicações — 5% do score
     * +2.5 pontos por cada membro indicado, max 5
     */
    const calcularIndicacoes = (indicacoesFeitas) => {
        return Math.min(5, indicacoesFeitas * 2.5);
    };

    /**
     * Penalidades
     * -15 por atraso de pagamento
     * -20 por falta de contribuição num mês
     */
    const calcularPenalidades = (atrasos, faltas) => {
        return (atrasos * -15) + (faltas * -20);
    };

    // ── Composição final do score ─────────────────────────────

    /**
     * calcularScoreIndividual :: UserData -> ScoreResult
     * Função pura: mesmo input = mesmo output (determinística)
     */
    const calcularScoreIndividual = (userData) => {
        const pontualidade = calcularPontualidade(
            userData.contribuicoesPontuais || userData.monthsActive,
            userData.totalMeses || 6
        );
        const consistencia = calcularConsistencia(
            userData.monthsActive || 0,
            userData.totalMeses || 6
        );
        const bonusGrupo = calcularBonusGrupo(userData.numMembrosGrupo || 0);
        const historicoCredito = calcularHistoricoCredito(userData.reembolsosFeitos || 0);
        const indicacoes = calcularIndicacoes(userData.indicacoesFeitas || 0);
        const penalidades = calcularPenalidades(
            userData.atrasos || 0,
            userData.faltas || 0
        );

        const scoreRaw = pontualidade + consistencia + bonusGrupo +
                         historicoCredito + indicacoes + penalidades;

        const scoreFinal = clampScore(scoreRaw);

        return {
            total: scoreFinal,
            classificacao: classificarScore(scoreFinal),
            factores: {
                pontualidade,
                consistencia,
                bonusGrupo,
                historicoCredito,
                indicacoes,
                penalidades,
            },
            limiteCredito: calcularLimiteCredito(scoreFinal),
            nivelRisco: avaliarRisco(scoreFinal),
        };
    };

    /**
     * calcularScoreGrupo :: [MemberData] -> GroupScoreResult
     * Score do grupo é a média ponderada dos scores individuais
     */
    const calcularScoreGrupo = (members) => {
        if (members.length === 0) return { total: 0, classificacao: "Sem dados" };

        const scores = members.map(m => m.score || 0);
        const media = Math.round(sum(scores) / scores.length);
        const membrosEmDia = members.filter(m => m.paid).length;
        const taxaPagamento = percentage(membrosEmDia, members.length);

        // Ajuste: penalizar se muitos membros em atraso
        const ajuste = taxaPagamento >= 75 ? 5 : taxaPagamento >= 50 ? 0 : -10;
        const scoreFinal = clampScore(media + ajuste);

        return {
            total: scoreFinal,
            classificacao: classificarScore(scoreFinal),
            membrosEmDia,
            totalMembros: members.length,
            taxaPagamento,
            limiteCredito: calcularLimiteCreditoGrupo(scoreFinal, members.length),
        };
    };

    // ── Classificação ─────────────────────────────────────────

    const classificarScore = (score) => {
        if (score >= 85) return "Excelente";
        if (score >= 70) return "Bom";
        if (score >= 50) return "Regular";
        if (score >= 30) return "Fraco";
        return "Crítico";
    };

    const classificarScoreEmoji = (score) => {
        if (score >= 85) return "🟢";
        if (score >= 70) return "🟡";
        if (score >= 50) return "🟠";
        return "🔴";
    };

    // ── Cálculo de crédito ────────────────────────────────────

    const calcularLimiteCredito = (score) => {
        if (score >= 85) return 10000;
        if (score >= 70) return 8000;
        if (score >= 50) return 4000;
        if (score >= 30) return 2000;
        return 0;
    };

    const calcularLimiteCreditoGrupo = (score, numMembros) => {
        const base = calcularLimiteCredito(score);
        const multiplicador = Math.min(numMembros / 5, 2.0);
        return Math.round(base * multiplicador);
    };

    const calcularParcela = (valor, taxaMensal, numParcelas) => {
        // Juros simples (mais justo para micro-crédito rural)
        const jurosTotal = valor * (taxaMensal / 100) * numParcelas;
        return Math.round((valor + jurosTotal) / numParcelas);
    };

    // ── Avaliação de risco ────────────────────────────────────

    const avaliarRisco = (score) => {
        if (score >= 75) return { nivel: "Baixo", cor: "low", probabilidadeDefault: 5 };
        if (score >= 50) return { nivel: "Médio", cor: "medium", probabilidadeDefault: 15 };
        return { nivel: "Alto", cor: "high", probabilidadeDefault: 35 };
    };

    const simularCenarios = (grupoScore, valorCredito, numMembros) => {
        return [
            {
                nome: "Optimista",
                descricao: "Todos pagam a tempo, boa colheita",
                probabilidade: grupoScore >= 70 ? 60 : 30,
                impactoScore: +10,
            },
            {
                nome: "Base",
                descricao: "Maioria paga, colheita normal",
                probabilidade: 30,
                impactoScore: 0,
            },
            {
                nome: "Pessimista",
                descricao: "Atrasos frequentes, má colheita",
                probabilidade: grupoScore >= 70 ? 10 : 40,
                impactoScore: -15,
            },
        ];
    };

    // ── API pública ───────────────────────────────────────────
    return {
        calcularScoreIndividual,
        calcularScoreGrupo,
        classificarScore,
        classificarScoreEmoji,
        calcularLimiteCredito,
        calcularLimiteCreditoGrupo,
        calcularParcela,
        avaliarRisco,
        simularCenarios,
        calcularPontualidade,
        calcularConsistencia,
        calcularBonusGrupo,
        calcularPenalidades,
        clampScore,
        pipe,
    };
})();

if (typeof window !== 'undefined') {
    window.AgroScoring = AgroScoring;
}
