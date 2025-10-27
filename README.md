# FinWise - Landing Page + Authentication

Landing page cho FinWise - Hệ thống Quản lý Chi tiêu Cá nhân qua AI với tích hợp đầy đủ authentication.

## 🚀 Công nghệ sử dụng

- **React 18** - Library JavaScript để xây dựng giao diện người dùng
- **TypeScript** - JavaScript với type safety
- **Vite** - Build tool nhanh và hiện đại
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## ✨ Tính năng

### Landing Page

- Header với navigation responsive
- Hero section với gradient design
- Features showcase với hover animations
- AI Insight section với interactive chat interface
- Pricing section với toggle annual/monthly
- Testimonials section với customer reviews
- Footer với newsletter signup

### Authentication System

- **Đăng ký tài khoản** với email verification
- **Đăng nhập** với email/password
- **Quên mật khẩu** với email reset link
- **Xác thực email** với token verification
- **Đặt lại mật khẩu** với secure token
- **Đăng nhập Google** (ready for integration)
- **JWT token management** với auto-refresh
- **Protected routes** và user session management

## 📦 Cài đặt

```bash
# Clone repository
git clone [your-repo-url]
cd FE_NVIDIA

# Cài đặt dependencies
npm install

# Tạo file environment
cp .env.example .env.local
```

## ⚙️ Cấu hình Environment

Tạo file `.env.local` với các biến sau:

```env
# Backend API Configuration
VITE_API_BASE_URL=https://inc-michaelina-aimpact-66b8b08a.koyeb.app

# Frontend URL (for email verification links)
VITE_FRONTEND_URL=http://localhost:5173

# App Information
VITE_APP_NAME=FinWise
VITE_APP_DESCRIPTION=Hệ thống Quản lý Chi tiêu Cá nhân qua AI
```

## � Không đẩy file .env lên Git

File `.env` thường chứa thông tin nhạy cảm (API keys, secrets). Để tránh vô tình đưa `.env` lên remote, làm theo các bước sau nếu bạn đã commit `.env` hoặc muốn bảo đảm nó không bị push:

1. Thêm `.env` vào `.gitignore` (đã có sẵn trong repo).
2. Nếu `.env` đã được commit, bỏ nó khỏi index và commit lại:

```powershell
# Bỏ .env khỏi git index nhưng giữ file trên disk
git rm --cached .env

# Thêm .env vào .gitignore nếu chưa có
echo ".env" >> .gitignore

# Commit thay đổi
git add .gitignore
git commit -m "Ignore .env and remove from index"

# Đẩy lên remote
git push
```

Lưu ý: Nếu `.env` đã xuất hiện trong lịch sử commit và chứa secret, cân nhắc rotate các secret và dùng công cụ như `git filter-repo` hoặc `BFG Repo-Cleaner` để loại bỏ chúng khỏi lịch sử.

## �🛠️ Scripts có sẵn

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
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx           # Modal đăng nhập/đăng ký
│   │   ├── EmailVerification.tsx   # Component xác thực email
│   │   ├── ResetPassword.tsx       # Component đặt lại mật khẩu
│   │   ├── Header.tsx              # Header với auth integration
│   │   ├── Footer.tsx
│   │   ├── LandingPage.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx     # Hero với auth CTA
│   │       ├── FeaturesSection.tsx
│   │       ├── AIInsightSection.tsx
│   │       ├── PricingSection.tsx
│   │       └── TestimonialsSection.tsx
│   ├── services/
│   │   └── authService.ts          # Authentication service
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── netlify.toml
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🔌 Backend API Endpoints

Authentication system tích hợp với các endpoints sau:

```
POST /api/auth/register          # Đăng ký tài khoản
POST /api/auth/login             # Đăng nhập
POST /api/auth/google-login      # Đăng nhập Google
POST /api/auth/refresh-token     # Refresh JWT token
GET  /api/auth/verify-email/:token           # Xác thực email
POST /api/auth/resend-verification          # Gửi lại email xác thực
POST /api/auth/forgot-password              # Quên mật khẩu
POST /api/auth/reset-password/:token        # Đặt lại mật khẩu
POST /api/auth/change-password              # Đổi mật khẩu (cần auth)
```

