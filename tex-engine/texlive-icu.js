// texlive-icu.js — 裁剪 TeX Live 数据包 loader(repack.mjs 生成,勿手改)
// 消费形态与官方 texlive-*.js 一致:BusytexPipeline.load_package 执行本脚本 →
// 注册 preRun → 运行期 FS_createPath/FS_createDataFile 挂载。数据为明文顺排(无 LZ4)。
// 以下 ProvidesPackage 注释行供 BusytexDataPackageResolver 文本扫描:

var Module = typeof BusytexPipeline != 'undefined' ? BusytexPipeline : {};
(() => {
  var metadata = {"files":[{"filename":"/texlive/icudt78l.dat","start":0,"end":16795392}],"remote_package_size":16795392};
  var dirOps = [["/","texlive"]];
  // 数据包的绝对 URL:从 BusytexPipeline.data_packages(load_package 注册的 .js 地址)
  // 里挑出**我们这一包**,把结尾的 .js 换成 .data。
  //
  // **刻意不用 BusytexPipeline.locateFile**(2026-08-14 真机实测踩到):上游那个实现是
  //   data_packages.map(js => js.replace('.js', '.data')).find(f => f.endsWith(name))
  // —— replace 只换**第一处** '.js',而 CDN 主机名 cdn.jsdelivr.net 里就含 '.js',
  // URL 会被改成 cdn.datadelivr.net,endsWith 永远匹配不上 → 返回 undefined → 404。
  // 只要数据包托管在 jsDelivr 上就必然触发,与是否分包无关。
  // 这里用锚定结尾的正则替换,并按包名精确挑选。
  var REMOTE_PACKAGE_BASE = "texlive-icu.data";
  var REMOTE_PACKAGE_NAME = (function () {
    var pkgs = (typeof BusytexPipeline != 'undefined' && BusytexPipeline.data_packages) || [];
    for (var i = 0; i < pkgs.length; i++) {
      if (String(pkgs[i]).replace(/[?#].*$/, '').endsWith("texlive-icu.js"))
        return String(pkgs[i]).replace(/\.js(\?[^#]*)?(#.*)?$/, '.data');
    }
    return REMOTE_PACKAGE_BASE; // 未注册(如 Node 直驱按相对路径读盘)→ 原样
  })();
  function runWithFS(Module) {
    for (var i = 0; i < dirOps.length; i++)
      Module['FS_createPath'](dirOps[i][0], dirOps[i][1], true, true);
    Module['addRunDependency']("datafile_texlive-icu.data");
    (async () => {
      var name = REMOTE_PACKAGE_NAME;
      var byteArray;
      var isNode = typeof process === 'object' && process.versions && process.versions.node && (typeof window === 'undefined');
      if (isNode) {
        byteArray = new Uint8Array(require('fs').readFileSync(name));
      } else {
        var response = await fetch(name);
        if (!response.ok) throw new Error('failed to fetch ' + name + ': HTTP ' + response.status);
        byteArray = new Uint8Array(await response.arrayBuffer());
      }
      if (byteArray.length !== metadata.remote_package_size)
        throw new Error('size mismatch for ' + name + ': ' + byteArray.length + ' != ' + metadata.remote_package_size);
      for (var f of metadata.files)
        Module['FS_createDataFile'](f.filename, null, byteArray.subarray(f.start, f.end), true, true, true);
      Module['removeRunDependency']("datafile_texlive-icu.data");
    })().catch((err) => { console.error('texlive-icu load failed:', err); throw err; });
  }
  if (Module['calledRun']) {
    runWithFS(Module);
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module['preRun'].push(runWithFS);
  }
})();
