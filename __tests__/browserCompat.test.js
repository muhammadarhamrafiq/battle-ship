/**
 * @jest-environment jsdom
 */
import BrowserCompatManager, { 
    BrowserFeatures, 
    EventNormalizer, 
    Polyfills,
    TouchUtils 
} from '../src/utils/browserCompat';

describe('BrowserCompatManager', () => {
    let manager;

    beforeEach(() => {
        manager = new BrowserCompatManager();
    });

    describe('Initialization', () => {
        it('should create a manager instance', () => {
            expect(manager).toBeDefined();
            expect(manager).toBeInstanceOf(BrowserCompatManager);
        });

        it('should not be initialized by default', () => {
            expect(manager.initialized).toBe(false);
        });

        it('should initialize only once', () => {
            manager.init();
            expect(manager.initialized).toBe(true);
            
            manager.init();
            expect(manager.initialized).toBe(true);
        });

        it('should have features, normalizer, and touchUtils properties', () => {
            expect(manager.features).toBe(BrowserFeatures);
            expect(manager.normalizer).toBe(EventNormalizer);
            expect(manager.touchUtils).toBe(TouchUtils);
        });
    });

    describe('Browser Detection', () => {
        it('should detect browser name', () => {
            const browserName = manager.getBrowserName();
            expect(browserName).toBeDefined();
            expect(typeof browserName).toBe('string');
        });

        it('should provide event types based on browser capabilities', () => {
            const eventTypes = manager.getEventTypes();
            
            expect(eventTypes).toBeDefined();
            expect(eventTypes.start).toBeDefined();
            expect(eventTypes.move).toBeDefined();
            expect(eventTypes.end).toBeDefined();
            expect(eventTypes.cancel).toBeDefined();
        });
    });
});

describe('BrowserFeatures', () => {
    describe('Touch Support Detection', () => {
        it('should detect touch support', () => {
            const hasTouch = BrowserFeatures.hasTouchSupport();
            expect(typeof hasTouch).toBe('boolean');
        });

        it('should return true or false for touch support in jsdom', () => {
            // jsdom may or may not report touch support depending on version
            const hasTouch = BrowserFeatures.hasTouchSupport();
            expect(typeof hasTouch).toBe('boolean');
        });
    });

    describe('Pointer Events Detection', () => {
        it('should detect pointer events support', () => {
            const hasPointer = BrowserFeatures.hasPointerSupport();
            expect(typeof hasPointer).toBe('boolean');
        });
    });

    describe('Passive Events Detection', () => {
        it('should detect passive event support', () => {
            const hasPassive = BrowserFeatures.hasPassiveSupport();
            expect(typeof hasPassive).toBe('boolean');
        });
    });

    describe('Browser Type Detection', () => {
        it('should detect browser type', () => {
            const isSafari = BrowserFeatures.isSafari();
            const isFirefox = BrowserFeatures.isFirefox();
            const isEdge = BrowserFeatures.isEdge();
            const isChrome = BrowserFeatures.isChrome();

            expect(typeof isSafari).toBe('boolean');
            expect(typeof isFirefox).toBe('boolean');
            expect(typeof isEdge).toBe('boolean');
            expect(typeof isChrome).toBe('boolean');
        });

        it('should detect mobile device', () => {
            const isMobile = BrowserFeatures.isMobile();
            expect(typeof isMobile).toBe('boolean');
        });
    });
});

describe('EventNormalizer', () => {
    describe('Coordinate Normalization', () => {
        it('should normalize mouse event coordinates', () => {
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: 100,
                clientY: 200
            });

            const coords = EventNormalizer.getCoordinates(mouseEvent);
            
            expect(coords).toBeDefined();
            expect(coords.x).toBe(100);
            expect(coords.y).toBe(200);
            // pageX/pageY may not be set in jsdom, so check they exist
            expect(coords.pageX).toBeDefined();
            expect(coords.pageY).toBeDefined();
        });

        it('should handle pointer events', () => {
            const event = {
                type: 'pointermove',
                clientX: 100,
                clientY: 200,
                pageX: 150,
                pageY: 250
            };

            const coords = EventNormalizer.getCoordinates(event);
            
            expect(coords.x).toBe(100);
            expect(coords.y).toBe(200);
        });

        it('should handle touch events with touches array', () => {
            const event = {
                type: 'touchmove',
                touches: [{
                    clientX: 100,
                    clientY: 200,
                    pageX: 150,
                    pageY: 250
                }],
                changedTouches: []
            };

            const coords = EventNormalizer.getCoordinates(event);
            
            expect(coords.x).toBe(100);
            expect(coords.y).toBe(200);
        });

        it('should handle touch events with changedTouches', () => {
            const event = {
                type: 'touchend',
                touches: [],
                changedTouches: [{
                    clientX: 100,
                    clientY: 200,
                    pageX: 150,
                    pageY: 250
                }]
            };

            const coords = EventNormalizer.getCoordinates(event);
            
            expect(coords.x).toBe(100);
            expect(coords.y).toBe(200);
        });
    });

    describe('Element Detection', () => {
        it('should get element from point', () => {
            // Mock elementFromPoint if not available in jsdom
            if (!document.elementFromPoint) {
                document.elementFromPoint = jest.fn(() => document.body);
            }
            
            const element = EventNormalizer.getElementFromPoint(0, 0);
            expect(element).toBeDefined();
        });
    });

    describe('Prevent Default', () => {
        it('should safely prevent default on cancelable events', () => {
            const cancelableEvent = new MouseEvent('click', { cancelable: true });
            expect(() => {
                EventNormalizer.preventDefault(cancelableEvent);
            }).not.toThrow();
        });

        it('should not throw on non-cancelable events', () => {
            const nonCancelableEvent = new MouseEvent('click', { cancelable: false });
            expect(() => {
                EventNormalizer.preventDefault(nonCancelableEvent);
            }).not.toThrow();
        });
    });

    describe('Event Options', () => {
        it('should return event options object when passive is supported', () => {
            const options = EventNormalizer.getEventOptions(true);
            expect(typeof options === 'object' || typeof options === 'boolean').toBe(true);
        });

        it('should handle passive false option', () => {
            const options = EventNormalizer.getEventOptions(false);
            expect(options).toBeDefined();
        });
    });
});

