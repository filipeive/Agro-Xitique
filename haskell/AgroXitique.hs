{- ═══════════════════════════════════════════════════════════════
   AgroXitique — Módulo Principal
   Ponto de entrada e demonstração do sistema
   
   Para executar:
     $ cd haskell
     $ ghci AgroXitique.hs
     > demo
   
   Cadeira: Programação Funcional — UniLicungo 2025
   Professor: Filipe Domingos dos Santos
   Projecto: Mini Finckathon 2025 — Vodacom/M-Pesa
   ═══════════════════════════════════════════════════════════════ -}

module AgroXitique where

import Types
import Scoring
import Risk

-- ═══════════════════════════════════════════════════════════════
-- Dados de exemplo (Círculo "Machamba Unida")
-- ═══════════════════════════════════════════════════════════════

-- | Contribuições de exemplo da Maria Fátima
contribsMaria :: [Contribuicao]
contribsMaria =
    [ contribPontual  200 (MesAno 1 2025)   -- Janeiro ✓
    , contribPontual  200 (MesAno 2 2025)   -- Fevereiro ✓
    , contribPontual  200 (MesAno 3 2025)   -- Março ✓
    , contribPontual  200 (MesAno 4 2025)   -- Abril ✓
    , contribPontual  200 (MesAno 5 2025)   -- Maio ✓
    ]

-- | Contribuições do Ernesto (com atrasos)
contribsErnesto :: [Contribuicao]
contribsErnesto =
    [ contribPontual  200 (MesAno 3 2025)   -- Março ✓
    , contribAtrasada 200 (MesAno 4 2025)   -- Abril ✗ (atrasada)
    ]

-- | Membros do círculo "Machamba Unida"
membrosExemplo :: [Membro]
membrosExemplo =
    [ Membro "Maria Fátima"     "84 123 4567" Activo   contribsMaria    5 1
    , Membro "Ana Bique"        "84 234 5678" Activo   (replicate 5 (contribPontual 200 (MesAno 1 2025))) 5 0
    , Membro "João Macuacua"    "84 345 6789" Activo   (replicate 4 (contribPontual 200 (MesAno 1 2025))) 4 0
    , Membro "Lurdes Mussa"     "84 456 7890" Pendente (replicate 3 (contribAtrasada 200 (MesAno 1 2025))) 3 0
    , Membro "Carlos Tembe"     "84 567 8901" Activo   (replicate 5 (contribPontual 200 (MesAno 1 2025))) 5 0
    , Membro "Felisa Nhamathe"  "84 678 9012" Activo   (replicate 4 (contribPontual 200 (MesAno 1 2025))) 4 0
    , Membro "Ernesto Cuamba"   "84 789 0123" Pendente contribsErnesto  2 0
    , Membro "Rosa Joaquim"     "84 890 1234" Activo   (replicate 5 (contribPontual 200 (MesAno 1 2025))) 5 0
    ]

-- | O grupo completo
grupoExemplo :: Grupo
grupoExemplo = Grupo
    { grupoNome          = "Machamba Unida"
    , grupoCodigo        = "MCH-2025-ZAM"
    , grupoDistrito      = "Quelimane, Zambézia"
    , grupoMembros       = membrosExemplo
    , grupoPoupanca      = 12400
    , grupoMeta          = 18000
    , grupoCreditoDisp   = 8000
    , grupoContribMensal = 200
    , grupoTaxaJuros     = 3
    }

-- | Produtos de crédito disponíveis
produtosCredito :: [ProdutoCredito]
produtosCredito =
    [ ProdutoCredito "Pacote Básico"    2000 3 "Sementes"
    , ProdutoCredito "Pacote Standard"  4000 4 "Sementes + Fertilizante"
    , ProdutoCredito "Pacote Completo"  8000 6 "Insumos completos"
    ]


-- ═══════════════════════════════════════════════════════════════
-- Funções de demonstração
-- ═══════════════════════════════════════════════════════════════

