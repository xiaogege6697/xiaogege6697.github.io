# xiaogege6697 · Personal IP V2

独立于旧版「个人档案馆」的第二版个人 IP 网站。视觉方向为浅色编辑式系统工作台，内容从 GitHub 公开仓库自动生成。

```bash
npm run fetch
npm run validate
npm run serve
```

访问 `http://localhost:8090`。纯静态、零运行时依赖，可直接部署至 GitHub Pages。

## 数据同步

项目数据来自 GitHub 公开仓库 API，写入 `assets/data.js`。

- 本地手动刷新：`npm run fetch && npm run validate`
- 自动刷新：GitHub Actions 每天 UTC 00:00（北京时间 08:00）运行一次
- 手动触发：在 GitHub Actions 的 `Sync repository data` workflow 中点击 `Run workflow`

自动同步只在 `assets/data.js` 发生变化时提交，提交信息为 `Update repository data`。
