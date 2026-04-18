# neko Daily — lauyiu.com 复现版

按照 https://lauyiu.com/ 原版 1:1 还原的静态网站，使用 RESTful Table API 替代原版 Cloudflare KV 存储。

---

## 🌐 页面入口

| 页面 | 路径 | 说明 |
|------|------|------|
| 日记主页 | `index.html` | MY DIARY 日记列表与编辑 |
| 联系页 | `contact.html` | CONTACT 联系信息 |
| GitHub 同步 | `github-sync.html` | 代码推送工具（附加功能） |

---

## ✅ 已还原内容

### 视觉设计（完全1:1）
- 背景色：`#E4D2CC`（暖粉米色）
- 左侧固定侧边栏：毛玻璃效果（`rgba(255,255,255,0.18)` + `backdrop-filter: blur(18px)`）
- 侧边栏 Logo：`neko`（French Script MT 草书体）
- 页面标题：`Press Start 2P` 像素字体
- 内容字体：`Noto Serif SC` 宋体
- 日记卡片：`rgba(255,255,255,0.32)` 半透明毛玻璃，圆角 18px
- 按钮：`#a07060` 棕色主色调，像素字体
- 底部 Footer：`@2026 lauyiu` + `Give AI to AI, return humanity to humanity.`

### 功能（完全还原）
- [x] **日记列表**：卡片展示，点击查看详情
- [x] **新建日记**（FAB `+` 按钮）：需管理员解锁
- [x] **编辑日记**：含 EDIT 按钮
- [x] **删除日记**：含 DELETE 按钮
- [x] **查看详情**：弹窗展示完整内容
- [x] **Emoji 图标选择器**：60个 Emoji，网格布局
- [x] **图片上传**：压缩至1200px max，JPEG 0.72质量
- [x] **图片网格展示**（≤3张）& **轮播展示**（>3张）
- [x] **灯箱（Lightbox）**：点击图片全屏查看
- [x] **视频/链接添加**：+ ADD LINK 支持多条
- [x] **置顶功能**（📌 PIN / UNPIN）
- [x] **管理员认证**：点击侧边栏"neko"解锁，默认密码 `neko2026`
- [x] **修改密码**（Modify 链接）
- [x] **Token 过期**：登录后1小时自动过期
- [x] **Toast 提示**：操作反馈

### 联系页（Contact）
- [x] 页面标题 `CONTACT`，与原版一致
- [x] 联系信息：www.nekolauyiu.com + neko@lauyiu.com

---

## 🔐 管理员使用

1. 点击左侧边栏 **`neko`** 标题
2. 输入密码（默认：`neko2026`）
3. 点击 `OK` 解锁
4. 解锁后可：新建/编辑/删除日记、置顶
5. 再次点击 `neko` → 退出登录

**修改密码：** 解锁弹窗中点击 `Modify` → 输入旧密码 + 新密码

---

## 🗄️ 数据表结构

### `diary_entries`
| 字段 | 类型 | 说明 |
|------|------|------|
| id | text | 唯一标识 |
| date | text | 日期 YYYY-MM-DD |
| title | text | 日记标题 |
| content | rich_text | 日记正文（pre-wrap 显示） |
| emoji | text | 帖子图标 Emoji |
| tags | array | 标签数组 |
| images | array | 图片 base64 数组 |
| links | array | 链接数组 `[{url, label}]` |
| pinned | bool | 是否置顶（最多3条） |

---

## 🔄 与原版的差异说明

| 功能 | 原版（lauyiu.com） | 本版 |
|------|-------------------|------|
| 数据存储 | Cloudflare KV | RESTful Table API |
| 身份认证 | Hono + JWT（后端） | 本地密码 + localStorage |
| 密码验证 | `/api/auth` 后端 | 前端本地比对 |
| 置顶上限 | 最多3条（后端限制） | 无限制（前端） |
| 字体 | ZoomlaXiangsu.otf（自定义） | 系统 cursive 回退 |

---

## 📌 推荐下一步

1. 发布上线 → 前往 **Publish 标签页** 一键部署
2. 配置 GitHub 同步 → 打开 `github-sync.html`，填写 Token
3. 如需更换密码，登录后点击 **Modify**

---

@2026 lauyiu
