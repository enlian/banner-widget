# バナーウィジェットコンポーネント

## 概要

このプロジェクトは、複数のバナーを順番に一定の時間で切り替えるシンプルなバナーウィジェットコンポーネントです。バナーは自動的にスクロールし、左右の矢印やページネーションで操作することもできます。PC、iOS、Androidに適応できます。

<img src="screenshot.png" width="500"/>

## 使用方法

### 基本的な使い方

1. **HTMLファイルにコンポーネントを追加**
   - 以下のように、`BannerWidget` を使用するHTMLファイルに追加します。

```html

  <div id="banner-container"></div>

  <script type="module">
    import BannerWidget from './dist/BannerWidget.js';

    const bannerImages = [
      { image: './img/banner_1.png', url: 'https://github.com/enlian' },
      { image: './img/banner_2.png', url: 'https://github.com/enlian' },
      { image: './img/banner_3.png', url: 'https://github.com/enlian' }
    ];

    const bannerContainer = document.getElementById('banner-container');

    bannerContainer && new BannerWidget({
        banners: bannerImages, // バナーリスト、画像とURLを含む
        container: bannerContainer, // バナーコンポーネントのコンテナ
        interval: 3000  // スクロールの間隔時間 (ミリ秒)
    });
  </script>
```

### パラメータの説明

- `banners` (必須)  
  バナーの配列。各バナーは `image` と `url` の2つのプロパティを持つオブジェクトで表現されます。

  ```javascript
  { image: './img/banner_1.png', url: 'https://github.com/enlian' }
  ```

- `container` (必須)  
  バナーウィジェットを挿入するコンテナ要素。`document.getElementById`などで取得したHTML要素を指定します。

- `interval` (オプション)  
  バナーが自動的に切り替わる時間間隔（ミリ秒単位）。デフォルトは `3000` ミリ秒です。

### メソッドの説明

- `startAutoScroll()`  
  自動的にバナーを一定間隔でスクロールさせます。

- `stopAutoScroll()`  
  自動スクロールを停止します。

- `nextBanner()`  
  次のバナーに手動で切り替えます。

- `prevBanner()`  
  前のバナーに手動で切り替えます。

## 調整方法

1. **`src/BannerWidget.ts`を変更する**
   - このファイルには、バナーのロジックが含まれています。必要に応じて調整できます。
  
2. **スタイル調整**
   - `src/styles.scss` ファイルでバナーのデザインを調整できます。Sass でスタイルを記述し、変更があれば再コンパイルしてください。

## 開発およびデバッグ

### ローカル開発環境のセットアップ

必要な依存関係をインストールします。

   ```bash
   npm install
   ```

### ローカルサーバーで実行する

1. `npm run dev` コマンドで開発モードを開始します。これにより、コードを変更すると自動で再ビルドされ、ブラウザが自動更新されます。

   ```bash
   npm run dev
   ```

2. ブラウザで `http://localhost:8080` にアクセスして、コンポーネントを確認できます。

### ビルド

1. `npm run build` コマンドでプロジェクトをビルドし、`dist` フォルダに展開します。

   ```bash
   npm run build
   ```

## デプロイ方法

ビルド後、`dist` フォルダに生成されたファイルをWebサーバーにアップロードします。以下のファイルが含まれます。
   - `index.html`
   - `dist/BannerWidget.js`
   - `dist/styles.css`
   - `dist/img` 


