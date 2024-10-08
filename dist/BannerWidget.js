var BannerWidget = /** @class */ (function () {
    function BannerWidget(options) {
        this.banners = options.banners;
        this.container = options.container;
        this.interval = options.interval || 3000;
        this.currentIndex = 0;
        this.init();
        options.banners.length > 1 && this.startAutoScroll();
    }
    // 複数のバナーの初期化
    BannerWidget.prototype.init = function () {
        this.render();
        this.addEventListeners();
        this.addSwipeListeners();
    };
    // HTMLを描画する
    BannerWidget.prototype.render = function () {
        var isSingleBanner = this.banners.length === 1; // バナーが1枚だけかどうかをチェック
        this.container.innerHTML = "\n      <div class=\"banner-container\">\n        <img src=\"./img/pic_left_arrow.png\" class=\"arrow arrow-left\" alt=\"Previous\" ".concat(isSingleBanner ? 'style="display:none"' : '', "/>\n        <div class=\"banner-wrapper\">\n          <div class=\"banners\" style=\"width: ").concat(isSingleBanner ? '100%' : this.banners.length * 100, "%\">\n            ").concat(this.banners
            .map(function (banner) { return "<div class=\"banner\" data-url=\"".concat(banner.url, "\"><img src=\"").concat(banner.image, "\" /></div>"); })
            .join(''), "\n          </div>\n        </div>\n        <img src=\"./img/pic_right_arrow.png\" class=\"arrow arrow-right\" alt=\"Next\" ").concat(isSingleBanner ? 'style="display:none"' : '', "/>\n      </div>\n      ").concat(!isSingleBanner ? "\n        <div class=\"pagination\">\n          ".concat(this.banners
            .map(function (_, index) {
            return "<img src=\"./img/text_".concat(index + 1, ".png\" class=\"pagination-item\" data-index=\"").concat(index, "\" />");
        })
            .join(''), "\n        </div>\n      ") : '', "\n    ");
        this.updatePagination();
    };
    // 自動スクロールを開始する
    BannerWidget.prototype.startAutoScroll = function () {
        var _this = this;
        this.timerId = window.setInterval(function () {
            _this.nextBanner();
        }, this.interval);
    };
    BannerWidget.prototype.stopAutoScroll = function () {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    };
    // 次のバナーに切り替える
    BannerWidget.prototype.nextBanner = function () {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
        this.updateBanners();
    };
    // 前のバナーに切り替える
    BannerWidget.prototype.prevBanner = function () {
        this.currentIndex =
            (this.currentIndex - 1 + this.banners.length) % this.banners.length;
        this.updateBanners();
    };
    // バナー表示を更新する
    BannerWidget.prototype.updateBanners = function () {
        var bannersEl = this.container.querySelector(".banners");
        bannersEl.style.transform = "translateX(-".concat(this.currentIndex * 300, "px)");
        this.updatePagination();
    };
    // ページネーションの状態を更新する
    BannerWidget.prototype.updatePagination = function () {
        var _this = this;
        var paginationItems = this.container.querySelectorAll(".pagination-item");
        paginationItems.forEach(function (item, index) {
            var img = item;
            img.src = "./img/text_".concat(index + 1).concat(_this.currentIndex === index ? "_on" : "", ".png");
        });
    };
    // イベントリスナーを追加する
    BannerWidget.prototype.addEventListeners = function () {
        var _this = this;
        var prevBtn = this.container.querySelector(".arrow-left");
        var nextBtn = this.container.querySelector(".arrow-right");
        var paginationItems = this.container.querySelectorAll(".pagination-item");
        var banners = this.container.querySelectorAll(".banner");
        prevBtn === null || prevBtn === void 0 ? void 0 : prevBtn.addEventListener("click", function () {
            _this.stopAutoScroll();
            _this.prevBanner();
            _this.startAutoScroll();
        });
        nextBtn === null || nextBtn === void 0 ? void 0 : nextBtn.addEventListener("click", function () {
            _this.stopAutoScroll();
            _this.nextBanner();
            _this.startAutoScroll();
        });
        paginationItems.forEach(function (item) {
            item.addEventListener("click", function (event) {
                var target = event.target;
                var index = Number(target.getAttribute("data-index"));
                if (!isNaN(index)) {
                    _this.stopAutoScroll();
                    _this.currentIndex = index;
                    _this.updateBanners();
                    _this.startAutoScroll();
                }
            });
        });
        banners.forEach(function (banner) {
            banner.addEventListener("click", function (event) {
                var url = event.currentTarget.getAttribute("data-url");
                if (url) {
                    window.open(url, "_blank");
                }
            });
        });
    };
    // スワイプとドラッグに対応する
    BannerWidget.prototype.addSwipeListeners = function () {
        var _this = this;
        var startX = null;
        this.container.addEventListener("touchstart", function (e) {
            startX = e.touches[0].clientX;
        });
        this.container.addEventListener("touchmove", function (e) {
            if (!startX)
                return;
            var diffX = e.touches[0].clientX - startX;
            if (diffX > 50) {
                _this.prevBanner();
                startX = null;
            }
            else if (diffX < -50) {
                _this.nextBanner();
                startX = null;
            }
        });
        var isDragging = false;
        this.container.addEventListener("mousedown", function (e) {
            startX = e.clientX;
            isDragging = true;
        });
        this.container.addEventListener("mousemove", function (e) {
            if (!isDragging || !startX)
                return;
            var diffX = e.clientX - startX;
            if (diffX > 50) {
                _this.prevBanner();
                startX = null;
                isDragging = false;
            }
            else if (diffX < -50) {
                _this.nextBanner();
                startX = null;
                isDragging = false;
            }
        });
        this.container.addEventListener("mouseup", function () {
            isDragging = false;
        });
    };
    return BannerWidget;
}());
export default BannerWidget;
