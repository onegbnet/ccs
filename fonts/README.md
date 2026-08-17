# fonts —— 网页字体(非 JS 模块,走 assetsDir 发布)

给消费者页面直接用 `@font-face` 引的字体。与 `tex-engine/dist/fonts/` 的区别:
那批是**喂给 WASM 编译器**的(由 JS 按需 fetch 进虚拟文件系统),这批是**浏览器排版**用的。

| 文件 | 用途 | 许可 |
|---|---|---|
| `lmroman10-regular.otf` / `lmroman10-bold.otf` | Latin Modern Roman 10pt —— LaTeX 字标(cvb 首页招牌) | **GUST Font License**,见同目录 `GUST-FONT-LICENSE.txt`,分发必须随附 |

字节来源:TeX Live 官方包内的 `fonts/opentype/public/lm/`,与 tex-engine 数据包里编译用的是同一批。

**为什么不放在消费者自己的静态资产里**:①house 原则是能不占自家 worker/R2 就不占;
②jsDelivr 有大陆镜像(`mjs/runtime/jsdelivr.mjs` 的 `selectJsdelivrCdnHost`),
而 R2 与 workers.dev 在大陆的可达性不可预测。
