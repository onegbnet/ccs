# tex-templates —— 上游 (La)TeX 简历件(喂进 WASM 编译器的 CWD)

消费者(cvb)在浏览器里编译 PDF 时,按模板注册表逐个 fetch 这里的文件,写进
XeLaTeX WASM 的当前目录。**与 `tex-engine/dist/fonts/` 的区别**:那批是引擎侧的
字体资产(CJK 子集、Carlito),这批是**逐套 vendor 的上游简历件本身**。

| 文件 | 来源 | 许可 |
|---|---|---|
| `sb2nov-resume.sty` | [sb2nov/resume](https://github.com/sb2nov/resume) | MIT(许可头在文件内) |
| `resumecls.cls` | CTAN `resumecls`(huxuan) | LPPL-1.3(许可头在文件内) |
| `billryan-resume.cls` | [billryan/resume](https://github.com/billryan/resume) | MIT,见 `billryan-resume.LICENSE` |
| `fontawesome.sty` / `fontawesomesymbols-*.tex` / `FontAwesome.otf` | 上游 billryan 件自带的 FA4 | 见 fontawesome.sty 头部 |
| `Fontin-SmallCaps.otf` | 同上,billryan 件绑定 | Fontin 许可(见上游) |
| `nth.sty` / `xltxtra.sty` | CTAN 补件 | 各自许可头 |
| `cjk-subset.sty` | **本项目自己写的**:把 ccs 的 CJK 子集字体挂成 xeCJK 字族 | MIT(随 ccs) |

**许可头必须原样保留**(LPPL/MIT 的硬要求),改上游件时只做适配、不删版权声明。

为什么放在 ccs 而不是消费者的静态资产里:house 原则是能不占自家 worker/R2 就不占;
jsDelivr 有大陆镜像(`mjs/runtime/jsdelivr.mjs`),R2 与 workers.dev 在大陆可达性不可预测。
