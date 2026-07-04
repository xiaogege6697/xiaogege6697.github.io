import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['index.html','assets/styles.css','assets/app.js','assets/data.js'];
await Promise.all(files.map(file => access(join(root,file))));
const code = await readFile(join(root,'assets/data.js'),'utf8');
const box = {};
new Function('window', code)(box);
const data = box.__PORTFOLIO_V2__;
if (!data || data.repos.length < 1) throw new Error('项目数据为空');
for (const repo of data.repos) {
  for (const key of ['name','url','updatedAt','category']) if (!repo[key]) throw new Error(`${repo.name || '?'} 缺少 ${key}`);
  if (!repo.url.startsWith('https://github.com/')) throw new Error(`${repo.name} URL 非 GitHub`);
}
console.log(`校验通过：${data.repos.length} 个项目，${data.categories.length} 个能力分类。`);
