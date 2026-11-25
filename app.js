const startButton = document.getElementById("startButton");
const statusText = document.getElementById("status");
startButton.addEventListener("click", startSensor);
async function startSensor() {
    try {
        // Device Orientation APIが利用可能か確認
        if (typeof DeviceOrientationEvent === "undefined") {
            statusText.textContent = "センサーAPIを利用できません";
            return;
        }
        // 必要に応じてセンサーの利用許可を要求
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
            const permission =
                await DeviceOrientationEvent.requestPermission();
            if (permission !== "granted") {
                statusText.textContent =
                    "センサーの利用が許可されませんでした";
                return;
            }
        }
        // センサーイベントを登録
        window.addEventListener(
            "deviceorientation",
            showOrientation
        );
        statusText.textContent = "センサー情報を取得しています";
        // 重複登録を防ぐためボタンを無効化
        startButton.disabled = true;
    } catch (error) {
        statusText.textContent = "センサーの開始に失敗しました";
        console.error(error);
    }
}
function showOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    // 傾き情報を取得できない場合
    if (beta === null || gamma === null) {
        statusText.textContent = "センサー情報を取得できません";
        return;
    }
    // センサー情報を画面に表示
    document.getElementById("alpha").textContent =
        alpha === null ? "---" : alpha.toFixed(1) + "°";
    document.getElementById("beta").textContent =
        beta.toFixed(1) + "°";
    document.getElementById("gamma").textContent =
        gamma.toFixed(1) + "°";
    // 傾き角度を移動距離に変換
    let x = gamma * 2;
    let y = beta * 2;
    // 円形の移動範囲に制限
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;
    if (distance > maxDistance) {
        x = x * maxDistance / distance;
        y = y * maxDistance / distance;
    }
    // 円の表示位置を更新
    bubble.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    // 水平状態の判定
    const isLevel =
        Math.abs(beta) <= 3 && Math.abs(gamma) <= 3;
    if (isLevel) {
        bubble.classList.add("level-ok");
        levelStatus.textContent = "水平状態：水平です";
    } else {
        bubble.classList.remove("level-ok");
        levelStatus.textContent = "水平状態：傾いています";
    }
    statusText.textContent = "センサー情報を取得しました";
}