-- | Demonstração principal — executar no GHCi com: > demo
demo :: IO ()
demo = do
    putStrLn ""
    putStrLn "🌱 ═══════════════════════════════════════════"
    putStrLn "   AgroXitique — Motor de Scoring"
    putStrLn "   Mini Finckathon 2025 · UniLicungo"
    putStrLn "   ═══════════════════════════════════════════"
    putStrLn ""
    
    -- Score da Maria (membro exemplar)
    putStrLn "▸ Score da Maria Fátima (5 meses, tudo pontual):"
    let scoreMaria = calcularScoreIndividual (head membrosExemplo) 8
    putStr (mostrarScore scoreMaria)
    putStrLn ""
    
    -- Score do Ernesto (com atrasos)
    putStrLn "▸ Score do Ernesto Cuamba (2 meses, com atrasos):"
    let scoreErnesto = calcularScoreIndividual (membrosExemplo !! 6) 8
    putStr (mostrarScore scoreErnesto)
    putStrLn ""
    
    -- Score do grupo
    putStrLn "▸ Score do grupo 'Machamba Unida':"
    let scoreGrupo = calcularScoreGrupo grupoExemplo
    putStrLn ("   Score: " ++ show scoreGrupo ++ "/100 — " ++ show (classificar scoreGrupo))
    putStrLn ""
    
    -- Relatório de risco
    putStrLn "▸ Relatório de risco para crédito de 4.000 MT:"
    putStr (mostrarRelatorioRisco scoreGrupo 4000 8)
    putStrLn ""
    
    -- Simulação de parcelas
    putStrLn "▸ Simulação de parcelas:"
    mapM_ mostrarProduto produtosCredito
    putStrLn ""
    putStrLn "   Programação Funcional — UniLicungo 2025"
    putStrLn "   Prof. Filipe Domingos dos Santos"
    putStrLn ""

-- | Mostra informação de um produto de crédito
mostrarProduto :: ProdutoCredito -> IO ()
mostrarProduto p = do
    let parcela = calcularParcela (prodValor p) 3 (prodParcelas p)
    putStrLn ("   " ++ prodNome p ++ ": " ++ show (round (prodValor p) :: Int) ++ " MT")
    putStrLn ("     → " ++ show (prodParcelas p) ++ " parcelas de " 
             ++ show (round parcela :: Int) ++ " MT (" ++ prodDescricao p ++ ")")


-- ═══════════════════════════════════════════════════════════════
-- Funções utilitárias para uso interactivo no GHCi
-- ═══════════════════════════════════════════════════════════════

-- | Calcula score rápido (atalho para o GHCi)
--   > scoreRapido 5 5 8 0 1
--   72
scoreRapido :: Int    -- ^ Contribuições pontuais
            -> Int    -- ^ Meses activos
            -> Int    -- ^ Membros no grupo
            -> Int    -- ^ Atrasos
            -> Int    -- ^ Indicações feitas
            -> Int    -- ^ Score final
scoreRapido pontuais meses membros atrasos indicacoes =
    clamp 0 100 $ calcPontualidade pontuais meses
               + calcConsistencia meses 6
               + calcBonusGrupo membros
               + calcIndicacoes indicacoes
               + calcPenalidades atrasos 0

-- | Verifica se um score permite crédito
--   > podeCredito 72
--   True
podeCredito :: Int -> Bool
podeCredito = (>= 30)

-- | Mostra o progresso da poupança
--   > progresso 12400 18000
--   "[████████░░░░░░] 69%"
progresso :: Double -> Double -> String
progresso actual meta =
    let perc = round (actual / meta * 100) :: Int
        filled = round (actual / meta * 14) :: Int
        bar = replicate filled '█' ++ replicate (14 - filled) '░'
    in "[" ++ bar ++ "] " ++ show perc ++ "%"
