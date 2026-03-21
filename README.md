# 💧 Beba+ — Water Tracker App

Aplicação mobile desenvolvida com **React Native + Expo**, com o objetivo de auxiliar usuários no controle diário de ingestão de água.

O app permite cadastro de usuários, cálculo automático de meta diária, registro de consumo e envio de notificações de lembrete.

---

## 📱 Funcionalidades

- 🔐 Cadastro e login de usuários (Firebase Authentication)
- 💧 Registro de consumo de água (valores fixos e personalizados)
- 🎯 Cálculo automático da meta diária *(peso × 35ml)*
- 📊 Histórico de consumo por dia
- 🔔 Notificações de lembrete
- 👤 Tela de perfil com dados do usuário
- 🎨 Interface moderna com identidade visual própria (Beba+)

---

## 🎨 Identidade Visual (Dia 2)

- Uso de **gradiente azul** como base do app
- Layout padronizado com **cards e bordas arredondadas**
- Ícones interativos (perfil, logout, notificações)
- Histórico redesenhado com **cards informativos**
- Interface consistente em todas as telas

---

## 🧱 Tecnologias utilizadas

- React Native (Expo)
- Expo Router
- Firebase Authentication
- Firebase Firestore
- Expo Notifications

---

## 🔌 Integrações externas

- **Firebase Authentication** → login e cadastro
- **Firebase Firestore** → armazenamento de dados
- **Expo Notifications** → notificações locais

---

## 🗄️ Estrutura de dados

### 📁 users
- `id` (uid do Firebase)
- `email`
- `weight`
- `age`
- `gender`
- `goal` (meta diária em ml)

### 📁 waterLogs
- `id`
- `userId`
- `date` (YYYY-MM-DD)
- `amount` (ml)

---

## 🔗 Relacionamentos

Um usuário pode possuir vários registros de consumo:


User (1) → (N) WaterLogs


---

## ⚙️ Regras de negócio

- A meta diária é calculada automaticamente:

peso × 35ml

- O consumo é acumulado por dia
- O histórico é agrupado por data

---

## 📲 Telas da aplicação

- Login
- Cadastro
- Home (controle de consumo)
- Perfil

---

## ▶️ Como executar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/water-app.git
2. Acessar a pasta
cd water-app
3. Instalar dependências
npm install
4. Rodar o projeto
npx expo start
5. Executar no celular
Instale o app Expo Go
Escaneie o QR Code exibido no terminal
🔐 Configuração do Firebase

Crie o arquivo:

/src/services/firebaseConfig.js

Adicione suas credenciais:

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

export const app = initializeApp(firebaseConfig);
📌 Status do projeto
✅ Etapa 1 (Concluída)
Interface completa (Login, Cadastro, Home, Perfil)
Navegação entre telas
Autenticação funcional
Persistência de dados (Firestore)
Registro e histórico de consumo
Identidade visual aplicada
🚧 Próximas melhorias
📊 Barra de progresso diária
🔔 Controle de notificações (ativar/desativar)
✏️ Edição de perfil
📈 Estatísticas e gráficos
💧 Animações (copo enchendo)
👨‍💻 Autores
Henrique Kempim
Guilherme
📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.
