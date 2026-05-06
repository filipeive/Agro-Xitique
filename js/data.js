// ═══════════════════════════════════════════════════════════════
// AgroXitique — Data Model
// Dados centralizados e estado da aplicação
// ═══════════════════════════════════════════════════════════════

const AgroData = {
    // ── Estado actual ──
    state: {
        screen: "idle",
        user: {
            name: "Maria Fátima",
            phone: "84 123 4567",
            district: "Quelimane",
            province: "Zambézia",
            balance: 4500,
            contributed: false,
            creditScore: 72,
            memberSince: "2025-01",
            monthsActive: 5,
            totalContributed: 1000,
            loansRepaid: 0,
            invitesMade: 1,
        },
        group: {
            name: "Machamba Unida",
            code: "MCH-2025-ZAM",
            district: "Quelimane, Zambézia",
            savings: 12400,
            target: 18000,
            credit: 8000,
            creditUsed: 0,
            score: 72,
            maxMembers: 15,
            monthlyContribution: 200,
            interestRate: 3,
            createdAt: "2025-01",
        },
        members: [
            { name: "Maria Fátima", paid: true, score: 72, monthsActive: 5, phone: "84 123 4567" },
            { name: "Ana Bique", paid: true, score: 68, monthsActive: 5, phone: "84 234 5678" },
            { name: "João Macuacua", paid: true, score: 75, monthsActive: 4, phone: "84 345 6789" },
            { name: "Lurdes Mussa", paid: false, score: 45, monthsActive: 3, phone: "84 456 7890" },
            { name: "Carlos Tembe", paid: true, score: 80, monthsActive: 5, phone: "84 567 8901" },
            { name: "Felisa Nhamathe", paid: true, score: 65, monthsActive: 4, phone: "84 678 9012" },
            { name: "Ernesto Cuamba", paid: false, score: 38, monthsActive: 2, phone: "84 789 0123" },
            { name: "Rosa Joaquim", paid: true, score: 70, monthsActive: 5, phone: "84 890 1234" },
        ],
        history: [
            { date: "02/05", desc: "Contribuição Ana Bique", amt: "+200 MT", type: "credit" },
            { date: "01/05", desc: "Contribuição Carlos Tembe", amt: "+200 MT", type: "credit" },
            { date: "30/04", desc: "Contribuição Maria Fátima", amt: "+200 MT", type: "credit" },
            { date: "28/04", desc: "Score actualizado", amt: "72 pts", type: "info" },
            { date: "25/04", desc: "Contribuição Rosa Joaquim", amt: "+200 MT", type: "credit" },
            { date: "20/04", desc: "Alerta: Lurdes Mussa em atraso", amt: "-15 pts", type: "debit" },
            { date: "15/04", desc: "Contribuição João Macuacua", amt: "+200 MT", type: "credit" },
            { date: "10/04", desc: "Felisa Nhamathe aderiu ao grupo", amt: "+20 pts", type: "info" },
        ],
    },

    // ── Dados históricos para analytics ──
    analytics: {
        savingsHistory: [
            { month: "Jan", value: 3200 },
            { month: "Fev", value: 5600 },
            { month: "Mar", value: 7800 },
            { month: "Abr", value: 10200 },
            { month: "Mai", value: 12400 },
        ],
        scoreHistory: [
            { month: "Jan", value: 35 },
            { month: "Fev", value: 48 },
            { month: "Mar", value: 58 },
            { month: "Abr", value: 65 },
            { month: "Mai", value: 72 },
        ],
        memberGrowth: [
            { month: "Jan", value: 3 },
            { month: "Fev", value: 4 },
            { month: "Mar", value: 5 },
            { month: "Abr", value: 7 },
            { month: "Mai", value: 8 },
        ],
    },

    // ── Tabela de scoring ──
    scoringRules: {
        pontualidade:   { peso: 40, pontosPerContrib: 10, desc: "Contribuições pontuais" },
        consistencia:   { peso: 30, pontosPerMes: 6, desc: "Meses consecutivos activos" },
        tamanhoGrupo:   { peso: 10, bonusMin5: 10, bonusMin10: 20, desc: "Tamanho do grupo" },
        historicoCredito: { peso: 15, pontosPerReembolso: 15, desc: "Reembolsos bem-sucedidos" },
        indicacoes:     { peso: 5, pontosPerIndicacao: 5, desc: "Novos membros indicados" },
        penalidades:    { atrasoPagamento: -15, faltaContribuicao: -20, desc: "Penalidades" },
    },

    // ── Produtos de crédito ──
    creditProducts: [
        { name: "Pacote Básico", value: 2000, parcelas: 3, desc: "Sementes" },
        { name: "Pacote Standard", value: 4000, parcelas: 4, desc: "Sementes + Fertilizante" },
        { name: "Pacote Completo", value: 8000, parcelas: 6, desc: "Insumos completos" },
    ],

    // ── Calendário agrícola de Moçambique ──
    agriculturalCalendar: {
        plantio: { inicio: "Outubro", fim: "Dezembro" },
        crescimento: { inicio: "Janeiro", fim: "Março" },
        colheita: { inicio: "Abril", fim: "Junho" },
        preparacao: { inicio: "Julho", fim: "Setembro" },
    },
};

// Tornar global para uso nos outros módulos
if (typeof window !== 'undefined') {
    window.AgroData = AgroData;
}
