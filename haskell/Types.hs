{- ═══════════════════════════════════════════════════════════════
   AgroXitique — Tipos de Dados
   Definição dos tipos algébricos do domínio
   
   Cadeira: Programação Funcional — UniLicungo 2025
   Professor: Filipe Domingos dos Santos
   Projecto: Mini Finckathon 2025 — Vodacom/M-Pesa
   ═══════════════════════════════════════════════════════════════ -}

module Types where

-- ── Tipos básicos ─────────────────────────────────────────────

-- | Mês e ano para datas simples
data MesAno = MesAno 
    { mes :: Int    -- 1 a 12
    , ano :: Int    -- ex: 2025
    } deriving (Show, Eq, Ord)

-- | Uma contribuição mensal de um membro
data Contribuicao = Contribuicao
    { contValor     :: Double   -- Valor em MT (ex: 200.0)
    , contEmDia     :: Bool     -- True se paga antes da data limite
    , contMes       :: MesAno   -- Mês de referência
    } deriving (Show)

-- | Estado de um membro no grupo
data StatusMembro 
    = Activo        -- Participa regularmente
    | Pendente      -- Tem pagamentos em atraso
    | Suspenso      -- Mais de 2 meses sem pagar
    | Novo          -- Acabou de aderir
    deriving (Show, Eq)

-- | Informação de um membro do círculo
data Membro = Membro
    { memNome         :: String
    , memTelefone     :: String
    , memStatus       :: StatusMembro
    , memContribs     :: [Contribuicao]
    , memMesesActivos :: Int
    , memIndicacoes   :: Int
    } deriving (Show)

-- | Classificação do score
data Classificacao 
    = Excelente     -- 85-100
    | Bom           -- 70-84
    | Regular       -- 50-69
    | Fraco         -- 30-49
    | Critico       -- 0-29
    deriving (Show, Eq, Ord)

-- | Resultado do cálculo do score
data ScoreResult = ScoreResult
    { scoreTotal        :: Int
    , scoreClassificacao :: Classificacao
    , scoreLimiteCredito :: Double
    , scoreFactores     :: ScoreFactores
    } deriving (Show)

-- | Decomposição dos factores que compõem o score
data ScoreFactores = ScoreFactores
    { factPontualidade    :: Int   -- 0-40
    , factConsistencia    :: Int   -- 0-30
    , factBonusGrupo      :: Int   -- 0-10
    , factHistoricoCredito :: Int  -- 0-15
    , factIndicacoes      :: Int   -- 0-5
    , factPenalidades     :: Int   -- Negativo
    } deriving (Show)

-- | Nível de risco do grupo
data NivelRisco 
    = RiscoBaixo    -- Score >= 75
    | RiscoMedio    -- Score 50-74
    | RiscoAlto     -- Score < 50
    deriving (Show, Eq)

-- | Resultado da avaliação de risco
data RiscoResult = RiscoResult
    { riscoNivel          :: NivelRisco
    , riscoProbDefault    :: Int     -- Probabilidade de incumprimento (%)
    , riscoLimiteCredito  :: Double  -- Limite de crédito recomendado
    } deriving (Show)

-- | Cenário de simulação de risco
data CenarioRisco = CenarioRisco
    { cenarioNome         :: String
    , cenarioDescricao    :: String
    , cenarioProbabilidade :: Int    -- Probabilidade (%)
    , cenarioImpactoScore :: Int    -- Variação no score
    } deriving (Show)

-- | Informação do grupo/círculo
data Grupo = Grupo
    { grupoNome           :: String
    , grupoCodigo         :: String
    , grupoDistrito       :: String
    , grupoMembros        :: [Membro]
    , grupoPoupanca       :: Double
    , grupoMeta           :: Double
    , grupoCreditoDisp    :: Double
    , grupoContribMensal  :: Double
    , grupoTaxaJuros      :: Double  -- Percentagem mensal
    } deriving (Show)

-- | Produto de crédito disponível
data ProdutoCredito = ProdutoCredito
    { prodNome      :: String
    , prodValor     :: Double
    , prodParcelas  :: Int
    , prodDescricao :: String
    } deriving (Show)

-- | Época do calendário agrícola
data EpocaAgricola
    = Plantio       -- Out-Dez
    | Crescimento   -- Jan-Mar
    | Colheita      -- Abr-Jun
    | Preparacao    -- Jul-Set
    deriving (Show, Eq)
