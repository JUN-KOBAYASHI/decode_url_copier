document.addEventListener('DOMContentLoaded', () => {
  const statusElement = document.getElementById('status');

  // 念のためウィンドウにフォーカスを当てる
  if (window.focus) window.focus();

  // 現在のアクティブなタブを取得
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      statusElement.textContent = "タブが見つかりません";
      statusElement.classList.add('error');
      return;
    }

    const currentTab = tabs[0];
    const rawUrl = currentTab.url;

    // ポップアップ描画とフォーカス安定のためにわずかに待機してから実行
    // これにより "Document is not focused" エラーを回避しやすくします
    setTimeout(() => {
      try {
        // URLをデコード (例: %E3%81%82 -> あ)
        const decodedUrl = decodeURI(rawUrl);

        // クリップボードに書き込む
        navigator.clipboard.writeText(decodedUrl).then(() => {
          statusElement.textContent = "コピーしました！";
          statusElement.classList.add('success');

          // 1秒後に自動的に閉じる
          setTimeout(() => {
            window.close();
          }, 1000);

        }).catch(err => {
          console.error('Copy failed', err);
          statusElement.textContent = "コピーに失敗しました";
          statusElement.classList.add('error');
        });

      } catch (e) {
        console.error('Decode failed', e);
        // デコード失敗時は生URLを試みる
        navigator.clipboard.writeText(rawUrl).catch(err => console.error('Fallback failed', err));
        statusElement.textContent = "デコード失敗(生URLをコピー)";
        statusElement.classList.add('error');
      }
    }, 150); // 150msの遅延を追加
  });
});