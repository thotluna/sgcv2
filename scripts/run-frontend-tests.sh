#!/bin/bash
cd frontend
pnpm test --bail --findRelatedTests --passWithNoTests "$@"