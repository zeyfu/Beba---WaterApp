# 💧 Beba+ — Water Tracker App

Aplicação mobile desenvolvida com **React Native + Expo**, com o objetivo de auxiliar usuários no controle diário de ingestão de água de forma inteligente e personalizada.

O app permite cadastro de usuários, cálculo dinâmico de meta diária, registro de consumo, integração com clima e envio de notificações de lembrete.

---

## 📱 Funcionalidades

- 🔐 Cadastro e login de usuários (Firebase Authentication)  
- 💧 Registro de consumo de água (valores fixos e personalizados)  
- 🎯 Cálculo automático da meta diária (peso × 35ml)  
- 🌡️ Ajuste inteligente da meta com base na temperatura atual (API de clima)  
- 📊 Histórico de consumo por dia  
- 📈 Barra de progresso diária  
- 🔔 Notificações de lembrete  
- 👤 Tela de perfil com dados do usuário  
- 🎨 Interface moderna com identidade visual própria (Beba+)  

---

## 🌡️ Ajuste Inteligente de Meta

O app utiliza a API **Open-Meteo** para obter a temperatura atual e ajustar automaticamente a meta diária de hidratação:

- ≥ 35°C → +1000 ml  
- ≥ 30°C → +700 ml  
- ≥ 25°C → +400 ml  
- < 25°C → meta padrão  

---

## 🎨 Identidade Visual

- Gradiente azul como base do app  
- Layout com cards e bordas arredondadas  
- Botões e FAB (Floating Action Button)  
- Ícones interativos (perfil, logout, notificações)  
- Interface consistente e responsiva  

---

## 🧱 Tecnologias utilizadas

- React Native (Expo)  
- Expo Router  
- Firebase Authentication  
- Firebase Firestore  
- Expo Notifications  

---

## 🔌 Integrações externas

- Firebase Authentication → login e cadastro  
- Firebase Firestore → armazenamento de dados  
- Expo Notifications → notificações locais  
- Open-Meteo API → dados climáticos em tempo real  

---

## 🗄️ Estrutura de dados

### 📁 users
```json
{
  "email": "",
  "weight": 0,
  "age": 0,
  "gender": "",
  "goal": 0
}
📁 waterLogs
{
  "userId": "",
  "date": "YYYY-MM-DD",
  "amount": 0
}
🔗 Relacionamentos

User (1) → (N) WaterLogs

⚙️ Regras de negócio
A meta base é calculada automaticamente:
peso × 35ml
A meta pode ser ajustada dinamicamente com base na temperatura
O consumo é acumulado por dia
O histórico é agrupado por data

📲 Telas da aplicação
Login
Cadastro
Home (controle de consumo + clima)
Perfil

▶️ Como executar o projeto
1. Clonar o repositório
git clone https://github.com/zeyfu/WaterApp.git

2. Acessar a pasta
cd watter-app

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
✅ Etapa atual
Interface completa (Login, Cadastro, Home, Perfil)
Navegação entre telas
Autenticação funcional
Persistência de dados (Firestore)
Registro e histórico de consumo
Integração com API de clima
Meta dinâmica baseada em temperatura
Barra de progresso

🚧 Próximas melhorias
📍 Geolocalização automática (GPS)
🔔 Controle de notificações (ativar/desativar)
✏️ Edição completa de perfil
📈 Estatísticas e gráficos
💧 Animações (copo enchendo)
🔥 Sistema de streak (dias consecutivos)

👨‍💻 Autores
Henrique Kempim
Guilherme Andrade

📄 Licença
Projeto acadêmico desenvolvido para fins educacionais.
