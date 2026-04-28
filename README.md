# 🧮 Math Playground

Una plataforma interactiva para explorar, aprender y practicar herramientas matemáticas. Visualiza procedimientos paso a paso y resuelve problemas de forma detallada.

## 📋 Características

- **Cálculos Precisos**: Utiliza fracciones para mantener la precisión exacta en todos los cálculos matemáticos
- **Procedimientos Detallados**: Aprende cómo se resuelven los problemas paso a paso, no solo el resultado final
- **Responsive**: Funciona perfecto en dispositivos móviles, tablets y computadoras
- **Sin Backend**: Toda la aplicación funciona en el navegador
- **Configuración Persistente**: Las configuraciones se guardan en localStorage

## 🛠️ Herramientas Disponibles

### Productos Notables
- Desarrolla productos notables y expresiones algebraicas
- Soporte para binomios, trinomios y polinomios complejos

### Racionalización (Próximamente)
- Racionaliza denominadores con raíces cuadradas
- Soporte para suma y diferencia de raíces

### Evaluación de Polinomios
- Evalúa polinomios en valores específicos
- Muestra el procedimiento paso a paso

### Ecuaciones Lineales
- Resuelve ecuaciones de la forma: ax + b = 0
- Muestra el procedimiento de despeje

### Ecuaciones Cuadráticas
- Resuelve ecuaciones de segundo grado
- Calcula el discriminante y muestra ambas raíces

### Sistemas de Ecuaciones (Próximamente)
- Resuelve sistemas de ecuaciones lineales
- Soporte para múltiples métodos de resolución

### División de Polinomios (Próximamente)
- Método de Horner para división de polinomios
- Visualización interactiva del procedimiento

## 📚 Compendio de Fórmulas

La aplicación incluye un compendio organizado de las principales fórmulas matemáticas:

- **Leyes de Exponentes**: Producto, cociente, potencia de potencia, etc.
- **Logaritmos**: Definición, propiedades y cambio de base
- **Productos Notables**: Cuadrado de binomio, diferencia de cuadrados, cubo de binomio, etc.

Las fórmulas se pueden agrupar por categoría y pueden exportarse a PDF.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18.x o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DivorcedLance/math-playground.git
cd math-playground

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   └── Navigation.tsx   # Navegación
├── pages/              # Páginas principales
│   ├── HomePage.tsx    # Página de inicio
│   ├── FormulasPage.tsx # Página de fórmulas
│   └── ToolPage.tsx    # Página de herramientas
├── tools/              # Herramientas de cálculo
│   ├── NotableProductsTool.tsx
│   ├── LinearEquationsTool.tsx
│   ├── QuadraticEquationsTool.tsx
│   └── PolynomialEvalTool.tsx
├── utils/              # Funciones de utilidad
│   ├── fractions.ts    # Operaciones con fracciones
│   ├── polynomials.ts  # Operaciones con polinomios
│   ├── parser.ts       # Parser de expresiones algebraicas
│   ├── storage.ts      # Operaciones con localStorage
│   └── toolsConfig.ts  # Configuración de herramientas
├── types/              # Definiciones de tipos TypeScript
└── App.tsx            # Componente principal
```

### Arquitectura Modular

El proyecto está diseñado de forma modular para facilitar la adición de nuevas herramientas:

1. Cada herramienta es un componente independiente
2. Las utilidades matemáticas están separadas en funciones reutilizables
3. Las herramientas se registran en `toolsConfig.ts`
4. Se pueden agregar nuevas herramientas sin modificar el core

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite 8** - Empaquetador y servidor de desarrollo
- **Tailwind CSS 4** - Framework de CSS utility-first
- **Fraction.js** - Librería para operaciones con fracciones exactas
- **Lucide React** - Iconos SVG

## 📝 Configuración

### localStorage

La aplicación guarda la configuración en localStorage con el prefijo `math-playground:`. Los datos se persisten entre sesiones.

### Rutas

La aplicación utiliza Client-Side Routing sin necesidad de un router de terceros:

- `/` - Página de inicio
- `/formulas` - Compendio de fórmulas
- `/tool/:toolId` - Herramienta específica

## 🔄 Deployment

La aplicación se despliega automáticamente a GitHub Pages mediante GitHub Actions cuando se hace un push a la rama `main`.

### Configurar GitHub Pages

1. Ve a Settings → Pages
2. Selecciona "GitHub Actions" como fuente de deployment
3. Las compilaciones se harán automáticamente

El workflow se encuentra en `.github/workflows/deploy.yml`

## 🎯 Roadmap

- [ ] Herramienta de Racionalización
- [ ] División de Polinomios (Método de Horner)
- [ ] Sistemas de Ecuaciones Lineales
- [ ] Exportación a PDF de fórmulas
- [ ] Soporte para ecuaciones complejas
- [ ] Modo oscuro mejorado
- [ ] Más fórmulas y ejemplos

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Véase el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un issue en GitHub con detalles sobre el problema.

---

Hecho con ❤️ para estudiantes de matemáticas
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
