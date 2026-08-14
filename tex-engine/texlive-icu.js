// texlive-icu.js — 裁剪 TeX Live 数据包 loader(repack.mjs 生成,勿手改)
// 消费形态与官方 texlive-*.js 一致:BusytexPipeline.load_package 执行本脚本 →
// 注册 preRun → 运行期 FS_createPath/FS_createDataFile 挂载。数据为明文顺排(无 LZ4)。
// 以下 ProvidesPackage 注释行供 BusytexDataPackageResolver 文本扫描:

var Module = typeof BusytexPipeline != 'undefined' ? BusytexPipeline : {};
(() => {
  var metadata = {"files":[{"filename":"/texlive/icudt78l.dat","start":0,"end":16795392}],"remote_package_size":16795392};
  var dirOps = [["/","texlive"]];
  // locateFile 须在脚本求值期解析:此刻 Module = BusytexPipeline(带静态 locateFile,
  // 按 load_package 注册的 data_packages 把 .js 路径映射到同目录 .data);
  // runWithFS 运行期拿到的是 Emscripten Module,其上没有 locateFile(官方 loader 同此时序)。
  var REMOTE_PACKAGE_BASE = "texlive-icu.data";
  var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
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
