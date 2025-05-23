class TranslationPopup {
  public popup: HTMLDivElement;
  public applyButton: HTMLButtonElement;
  private closeButton: HTMLButtonElement;
  private currentTarget: HTMLElement | null = null;
  private resizeObserver: ResizeObserver;
  private positionUpdatePending: boolean = false;

  constructor() {
    this.popup = document.createElement("div");
    this.popup.style.cssText = `
      position: fixed;
      background: rgba(16, 18, 27, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  0 0 20px rgba(0, 255, 255, 0.1);
      z-index: 2147483647;
      max-width: 300px;
      font-size: 14px;
      line-height: 1.4;
      color: #e0e0e0;
      white-space: pre-wrap;
      word-wrap: break-word;
      display: none;
      flex-direction: column;
      gap: 8px;
      min-width: 100px;
      min-height: 20px;
      backdrop-filter: blur(10px);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    `;

    // 创建内容容器
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
      position: relative;
      padding-right: 20px;
    `;

    // 创建关闭按钮
    this.closeButton = document.createElement("button");
    this.closeButton.textContent = "×";
    this.closeButton.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      width: 22px;
      height: 22px;
      padding: 0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e0e0e0;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    `;
    this.closeButton.addEventListener("mouseover", () => {
      this.closeButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      this.closeButton.style.transform = "scale(1.1)";
    });
    this.closeButton.addEventListener("mouseout", () => {
      this.closeButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      this.closeButton.style.transform = "scale(1)";
    });
    this.closeButton.addEventListener("click", () => {
      this.popup.style.display = "none";
    });

    this.applyButton = document.createElement("button");
    this.applyButton.textContent = "应用翻译";
    this.applyButton.style.cssText = `
      padding: 6px 12px;
      background: linear-gradient(135deg, #00c6ff, #0072ff);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      align-self: flex-end;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 114, 255, 0.3);
    `;
    this.applyButton.addEventListener("mouseover", () => {
      this.applyButton.style.transform = "translateY(-1px)";
      this.applyButton.style.boxShadow = "0 4px 12px rgba(0, 114, 255, 0.4)";
    });
    this.applyButton.addEventListener("mouseout", () => {
      this.applyButton.style.transform = "translateY(0)";
      this.applyButton.style.boxShadow = "0 2px 8px rgba(0, 114, 255, 0.3)";
    });

    // 将关闭按钮添加到内容容器
    contentContainer.appendChild(this.closeButton);
    
    // 将内容容器和按钮添加到弹出窗口
    this.popup.appendChild(contentContainer);
    this.popup.appendChild(this.applyButton);
    document.body.appendChild(this.popup);

    // 创建 ResizeObserver 来监听尺寸变化
    this.resizeObserver = new ResizeObserver(() => {
      if (this.positionUpdatePending) {
        this.updatePosition();
        this.positionUpdatePending = false;
      }
    });
    this.resizeObserver.observe(this.popup);

    console.log("TranslationPopup: 弹出窗口已添加到页面");
  }

  private updatePosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = this.popup.offsetWidth;
    const popupHeight = this.popup.offsetHeight;

    console.log("TranslationPopup: 计算位置", {
      viewportWidth,
      viewportHeight,
      popupWidth,
      popupHeight
    });

    if (popupWidth === 0 || popupHeight === 0) {
      this.positionUpdatePending = true;
      return;
    }

    // 获取目标元素的位置
    if (!this.currentTarget) return;
    const rect = this.currentTarget.getBoundingClientRect();

    // 计算最佳位置
    let finalX = rect.left;
    let finalY;

    // 优先尝试放在输入框上方
    if (rect.top > popupHeight + 10) {
      finalY = rect.top - popupHeight - 10;
    } else {
      // 如果上方放不下，就放在下方
      finalY = rect.bottom + 10;
    }

    // 确保不超出视口左右边界
    if (finalX + popupWidth > viewportWidth) {
      finalX = viewportWidth - popupWidth - 10;
    }
    if (finalX < 10) {
      finalX = 10;
    }

    // 添加平滑过渡效果
    this.popup.style.transition = "all 0.2s ease";
    this.popup.style.left = `${finalX}px`;
    this.popup.style.top = `${finalY}px`;

    console.log("TranslationPopup: 最终位置", { finalX, finalY });
  }

  show(text: string, x: number, y: number, target: HTMLElement) {
    console.log("TranslationPopup: 显示翻译结果", { text, x, y, target });

    // 先添加文本内容
    const textNode = document.createTextNode(text);
    // 清除之前的内容（除了按钮和内容容器）
    const contentContainer = this.popup.firstChild as HTMLElement;
    while (contentContainer.firstChild !== this.closeButton) {
      contentContainer.removeChild(contentContainer.firstChild!);
    }
    contentContainer.insertBefore(textNode, this.closeButton);

    this.currentTarget = target;

    // 设置显示
    this.popup.style.display = "flex";

    // 标记需要更新位置
    this.positionUpdatePending = true;

    // 强制重绘
    this.popup.offsetHeight;
  }

  applyTranslation() {
    if (!this.currentTarget) return;

    // 获取内容容器中的文本内容（不包括关闭按钮）
    const contentContainer = this.popup.firstChild as HTMLElement;
    const translatedText = contentContainer.childNodes[0].textContent || "";

    if (
      this.currentTarget.isContentEditable ||
      this.currentTarget.getAttribute("contenteditable") === "true"
    ) {
      this.currentTarget.textContent = translatedText;
    } else {
      (this.currentTarget as HTMLInputElement | HTMLTextAreaElement).value =
        translatedText;
    }

    // 应用翻译后关闭弹出窗口
    this.popup.style.display = "none";
  }
}

