{- ═══════════════════════════════════════════════════════════════
   AgroXitique — Testes
   Testes para validar a lógica de scoring e risco
   
   Para executar:
     $ cd haskell
     $ ghci Tests.hs
     > runTests
   
   Cadeira: Programação Funcional — UniLicungo 2025
   Professor: Filipe Domingos dos Santos
   ═══════════════════════════════════════════════════════════════ -}

module Tests where

import Types
import Scoring
import Risk

-- ═══════════════════════════════════════════════════════════════
-- Framework de testes simples (sem dependências externas)
-- ═══════════════════════════════════════════════════════════════

data TestResult = Pass String | Fail String String
    deriving (Show)

-- | Verifica se um teste passou
assert :: String -> Bool -> TestResult
assert name True  = Pass name
assert name False = Fail name "Condição falsa"

-- | Verifica igualdade
assertEqual :: (Show a, Eq a) => String -> a -> a -> TestResult
assertEqual name expected actual
    | expected == actual = Pass name
    | otherwise = Fail name ("Esperado: " ++ show expected ++ ", Obtido: " ++ show actual)

-- | Executa e mostra resultados
showResult :: TestResult -> IO ()
showResult (Pass name) = putStrLn ("  ✓ " ++ name)
showResult (Fail name msg) = putStrLn ("  ✗ " ++ name ++ " — " ++ msg)

isPassed :: TestResult -> Bool
isPassed (Pass _) = True
isPassed _        = False


-- ═══════════════════════════════════════════════════════════════
-- Testes do Motor de Scoring
-- ═══════════════════════════════════════════════════════════════

testesScoring :: [TestResult]
testesScoring =
    [ -- Testes de clamp
      assertEqual "clamp: valor dentro do intervalo"  50 (clamp 0 100 50)
    , assertEqual "clamp: valor acima do máximo"     100 (clamp 0 100 150)
    , assertEqual "clamp: valor abaixo do mínimo"      0 (clamp 0 100 (-10))
    
    -- Testes de pontualidade
    , assertEqual "pontualidade: 5 de 5 = 40"  40 (calcPontualidade 5 5)
    , assertEqual "pontualidade: 3 de 6 = 20"  20 (calcPontualidade 3 6)
    , assertEqual "pontualidade: 0 de 5 = 0"    0 (calcPontualidade 0 5)
    , assertEqual "pontualidade: 0 de 0 = 0"    0 (calcPontualidade 0 0)
    
    -- Testes de consistência
    , assertEqual "consistencia: 6 de 6 = 30"  30 (calcConsistencia 6 6)
    , assertEqual "consistencia: 3 de 6 = 15"  15 (calcConsistencia 3 6)
    , assertEqual "consistencia: 0 de 0 = 0"    0 (calcConsistencia 0 0)
    
    -- Testes de bónus de grupo
    , assertEqual "bonusGrupo: 15 membros = 10" 10 (calcBonusGrupo 15)
    , assertEqual "bonusGrupo: 8 membros = 7"    7 (calcBonusGrupo 8)
    , assertEqual "bonusGrupo: 5 membros = 5"    5 (calcBonusGrupo 5)
    , assertEqual "bonusGrupo: 2 membros = 2"    2 (calcBonusGrupo 2)
    
    -- Testes de histórico de crédito
    , assertEqual "histCredito: 3 reembolsos = 15" 15 (calcHistoricoCredito 3)
    , assertEqual "histCredito: 1 reembolso = 5"    5 (calcHistoricoCredito 1)
    , assertEqual "histCredito: 4 reembolsos = 15 (cap)" 15 (calcHistoricoCredito 4)
    
    -- Testes de indicações
    , assertEqual "indicacoes: 2 = 4"  4 (calcIndicacoes 2)
    , assertEqual "indicacoes: 5 = 5 (cap)" 5 (calcIndicacoes 5)
    
    -- Testes de penalidades
    , assertEqual "penalidades: 1 atraso = -15"    (-15) (calcPenalidades 1 0)
    , assertEqual "penalidades: 1 falta = -20"     (-20) (calcPenalidades 0 1)
    , assertEqual "penalidades: 1 atraso + 1 falta = -35" (-35) (calcPenalidades 1 1)
    , assertEqual "penalidades: 0 atrasos = 0"       0  (calcPenalidades 0 0)
    ]

-- ═══════════════════════════════════════════════════════════════
-- Testes de Classificação
-- ═══════════════════════════════════════════════════════════════

testesClassificacao :: [TestResult]
testesClassificacao =
    [ assertEqual "classificar 90 = Excelente" Excelente (classificar 90)
    , assertEqual "classificar 85 = Excelente" Excelente (classificar 85)
    , assertEqual "classificar 75 = Bom"       Bom       (classificar 75)
    , assertEqual "classificar 60 = Regular"   Regular   (classificar 60)
    , assertEqual "classificar 35 = Fraco"     Fraco     (classificar 35)
    , assertEqual "classificar 10 = Critico"   Critico   (classificar 10)
    ]

-- ═══════════════════════════════════════════════════════════════
-- Testes de Crédito
-- ═══════════════════════════════════════════════════════════════