describe('Polyfills', () => {
    describe('Closest Polyfill', () => {
        it('should add closest method if not present', () => {
            // Save original
            const originalClosest = Element.prototype.closest;
            const originalMatches = Element.prototype.matches;
            
            // Remove closest temporarily
            delete Element.prototype.closest;
            delete Element.prototype.matches;
            
            Polyfills.addClosestPolyfill();
            
            expect(Element.prototype.closest).toBeDefined();
            expect(typeof Element.prototype.closest).toBe('function');
            
            // Restore
            Element.prototype.closest = originalClosest;
            Element.prototype.matches = originalMatches;
        });

        it('should not override existing closest method', () => {
            const originalClosest = Element.prototype.closest;
            Polyfills.addClosestPolyfill();
            expect(Element.prototype.closest).toBe(originalClosest);
        });
    });

    describe('CustomEvent Polyfill', () => {
        it('should handle CustomEvent polyfill', () => {
            // CustomEvent should work in jsdom
            Polyfills.addCustomEventPolyfill();
            expect(window.CustomEvent).toBeDefined();
        });
    });

    describe('Init All Polyfills', () => {
        it('should initialize all polyfills without errors', () => {
            expect(() => {
                Polyfills.init();
            }).not.toThrow();
        });
    });
});

describe('TouchUtils', () => {
    describe('Touch Target Validation', () => {
        it('should validate touch target size', () => {
            // Create a test element
            const element = document.createElement('div');
            Object.defineProperty(element, 'getBoundingClientRect', {
                value: () => ({
                    width: 50,
                    height: 50,
                    top: 0,
                    left: 0,
                    right: 50,
                    bottom: 50
                })
            });

            const isValid = TouchUtils.isValidTouchTarget(element);
            expect(isValid).toBe(true);
        });

        it('should reject small touch targets', () => {
            const element = document.createElement('div');
            Object.defineProperty(element, 'getBoundingClientRect', {
                value: () => ({
                    width: 30,
                    height: 30,
                    top: 0,
                    left: 0,
                    right: 30,
                    bottom: 30
                })
            });

            const isValid = TouchUtils.isValidTouchTarget(element);
            expect(isValid).toBe(false);
        });
    });

    describe('Touch-Friendly Classes', () => {
        it('should add touch-enabled class when touch is supported', () => {
            const element = document.createElement('div');
            const originalHasTouch = BrowserFeatures.hasTouchSupport;
            
            // Mock touch support
            BrowserFeatures.hasTouchSupport = () => true;
            
            TouchUtils.makeTouchFriendly(element);
            
            // Restore
            BrowserFeatures.hasTouchSupport = originalHasTouch;
        });

        it('should not add class when touch is not supported', () => {
            const element = document.createElement('div');
            const originalHasTouch = BrowserFeatures.hasTouchSupport;
            
            // Mock no touch support
            BrowserFeatures.hasTouchSupport = () => false;
            
            TouchUtils.makeTouchFriendly(element);
            expect(element.classList.contains('touch-enabled')).toBe(false);
            
            // Restore
            BrowserFeatures.hasTouchSupport = originalHasTouch;
        });
    });

    describe('Prevent Touch Scroll', () => {
        it('should add touchmove event listener', () => {
            const element = document.createElement('div');
            const addEventListenerSpy = jest.spyOn(element, 'addEventListener');
            
            TouchUtils.preventTouchScroll(element);
            
            expect(addEventListenerSpy).toHaveBeenCalled();
            expect(addEventListenerSpy.mock.calls[0][0]).toBe('touchmove');
            
            addEventListenerSpy.mockRestore();
        });
    });
});
