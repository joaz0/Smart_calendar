#!/bin/bash
# 🚀 Script de Correção de Lint - Guia Rápido

echo "📋 Smart Calendar - Correção de Lint"
echo "===================================="
echo ""

# Função para contar erros
count_errors() {
    npm run lint 2>&1 | grep "error" | wc -l
}

# Função para mostrar top erros
show_top_errors() {
    echo "🔝 Top 10 tipos de erros:"
    npm run lint 2>&1 | grep -o "@[^/]*/[^ ]*" | sort | uniq -c | sort -nr | head -10
}

# Menu
echo "Escolha uma opção:"
echo ""
echo "1) Contar erros atuais"
echo "2) Mostrar top 10 tipos de erros"
echo "3) Executar correção automática em lote"
echo "4) Migrar para inject() [RECOMENDADO]"
echo "5) Verificar arquivos com mais erros"
echo "6) Executar lint com --fix"
echo "7) Sair"
echo ""
read -p "Opção: " option

case $option in
    1)
        echo ""
        echo "📊 Contando erros..."
        ERRORS=$(count_errors)
        echo "Total de erros: $ERRORS"
        ;;
    2)
        echo ""
        show_top_errors
        ;;
    3)
        echo ""
        echo "🔧 Executando correção automática..."
        node fix-lint-batch.js
        echo ""
        echo "✅ Concluído!"
        ERRORS=$(count_errors)
        echo "Erros restantes: $ERRORS"
        ;;
    4)
        echo ""
        echo "🔄 Migrando para inject()..."
        echo "⚠️  Esta migração pode levar alguns minutos..."
        ng generate @angular/core:inject --path=src/app --defaults
        echo ""
        echo "✅ Migração concluída!"
        ERRORS=$(count_errors)
        echo "Erros restantes: $ERRORS"
        ;;
    5)
        echo ""
        echo "📁 Arquivos com mais erros:"
        npm run lint 2>&1 | grep "error" | cut -d':' -f1 | sort | uniq -c | sort -nr | head -10
        ;;
    6)
        echo ""
        echo "🔧 Executando lint --fix..."
        npm run lint -- --fix
        ;;
    7)
        echo "👋 Até logo!"
        exit 0
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "✨ Processo concluído!"
