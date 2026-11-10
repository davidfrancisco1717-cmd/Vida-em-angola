# Vida em Angola

Primeira versão jogável do protótipo Vida em Angola.

## O que já funciona
- Bairro virtual com casas, ruas, praça e árvores.
- Personagem controlável por teclado (WASD/setas).
- No telemóvel, tocar no cenário faz o personagem caminhar.
- Interface em português com perfil, missão e saldo fictício.

## Executar
É necessário Node.js 20 ou superior.

```bash
npm install
npm run dev
```

## Publicar na Vercel
Importar este repositório na Vercel. Framework: Vite. Build command: `npm run build`. Output directory: `dist`.

## Próximas etapas
1. Criar autenticação e perfis.
2. Criar servidor multijogador em tempo real.
3. Guardar progresso e Kumbu fictício numa base de dados.
4. Criar casas, empregos, veículos, inventário e chat.

Esta versão é um protótipo local; não contém pagamentos reais nem multijogador ligado.
