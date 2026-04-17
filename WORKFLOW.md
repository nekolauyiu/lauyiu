# 开发工作流 / Development Workflow

## 分支策略 / Branch Strategy

| 分支 | 用途 |
|------|------|
| `main` | 生产环境，Cloudflare Pages 自动部署 |
| `feat/xxx` | 新功能开发 |
| `fix/xxx` | Bug 修复 |
| `perf/xxx` | 性能优化 |
| `style/xxx` | 样式调整 |

## 迭代记录 / Iteration History

每次迭代均以独立分支开发，合并到 main 后可在 GitHub Pull Requests 查看完整改动记录。

## 历史迭代 / Past Iterations (before branch workflow)

| Commit | 说明 |
|--------|------|
| `79a8885` | 标题/内容字体大小互换，改为宋体 |
| `a640f65` | 修复表情包双重显示问题，改为图标选择器 |
| `2572c61` | 性能优化：KV 并行读取，移除多余 load() |
| `e249c30` | 修复页面永久加载中的 bug |
| `7641bbe` | 列表接口剥离图片数据，响应从 140KB 降至 809B |
| `b9c8500` | 新增标题输入和表情选择器 |
| `a642ccb` | 修复轮播按钮翻页逻辑 |
| `dfe0e70` | 保存/删除后即时更新本地列表 |
| `0b6d1d9` | 修复轮播按钮无响应，禁止点击外部关闭对话框 |
| `889dc4e` | 图片显示完整（object-fit: contain） |
| `441cdb1` | 编辑界面新增删除按钮 |