testesCredito :: [TestResult]
testesCredito =
    [ assertEqual "limiteCredito: score 90 = 10000" 10000.0 (calcularLimiteCredito 90)
    , assertEqual "limiteCredito: score 72 = 8000"   8000.0 (calcularLimiteCredito 72)
    , assertEqual "limiteCredito: score 55 = 4000"   4000.0 (calcularLimiteCredito 55)
    , assertEqual "limiteCredito: score 20 = 0"         0.0 (calcularLimiteCredito 20)
    
    -- Teste de parcelas (juros simples)
    , assertEqual "parcela: 4000 MT, 3%, 4 meses = 1120"
        1120.0 (calcularParcela 4000 3 4)
    , assert "parcela: 2000 MT, 3%, 3 meses ≈ 727"
        (let p = calcularParcela 2000 3 3
         in abs (p - 726.67) < 1.0)
    ]

-- ═══════════════════════════════════════════════════════════════
-- Testes de Risco
-- ═══════════════════════════════════════════════════════════════

testesRisco :: [TestResult]
testesRisco =
    [ assertEqual "risco: score 80 = Baixo" RiscoBaixo (riscoNivel (avaliarRisco 80))
    , assertEqual "risco: score 60 = Medio" RiscoMedio (riscoNivel (avaliarRisco 60))
    , assertEqual "risco: score 30 = Alto"  RiscoAlto  (riscoNivel (avaliarRisco 30))
    
    , assert "elegibilidade: score 72, 8 membros = True"
        (fst (elegibilidadeCredito 72 8))
    , assert "elegibilidade: score 20, 8 membros = False"
        (not (fst (elegibilidadeCredito 20 8)))
    , assert "elegibilidade: score 72, 2 membros = False (poucos)"
        (not (fst (elegibilidadeCredito 72 2)))
    
    , assertEqual "cenarios: score 72 → 3 cenários" 3
        (length (simularCenarios 72 4000 8))
    ]

-- ═══════════════════════════════════════════════════════════════
-- Testes de Propriedades (estilo QuickCheck simplificado)
-- ═══════════════════════════════════════════════════════════════

testesPropriedades :: [TestResult]
testesPropriedades =
    [ -- Score sempre entre 0 e 100
      assert "propriedade: score sempre >= 0"
        (all (\s -> scoreTotal s >= 0) scoresVarios)
    , assert "propriedade: score sempre <= 100"
        (all (\s -> scoreTotal s <= 100) scoresVarios)
    
    -- Mais contribuições → score mais alto
    , assert "propriedade: mais pontuais → melhor score"
        (scoreTotal scoreMaisContribs >= scoreTotal scoreMenosContribs)
    
    -- Função pura: mesmo input → mesmo output
    , assert "propriedade: função pura (determinística)"
        (calcPontualidade 5 6 == calcPontualidade 5 6)
    
    -- Grupo maior → mais bónus
    , assert "propriedade: grupo maior → mais bónus"
        (calcBonusGrupo 12 >= calcBonusGrupo 5)
    ]
  where
    mkMembro n cs = Membro "Teste" "84000" Activo cs n 0
    scoreMaisContribs  = calcularScoreIndividual (mkMembro 5 (replicate 5 (contribPontual 200 (MesAno 1 2025)))) 8
    scoreMenosContribs = calcularScoreIndividual (mkMembro 2 (replicate 2 (contribPontual 200 (MesAno 1 2025)))) 8
    
    -- Gerar vários scores para testar propriedades
    scoresVarios = [ calcularScoreIndividual (mkMembro m (replicate m (contribPontual 200 (MesAno 1 2025)))) g
                   | m <- [0..6], g <- [1,5,8,12,15] ]


-- ═══════════════════════════════════════════════════════════════
-- Runner principal
-- ═══════════════════════════════════════════════════════════════

-- | Executar todos os testes: > runTests
runTests :: IO ()
runTests = do
    putStrLn ""
    putStrLn "🌱 AgroXitique — Suite de Testes"
    putStrLn "════════════════════════════════════"
    
    putStrLn "\n📋 Testes de Scoring:"
    mapM_ showResult testesScoring
    
    putStrLn "\n📋 Testes de Classificação:"
    mapM_ showResult testesClassificacao
    
    putStrLn "\n📋 Testes de Crédito:"
    mapM_ showResult testesCredito
    
    putStrLn "\n📋 Testes de Risco:"
    mapM_ showResult testesRisco
    
    putStrLn "\n📋 Testes de Propriedades:"
    mapM_ showResult testesPropriedades
    
    let allTests = testesScoring ++ testesClassificacao ++ testesCredito ++ testesRisco ++ testesPropriedades
        passed  = length (filter isPassed allTests)
        total   = length allTests
    
    putStrLn "\n════════════════════════════════════"
    putStrLn ("  Resultado: " ++ show passed ++ "/" ++ show total ++ " testes passaram")
    if passed == total
        then putStrLn "  ✓ TODOS OS TESTES PASSARAM!"
        else putStrLn ("  ✗ " ++ show (total - passed) ++ " teste(s) falharam")
    putStrLn "════════════════════════════════════\n"
