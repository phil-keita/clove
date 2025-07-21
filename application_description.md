
---

# 📝 Recipe Application – Developer Plan

## 1. **Project Overview and Requirements**

**Purpose:**  
Build a web application that allows users to:
- Enter the name of any recipe (e.g., "Spaghetti Bolognese")
- See generated ingredients, cooking steps, and a relevant YouTube video if available
- Be guided step-by-step through the recipe, with support for timers for each step
- Create accounts to save recipes, liked recipes, and personal info
- Like recipes and help recommend popular ones to other users searching for the same dish

**Key Functional Requirements:**
- User authentication (signup, login, saved data)
- Recipe search and result generation via LLM integration
- Step-by-step interactive cooking guide, including timers
- Integration with YouTube for relevant instructional videos
- Ability to like/favorite recipes, with recommendations based on likes
- Responsive, modern, and user-friendly UI
- Scalable and cost-effective backend & infrastructure

---

## 2. **Technology Stack**

- Frontend: **React.js** (w/ Vite or Create React App), Chakra UI/Material-UI, React Router, Framer Motion (for animations)
- Backend/API: **Node.js** with Express.js
- Database: **Firebase Firestore**
- Authentication: **Firebase Authentication** (email/password & social logins)
- Storage: **Firebase Storage** (if any image uploads in future)
- Hosting: **Firebase Hosting**
- LLM API: **OpenAI GPT-3.5 Turbo** (best cost/performance for recipe generation)
- Video integration: **YouTube Data API** or use "search on YouTube" links

---
