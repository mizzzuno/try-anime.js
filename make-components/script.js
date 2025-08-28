// animejs をローカル dev サーバが node_modules を公開しない環境でも確実に読めるよう CDN から ESM で取得
// オフラインで使いたい場合は public/vendor などにコピーして相対パスに変更してください。
// animejs を複数 CDN からフォールバック読み込み
(async () => {
  const cdnCandidates = [
    // 想定パス候補（バージョンにより lib/dist どちらか）
    "https://cdn.jsdelivr.net/npm/animejs@4.1.3/lib/anime.es.js",
    "https://cdn.jsdelivr.net/npm/animejs@4.1.3/dist/anime.es.js",
    "https://cdn.jsdelivr.net/npm/animejs@4.1.3/+esm",
    "https://unpkg.com/animejs@4.1.3/lib/anime.es.js",
    "https://unpkg.com/animejs@4.1.3/dist/anime.es.js",
  ];
  let mod = null;
  for (const url of cdnCandidates) {
    try {
      mod = await import(url);
      console.info("[animejs] loaded from", url);
      break;
    } catch (e) {
      console.warn("[animejs] failed", url);
    }
  }
  if (!mod) {
    console.error(
      "animejs を読み込めませんでした。オフラインか、CDN ブロックの可能性"
    );
    return;
  }

  const { animate, svg } = mod;

  const pathEl = document.querySelector("#suzuka");
  if (!pathEl) {
    console.error("#suzuka path が見つかりません");
    return;
  }

  const { translateX, translateY, rotate } = svg.createMotionPath(pathEl);
  // デバッグ: 長さ確認
  console.log("translateX keyframes:", translateX.length);

  animate(".car", {
    translateX,
    translateY,
    rotate,
    ease: "linear",
    duration: 5000,
    loop: true,
  });

  animate(svg.createDrawable(pathEl), {
    draw: "0 1",
    ease: "linear",
    duration: 5000,
    loop: true,
  });
})();
