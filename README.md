# FE NVIDIA - React + Vite + TypeScript + Tailwind CSS

Đây là một project React cơ bản được tạo với Vite, TypeScript và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **React 18** - Library JavaScript để xây dựng giao diện người dùng
- **TypeScript** - JavaScript với type safety
- **Vite** - Build tool nhanh và hiện đại
- **Tailwind CSS** - Utility-first CSS framework

## 📦 Cài đặt

```bash
# Clone repository
git clone [your-repo-url]
cd FE_NVIDIA

# Cài đặt dependencies
npm install
```

## 🛠️ Scripts có sẵn

```bash
# Khởi chạy development server
npm run dev

# Build project cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ Cấu trúc project

```
FE_NVIDIA/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🎨 Tailwind CSS

Project đã được cấu hình sẵn Tailwind CSS. Bạn có thể sử dụng các utility classes của Tailwind ngay lập tức.

Ví dụ:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">Hello Tailwind!</div>
```

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
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
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
