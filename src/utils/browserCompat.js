/**
 * Browser Compatibility Utilities
 * Handles cross-browser compatibility for drag-and-drop with touch support
 * Supports: Chrome, Firefox, Safari, Edge (desktop and mobile)
 */

/**
 * Feature detection for various browser capabilities
 */
export const BrowserFeatures = {
    // Check if touch events are supported
    hasTouchSupport: () => {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    },

    // Check if pointer events are supported
    hasPointerSupport: () => {
        return 'onpointerdown' in window || 
               window.PointerEvent !== undefined;
    },

    // Check if passive event listeners are supported
    hasPassiveSupport: () => {
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    },

    // Detect Safari browser
    isSafari: () => {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },

    // Detect Firefox browser
    isFirefox: () => {
        return /firefox/i.test(navigator.userAgent);
    },

    // Detect Edge browser
    isEdge: () => {
        return /edg/i.test(navigator.userAgent);
    },

    // Detect Chrome browser
    isChrome: () => {
        return /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
    },

    // Check if mobile device
    isMobile: () => {
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
    }
};

/**
 * Normalize event coordinates across mouse, touch, and pointer events
 */
export const EventNormalizer = {
    /**
     * Get normalized coordinates from any event type
     * @param {Event} event - Mouse, Touch, or Pointer event
     * @returns {{x: number, y: number, pageX: number, pageY: number}}
     */
    getCoordinates: (event) => {
        // Pointer events (modern browsers)
        if (event.type.startsWith('pointer')) {
            return {
                x: event.clientX,
                y: event.clientY,
                pageX: event.pageX,
                pageY: event.pageY
            };
        }
        
        // Touch events (mobile)
        if (event.type.startsWith('touch')) {
            const touch = event.touches[0] || event.changedTouches[0];
            if (touch) {
                return {
                    x: touch.clientX,
                    y: touch.clientY,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };
            }
        }
        
        // Mouse events (desktop)
        return {
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY
        };
    },

    /**
     * Get element from coordinates (handles touch vs mouse)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Element|null}
     */
    getElementFromPoint: (x, y) => {
        return document.elementFromPoint(x, y);
    },

    /**
     * Prevent default behavior safely across browsers
     * @param {Event} event
     */
    preventDefault: (event) => {
        if (event.cancelable) {
            event.preventDefault();
        }
    },

    /**
     * Get event options with passive support detection
     * @param {boolean} passive - Whether to use passive mode
     * @returns {Object|boolean}
     */
    getEventOptions: (passive = false) => {
        if (BrowserFeatures.hasPassiveSupport()) {
            return { passive };
        }
        return false;
    }
};

/**
 * Polyfills for older browsers
 */
export const Polyfills = {
    /**
     * Add Element.closest() polyfill for older browsers
     */
    addClosestPolyfill: () => {
        if (!Element.prototype.matches) {
            Element.prototype.matches = 
                Element.prototype.msMatchesSelector || 
                Element.prototype.webkitMatchesSelector;
        }

        if (!Element.prototype.closest) {
            Element.prototype.closest = function(s) {
                let el = this;
                do {
                    if (Element.prototype.matches.call(el, s)) return el;
                    el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }
    },

    /**
     * Add CustomEvent polyfill for IE
     */
    addCustomEventPolyfill: () => {
        if (typeof window.CustomEvent === "function") return;

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        window.CustomEvent = CustomEvent;
    },

    /**
     * Initialize all polyfills
     */
    init: () => {
        Polyfills.addClosestPolyfill();
        Polyfills.addCustomEventPolyfill();
    }
};

/**
 * Touch-specific utilities
 */
export const TouchUtils = {
    /**
     * Prevent scrolling during touch drag
     * @param {Element} element
     */
    preventTouchScroll: (element) => {
        element.addEventListener('touchmove', (e) => {
            EventNormalizer.preventDefault(e);
        }, EventNormalizer.getEventOptions(false));
    },

    /**
     * Check if touch target is large enough (accessibility)
     * Minimum recommended: 44x44 pixels
     * @param {Element} element
     * @returns {boolean}
     */
    isValidTouchTarget: (element) => {
        const rect = element.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
    },

    /**
     * Add touch-friendly class for styling
     * @param {Element} element
     */
    makeTouchFriendly: (element) => {
        if (BrowserFeatures.hasTouchSupport()) {
            element.classList.add('touch-enabled');
        }
    }
};

/**
 * Main compatibility manager
 */
export default class BrowserCompatManager {
    constructor() {
        this.features = BrowserFeatures;
        this.normalizer = EventNormalizer;
        this.touchUtils = TouchUtils;
        this.initialized = false;
    }

    /**
     * Initialize browser compatibility layer
     */
    init() {
        if (this.initialized) return;

        // Add polyfills
        Polyfills.init();

        // Log browser info for debugging
        if (process.env.NODE_ENV === 'development') {
            this.logBrowserInfo();
        }

        this.initialized = true;
    }

    /**
     * Log browser capabilities (development only)
     */
    logBrowserInfo() {
        console.log('Browser Compatibility Info:', {
            touch: this.features.hasTouchSupport(),
            pointer: this.features.hasPointerSupport(),
            passive: this.features.hasPassiveSupport(),
            browser: this.getBrowserName(),
            mobile: this.features.isMobile()
        });
    }

    /**
     * Get browser name
     * @returns {string}
     */
    getBrowserName() {
        if (this.features.isChrome()) return 'Chrome';
        if (this.features.isFirefox()) return 'Firefox';
        if (this.features.isSafari()) return 'Safari';
        if (this.features.isEdge()) return 'Edge';
        return 'Unknown';
    }

    /**
     * Get recommended event types for current browser
     * @returns {{start: string, move: string, end: string}}
     */
    getEventTypes() {
        // Prefer pointer events if available (modern browsers)
        if (this.features.hasPointerSupport()) {
            return {
                start: 'pointerdown',
                move: 'pointermove',
                end: 'pointerup',
                cancel: 'pointercancel'
            };
        }
        
        // Fall back to touch events on mobile
        if (this.features.hasTouchSupport() && this.features.isMobile()) {
            return {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                cancel: 'touchcancel'
            };
        }
        
        // Default to mouse events
        return {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup',
            cancel: 'mouseleave'
        };
    }
}