interface TranslationSettings {
  sourceLanguage: string;
  targetLanguage: string;
}

class Translator {
  public popup: TranslationPopup;
  private debounceTimer: number | null = null;
  private readonly DEBOUNCE_DELAY = 300;
  private settings: TranslationSettings = {
    sourceLanguage: 'zh-CN',
    targetLanguage: 'en'
  };
  private isComposing: boolean = false; // 添加输入法组合状态标记
  private isEnabled = true;

  constructor() {
    this.popup = new TranslationPopup();
    this.initializeEventListeners();
    this.loadSettings();
    
    // 添加应用按钮的点击事件
    this.popup.applyButton.addEventListener("click", () => {
      this.popup.applyTranslation();
    });

    // 从存储中获取初始状态
    chrome.storage.sync.get(['enabled'], (result) => {
      this.isEnabled = result.enabled !== false;
    });

    // 监听来自 popup 的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggleTranslation') {
        this.isEnabled = message.enabled;
      }
    });
  }

  private loadSettings() {
    chrome.storage.sync.get({
      sourceLanguage: 'zh-CN',
      targetLanguage: 'en'
    }, (items: { [key: string]: any }) => {
      this.settings = {
        sourceLanguage: items.sourceLanguage || 'zh-CN',
        targetLanguage: items.targetLanguage || 'en'
      };
    });
  }

  private isPinyin(text: string): boolean {
    // 拼音正则表达式：匹配声母、韵母和声调
    const pinyinPattern = /^[a-z]+[1-5]?$/i;
    // 检查是否只包含英文字母和数字
    const onlyEnglishAndNumbers = /^[a-z0-9]+$/i;
    
    // 如果文本只包含英文字母和数字，且长度小于等于6，可能是拼音
    if (onlyEnglishAndNumbers.test(text) && text.length <= 6) {
      return true;
    }
    
    // 如果文本完全匹配拼音模式，则是拼音
    if (pinyinPattern.test(text)) {
      return true;
    }
    
    return false;
  }

  private async translateText(text: string): Promise<string> {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${this.settings.sourceLanguage}&tl=${this.settings.targetLanguage}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error("Translation error:", error);
      return "翻译失败，请重试";
    }
  }

  private initializeEventListeners() {
    // 使用事件委托，监听所有输入事件
    document.addEventListener("input", (event) => {
      if (!this.isEnabled) return;
      
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        this.handleInput(target);
      }
    });

    // 监听输入法组合事件
    document.addEventListener("compositionstart", (event) => {
      const target = event.target as HTMLElement;
      if (this.isTextInput(target)) {
        this.isComposing = true;
        // 在开始输入法组合时隐藏翻译弹窗
        this.popup.popup.style.display = "none";
      }
    });

    document.addEventListener("compositionend", (event) => {
      const target = event.target as HTMLElement;
      if (this.isTextInput(target)) {
        this.isComposing = false;
        // 在输入法组合结束时处理翻译
        this.handleInput(target);
      }
    });
  }

  private isTextInput(element: HTMLElement): boolean {
    // 检查是否为 ProseMirror 编辑器
    if (element.classList.contains('ProseMirror')) {
      return true;
    }

    // 检查是否为普通输入框
    if (element.tagName === "INPUT" && (element as HTMLInputElement).type === "text") {
      return true;
    }

    // 检查是否为文本区域
    if (element.tagName === "TEXTAREA") {
      return true;
    }

    // 检查是否为可编辑内容
    if (element.isContentEditable || element.getAttribute("contenteditable") === "true") {
      return true;
    }

    return false;
  }

  private getTextFromElement(element: HTMLElement): string {
    // 处理 ProseMirror 编辑器
    if (element.classList.contains('ProseMirror')) {
      return element.textContent || "";
    }
    
    // 处理可编辑内容
    if (
      element.isContentEditable ||
      element.getAttribute("contenteditable") === "true"
    ) {
      return element.textContent || "";
    }
    
    // 处理普通输入框
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value;
    }
    
    return "";
  }

  private handleInput(target: HTMLElement) {
    // 如果正在使用输入法组合，不进行翻译
    if (this.isComposing) {
      return;
    }

    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(async () => {
      const text = this.getTextFromElement(target);
      // 只有当文本不为空且不是单个字符时才进行翻译
      if (text && text.length > 1) {
        const translatedText = await this.translateText(text);
        this.popup.show(translatedText, 0, 0, target);
      }
    }, this.DEBOUNCE_DELAY);
  }
}

// 初始化翻译器
new Translator();
