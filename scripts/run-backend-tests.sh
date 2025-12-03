#!/bin/bash
cd backend
# Remover el prefijo "backend/" de cada archivo
files=$(echo "$@" | sed 's|backend/||g')
npx jest --passWithNoTests --findRelatedTests $files