interface Banner {
  image: string;  // 画像のパス
  url: string;    // クリックで移動するURL
}

interface BannerWidgetOptions {
  banners: Banner[];  // バナーリスト、画像とURLを含む
  container: HTMLElement; // バナーコンポーネントのコンテナ
  interval?: number; // バナーのスクロール間隔時間
}

class BannerWidget {
  private banners: Banner[];
  private container: HTMLElement;
  private interval: number;
  private currentIndex: number;
  private timerId: number | undefined;

  constructor(options: BannerWidgetOptions) {
    this.banners = options.banners;
    this.container = options.container;
    this.interval = options.interval || 3000;
    this.currentIndex = 0;

    this.init();
    options.banners.length > 1 && this.startAutoScroll();
  }

  // 複数のバナーの初期化
  private init() {
    this.render();
    this.addEventListeners();
    this.addSwipeListeners();
  }

  // HTMLを描画する
  private render() {
    const isSingleBanner = this.banners.length === 1; // バナーが1枚だけかどうかをチェック
  
    this.container.innerHTML = `
      <div class="banner-container">
        <img src="./img/pic_left_arrow.png" class="arrow arrow-left" alt="Previous" ${isSingleBanner ? 'style="display:none"' : ''}/>
        <div class="banner-wrapper">
          <div class="banners" style="width: ${isSingleBanner ? '100%' : this.banners.length * 100}%">
            ${this.banners
              .map((banner) => `<div class="banner" data-url="${banner.url}"><img src="${banner.image}" /></div>`)
              .join('')}
          </div>
        </div>
        <img src="./img/pic_right_arrow.png" class="arrow arrow-right" alt="Next" ${isSingleBanner ? 'style="display:none"' : ''}/>
      </div>
      ${!isSingleBanner ? `
        <div class="pagination">
          ${this.banners
            .map(
              (_, index) =>
                `<img src="./img/text_${index + 1}.png" class="pagination-item" data-index="${index}" />`
            )
            .join('')}
        </div>
      ` : ''}
    `;
    this.updatePagination();
  }
  
  // 自動スクロールを開始する
  private startAutoScroll() {
    this.timerId = window.setInterval(() => {
      this.nextBanner();
    }, this.interval);
  }

  private stopAutoScroll() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // 次のバナーに切り替える
  private nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
    this.updateBanners();
  }

  // 前のバナーに切り替える
  private prevBanner() {
    this.currentIndex =
      (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    this.updateBanners();
  }

  // バナー表示を更新する
  private updateBanners() {
    const bannersEl = this.container.querySelector(".banners") as HTMLElement;
    bannersEl.style.transform = `translateX(-${this.currentIndex * 300}px)`;
    this.updatePagination();
  }

  // ページネーションの状態を更新する
  private updatePagination() {
    const paginationItems = this.container.querySelectorAll(".pagination-item");
    paginationItems.forEach((item, index) => {
      const img = item as HTMLImageElement;
      img.src = `./img/text_${index + 1}${this.currentIndex === index ? "_on" : ""}.png`;
    });
  }

  // イベントリスナーを追加する
  private addEventListeners() {
    const prevBtn = this.container.querySelector(".arrow-left");
    const nextBtn = this.container.querySelector(".arrow-right");
    const paginationItems = this.container.querySelectorAll(".pagination-item");
    const banners = this.container.querySelectorAll(".banner");

    prevBtn?.addEventListener("click", () => {
      this.stopAutoScroll();
      this.prevBanner();
      this.startAutoScroll();
    });

    nextBtn?.addEventListener("click", () => {
      this.stopAutoScroll();
      this.nextBanner();
      this.startAutoScroll();
    });

    paginationItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const index = Number(target.getAttribute("data-index"));
        if (!isNaN(index)) {
          this.stopAutoScroll();
          this.currentIndex = index;
          this.updateBanners();
          this.startAutoScroll();
        }
      });
    });

    banners.forEach((banner) => {
      banner.addEventListener("click", (event) => {
        const url = (event.currentTarget as HTMLElement).getAttribute(
          "data-url"
        );
        if (url) {
          window.open(url, "_blank");
        }
      });
    });
  }

  // スワイプとドラッグに対応する
  private addSwipeListeners() {
    let startX: number | null = null;

    this.container.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.container.addEventListener("touchmove", (e) => {
      if (!startX) return;

      const diffX = e.touches[0].clientX - startX;
      if (diffX > 50) {
        this.prevBanner();
        startX = null;
      } else if (diffX < -50) {
        this.nextBanner();
        startX = null;
      }
    });

    let isDragging = false;
    this.container.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    this.container.addEventListener("mousemove", (e) => {
      if (!isDragging || !startX) return;

      const diffX = e.clientX - startX;
      if (diffX > 50) {
        this.prevBanner();
        startX = null;
        isDragging = false;
      } else if (diffX < -50) {
        this.nextBanner();
        startX = null;
        isDragging = false;
      }
    });

    this.container.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
}

export default BannerWidget;