## 🔐 Authentication Flow

### 1. Đăng ký tài khoản

```typescript
const result = await authService.register({
  email: "user@example.com",
  password: "password123",
  fullName: "Nguyễn Văn A",
  phone: "0123456789",
});
```

### 2. Xác thực email

- User nhận email với link xác thực
- Click link → `/verify-email/:token`
- Component `EmailVerification` xử lý xác thực

### 3. Đăng nhập

```typescript
const result = await authService.login({
  email: "user@example.com",
  password: "password123",
});
```

### 4. Quên mật khẩu

```typescript
const result = await authService.forgotPassword("user@example.com");
// User nhận email với link reset
// Click link → `/reset-password/:token`
```

## 🎨 UI Components

### AuthModal

Modal đa chức năng với 3 modes:

- **Login**: Form đăng nhập
- **Register**: Form đăng ký với validation
- **Forgot**: Form quên mật khẩu

```typescript
<AuthModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  initialMode="login"
  onSuccess={() => console.log("Auth success!")}
/>
```

### EmailVerification

Trang xác thực email với UI states:

- **Loading**: Đang xác thực
- **Success**: Xác thực thành công + auto redirect
- **Error**: Xác thực thất bại + option resend

### ResetPassword

Form đặt lại mật khẩu với:

- Password strength validation
- Confirm password matching
- Token validation
- Success/error handling

## 🔄 State Management

### AuthService

Centralized authentication service:

```typescript
// Check if user is authenticated
authService.isAuthenticated();

// Get current user info
const user = await authService.getCurrentUser();

// Logout
authService.logout();

// Auto token refresh
// Automatically handles expired tokens
```

### Local Storage

- `accessToken`: JWT access token
- `refreshToken`: JWT refresh token
- Auto-cleanup on logout

## 🚀 Deployment

### Netlify (Đã cấu hình)

```bash
# Build và deploy tự động khi push to master
git push origin master
```

### Manual Deploy

```bash
# Build project
npm run build

# Deploy dist/ folder
```

## 🧪 Testing Authentication

### 1. Chạy Backend

Đảm bảo backend đang chạy tại `https://inc-michaelina-aimpact-66b8b08a.koyeb.app`

### 2. Test Flow

1. Mở landing page
2. Click "Dùng thử miễn phí" → Modal đăng ký
3. Đăng ký tài khoản → Nhận email xác thực
4. Click link xác thực → Redirect về trang chủ
5. Đăng nhập → Header hiển thị user menu
6. Test logout functionality

## 🛡️ Security Features

- **JWT Authentication** với access/refresh tokens
- **Email Verification** bắt buộc
- **Password Hashing** trên backend
- **CORS Protection**
- **Input Validation** và sanitization
- **Auto Token Refresh** khi expired
- **Secure Password Reset** với time-limited tokens

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl
- **Touch-friendly** interactions
- **Optimized modals** cho mobile

## 🎯 Next Steps

1. **Google OAuth Integration**
2. **User Dashboard** sau khi đăng nhập
3. **Profile Management**
4. **Two-Factor Authentication**
5. **Social Login** (Facebook, GitHub)
6. **Progressive Web App** features

## 📞 Support

Nếu gặp vấn đề với authentication:

1. Kiểm tra console logs
2. Verify backend endpoints
3. Check environment variables
4. Test với Postman/curl
   │ └── vite-env.d.ts
   ├── index.html
   ├── package.json
   ├── tailwind.config.js
   ├── postcss.config.js
   ├── tsconfig.json
   ├── tsconfig.node.json
   └── vite.config.ts

````

## 🎨 Tailwind CSS

Project đã được cấu hình sẵn Tailwind CSS. Bạn có thể sử dụng các utility classes của Tailwind ngay lập tức.

Ví dụ:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">Hello Tailwind!</div>
````

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
