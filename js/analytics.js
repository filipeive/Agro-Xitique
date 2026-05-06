// ═══════════════════════════════════════════════════════════════
// AgroXitique — Analytics Panel
// Renderiza o painel lateral com dados, gráficos e Haskell
// ═══════════════════════════════════════════════════════════════

const AgroAnalytics = (() => {
    const S = () => AgroData.state;
    const fmtMT = (v) => v.toLocaleString("pt") + " MT";

    // ── Render Members List ───────────────────────────────────
    function renderMembers() {
        const el = document.getElementById("members-list");
        if (!el) return;
        el.innerHTML = S().members.map(m =>
            `<div class="member-row">
                <span class="name">${m.name}<br><small>${m.score}/100 score</small></span>
                <span class="status ${m.paid ? '' : 'late'}">${m.paid ? '✓ Pago' : '⚠ Pendente'}</span>
            </div>`
        ).join("");
    }

    // ── Render Transaction History ────────────────────────────
    function renderHistory() {
        const el = document.getElementById("history-list");
        if (!el) return;
        el.innerHTML = S().history.slice(0, 8).map(h =>
            `<div class="hist-item ${h.type}">
                <span>${h.date} — ${h.desc}</span>
                <span class="tx ${h.type === 'debit' ? 'debit' : ''}">${h.amt}</span>
            </div>`
        ).join("");
    }

    // ── Render Score Bar ──────────────────────────────────────
    function renderScore() {
        const scoreVal = document.getElementById("score-val");
        const scoreFill = document.getElementById("score-fill");
        const creditVal = document.getElementById("credit-val");
        const savingsVal = document.getElementById("savings-val");
        const membersCount = document.getElementById("members-count");
        const scoreStatus = document.querySelector(".score-status");

        const updateWithAnim = (el, val) => {
            if (el && el.textContent !== val) {
                el.textContent = val;
                el.classList.remove("updated");
                void el.offsetWidth; // Trigger reflow
                el.classList.add("updated");
            }
        };

        updateWithAnim(scoreVal, S().group.score + "/100");
        if (scoreFill) scoreFill.style.width = S().group.score + "%";
        updateWithAnim(creditVal, fmtMT(S().group.credit));
        updateWithAnim(savingsVal, fmtMT(S().group.savings));
        updateWithAnim(membersCount, S().members.length + " / " + S().group.maxMembers);
        if (scoreStatus) {
            scoreStatus.textContent = AgroScoring.classificarScore(S().group.score);
        }
    }

    // ── Render Savings Chart ──────────────────────────────────
    function renderSavingsChart() {
        const el = document.getElementById("savings-chart");
        if (!el) return;

        const data = AgroData.analytics.savingsHistory;
        const max = Math.max(...data.map(d => d.value));

        el.innerHTML = data.map(d => {
            const h = Math.round((d.value / max) * 70);
            return `<div class="mini-bar" style="height: ${h}px">
                <span class="bar-value">${(d.value / 1000).toFixed(1)}k</span>
                <span class="bar-label">${d.month}</span>
            </div>`;
        }).join("");
    }

    // ── Render Score Evolution Chart ──────────────────────────
    function renderScoreChart() {
        const el = document.getElementById("score-chart");
        if (!el) return;

        const data = AgroData.analytics.scoreHistory;

        el.innerHTML = data.map(d => {
            const h = Math.round((d.value / 100) * 70);
            return `<div class="mini-bar" style="height: ${h}px">
                <span class="bar-value">${d.value}</span>
                <span class="bar-label">${d.month}</span>
            </div>`;
        }).join("");
    }

    // ── Render Risk Indicator ─────────────────────────────────
    function renderRisk() {
        const el = document.getElementById("risk-indicator");
        if (!el) return;

        const risco = AgroScoring.avaliarRisco(S().group.score);
        el.innerHTML = `
            <div class="risk-dot ${risco.cor}"></div>
            <span class="risk-label">Risco do grupo:</span>
            <span class="risk-value" style="color: var(--${risco.cor === 'low' ? 'green-400' : risco.cor === 'medium' ? 'gold-500' : 'red-400'})">${risco.nivel} (${risco.probabilidadeDefault}%)</span>
        `;
    }

    // ── Render All ────────────────────────────────────────────
    function renderPanel() {
        renderMembers();
        renderHistory();
        renderScore();
        renderSavingsChart();
        renderScoreChart();
        renderRisk();
    }

    // ── Tab Switching ─────────────────────────────────────────
    function switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.panel-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    // ── Initialize Tabs ───────────────────────────────────────
    function initTabs() {
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
    }

    return {
        renderPanel,
        switchTab,
        initTabs,
    };
})();

if (typeof window !== 'undefined') {
    window.AgroAnalytics = AgroAnalytics;
}
