#!/bin/bash

echo "🔍 Verificando exports del paquete @sgcv2/shared..."
echo ""

# Verificar que existe el archivo index.ts
if [ ! -f "packages/shared/src/index.ts" ]; then
  echo "❌ ERROR: No se encuentra packages/shared/src/index.ts"
  exit 1
fi

echo "📦 Contenido de packages/shared/src/index.ts:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat packages/shared/src/index.ts
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📁 Estructura de packages/shared/src/:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
tree packages/shared/src/ -L 2 -I 'node_modules|dist' || find packages/shared/src/ -type f -name "*.ts" | head -20
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 Tipos/DTOs importados en el backend:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Extraer todos los imports únicos
echo "Extrayendo imports del backend..."
grep -rh "from '@sgcv2/shared'" backend/src/ | \
  sed -n "s/.*import[[:space:]]*{[[:space:]]*\([^}]*\)[[:space:]]*}.*/\1/p" | \
  tr ',' '\n' | \
  sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
  sort -u | \
  grep -v '^$'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Verifica que todos estos tipos/DTOs estén exportados en packages/shared/src/index.ts"