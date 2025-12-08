#!/bin/bash

# Script para corregir importaciones incorrectas de @sgcv2/shared

echo "🔍 Buscando importaciones incorrectas de @sgcv2/shared..."

# Buscar todas las importaciones con barra final
files_with_trailing_slash=$(grep -rl "from '@sgcv2/shared/'" backend/src/)

if [ -z "$files_with_trailing_slash" ]; then
  echo "✅ No se encontraron importaciones con barra final"
else
  echo "📝 Archivos encontrados con '@sgcv2/shared/':"
  echo "$files_with_trailing_slash"
  
  # Corregir cada archivo (macOS y Linux compatible)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "$files_with_trailing_slash" | xargs sed -i '' "s/@sgcv2\/shared\/'/@sgcv2\/shared'/g"
  else
    # Linux
    echo "$files_with_trailing_slash" | xargs sed -i "s/@sgcv2\/shared\/'/@sgcv2\/shared'/g"
  fi
  
  echo "✅ Importaciones corregidas"
fi

echo ""
echo "🔍 Verificando todas las importaciones de @sgcv2/shared..."
grep -rn "from '@sgcv2/shared" backend/src/ || echo "✅ Todas las importaciones están correctas"