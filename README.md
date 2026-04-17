# neko · Daily Diary

个人工作日记系统，记录每日工作计划与思考。

## 已实现功能

- ✅ 登录认证（JWT，仅限登录，无对外注册）
- ✅ 日记列表 / 新建 / 编辑 / 删除
- ✅ 心情标签 + 自定义标签分类
- ✅ 后台用户管理（Admin 专属）
- ✅ 响应式左侧导航栏

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| neko | neko2026 | 管理员 |

> 首次登录后请在 Admin 页面修改密码或添加新用户。

## 页面路由

| 路径 | 说明 |
|------|------|
| `/login` | 登录页 |
| `/` | 日记主页 |
| `/contact` | 联系页 |
| `/admin` | 用户管理（仅管理员） |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/login` | 登录 |
| POST | `/api/verify` | Token 验证 |
| GET | `/api/diary` | 获取日记列表 |
| POST | `/api/diary` | 新建日记 |
| PUT | `/api/diary/:id` | 更新日记 |
| DELETE | `/api/diary/:id` | 删除日记 |
| GET | `/api/admin/users` | 用户列表 |
| POST | `/api/admin/users` | 创建用户 |
| PUT | `/api/admin/users/:username` | 修改用户 |
| DELETE | `/api/admin/users/:username` | 删除用户 |

## 数据存储

- **Cloudflare KV** — 存储日记条目（key: `diary:{id}`）及用户（key: `user:{username}`）

## 技术栈

- Hono + TypeScript（Cloudflare Pages）
- 原生 Web Crypto API（JWT）
- Tailwind CDN + Playfair Display + Noto Serif SC

## 本地开发

```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
```

## 部署

```bash
npm run deploy
```

---

@2026 lauyiu 劉瑤 · 
