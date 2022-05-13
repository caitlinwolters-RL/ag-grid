/**
          * ag-charts-community - Advanced Charting / Charts supporting Javascript / Typescript / React / Angular / Vue * @version v5.3.0
          * @link https://www.ag-grid.com/
          * @license MIT
          */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Observable = /** @class */ (function () {
    function Observable() {
        // Note that these maps can't be specified generically, so they are kept untyped.
        // Some methods in this class only need generics in their signatures, the generics inside the methods
        // are just for clarity. The generics in signatures allow for static type checking of user provided
        // listeners and for type inference, so that the users wouldn't have to specify the type of parameters
        // of their inline lambdas.
        this.allPropertyListeners = new Map(); // property name => property change listener => scopes
        this.allEventListeners = new Map(); // event type => event listener => scopes
    }
    Observable.prototype.addPropertyListener = function (name, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (!propertyListeners) {
            propertyListeners = new Map();
            allPropertyListeners.set(name, propertyListeners);
        }
        if (!propertyListeners.has(listener)) {
            var scopes_1 = new Set();
            propertyListeners.set(listener, scopes_1);
        }
        var scopes = propertyListeners.get(listener);
        if (scopes) {
            scopes.add(scope);
        }
    };
    Observable.prototype.removePropertyListener = function (name, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (propertyListeners) {
            if (listener) {
                var scopes = propertyListeners.get(listener);
                if (scopes) {
                    scopes.delete(scope);
                    if (!scopes.size) {
                        propertyListeners.delete(listener);
                    }
                }
            }
            else {
                propertyListeners.clear();
            }
        }
    };
    Observable.prototype.notifyPropertyListeners = function (name, oldValue, value) {
        var _this = this;
        var allPropertyListeners = this.allPropertyListeners;
        var propertyListeners = allPropertyListeners.get(name);
        if (propertyListeners) {
            propertyListeners.forEach(function (scopes, listener) {
                scopes.forEach(function (scope) { return listener.call(scope, { type: name, source: _this, value: value, oldValue: oldValue }); });
            });
        }
    };
    Observable.prototype.addEventListener = function (type, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allEventListeners = this.allEventListeners;
        var eventListeners = allEventListeners.get(type);
        if (!eventListeners) {
            eventListeners = new Map();
            allEventListeners.set(type, eventListeners);
        }
        if (!eventListeners.has(listener)) {
            var scopes_2 = new Set();
            eventListeners.set(listener, scopes_2);
        }
        var scopes = eventListeners.get(listener);
        if (scopes) {
            scopes.add(scope);
        }
    };
    Observable.prototype.removeEventListener = function (type, listener, scope) {
        if (scope === void 0) { scope = this; }
        var allEventListeners = this.allEventListeners;
        var eventListeners = allEventListeners.get(type);
        if (eventListeners) {
            if (listener) {
                var scopes = eventListeners.get(listener);
                if (scopes) {
                    scopes.delete(scope);
                    if (!scopes.size) {
                        eventListeners.delete(listener);
                    }
                }
            }
            else {
                eventListeners.clear();
            }
        }
    };
    Observable.prototype.notifyEventListeners = function (types) {
        var _this = this;
        var allEventListeners = this.allEventListeners;
        types.forEach(function (type) {
            var listeners = allEventListeners.get(type);
            if (listeners) {
                listeners.forEach(function (scopes, listener) {
                    scopes.forEach(function (scope) { return listener.call(scope, { type: type, source: _this }); });
                });
            }
        });
    };
    // 'source' is added automatically and is always the object this method belongs to.
    Observable.prototype.fireEvent = function (event) {
        var _this = this;
        var listeners = this.allEventListeners.get(event.type);
        if (listeners) {
            listeners.forEach(function (scopes, listener) {
                scopes.forEach(function (scope) { return listener.call(scope, __assign(__assign({}, event), { source: _this })); });
            });
        }
    };
    Observable.privateKeyPrefix = '_';
    return Observable;
}());
function reactive() {
    var events = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        events[_i] = arguments[_i];
    }
    var debug = events.indexOf('debugger') >= 0;
    return function (target, key) {
        // `target` is either a constructor (static member) or prototype (instance member)
        var privateKey = Observable.privateKeyPrefix + key;
        var privateKeyEvents = privateKey + 'Events';
        if (!target[key]) {
            if (events) {
                target[privateKeyEvents] = events;
            }
            Object.defineProperty(target, key, {
                set: function (value) {
                    var oldValue = this[privateKey];
                    // This is a way to stop inside the setter by adding the special
                    // 'debugger' event to a reactive property, for example:
                    //  @reactive('layoutChange', 'debugger') title?: Caption;
                    if (debug) { // DO NOT REMOVE
                        debugger;
                    }
                    if (value !== oldValue || (typeof value === 'object' && value !== null)) {
                        this[privateKey] = value;
                        this.notifyPropertyListeners(key, oldValue, value);
                        var events_1 = this[privateKeyEvents];
                        if (events_1) {
                            this.notifyEventListeners(events_1);
                        }
                    }
                },
                get: function () {
                    return this[privateKey];
                },
                enumerable: true,
                configurable: true
            });
        }
    };
}

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Padding = /** @class */ (function (_super) {
    __extends(Padding, _super);
    function Padding(top, right, bottom, left) {
        if (top === void 0) { top = 0; }
        if (right === void 0) { right = top; }
        if (bottom === void 0) { bottom = top; }
        if (left === void 0) { left = right; }
        var _this = _super.call(this) || this;
        _this.top = top;
        _this.right = right;
        _this.bottom = bottom;
        _this.left = left;
        return _this;
    }
    Padding.prototype.clear = function () {
        this.top = this.right = this.bottom = this.left = 0;
    };
    __decorate([
        reactive('layoutChange')
    ], Padding.prototype, "top", void 0);
    __decorate([
        reactive('layoutChange')
    ], Padding.prototype, "right", void 0);
    __decorate([
        reactive('layoutChange')
    ], Padding.prototype, "bottom", void 0);
    __decorate([
        reactive('layoutChange')
    ], Padding.prototype, "left", void 0);
    return Padding;
}(Observable));

// For small data structs like a bounding box, objects are superior to arrays
// in terms of performance (by 3-4% in Chrome 71, Safari 12 and by 20% in Firefox 64).
// They are also self descriptive and harder to abuse.
// For example, one has to do:
// `ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);`
// rather than become enticed by the much slower:
// `ctx.strokeRect(...bbox);`
// https://jsperf.com/array-vs-object-create-access
var BBox = /** @class */ (function () {
    function BBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    BBox.prototype.isValid = function () {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
    };
    BBox.prototype.dilate = function (value) {
        this.x -= value;
        this.y -= value;
        this.width += value * 2;
        this.height += value * 2;
    };
    BBox.prototype.containsPoint = function (x, y) {
        return x >= this.x && x <= (this.x + this.width)
            && y >= this.y && y <= (this.y + this.height);
    };
    BBox.prototype.render = function (ctx, params) {
        if (params === void 0) { params = BBox.noParams; }
        ctx.save();
        if (params.resetTransform) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.strokeStyle = params.strokeStyle || 'cyan';
        ctx.lineWidth = params.lineWidth || 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (params.label) {
            ctx.fillStyle = params.fillStyle || 'black';
            ctx.textBaseline = 'bottom';
            ctx.fillText(params.label, this.x, this.y);
        }
        ctx.restore();
    };
    BBox.noParams = {};
    return BBox;
}());

var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * As of Jan 8, 2019, Firefox still doesn't implement
 * `getTransform(): DOMMatrix;`
 * `setTransform(transform?: DOMMatrix2DInit)`
 * in the `CanvasRenderingContext2D`.
 * Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=928150
 * IE11 and Edge 44 also don't have the support.
 * Thus this class, to keep track of the current transform and
 * combine transformations.
 * Standards:
 * https://html.spec.whatwg.org/dev/canvas.html
 * https://www.w3.org/TR/geometry-1/
 */
var Matrix = /** @class */ (function () {
    function Matrix(elements) {
        if (elements === void 0) { elements = [1, 0, 0, 1, 0, 0]; }
        this.elements = elements;
    }
    Matrix.prototype.setElements = function (elements) {
        var e = this.elements;
        // `this.elements = elements.slice()` is 4-5 times slower
        // (in Chrome 71 and FF 64) than manually copying elements,
        // since slicing allocates new memory.
        // The performance of passing parameters individually
        // vs as an array is about the same in both browsers, so we
        // go with a single (array of elements) parameter, because
        // `setElements(elements)` and `setElements([a, b, c, d, e, f])`
        // calls give us roughly the same performance, versus
        // `setElements(...elements)` and `setElements(a, b, c, d, e, f)`,
        // where the spread operator causes a 20-30x performance drop
        // (30x when compiled to ES5's `.apply(this, elements)`
        //  20x when used natively).
        e[0] = elements[0];
        e[1] = elements[1];
        e[2] = elements[2];
        e[3] = elements[3];
        e[4] = elements[4];
        e[5] = elements[5];
        return this;
    };
    Matrix.prototype.setIdentityElements = function () {
        var e = this.elements;
        e[0] = 1;
        e[1] = 0;
        e[2] = 0;
        e[3] = 1;
        e[4] = 0;
        e[5] = 0;
        return this;
    };
    Object.defineProperty(Matrix.prototype, "identity", {
        get: function () {
            var e = this.elements;
            return e[0] === 1 && e[1] === 0 && e[2] === 0 &&
                e[3] === 1 && e[4] === 0 && e[5] === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "a", {
        get: function () {
            return this.elements[0];
        },
        set: function (value) {
            this.elements[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "b", {
        get: function () {
            return this.elements[1];
        },
        set: function (value) {
            this.elements[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "c", {
        get: function () {
            return this.elements[2];
        },
        set: function (value) {
            this.elements[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "d", {
        get: function () {
            return this.elements[3];
        },
        set: function (value) {
            this.elements[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "e", {
        get: function () {
            return this.elements[4];
        },
        set: function (value) {
            this.elements[4] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "f", {
        get: function () {
            return this.elements[5];
        },
        set: function (value) {
            this.elements[5] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Performs the AxB matrix multiplication and saves the result
     * to `C`, if given, or to `A` otherwise.
     */
    Matrix.prototype.AxB = function (A, B, C) {
        var _a = __read(A, 6), m11 = _a[0], m12 = _a[1], m21 = _a[2], m22 = _a[3], m31 = _a[4], m32 = _a[5];
        var _b = __read(B, 6), o11 = _b[0], o12 = _b[1], o21 = _b[2], o22 = _b[3], o31 = _b[4], o32 = _b[5];
        C = C || A;
        C[0] = m11 * o11 + m21 * o12;
        C[1] = m12 * o11 + m22 * o12;
        C[2] = m11 * o21 + m21 * o22;
        C[3] = m12 * o21 + m22 * o22;
        C[4] = m11 * o31 + m21 * o32 + m31;
        C[5] = m12 * o31 + m22 * o32 + m32;
    };
    /**
     * The `other` matrix gets post-multiplied to the current matrix.
     * Returns the current matrix.
     * @param other
     */
    Matrix.prototype.multiplySelf = function (other) {
        this.AxB(this.elements, other.elements);
        return this;
    };
    /**
     * The `other` matrix gets post-multiplied to the current matrix.
     * Returns a new matrix.
     * @param other
     */
    Matrix.prototype.multiply = function (other) {
        var elements = new Array(6);
        this.AxB(this.elements, other.elements, elements);
        return new Matrix(elements);
    };
    Matrix.prototype.preMultiplySelf = function (other) {
        this.AxB(other.elements, this.elements, this.elements);
        return this;
    };
    /**
     * Returns the inverse of this matrix as a new matrix.
     */
    Matrix.prototype.inverse = function () {
        var _a = __read(this.elements, 6), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        return new Matrix([d, -b, -c, a, c * f - d * e, b * e - a * f]);
    };
    /**
     * Save the inverse of this matrix to the given matrix.
     */
    Matrix.prototype.inverseTo = function (other) {
        var _a = __read(this.elements, 6), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        other.setElements([d, -b, -c, a, c * f - d * e, b * e - a * f]);
        return this;
    };
    Matrix.prototype.invertSelf = function () {
        var elements = this.elements;
        var _a = __read(elements, 6), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        var rD = 1 / (a * d - b * c); // reciprocal of determinant
        a *= rD;
        b *= rD;
        c *= rD;
        d *= rD;
        elements[0] = d;
        elements[1] = -b;
        elements[2] = -c;
        elements[3] = a;
        elements[4] = c * f - d * e;
        elements[5] = b * e - a * f;
        return this;
    };
    Matrix.prototype.clone = function () {
        return new Matrix(this.elements.slice());
    };
    Matrix.prototype.transformPoint = function (x, y) {
        var e = this.elements;
        return {
            x: x * e[0] + y * e[2] + e[4],
            y: x * e[1] + y * e[3] + e[5]
        };
    };
    Matrix.prototype.transformBBox = function (bbox, radius, target) {
        if (radius === void 0) { radius = 0; }
        var elements = this.elements;
        var xx = elements[0];
        var xy = elements[1];
        var yx = elements[2];
        var yy = elements[3];
        var h_w = bbox.width * 0.5;
        var h_h = bbox.height * 0.5;
        var cx = bbox.x + h_w;
        var cy = bbox.y + h_h;
        var w, h;
        if (radius) {
            h_w -= radius;
            h_h -= radius;
            var sx = Math.sqrt(xx * xx + yx * yx);
            var sy = Math.sqrt(xy * xy + yy * yy);
            w = Math.abs(h_w * xx) + Math.abs(h_h * yx) + Math.abs(sx * radius);
            h = Math.abs(h_w * xy) + Math.abs(h_h * yy) + Math.abs(sy * radius);
        }
        else {
            w = Math.abs(h_w * xx) + Math.abs(h_h * yx);
            h = Math.abs(h_w * xy) + Math.abs(h_h * yy);
        }
        if (!target) {
            target = new BBox(0, 0, 0, 0);
        }
        target.x = cx * xx + cy * yx + elements[4] - w;
        target.y = cx * xy + cy * yy + elements[5] - h;
        target.width = w + w;
        target.height = h + h;
        return target;
    };
    Matrix.prototype.toContext = function (ctx) {
        // It's fair to say that matrix multiplications are not cheap.
        // However, updating path definitions on every frame isn't either, so
        // it may be cheaper to just translate paths. It's also fair to
        // say, that most paths will have to be re-rendered anyway, say
        // rectangle paths in a bar chart, where an animation would happen when
        // the data set changes and existing bars are morphed into new ones.
        // Or a pie chart, where old sectors are also morphed into new ones.
        // Same for the line chart. The only plausible case where translating
        // existing paths would be enough, is the scatter chart, where marker
        // icons, typically circles, stay the same size. But if circle radii
        // are bound to some data points, even circle paths would have to be
        // updated. And thus it makes sense to optimize for fewer matrix
        // transforms, where transform matrices of paths are mostly identity
        // matrices and `x`/`y`, `centerX`/`centerY` and similar properties
        // are used to define a path at specific coordinates. And only groups
        // are used to collectively apply a transform to a set of nodes.
        // If the matrix is mostly identity (95% of the time),
        // the `if (this.isIdentity)` check can make this call 3-4 times
        // faster on average: https://jsperf.com/matrix-check-first-vs-always-set
        if (this.identity) {
            return;
        }
        var e = this.elements;
        ctx.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
    };
    Matrix.flyweight = function (elements) {
        if (elements) {
            if (elements instanceof Matrix) {
                Matrix.matrix.setElements(elements.elements);
            }
            else {
                Matrix.matrix.setElements(elements);
            }
        }
        else {
            Matrix.matrix.setIdentityElements();
        }
        return Matrix.matrix;
    };
    Matrix.matrix = new Matrix();
    return Matrix;
}());

function createId(instance) {
    var constructor = instance.constructor;
    var className = constructor.className;
    if (!className) {
        throw new Error("The " + constructor + " is missing the 'className' property.");
    }
    return className + '-' + (constructor.id = (constructor.id || 0) + 1);
}

var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var PointerEvents;
(function (PointerEvents) {
    PointerEvents[PointerEvents["All"] = 0] = "All";
    PointerEvents[PointerEvents["None"] = 1] = "None";
})(PointerEvents || (PointerEvents = {}));
/**
 * Abstract scene graph node.
 * Each node can have zero or one parent and belong to zero or one scene.
 */
var Node = /** @class */ (function () {
    function Node() {
        /**
         * Unique node ID in the form `ClassName-NaturalNumber`.
         */
        this.id = createId(this);
        /**
         * Some number to identify this node, typically within a `Group` node.
         * Usually this will be some enum value used as a selector.
         */
        this.tag = NaN;
        /**
         * To simplify the type system (especially in Selections) we don't have the `Parent` node
         * (one that has children). Instead, we mimic HTML DOM, where any node can have children.
         * But we still need to distinguish regular leaf nodes from container leafs somehow.
         */
        this.isContainerNode = false;
        this._children = [];
        // Used to check for duplicate nodes.
        this.childSet = {}; // new Set<Node>()
        // These matrices may need to have package level visibility
        // for performance optimization purposes.
        this.matrix = new Matrix();
        this.inverseMatrix = new Matrix();
        this._dirtyTransform = false;
        this._scalingX = 1;
        this._scalingY = 1;
        /**
         * The center of scaling.
         * The default value of `null` means the scaling center will be
         * determined automatically, as the center of the bounding box
         * of a node.
         */
        this._scalingCenterX = null;
        this._scalingCenterY = null;
        this._rotationCenterX = null;
        this._rotationCenterY = null;
        /**
         * Rotation angle in radians.
         * The value is set as is. No normalization to the [-180, 180) or [0, 360)
         * interval is performed.
         */
        this._rotation = 0;
        this._translationX = 0;
        this._translationY = 0;
        /**
         * Each time a property of the node that effects how it renders changes
         * the `dirty` property of the node should be set to `true`. The change
         * to the `dirty` property of the node will propagate up to its parents
         * and eventually to the scene, at which point an animation frame callback
         * will be scheduled to rerender the scene and its nodes and reset the `dirty`
         * flags of all nodes and the {@link Scene._dirty | Scene} back to `false`.
         * Since changes to node properties are not rendered immediately, it's possible
         * to change as many properties on as many nodes as needed and the rendering
         * will still only happen once in the next animation frame callback.
         * The animation frame callback is only scheduled if it hasn't been already.
         */
        this._dirty = true;
        this._visible = true;
        this.dirtyZIndex = false;
        this._zIndex = 0;
        this.pointerEvents = PointerEvents.All;
    }
    /**
     * This is meaningfully faster than `instanceof` and should be the preferred way
     * of checking inside loops.
     * @param node
     */
    Node.isNode = function (node) {
        return node ? node.matrix !== undefined : false;
    };
    Node.prototype._setScene = function (value) {
        this._scene = value;
        var children = this.children;
        var n = children.length;
        for (var i = 0; i < n; i++) {
            children[i]._setScene(value);
        }
    };
    Object.defineProperty(Node.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype._setParent = function (value) {
        this._parent = value;
    };
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.countChildren = function (depth) {
        if (depth === void 0) { depth = Node.MAX_SAFE_INTEGER; }
        if (depth <= 0) {
            return 0;
        }
        var children = this.children;
        var n = children.length;
        var size = n;
        for (var i = 0; i < n; i++) {
            size += children[i].countChildren(depth - 1);
        }
        return size;
    };
    /**
     * Appends one or more new node instances to this parent.
     * If one needs to:
     * - move a child to the end of the list of children
     * - move a child from one parent to another (including parents in other scenes)
     * one should use the {@link insertBefore} method instead.
     * @param nodes A node or nodes to append.
     */
    Node.prototype.append = function (nodes) {
        // Passing a single parameter to an open-ended version of `append`
        // would be 30-35% slower than this.
        if (Node.isNode(nodes)) {
            nodes = [nodes];
        }
        // The function takes an array rather than having open-ended
        // arguments like `...nodes: Node[]` because the latter is
        // transpiled to a function where the `arguments` object
        // is copied to a temporary array inside a loop.
        // So an array is created either way. And if we already have
        // an array of nodes we want to add, we have to use the prohibitively
        // expensive spread operator to pass it to the function,
        // and, on top of that, the copy of the `arguments` is still made.
        var n = nodes.length;
        for (var i = 0; i < n; i++) {
            var node = nodes[i];
            if (node.parent) {
                throw new Error(node + " already belongs to another parent: " + node.parent + ".");
            }
            if (node.scene) {
                throw new Error(node + " already belongs a scene: " + node.scene + ".");
            }
            if (this.childSet[node.id]) {
                // Cast to `any` to avoid `Property 'name' does not exist on type 'Function'`.
                throw new Error("Duplicate " + node.constructor.name + " node: " + node);
            }
            this._children.push(node);
            this.childSet[node.id] = true;
            node._setParent(this);
            node._setScene(this.scene);
        }
        this.dirty = true;
    };
    Node.prototype.appendChild = function (node) {
        if (node.parent) {
            throw new Error(node + " already belongs to another parent: " + node.parent + ".");
        }
        if (node.scene) {
            throw new Error(node + " already belongs to a scene: " + node.scene + ".");
        }
        if (this.childSet[node.id]) {
            // Cast to `any` to avoid `Property 'name' does not exist on type 'Function'`.
            throw new Error("Duplicate " + node.constructor.name + " node: " + node);
        }
        this._children.push(node);
        this.childSet[node.id] = true;
        node._setParent(this);
        node._setScene(this.scene);
        this.dirty = true;
        return node;
    };
    Node.prototype.removeChild = function (node) {
        if (node.parent === this) {
            var i = this.children.indexOf(node);
            if (i >= 0) {
                this._children.splice(i, 1);
                delete this.childSet[node.id];
                node._setParent();
                node._setScene();
                this.dirty = true;
                return node;
            }
        }
        throw new Error("The node to be removed is not a child of this node.");
    };
    /**
     * Inserts the node `node` before the existing child node `nextNode`.
     * If `nextNode` is null, insert `node` at the end of the list of children.
     * If the `node` belongs to another parent, it is first removed.
     * Returns the `node`.
     * @param node
     * @param nextNode
     */
    Node.prototype.insertBefore = function (node, nextNode) {
        var parent = node.parent;
        if (node.parent) {
            node.parent.removeChild(node);
        }
        if (nextNode && nextNode.parent === this) {
            var i = this.children.indexOf(nextNode);
            if (i >= 0) {
                this._children.splice(i, 0, node);
                this.childSet[node.id] = true;
                node._setParent(this);
                node._setScene(this.scene);
            }
            else {
                throw new Error(nextNode + " has " + parent + " as the parent, "
                    + "but is not in its list of children.");
            }
            this.dirty = true;
        }
        else {
            this.append(node);
        }
        return node;
    };
    Object.defineProperty(Node.prototype, "nextSibling", {
        get: function () {
            var parent = this.parent;
            if (parent) {
                var children = parent.children;
                var index = children.indexOf(this);
                if (index >= 0 && index <= children.length - 1) {
                    return children[index + 1];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.transformPoint = function (x, y) {
        var matrix = Matrix.flyweight(this.matrix);
        var parent = this.parent;
        while (parent) {
            matrix.preMultiplySelf(parent.matrix);
            parent = parent.parent;
        }
        return matrix.invertSelf().transformPoint(x, y);
    };
    Node.prototype.inverseTransformPoint = function (x, y) {
        var matrix = Matrix.flyweight(this.matrix);
        var parent = this.parent;
        while (parent) {
            matrix.preMultiplySelf(parent.matrix);
            parent = parent.parent;
        }
        return matrix.transformPoint(x, y);
    };
    Object.defineProperty(Node.prototype, "dirtyTransform", {
        get: function () {
            return this._dirtyTransform;
        },
        set: function (value) {
            this._dirtyTransform = value;
            if (value) {
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "scalingX", {
        get: function () {
            return this._scalingX;
        },
        set: function (value) {
            if (this._scalingX !== value) {
                this._scalingX = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "scalingY", {
        get: function () {
            return this._scalingY;
        },
        set: function (value) {
            if (this._scalingY !== value) {
                this._scalingY = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "scalingCenterX", {
        get: function () {
            return this._scalingCenterX;
        },
        set: function (value) {
            if (this._scalingCenterX !== value) {
                this._scalingCenterX = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "scalingCenterY", {
        get: function () {
            return this._scalingCenterY;
        },
        set: function (value) {
            if (this._scalingCenterY !== value) {
                this._scalingCenterY = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "rotationCenterX", {
        get: function () {
            return this._rotationCenterX;
        },
        set: function (value) {
            if (this._rotationCenterX !== value) {
                this._rotationCenterX = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "rotationCenterY", {
        get: function () {
            return this._rotationCenterY;
        },
        set: function (value) {
            if (this._rotationCenterY !== value) {
                this._rotationCenterY = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            if (this._rotation !== value) {
                this._rotation = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "rotationDeg", {
        get: function () {
            return this.rotation / Math.PI * 180;
        },
        /**
         * For performance reasons the rotation angle's internal representation
         * is in radians. Therefore, don't expect to get the same number you set.
         * Even with integer angles about a quarter of them from 0 to 359 cannot
         * be converted to radians and back without precision loss.
         * For example:
         *
         *     node.rotationDeg = 11;
         *     console.log(node.rotationDeg); // 10.999999999999998
         *
         * @param value Rotation angle in degrees.
         */
        set: function (value) {
            this.rotation = value / 180 * Math.PI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "translationX", {
        get: function () {
            return this._translationX;
        },
        set: function (value) {
            if (this._translationX !== value) {
                this._translationX = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "translationY", {
        get: function () {
            return this._translationY;
        },
        set: function (value) {
            if (this._translationY !== value) {
                this._translationY = value;
                this.dirtyTransform = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.containsPoint = function (x, y) {
        return false;
    };
    /**
     * Hit testing method.
     * Recursively checks if the given point is inside this node or any of its children.
     * Returns the first matching node or `undefined`.
     * Nodes that render later (show on top) are hit tested first.
     * @param x
     * @param y
     */
    Node.prototype.pickNode = function (x, y) {
        if (!this.visible || this.pointerEvents === PointerEvents.None || !this.containsPoint(x, y)) {
            return;
        }
        var children = this.children;
        if (children.length) {
            // Nodes added later should be hit-tested first,
            // as they are rendered on top of the previously added nodes.
            for (var i = children.length - 1; i >= 0; i--) {
                var hit = children[i].pickNode(x, y);
                if (hit) {
                    return hit;
                }
            }
        }
        else if (!this.isContainerNode) { // a leaf node, but not a container leaf
            return this;
        }
    };
    Node.prototype.computeBBox = function () { return; };
    Node.prototype.computeBBoxCenter = function () {
        var bbox = this.computeBBox && this.computeBBox();
        if (bbox) {
            return [
                bbox.x + bbox.width * 0.5,
                bbox.y + bbox.height * 0.5
            ];
        }
        return [0, 0];
    };
    Node.prototype.computeTransformMatrix = function () {
        // TODO: transforms without center of scaling and rotation correspond directly
        //       to `setAttribute('transform', 'translate(tx, ty) rotate(rDeg) scale(sx, sy)')`
        //       in SVG. Our use cases will mostly require positioning elements (rects, circles)
        //       within a group, rotating groups at right angles (e.g. for axis) and translating
        //       groups. We shouldn't even need `scale(1, -1)` (invert vertically), since this
        //       can be done using D3-like scales already by inverting the output range.
        //       So for now, just assume that centers of scaling and rotation are at the origin.
        // const [bbcx, bbcy] = this.computeBBoxCenter();
        var _a = __read$1([0, 0], 2), bbcx = _a[0], bbcy = _a[1];
        var sx = this.scalingX;
        var sy = this.scalingY;
        var scx;
        var scy;
        if (sx === 1 && sy === 1) {
            scx = 0;
            scy = 0;
        }
        else {
            scx = this.scalingCenterX === null ? bbcx : this.scalingCenterX;
            scy = this.scalingCenterY === null ? bbcy : this.scalingCenterY;
        }
        var r = this.rotation;
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        var rcx;
        var rcy;
        if (r === 0) {
            rcx = 0;
            rcy = 0;
        }
        else {
            rcx = this.rotationCenterX === null ? bbcx : this.rotationCenterX;
            rcy = this.rotationCenterY === null ? bbcy : this.rotationCenterY;
        }
        var tx = this.translationX;
        var ty = this.translationY;
        // The transform matrix `M` is a result of the following transformations:
        // 1) translate the center of scaling to the origin
        // 2) scale
        // 3) translate back
        // 4) translate the center of rotation to the origin
        // 5) rotate
        // 6) translate back
        // 7) translate
        //         (7)          (6)             (5)             (4)           (3)           (2)           (1)
        //     | 1 0 tx |   | 1 0 rcx |   | cos -sin 0 |   | 1 0 -rcx |   | 1 0 scx |   | sx 0 0 |   | 1 0 -scx |
        // M = | 0 1 ty | * | 0 1 rcy | * | sin  cos 0 | * | 0 1 -rcy | * | 0 1 scy | * | 0 sy 0 | * | 0 1 -scy |
        //     | 0 0  1 |   | 0 0  1  |   |  0    0  1 |   | 0 0  1   |   | 0 0  1  |   | 0  0 0 |   | 0 0  1   |
        // Translation after steps 1-4 above:
        var tx4 = scx * (1 - sx) - rcx;
        var ty4 = scy * (1 - sy) - rcy;
        this.dirtyTransform = false;
        this.matrix.setElements([
            cos * sx, sin * sx,
            -sin * sy, cos * sy,
            cos * tx4 - sin * ty4 + rcx + tx,
            sin * tx4 + cos * ty4 + rcy + ty
        ]).inverseTo(this.inverseMatrix);
    };
    Object.defineProperty(Node.prototype, "dirty", {
        get: function () {
            return this._dirty;
        },
        set: function (value) {
            // TODO: check if we are already dirty (e.g. if (this._dirty !== value))
            //       if we are, then all parents and the scene have been
            //       notified already, and we are doing redundant work
            //       (but test if this is indeed the case)
            this._dirty = value;
            if (value) {
                if (this.parent) {
                    this.parent.dirty = true;
                }
                else if (this.scene) {
                    this.scene.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            if (this._visible !== value) {
                this._visible = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "zIndex", {
        get: function () {
            return this._zIndex;
        },
        set: function (value) {
            if (this._zIndex !== value) {
                this._zIndex = value;
                if (this.parent) {
                    this.parent.dirtyZIndex = true;
                }
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Node.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1; // Number.MAX_SAFE_INTEGER
    return Node;
}());

/**
 * Creates a new object with a `parent` as its prototype
 * and copies properties from the `child` into it.
 * @param parent
 * @param child
 */
function chainObjects(parent, child) {
    var obj = Object.create(parent);
    for (var prop in child) {
        if (child.hasOwnProperty(prop)) {
            obj[prop] = child[prop];
        }
    }
    return obj;
}
function getValue(object, path, defaultValue) {
    var parts = Array.isArray(path) ? path : path.split('.');
    var value = object;
    try {
        parts.forEach(function (part) {
            value = value[part];
        });
    }
    catch (e) {
        if (arguments.length === 3) {
            value = defaultValue;
        }
        else {
            throw e;
        }
    }
    return value;
}
function emptyTarget(value) {
    return Array.isArray(value) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
    return (options.clone !== false && options.isMergeableObject(value))
        ? deepMerge(emptyTarget(value), value, options)
        : value;
}
function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
        return cloneUnlessOtherwiseSpecified(element, options);
    });
}
function getMergeFunction(key, options) {
    if (!options.customMerge) {
        return deepMerge;
    }
    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepMerge;
}
function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols
        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
            return target.propertyIsEnumerable(symbol);
        })
        : [];
}
function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
}
function propertyIsOnObject(object, property) {
    try {
        return property in object;
    }
    catch (_) {
        return false;
    }
}
// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
        && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
            && Object.propertyIsEnumerable.call(target, key)); // and also unsafe if they're nonenumerable.
}
function mergeObject(target, source, options) {
    var destination = {};
    if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function (key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    getKeys(source).forEach(function (key) {
        if (propertyIsUnsafe(target, key)) {
            return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        }
        else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
    });
    return destination;
}
function defaultIsMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
}
function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}
function deepMerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
    // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.
    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
    }
    else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
    }
    else {
        return mergeObject(target, source, options);
    }
}
function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value);
}

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Shape = /** @class */ (function (_super) {
    __extends$1(Shape, _super);
    function Shape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastInstanceId = 0;
        _this._fillOpacity = 1;
        _this._strokeOpacity = 1;
        _this._fill = Shape.defaultStyles.fill;
        /**
         * Note that `strokeStyle = null` means invisible stroke,
         * while `lineWidth = 0` means no stroke, and sometimes this can mean different things.
         * For example, a rect shape with an invisible stroke may not align to the pixel grid
         * properly because the stroke affects the rules of alignment, and arc shapes forming
         * a pie chart will have a gap between them if they have an invisible stroke, whereas
         * there would be not gap if there was no stroke at all.
         * The preferred way of making the stroke invisible is setting the `lineWidth` to zero,
         * unless specific looks that is achieved by having an invisible stroke is desired.
         */
        _this._stroke = Shape.defaultStyles.stroke;
        _this._strokeWidth = Shape.defaultStyles.strokeWidth;
        _this._lineDash = Shape.defaultStyles.lineDash;
        _this._lineDashOffset = Shape.defaultStyles.lineDashOffset;
        _this._lineCap = Shape.defaultStyles.lineCap;
        _this._lineJoin = Shape.defaultStyles.lineJoin;
        _this._opacity = Shape.defaultStyles.opacity;
        _this.onShadowChange = function () {
            _this.dirty = true;
        };
        _this._fillShadow = Shape.defaultStyles.fillShadow;
        _this._strokeShadow = Shape.defaultStyles.strokeShadow;
        return _this;
    }
    /**
     * Creates a light-weight instance of the given shape (that serves as a template).
     * The created instance only stores the properites set on the instance itself
     * and the rest of the properties come via the prototype chain from the template.
     * This can greatly reduce memory usage in cases where one has many simular shapes,
     * for example, circles of different size, position and color. The exact memory usage
     * reduction will depend on the size of the template and the number of own properties
     * set on its lightweight instances, but will typically be around an order of magnitude
     * or more.
     *
     * Note: template shapes are not supposed to be part of the scene graph (they should not
     * have a parent).
     *
     * @param template
     */
    Shape.createInstance = function (template) {
        var shape = Object.create(template);
        shape._setParent(undefined);
        shape.id = template.id + '-Instance-' + String(++template.lastInstanceId);
        return shape;
    };
    /**
     * Restores the default styles introduced by this subclass.
     */
    Shape.prototype.restoreOwnStyles = function () {
        var styles = this.constructor.defaultStyles;
        var keys = Object.getOwnPropertyNames(styles);
        // getOwnPropertyNames is about 2.5 times faster than
        // for..in with the hasOwnProperty check and in this
        // case, where most properties are inherited, can be
        // more then an order of magnitude faster.
        for (var i = 0, n = keys.length; i < n; i++) {
            var key = keys[i];
            this[key] = styles[key];
        }
    };
    Shape.prototype.restoreAllStyles = function () {
        var styles = this.constructor.defaultStyles;
        for (var property in styles) {
            this[property] = styles[property];
        }
    };
    /**
     * Restores the base class default styles that have been overridden by this subclass.
     */
    Shape.prototype.restoreOverriddenStyles = function () {
        var styles = this.constructor.defaultStyles;
        var protoStyles = Object.getPrototypeOf(styles);
        for (var property in styles) {
            if (styles.hasOwnProperty(property) && protoStyles.hasOwnProperty(property)) {
                this[property] = styles[property];
            }
        }
    };
    Object.defineProperty(Shape.prototype, "fillOpacity", {
        get: function () {
            return this._fillOpacity;
        },
        set: function (value) {
            if (this._fillOpacity !== value) {
                this._fillOpacity = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeOpacity", {
        get: function () {
            return this._strokeOpacity;
        },
        set: function (value) {
            if (this._strokeOpacity !== value) {
                this._strokeOpacity = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "fill", {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            if (this._fill !== value) {
                this._fill = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "stroke", {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            if (this._stroke !== value) {
                this._stroke = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "alignment", {
        // An offset value to align to the pixel grid.
        get: function () {
            return Math.floor(this.strokeWidth) % 2 / 2;
        },
        enumerable: true,
        configurable: true
    });
    // Returns the aligned `start` or `length` value.
    // For example: `start` could be `y` and `length` could be `height` of a rectangle.
    Shape.prototype.align = function (alignment, start, length) {
        if (length != undefined) {
            return Math.floor(length) + Math.floor(start % 1 + length % 1);
        }
        return Math.floor(start) + alignment;
    };
    Object.defineProperty(Shape.prototype, "lineDash", {
        get: function () {
            return this._lineDash;
        },
        set: function (value) {
            var oldValue = this._lineDash;
            if (oldValue !== value) {
                if (oldValue && value && oldValue.length === value.length) {
                    var identical = true;
                    var n = value.length;
                    for (var i = 0; i < n; i++) {
                        if (oldValue[i] !== value[i]) {
                            identical = false;
                            break;
                        }
                    }
                    if (identical) {
                        return;
                    }
                }
                this._lineDash = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "lineDashOffset", {
        get: function () {
            return this._lineDashOffset;
        },
        set: function (value) {
            if (this._lineDashOffset !== value) {
                this._lineDashOffset = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "lineCap", {
        get: function () {
            return this._lineCap;
        },
        set: function (value) {
            if (this._lineCap !== value) {
                this._lineCap = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "lineJoin", {
        get: function () {
            return this._lineJoin;
        },
        set: function (value) {
            if (this._lineJoin !== value) {
                this._lineJoin = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "opacity", {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            value = Math.min(1, Math.max(0, value));
            if (this._opacity !== value) {
                this._opacity = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "fillShadow", {
        get: function () {
            return this._fillShadow;
        },
        set: function (value) {
            var oldValue = this._fillShadow;
            if (oldValue !== value) {
                if (oldValue) {
                    oldValue.removeEventListener('change', this.onShadowChange);
                }
                if (value) {
                    value.addEventListener('change', this.onShadowChange);
                }
                this._fillShadow = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeShadow", {
        get: function () {
            return this._strokeShadow;
        },
        set: function (value) {
            var oldValue = this._strokeShadow;
            if (oldValue !== value) {
                if (oldValue) {
                    oldValue.removeEventListener('change', this.onShadowChange);
                }
                if (value) {
                    value.addEventListener('change', this.onShadowChange);
                }
                this._strokeShadow = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Shape.prototype.fillStroke = function (ctx) {
        if (!this.scene) {
            return;
        }
        var pixelRatio = this.scene.canvas.pixelRatio || 1;
        var globalAlpha = ctx.globalAlpha;
        if (this.fill) {
            ctx.fillStyle = this.fill;
            ctx.globalAlpha = globalAlpha * this.opacity * this.fillOpacity;
            // The canvas context scaling (depends on the device's pixel ratio)
            // has no effect on shadows, so we have to account for the pixel ratio
            // manually here.
            var fillShadow = this.fillShadow;
            if (fillShadow && fillShadow.enabled) {
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            ctx.fill();
        }
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        if (this.stroke && this.strokeWidth) {
            ctx.strokeStyle = this.stroke;
            ctx.globalAlpha = globalAlpha * this.opacity * this.strokeOpacity;
            ctx.lineWidth = this.strokeWidth;
            if (this.lineDash) {
                ctx.setLineDash(this.lineDash);
            }
            if (this.lineDashOffset) {
                ctx.lineDashOffset = this.lineDashOffset;
            }
            if (this.lineCap) {
                ctx.lineCap = this.lineCap;
            }
            if (this.lineJoin) {
                ctx.lineJoin = this.lineJoin;
            }
            var strokeShadow = this.strokeShadow;
            if (strokeShadow && strokeShadow.enabled) {
                ctx.shadowColor = strokeShadow.color;
                ctx.shadowOffsetX = strokeShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = strokeShadow.yOffset * pixelRatio;
                ctx.shadowBlur = strokeShadow.blur * pixelRatio;
            }
            ctx.stroke();
        }
    };
    Shape.prototype.containsPoint = function (x, y) {
        return this.isPointInPath(x, y);
    };
    /**
     * Defaults for style properties. Note that properties that affect the position
     * and shape of the node are not considered style properties, for example:
     * `x`, `y`, `width`, `height`, `radius`, `rotation`, etc.
     * Can be used to reset to the original styling after some custom styling
     * has been applied (using the `restoreOwnStyles` and `restoreAllStyles` methods).
     * These static defaults are meant to be inherited by subclasses.
     */
    Shape.defaultStyles = chainObjects({}, {
        fill: 'black',
        stroke: undefined,
        strokeWidth: 0,
        lineDash: undefined,
        lineDashOffset: 0,
        lineCap: undefined,
        lineJoin: undefined,
        opacity: 1,
        fillShadow: undefined,
        strokeShadow: undefined
    });
    return Shape;
}(Node));

/**
 * Wraps the native Canvas element and overrides its CanvasRenderingContext2D to
 * provide resolution independent rendering based on `window.devicePixelRatio`.
 */
var HdpiCanvas = /** @class */ (function () {
    // The width/height attributes of the Canvas element default to
    // 300/150 according to w3.org.
    function HdpiCanvas(document, width, height) {
        if (document === void 0) { document = window.document; }
        if (width === void 0) { width = 600; }
        if (height === void 0) { height = 300; }
        this._container = undefined;
        // `NaN` is deliberate here, so that overrides are always applied
        // and the `resetTransform` inside the `resize` method works in IE11.
        this._pixelRatio = NaN;
        this._width = 0;
        this._height = 0;
        this.document = document;
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.element.style.userSelect = 'none';
        this.element.style.display = 'block';
        this.setPixelRatio();
        this.resize(width, height);
    }
    Object.defineProperty(HdpiCanvas.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (value) {
            if (this._container !== value) {
                this.remove();
                if (value) {
                    value.appendChild(this.element);
                }
                this._container = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.prototype.remove = function () {
        var parentNode = this.element.parentNode;
        if (parentNode != null) {
            parentNode.removeChild(this.element);
        }
    };
    HdpiCanvas.prototype.destroy = function () {
        this.element.remove();
        this._canvas = undefined;
        Object.freeze(this);
    };
    HdpiCanvas.prototype.toImage = function () {
        var img = this.document.createElement('img');
        img.src = this.getDataURL();
        return img;
    };
    HdpiCanvas.prototype.getDataURL = function (type) {
        return this.element.toDataURL(type);
    };
    /**
     * @param fileName The name of the file upon save. The `.png` extension is going to be added automatically.
     */
    HdpiCanvas.prototype.download = function (fileName) {
        fileName = ((fileName || '').trim() || 'image') + '.png';
        // Chart images saved as JPEG are a few times larger at 50% quality than PNG images,
        // so we don't support saving to JPEG.
        var type = 'image/png';
        var dataUrl = this.getDataURL(type);
        var document = this.document;
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a); // required for the `click` to work in Firefox
        a.click();
        document.body.removeChild(a);
    };
    Object.defineProperty(HdpiCanvas.prototype, "pixelRatio", {
        get: function () {
            return this._pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Changes the pixel ratio of the Canvas element to the given value,
     * or uses the window.devicePixelRatio (default), then resizes the Canvas
     * element accordingly (default).
     */
    HdpiCanvas.prototype.setPixelRatio = function (ratio) {
        var pixelRatio = ratio || window.devicePixelRatio;
        if (pixelRatio === this.pixelRatio) {
            return;
        }
        HdpiCanvas.overrideScale(this.context, pixelRatio);
        this._pixelRatio = pixelRatio;
        this.resize(this.width, this.height);
    };
    Object.defineProperty(HdpiCanvas.prototype, "pixelated", {
        get: function () {
            return this.element.style.imageRendering === 'pixelated';
        },
        set: function (value) {
            this.element.style.imageRendering = value ? 'pixelated' : 'auto';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.prototype.resize = function (width, height) {
        if (!(width > 0 && height > 0)) {
            return;
        }
        var _a = this, element = _a.element, context = _a.context, pixelRatio = _a.pixelRatio;
        element.width = Math.round(width * pixelRatio);
        element.height = Math.round(height * pixelRatio);
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        context.resetTransform();
        this._width = width;
        this._height = height;
    };
    Object.defineProperty(HdpiCanvas, "textMeasuringContext", {
        get: function () {
            if (this._textMeasuringContext) {
                return this._textMeasuringContext;
            }
            var canvas = document.createElement('canvas');
            return this._textMeasuringContext = canvas.getContext('2d');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas, "svgText", {
        get: function () {
            if (this._svgText) {
                return this._svgText;
            }
            var xmlns = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(xmlns, 'svg');
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            // Add a descriptive class name in case someone sees this SVG element
            // in devtools and wonders about its purpose:
            if (svg.classList) {
                svg.classList.add('text-measuring-svg');
            }
            else {
                svg.setAttribute('class', 'text-measuring-svg');
            }
            svg.style.position = 'absolute';
            svg.style.top = '-1000px';
            svg.style.visibility = 'hidden';
            var svgText = document.createElementNS(xmlns, 'text');
            svgText.setAttribute('x', '0');
            svgText.setAttribute('y', '30');
            svgText.setAttribute('text', 'black');
            svg.appendChild(svgText);
            document.body.appendChild(svg);
            this._svgText = svgText;
            return svgText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HdpiCanvas, "has", {
        get: function () {
            if (this._has) {
                return this._has;
            }
            var isChrome = navigator.userAgent.indexOf('Chrome') > -1;
            var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
            var isSafari = !isChrome && navigator.userAgent.indexOf('Safari') > -1;
            return this._has = Object.freeze({
                textMetrics: this.textMeasuringContext.measureText('test').actualBoundingBoxDescent !== undefined
                    // Firefox implemented advanced TextMetrics object in v74:
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1102584
                    // but it's buggy, so we'll keed using the SVG for text measurement in Firefox for now.
                    && !isFirefox && !isSafari,
                getTransform: this.textMeasuringContext.getTransform !== undefined
            });
        },
        enumerable: true,
        configurable: true
    });
    HdpiCanvas.measureText = function (text, font, textBaseline, textAlign) {
        var ctx = this.textMeasuringContext;
        ctx.font = font;
        ctx.textBaseline = textBaseline;
        ctx.textAlign = textAlign;
        return ctx.measureText(text);
    };
    /**
     * Returns the width and height of the measured text.
     * @param text The single-line text to measure.
     * @param font The font shorthand string.
     */
    HdpiCanvas.getTextSize = function (text, font) {
        if (this.has.textMetrics) {
            var ctx = this.textMeasuringContext;
            ctx.font = font;
            var metrics = ctx.measureText(text);
            return {
                width: metrics.width,
                height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
            };
        }
        else {
            return this.measureSvgText(text, font);
        }
    };
    HdpiCanvas.measureSvgText = function (text, font) {
        var cache = this.textSizeCache;
        var fontCache = cache[font];
        // Note: consider not caching the size of numeric strings.
        // For example: if (isNaN(+text)) { // skip
        if (fontCache) {
            var size_1 = fontCache[text];
            if (size_1) {
                return size_1;
            }
        }
        else {
            cache[font] = {};
        }
        var svgText = this.svgText;
        svgText.style.font = font;
        svgText.textContent = text;
        // `getBBox` returns an instance of `SVGRect` with the same `width` and `height`
        // measurements as `DOMRect` instance returned by the `getBoundingClientRect`.
        // But the `SVGRect` instance has half the properties of the `DOMRect`,
        // so we use the `getBBox` method.
        var bbox = svgText.getBBox();
        var size = {
            width: bbox.width,
            height: bbox.height
        };
        cache[font][text] = size;
        return size;
    };
    HdpiCanvas.overrideScale = function (ctx, scale) {
        var depth = 0;
        var overrides = {
            save: function () {
                this.$save();
                depth++;
            },
            restore: function () {
                if (depth > 0) {
                    this.$restore();
                    depth--;
                }
            },
            setTransform: function (a, b, c, d, e, f) {
                this.$setTransform(a * scale, b * scale, c * scale, d * scale, e * scale, f * scale);
            },
            resetTransform: function () {
                // As of Jan 8, 2019, `resetTransform` is still an "experimental technology",
                // and doesn't work in IE11 and Edge 44.
                this.$setTransform(scale, 0, 0, scale, 0, 0);
                this.save();
                depth = 0;
                // The scale above will be impossible to restore,
                // because we override the `ctx.restore` above and
                // check `depth` there.
            }
        };
        for (var name_1 in overrides) {
            if (overrides.hasOwnProperty(name_1)) {
                // Save native methods under prefixed names,
                // if this hasn't been done by the previous overrides already.
                if (!ctx['$' + name_1]) {
                    ctx['$' + name_1] = ctx[name_1];
                }
                // Replace native methods with overrides,
                // or previous overrides with the new ones.
                ctx[name_1] = overrides[name_1];
            }
        }
    };
    HdpiCanvas.textSizeCache = {};
    return HdpiCanvas;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Text = /** @class */ (function (_super) {
    __extends$2(Text, _super);
    function Text() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._x = 0;
        _this._y = 0;
        _this.lineBreakRegex = /\r?\n/g;
        _this.lines = [];
        _this._text = '';
        _this._dirtyFont = true;
        _this._fontSize = 10;
        _this._fontFamily = 'sans-serif';
        _this._textAlign = Text.defaultStyles.textAlign;
        _this._textBaseline = Text.defaultStyles.textBaseline;
        _this._lineHeight = 14;
        return _this;
    }
    Object.defineProperty(Text.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Text.prototype.splitText = function () {
        this.lines = this._text.split(this.lineBreakRegex);
    };
    Object.defineProperty(Text.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            var str = String(value); // `value` can be an object here
            if (this._text !== str) {
                this._text = str;
                this.splitText();
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "font", {
        get: function () {
            if (this.dirtyFont) {
                this.dirtyFont = false;
                this._font = getFont(this.fontSize, this.fontFamily, this.fontStyle, this.fontWeight);
            }
            return this._font;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "dirtyFont", {
        get: function () {
            return this._dirtyFont;
        },
        set: function (value) {
            if (this._dirtyFont !== value) {
                this._dirtyFont = value;
                if (value) {
                    this.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontStyle", {
        get: function () {
            return this._fontStyle;
        },
        set: function (value) {
            if (this._fontStyle !== value) {
                this._fontStyle = value;
                this.dirtyFont = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontWeight", {
        get: function () {
            return this._fontWeight;
        },
        set: function (value) {
            if (this._fontWeight !== value) {
                this._fontWeight = value;
                this.dirtyFont = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            if (!isFinite(value)) {
                value = 10;
            }
            if (this._fontSize !== value) {
                this._fontSize = value;
                this.dirtyFont = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "fontFamily", {
        get: function () {
            return this._fontFamily;
        },
        set: function (value) {
            if (this._fontFamily !== value) {
                this._fontFamily = value;
                this.dirtyFont = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "textAlign", {
        get: function () {
            return this._textAlign;
        },
        set: function (value) {
            if (this._textAlign !== value) {
                this._textAlign = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "textBaseline", {
        get: function () {
            return this._textBaseline;
        },
        set: function (value) {
            if (this._textBaseline !== value) {
                this._textBaseline = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Text.prototype, "lineHeight", {
        get: function () {
            return this._lineHeight;
        },
        set: function (value) {
            // Multi-line text is complicated because:
            // - Canvas does not support it natively, so we have to implement it manually
            // - need to know the height of each line -> need to parse the font shorthand ->
            //   generally impossible to do because font size may not be in pixels
            // - so, need to measure the text instead, each line individually -> expensive
            // - or make the user provide the line height manually for multi-line text
            // - computeBBox should use the lineHeight for multi-line text but ignore it otherwise
            // - textBaseline kind of loses its meaning for multi-line text
            if (this._lineHeight !== value) {
                this._lineHeight = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Text.prototype.computeBBox = function () {
        return HdpiCanvas.has.textMetrics
            ? this.getPreciseBBox()
            : this.getApproximateBBox();
    };
    Text.prototype.getPreciseBBox = function () {
        var metrics = HdpiCanvas.measureText(this.text, this.font, this.textBaseline, this.textAlign);
        return new BBox(this.x - metrics.actualBoundingBoxLeft, this.y - metrics.actualBoundingBoxAscent, metrics.width, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    };
    Text.prototype.getApproximateBBox = function () {
        var size = HdpiCanvas.getTextSize(this.text, this.font);
        var _a = this, x = _a.x, y = _a.y;
        switch (this.textAlign) {
            case 'end':
            case 'right':
                x -= size.width;
                break;
            case 'center':
                x -= size.width / 2;
        }
        switch (this.textBaseline) {
            case 'alphabetic':
                y -= size.height * 0.7;
                break;
            case 'middle':
                y -= size.height * 0.45;
                break;
            case 'ideographic':
                y -= size.height;
                break;
            case 'hanging':
                y -= size.height * 0.2;
                break;
            case 'bottom':
                y -= size.height;
                break;
        }
        return new BBox(x, y, size.width, size.height);
    };
    Text.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox ? bbox.containsPoint(point.x, point.y) : false;
    };
    Text.prototype.isPointInStroke = function (x, y) {
        return false;
    };
    Text.prototype.render = function (ctx) {
        if (!this.lines.length || !this.scene) {
            return;
        }
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        // this.matrix.transformBBox(this.computeBBox!()).render(ctx); // debug
        this.matrix.toContext(ctx);
        var _a = this, fill = _a.fill, stroke = _a.stroke, strokeWidth = _a.strokeWidth;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        var pixelRatio = this.scene.canvas.pixelRatio || 1;
        var globalAlpha = ctx.globalAlpha;
        if (fill) {
            ctx.fillStyle = fill;
            ctx.globalAlpha = globalAlpha * this.opacity * this.fillOpacity;
            var _b = this, fillShadow = _b.fillShadow, text = _b.text, x = _b.x, y = _b.y;
            if (fillShadow && fillShadow.enabled) {
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            ctx.fillText(text, x, y);
        }
        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.globalAlpha = globalAlpha * this.opacity * this.strokeOpacity;
            var _c = this, lineDash = _c.lineDash, lineDashOffset = _c.lineDashOffset, lineCap = _c.lineCap, lineJoin = _c.lineJoin, strokeShadow = _c.strokeShadow, text = _c.text, x = _c.x, y = _c.y;
            if (lineDash) {
                ctx.setLineDash(lineDash);
            }
            if (lineDashOffset) {
                ctx.lineDashOffset = lineDashOffset;
            }
            if (lineCap) {
                ctx.lineCap = lineCap;
            }
            if (lineJoin) {
                ctx.lineJoin = lineJoin;
            }
            if (strokeShadow && strokeShadow.enabled) {
                ctx.shadowColor = strokeShadow.color;
                ctx.shadowOffsetX = strokeShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = strokeShadow.yOffset * pixelRatio;
                ctx.shadowBlur = strokeShadow.blur * pixelRatio;
            }
            ctx.strokeText(text, x, y);
        }
        this.dirty = false;
    };
    Text.className = 'Text';
    Text.defaultStyles = chainObjects(Shape.defaultStyles, {
        textAlign: 'start',
        fontStyle: undefined,
        fontWeight: undefined,
        fontSize: 10,
        fontFamily: 'sans-serif',
        textBaseline: 'alphabetic'
    });
    return Text;
}(Shape));
function getFont(fontSize, fontFamily, fontStyle, fontWeight) {
    return [
        fontStyle || '',
        fontWeight || '',
        fontSize + 'px',
        fontFamily
    ].join(' ').trim();
}

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Caption = /** @class */ (function (_super) {
    __extends$3(Caption, _super);
    function Caption() {
        var _this = _super.call(this) || this;
        _this.node = new Text();
        _this.enabled = false;
        _this.padding = new Padding(10);
        var node = _this.node;
        node.textAlign = 'center';
        node.textBaseline = 'top';
        node.pointerEvents = PointerEvents.None;
        return _this;
    }
    Object.defineProperty(Caption.prototype, "text", {
        get: function () {
            return this.node.text;
        },
        set: function (value) {
            if (this.node.text !== value) {
                this.node.text = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontStyle", {
        get: function () {
            return this.node.fontStyle;
        },
        set: function (value) {
            if (this.node.fontStyle !== value) {
                this.node.fontStyle = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontWeight", {
        get: function () {
            return this.node.fontWeight;
        },
        set: function (value) {
            if (this.node.fontWeight !== value) {
                this.node.fontWeight = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontSize", {
        get: function () {
            return this.node.fontSize;
        },
        set: function (value) {
            if (this.node.fontSize !== value) {
                this.node.fontSize = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "fontFamily", {
        get: function () {
            return this.node.fontFamily;
        },
        set: function (value) {
            if (this.node.fontFamily !== value) {
                this.node.fontFamily = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Caption.prototype, "color", {
        get: function () {
            return this.node.fill;
        },
        set: function (value) {
            if (this.node.fill !== value) {
                this.node.fill = value;
                this.fireEvent({ type: 'change' });
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate$1([
        reactive('change')
    ], Caption.prototype, "enabled", void 0);
    __decorate$1([
        reactive('change')
    ], Caption.prototype, "padding", void 0);
    return Caption;
}(Observable));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function ticks (a, b, count) {
    var step = tickStep(a, b, count);
    a = Math.ceil(a / step) * step;
    b = Math.floor(b / step) * step + step / 2;
    // Add half a step here so that the array returned by `range` includes the last tick.
    return range(a, b, step);
}
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function tickStep(a, b, count) {
    var rawStep = Math.abs(b - a) / Math.max(0, count);
    var step = Math.pow(10, Math.floor(Math.log(rawStep) / Math.LN10)); // = Math.log10(rawStep)
    var error = rawStep / step;
    if (error >= e10) {
        step *= 10;
    }
    else if (error >= e5) {
        step *= 5;
    }
    else if (error >= e2) {
        step *= 2;
    }
    return b < a ? -step : step;
}
function tickIncrement(a, b, count) {
    var rawStep = (b - a) / Math.max(0, count);
    var power = Math.floor(Math.log(rawStep) / Math.LN10);
    var error = rawStep / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
var NumericTicks = /** @class */ (function (_super) {
    __extends$4(NumericTicks, _super);
    function NumericTicks(fractionDigits, elements) {
        var _this = _super.call(this) || this;
        if (elements) {
            for (var i = 0, n = elements.length; i < n; i++) {
                _this[i] = elements[i];
            }
        }
        _this.fractionDigits = fractionDigits;
        return _this;
    }
    return NumericTicks;
}(Array));
function range(a, b, step) {
    if (step === void 0) { step = 1; }
    var absStep = Math.abs(step);
    var fractionDigits = (absStep > 0 && absStep < 1)
        ? Math.abs(Math.floor(Math.log(absStep) / Math.LN10))
        : 0;
    var f = Math.pow(10, fractionDigits);
    var n = Math.max(0, Math.ceil((b - a) / step)) || 0;
    var values = new NumericTicks(fractionDigits);
    for (var i = 0; i < n; i++) {
        var value = a + step * i;
        values[i] = Math.round(value * f) / f;
    }
    return values;
}

function calculateNiceSecondaryAxis(domain, primaryTickCount) {
    // Make secondary axis domain nice using strict tick count, matching the tick count from the primary axis.
    // This is to make the secondary axis grid lines/ tick positions align with the ones from the primary axis.
    var start = Math.floor(domain[0]);
    var stop = domain[1];
    start = calculateNiceStart(start, stop, primaryTickCount);
    var step = getTickStep(start, stop, primaryTickCount);
    var segments = primaryTickCount - 1;
    stop = start + (segments * step);
    var d = [start, stop];
    var ticks = getTicks(start, step, primaryTickCount);
    return [d, ticks];
}
function calculateNiceStart(a, b, count) {
    var rawStep = Math.abs(b - a) / (count - 1);
    var order = Math.floor(Math.log10(rawStep));
    var magnitude = Math.pow(10, order);
    return Math.floor(a / magnitude) * magnitude;
}
function getTicks(start, step, count) {
    // power of the step will be negative if the step is a fraction (between 0 and 1)
    var stepPower = Math.floor(Math.log10(step));
    var fractionDigits = (step > 0 && step < 1) ? Math.abs(stepPower) : 0;
    var f = Math.pow(10, fractionDigits);
    var ticks = new NumericTicks(fractionDigits);
    for (var i = 0; i < count; i++) {
        var tick = start + step * i;
        ticks[i] = Math.round(tick * f) / f;
    }
    return ticks;
}
function getTickStep(start, stop, count) {
    var segments = count - 1;
    var rawStep = (stop - start) / segments;
    return calculateNextNiceStep(rawStep);
}
function calculateNextNiceStep(rawStep) {
    var order = Math.floor(Math.log10(rawStep));
    var magnitude = Math.pow(10, order);
    // Make order 1
    var step = (rawStep / magnitude) * 10;
    if (step > 0 && step <= 1) {
        return magnitude / 10;
    }
    if (step > 1 && step <= 2) {
        return 2 * magnitude / 10;
    }
    if (step > 1 && step <= 5) {
        return 5 * magnitude / 10;
    }
    if (step > 5 && step <= 10) {
        return 10 * magnitude / 10;
    }
    if (step > 10 && step <= 20) {
        return 20 * magnitude / 10;
    }
    if (step > 20 && step <= 40) {
        return 40 * magnitude / 10;
    }
    if (step > 40 && step <= 50) {
        return 50 * magnitude / 10;
    }
    if (step > 50 && step <= 100) {
        return 100 * magnitude / 10;
    }
    return step;
}

var constant = (function (x) { return function () { return x; }; });

function interpolateNumber (a, b) {
    a = +a;
    b = +b;
    return function (t) { return a * (1 - t) + b * t; };
}

function date (a, b) {
    var date = new Date;
    var msA = +a;
    var msB = +b;
    return function (t) {
        date.setTime(msA * (1 - t) + msB * t);
        return date;
    };
}

function array (a, b) {
    var nb = b ? b.length : 0;
    var na = a ? Math.min(nb, a.length) : 0;
    var x = new Array(na);
    var c = new Array(nb);
    var i;
    for (i = 0; i < na; ++i) {
        x[i] = interpolateValue(a[i], b[i]);
    }
    for (; i < nb; ++i) {
        c[i] = b[i];
    }
    return function (t) {
        for (i = 0; i < na; ++i) {
            c[i] = x[i](t);
        }
        return c;
    };
}

function object (a, b) {
    var i = {};
    var c = {};
    var k;
    if (a === null || typeof a !== 'object') {
        a = {};
    }
    if (b === null || typeof b !== 'object') {
        b = {};
    }
    for (k in b) {
        if (k in a) {
            i[k] = interpolateValue(a[k], b[k]);
        }
        else {
            c[k] = b[k];
        }
    }
    return function (t) {
        for (k in i) {
            c[k] = i[k](t);
        }
        return c;
    };
}

var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var Color = /** @class */ (function () {
    /**
     * Every color component should be in the [0, 1] range.
     * Some easing functions (such as elastic easing) can overshoot the target value by some amount.
     * So, when animating colors, if the source or target color components are already near
     * or at the edge of the allowed [0, 1] range, it is possible for the intermediate color
     * component value to end up outside of that range mid-animation. For this reason the constructor
     * performs range checking/constraining.
     * @param r Red component.
     * @param g Green component.
     * @param b Blue component.
     * @param a Alpha (opacity) component.
     */
    function Color(r, g, b, a) {
        if (a === void 0) { a = 1; }
        // NaN is treated as 0.
        this.r = Math.min(1, Math.max(0, r || 0));
        this.g = Math.min(1, Math.max(0, g || 0));
        this.b = Math.min(1, Math.max(0, b || 0));
        this.a = Math.min(1, Math.max(0, a || 0));
    }
    /**
     * The given string can be in one of the following formats:
     * - #rgb
     * - #rrggbb
     * - rgb(r, g, b)
     * - rgba(r, g, b, a)
     * - CSS color name such as 'white', 'orange', 'cyan', etc.
     * @param str
     */
    Color.fromString = function (str) {
        // hexadecimal notation
        if (str.indexOf('#') >= 0) { // there can be some leading whitespace
            return Color.fromHexString(str);
        }
        // color name
        var hex = Color.nameToHex[str];
        if (hex) {
            return Color.fromHexString(hex);
        }
        // rgb(a) notation
        if (str.indexOf('rgb') >= 0) {
            return Color.fromRgbaString(str);
        }
        throw new Error("Invalid color string: '" + str + "'");
    };
    // See https://drafts.csswg.org/css-color/#hex-notation
    Color.parseHex = function (input) {
        input = input.replace(/ /g, '').slice(1);
        var parts;
        switch (input.length) {
            case 6:
            case 8:
                parts = [];
                for (var i = 0; i < input.length; i += 2) {
                    parts.push(parseInt("" + input[i] + input[i + 1], 16));
                }
                break;
            case 3:
            case 4:
                parts = input.split('').map(function (p) { return parseInt(p, 16); }).map(function (p) { return p + p * 16; });
                break;
        }
        if (parts.length >= 3) {
            if (parts.every(function (p) { return p >= 0; })) {
                if (parts.length === 3) {
                    parts.push(255);
                }
                return parts;
            }
        }
    };
    Color.fromHexString = function (str) {
        var values = Color.parseHex(str);
        if (values) {
            var _a = __read$2(values, 4), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
            return new Color(r / 255, g / 255, b / 255, a / 255);
        }
        throw new Error("Malformed hexadecimal color string: '" + str + "'");
    };
    Color.stringToRgba = function (str) {
        // Find positions of opening and closing parentheses.
        var _a = __read$2([NaN, NaN], 2), po = _a[0], pc = _a[1];
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            if (!po && c === '(') {
                po = i;
            }
            else if (c === ')') {
                pc = i;
                break;
            }
        }
        var contents = po && pc && str.substring(po + 1, pc);
        if (!contents) {
            return;
        }
        var parts = contents.split(',');
        var rgba = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var value = parseFloat(part);
            if (isNaN(value)) {
                return;
            }
            if (part.indexOf('%') >= 0) { // percentage r, g, or b value
                value = Math.max(0, Math.min(100, value));
                value /= 100;
            }
            else {
                if (i === 3) { // alpha component
                    value = Math.max(0, Math.min(1, value));
                }
                else { // absolute r, g, or b value
                    value = Math.max(0, Math.min(255, value));
                    value /= 255;
                }
            }
            rgba.push(value);
        }
        return rgba;
    };
    Color.fromRgbaString = function (str) {
        var rgba = Color.stringToRgba(str);
        if (rgba) {
            if (rgba.length === 3) {
                return new Color(rgba[0], rgba[1], rgba[2]);
            }
            else if (rgba.length === 4) {
                return new Color(rgba[0], rgba[1], rgba[2], rgba[3]);
            }
        }
        throw new Error("Malformed rgb/rgba color string: '" + str + "'");
    };
    Color.fromArray = function (arr) {
        if (arr.length === 4) {
            return new Color(arr[0], arr[1], arr[2], arr[3]);
        }
        if (arr.length === 3) {
            return new Color(arr[0], arr[1], arr[2]);
        }
        throw new Error('The given array should contain 3 or 4 color components (numbers).');
    };
    Color.fromHSB = function (h, s, b, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var rgb = Color.HSBtoRGB(h, s, b);
        return new Color(rgb[0], rgb[1], rgb[2], alpha);
    };
    Color.padHex = function (str) {
        // Can't use `padStart(2, '0')` here because of IE.
        return str.length === 1 ? '0' + str : str;
    };
    Color.prototype.toHexString = function () {
        var hex = '#'
            + Color.padHex(Math.round(this.r * 255).toString(16))
            + Color.padHex(Math.round(this.g * 255).toString(16))
            + Color.padHex(Math.round(this.b * 255).toString(16));
        if (this.a < 1) {
            hex += Color.padHex(Math.round(this.a * 255).toString(16));
        }
        return hex;
    };
    Color.prototype.toRgbaString = function (fractionDigits) {
        if (fractionDigits === void 0) { fractionDigits = 3; }
        var components = [
            Math.round(this.r * 255),
            Math.round(this.g * 255),
            Math.round(this.b * 255)
        ];
        var k = Math.pow(10, fractionDigits);
        if (this.a !== 1) {
            components.push(Math.round(this.a * k) / k);
            return "rgba(" + components.join(', ') + ")";
        }
        return "rgb(" + components.join(', ') + ")";
    };
    Color.prototype.toString = function () {
        if (this.a === 1) {
            return this.toHexString();
        }
        return this.toRgbaString();
    };
    Color.prototype.toHSB = function () {
        return Color.RGBtoHSB(this.r, this.g, this.b);
    };
    /**
     * Converts the given RGB triple to an array of HSB (HSV) components.
     * The hue component will be `NaN` for achromatic colors.
     */
    Color.RGBtoHSB = function (r, g, b) {
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var S = max !== 0 ? (max - min) / max : 0;
        var H = NaN;
        // min == max, means all components are the same
        // and the color is a shade of gray with no hue (H is NaN)
        if (min !== max) {
            var delta = max - min;
            var rc = (max - r) / delta;
            var gc = (max - g) / delta;
            var bc = (max - b) / delta;
            if (r === max) {
                H = bc - gc;
            }
            else if (g === max) {
                H = 2.0 + rc - bc;
            }
            else {
                H = 4.0 + gc - rc;
            }
            H /= 6.0;
            if (H < 0) {
                H = H + 1.0;
            }
        }
        return [H * 360, S, max];
    };
    /**
     * Converts the given HSB (HSV) triple to an array of RGB components.
     */
    Color.HSBtoRGB = function (H, S, B) {
        if (isNaN(H)) {
            H = 0;
        }
        H = (((H % 360) + 360) % 360) / 360; // normalize hue to [0, 360] interval, then scale to [0, 1]
        var r = 0;
        var g = 0;
        var b = 0;
        if (S === 0) {
            r = g = b = B;
        }
        else {
            var h = (H - Math.floor(H)) * 6;
            var f = h - Math.floor(h);
            var p = B * (1 - S);
            var q = B * (1 - S * f);
            var t = B * (1 - (S * (1 - f)));
            switch (h >> 0) { // discard the floating point part of the number
                case 0:
                    r = B;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = B;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = B;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = B;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = B;
                    break;
                case 5:
                    r = B;
                    g = p;
                    b = q;
                    break;
            }
        }
        return [r, g, b];
    };
    Color.prototype.derive = function (hueShift, saturationFactor, brightnessFactor, opacityFactor) {
        var hsb = Color.RGBtoHSB(this.r, this.g, this.b);
        var b = hsb[2];
        if (b == 0 && brightnessFactor > 1.0) {
            b = 0.05;
        }
        var h = (((hsb[0] + hueShift) % 360) + 360) % 360;
        var s = Math.max(Math.min(hsb[1] * saturationFactor, 1.0), 0.0);
        b = Math.max(Math.min(b * brightnessFactor, 1.0), 0.0);
        var a = Math.max(Math.min(this.a * opacityFactor, 1.0), 0.0);
        var rgba = Color.HSBtoRGB(h, s, b);
        rgba.push(a);
        return Color.fromArray(rgba);
    };
    Color.prototype.brighter = function () {
        return this.derive(0, 1.0, 1.0 / 0.7, 1.0);
    };
    Color.prototype.darker = function () {
        return this.derive(0, 1.0, 0.7, 1.0);
    };
    /**
     * CSS Color Module Level 4:
     * https://drafts.csswg.org/css-color/#named-colors
     */
    Color.nameToHex = Object.freeze({
        aliceblue: '#F0F8FF',
        antiquewhite: '#FAEBD7',
        aqua: '#00FFFF',
        aquamarine: '#7FFFD4',
        azure: '#F0FFFF',
        beige: '#F5F5DC',
        bisque: '#FFE4C4',
        black: '#000000',
        blanchedalmond: '#FFEBCD',
        blue: '#0000FF',
        blueviolet: '#8A2BE2',
        brown: '#A52A2A',
        burlywood: '#DEB887',
        cadetblue: '#5F9EA0',
        chartreuse: '#7FFF00',
        chocolate: '#D2691E',
        coral: '#FF7F50',
        cornflowerblue: '#6495ED',
        cornsilk: '#FFF8DC',
        crimson: '#DC143C',
        cyan: '#00FFFF',
        darkblue: '#00008B',
        darkcyan: '#008B8B',
        darkgoldenrod: '#B8860B',
        darkgray: '#A9A9A9',
        darkgreen: '#006400',
        darkgrey: '#A9A9A9',
        darkkhaki: '#BDB76B',
        darkmagenta: '#8B008B',
        darkolivegreen: '#556B2F',
        darkorange: '#FF8C00',
        darkorchid: '#9932CC',
        darkred: '#8B0000',
        darksalmon: '#E9967A',
        darkseagreen: '#8FBC8F',
        darkslateblue: '#483D8B',
        darkslategray: '#2F4F4F',
        darkslategrey: '#2F4F4F',
        darkturquoise: '#00CED1',
        darkviolet: '#9400D3',
        deeppink: '#FF1493',
        deepskyblue: '#00BFFF',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1E90FF',
        firebrick: '#B22222',
        floralwhite: '#FFFAF0',
        forestgreen: '#228B22',
        fuchsia: '#FF00FF',
        gainsboro: '#DCDCDC',
        ghostwhite: '#F8F8FF',
        gold: '#FFD700',
        goldenrod: '#DAA520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#ADFF2F',
        grey: '#808080',
        honeydew: '#F0FFF0',
        hotpink: '#FF69B4',
        indianred: '#CD5C5C',
        indigo: '#4B0082',
        ivory: '#FFFFF0',
        khaki: '#F0E68C',
        lavender: '#E6E6FA',
        lavenderblush: '#FFF0F5',
        lawngreen: '#7CFC00',
        lemonchiffon: '#FFFACD',
        lightblue: '#ADD8E6',
        lightcoral: '#F08080',
        lightcyan: '#E0FFFF',
        lightgoldenrodyellow: '#FAFAD2',
        lightgray: '#D3D3D3',
        lightgreen: '#90EE90',
        lightgrey: '#D3D3D3',
        lightpink: '#FFB6C1',
        lightsalmon: '#FFA07A',
        lightseagreen: '#20B2AA',
        lightskyblue: '#87CEFA',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#B0C4DE',
        lightyellow: '#FFFFE0',
        lime: '#00FF00',
        limegreen: '#32CD32',
        linen: '#FAF0E6',
        magenta: '#FF00FF',
        maroon: '#800000',
        mediumaquamarine: '#66CDAA',
        mediumblue: '#0000CD',
        mediumorchid: '#BA55D3',
        mediumpurple: '#9370DB',
        mediumseagreen: '#3CB371',
        mediumslateblue: '#7B68EE',
        mediumspringgreen: '#00FA9A',
        mediumturquoise: '#48D1CC',
        mediumvioletred: '#C71585',
        midnightblue: '#191970',
        mintcream: '#F5FFFA',
        mistyrose: '#FFE4E1',
        moccasin: '#FFE4B5',
        navajowhite: '#FFDEAD',
        navy: '#000080',
        oldlace: '#FDF5E6',
        olive: '#808000',
        olivedrab: '#6B8E23',
        orange: '#FFA500',
        orangered: '#FF4500',
        orchid: '#DA70D6',
        palegoldenrod: '#EEE8AA',
        palegreen: '#98FB98',
        paleturquoise: '#AFEEEE',
        palevioletred: '#DB7093',
        papayawhip: '#FFEFD5',
        peachpuff: '#FFDAB9',
        peru: '#CD853F',
        pink: '#FFC0CB',
        plum: '#DDA0DD',
        powderblue: '#B0E0E6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#FF0000',
        rosybrown: '#BC8F8F',
        royalblue: '#4169E1',
        saddlebrown: '#8B4513',
        salmon: '#FA8072',
        sandybrown: '#F4A460',
        seagreen: '#2E8B57',
        seashell: '#FFF5EE',
        sienna: '#A0522D',
        silver: '#C0C0C0',
        skyblue: '#87CEEB',
        slateblue: '#6A5ACD',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#FFFAFA',
        springgreen: '#00FF7F',
        steelblue: '#4682B4',
        tan: '#D2B48C',
        teal: '#008080',
        thistle: '#D8BFD8',
        tomato: '#FF6347',
        turquoise: '#40E0D0',
        violet: '#EE82EE',
        wheat: '#F5DEB3',
        white: '#FFFFFF',
        whitesmoke: '#F5F5F5',
        yellow: '#FFFF00',
        yellowgreen: '#9ACD32'
    });
    return Color;
}());

function color (a, b) {
    if (typeof a === 'string') {
        try {
            a = Color.fromString(a);
        }
        catch (e) {
            a = Color.fromArray([0, 0, 0]);
        }
    }
    if (typeof b === 'string') {
        try {
            b = Color.fromString(b);
        }
        catch (e) {
            b = Color.fromArray([0, 0, 0]);
        }
    }
    var red = interpolateNumber(a.r, b.r);
    var green = interpolateNumber(a.g, b.g);
    var blue = interpolateNumber(a.b, b.b);
    var alpha = interpolateNumber(a.a, b.a);
    return function (t) {
        return Color.fromArray([red(t), green(t), blue(t), alpha(t)]).toRgbaString();
    };
}

function interpolateValue (a, b) {
    var t = typeof b;
    var c;
    if (b == null || t === 'boolean') {
        return constant(b);
    }
    if (t === 'number') {
        return interpolateNumber(a, b);
    }
    if (t === 'string') {
        try {
            c = Color.fromString(b);
            b = c;
            return color(a, b);
        }
        catch (e) {
            // return string(a, b);
        }
    }
    if (b instanceof Color) {
        return color(a, b);
    }
    if (b instanceof Date) {
        return date(a, b);
    }
    if (Array.isArray(b)) {
        return array(a, b);
    }
    if (typeof b.valueOf !== 'function' && typeof b.toString !== 'function' || isNaN(b)) {
        return object(a, b);
    }
    return interpolateNumber(a, b);
}

function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisectRight(list, x, comparator, lo, hi) {
    if (lo === void 0) { lo = 0; }
    if (hi === void 0) { hi = list.length; }
    while (lo < hi) {
        var mid = (lo + hi) >>> 1;
        if (comparator(list[mid], x) > 0) { // list[mid] > x
            hi = mid;
        }
        else {
            lo = mid + 1;
        }
    }
    return lo;
}
function complexBisectRight(list, x, map, lo, hi) {
    if (lo === void 0) { lo = 0; }
    if (hi === void 0) { hi = list.length; }
    var comparator = ascendingComparator(map);
    while (lo < hi) {
        var mid = (lo + hi) >>> 1;
        if (comparator(list[mid], x) < 0) {
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    return lo;
}
function ascendingComparator(map) {
    return function (item, x) {
        return ascending(map(item), x);
    };
}

var __read$3 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var constant$1 = function (x) { return function () { return x; }; };
var identity = function (x) { return x; };
function clamper(domain) {
    var _a;
    var a = domain[0];
    var b = domain[domain.length - 1];
    if (a > b) {
        _a = __read$3([b, a], 2), a = _a[0], b = _a[1];
    }
    return function (x) { return Math.max(a, Math.min(b, x)); };
}
var ContinuousScale = /** @class */ (function () {
    function ContinuousScale() {
        /**
         * The output value of the scale for `undefined` or `NaN` input values.
         */
        this.unknown = undefined;
        this.clamper = clamper;
        this._clamp = identity;
        this._domain = [0, 1];
        this._range = [0, 1];
        this.transform = identity; // transforms domain value
        this.untransform = identity; // untransforms domain value
        this._interpolate = interpolateValue;
        this.rescale();
    }
    Object.defineProperty(ContinuousScale.prototype, "clamp", {
        get: function () {
            return this._clamp !== identity;
        },
        set: function (value) {
            this._clamp = value ? this.clamper(this.domain) : identity;
        },
        enumerable: true,
        configurable: true
    });
    ContinuousScale.prototype.setDomain = function (values) {
        this._domain = Array.prototype.map.call(values, function (v) { return +v; });
        if (this._clamp !== identity) {
            this._clamp = this.clamper(this.domain);
        }
        this.rescale();
    };
    ContinuousScale.prototype.getDomain = function () {
        return this._domain.slice();
    };
    Object.defineProperty(ContinuousScale.prototype, "domain", {
        get: function () {
            return this.getDomain();
        },
        set: function (values) {
            this.setDomain(values);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContinuousScale.prototype, "range", {
        get: function () {
            return this._range.slice();
        },
        set: function (values) {
            this._range = Array.prototype.slice.call(values);
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContinuousScale.prototype, "interpolate", {
        get: function () {
            return this._interpolate;
        },
        set: function (value) {
            this._interpolate = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    ContinuousScale.prototype.rescale = function () {
        if (Math.min(this.domain.length, this.range.length) > 2) {
            this.piecewise = this.polymap;
        }
        else {
            this.piecewise = this.bimap;
        }
        this.output = undefined;
        this.input = undefined;
    };
    /**
     * Returns a function that converts `x` in `[a, b]` to `t` in `[0, 1]`. Non-clamping.
     * @param a
     * @param b
     */
    ContinuousScale.prototype.normalize = function (a, b) {
        return (b -= (a = +a))
            ? function (x) { return (x - a) / b; }
            : constant$1(isNaN(b) ? NaN : 0.5);
    };
    ContinuousScale.prototype.bimap = function (domain, range, interpolate) {
        var x0 = domain[0];
        var x1 = domain[1];
        var y0 = range[0];
        var y1 = range[1];
        var xt;
        var ty;
        if (x1 < x0) {
            xt = this.normalize(x1, x0);
            ty = interpolate(y1, y0);
        }
        else {
            xt = this.normalize(x0, x1);
            ty = interpolate(y0, y1);
        }
        return function (x) { return ty(xt(x)); }; // domain value x --> t in [0, 1] --> range value y
    };
    ContinuousScale.prototype.polymap = function (domain, range, interpolate) {
        var _this = this;
        // number of segments in the polylinear scale
        var n = Math.min(domain.length, range.length) - 1;
        if (domain[n] < domain[0]) {
            domain = domain.slice().reverse();
            range = range.slice().reverse();
        }
        // deinterpolators from domain segment value to t
        var dt = Array.from({ length: n }, function (_, i) { return _this.normalize(domain[i], domain[i + 1]); });
        // reinterpolators from t to range segment value
        var tr = Array.from({ length: n }, function (_, i) { return interpolate(range[i], range[i + 1]); });
        return function (x) {
            var i = bisectRight(domain, x, ascending, 1, n) - 1; // Find the domain segment that `x` belongs to.
            // This also tells us which deinterpolator/reinterpolator pair to use.
            return tr[i](dt[i](x));
        };
    };
    ContinuousScale.prototype.convert = function (x, clamper) {
        x = +x;
        if (isNaN(x)) {
            return this.unknown;
        }
        if (!this.output) {
            this.output = this.piecewise(this.domain.map(this.transform), this.range, this.interpolate);
        }
        var clamp = clamper ? clamper(this.domain) : this._clamp;
        return this.output(this.transform(clamp(x)));
    };
    ContinuousScale.prototype.invert = function (y) {
        if (!this.input) {
            this.input = this.piecewise(this.range, this.domain.map(this.transform), interpolateNumber);
        }
        return this._clamp(this.untransform(this.input(y)));
    };
    return ContinuousScale;
}());

function formatDefault(x, p) {
    var xs = x.toPrecision(p);
    out: for (var n = xs.length, i = 1, i0 = -1, i1 = 0; i < n; ++i) {
        switch (xs[i]) {
            case '.':
                i0 = i1 = i;
                break;
            case '0':
                if (i0 === 0)
                    i0 = i;
                i1 = i;
                break;
            case 'e': break out;
            default:
                if (i0 > 0)
                    i0 = 0;
                break;
        }
    }
    return i0 > 0 ? xs.slice(0, i0) + xs.slice(i1 + 1) : xs;
}
var formatTypes = {
    '': formatDefault,
    // Multiply by 100, and then decimal notation with a percent sign.
    '%': function (x, p) { return (x * 100).toFixed(p); },
    // Binary notation, rounded to integer.
    'b': function (x) { return Math.round(x).toString(2); },
    // Converts the integer to the corresponding unicode character before printing.
    'c': function (x) { return String(x); },
    // Decimal notation, rounded to integer.
    'd': formatDecimal,
    // Exponent notation.
    'e': function (x, p) { return x.toExponential(p); },
    // Fixed point notation.
    'f': function (x, p) { return x.toFixed(p); },
    // Either decimal or exponent notation, rounded to significant digits.
    'g': function (x, p) { return x.toPrecision(p); },
    // Octal notation, rounded to integer.
    'o': function (x) { return Math.round(x).toString(8); },
    // Multiply by 100, round to significant digits, and then decimal notation with a percent sign.
    'p': function (x, p) { return formatRounded(x * 100, p); },
    // Decimal notation, rounded to significant digits.
    'r': formatRounded,
    // Decimal notation with a SI prefix, rounded to significant digits.
    's': formatPrefixAuto,
    // Hexadecimal notation, using upper-case letters, rounded to integer.
    'X': function (x) { return Math.round(x).toString(16).toUpperCase(); },
    // Hexadecimal notation, using lower-case letters, rounded to integer.
    'x': function (x) { return Math.round(x).toString(16); }
};
var prefixes = ['y', 'z', 'a', 'f', 'p', 'n', '\xB5', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
/**
 * [[fill]align][sign][#][0][width][grouping_option][.precision][type]
 */
var FormatSpecifier = /** @class */ (function () {
    function FormatSpecifier(specifier) {
        if (specifier instanceof FormatSpecifier) {
            this.fill = specifier.fill;
            this.align = specifier.align;
            this.sign = specifier.sign;
            this.symbol = specifier.symbol;
            this.zero = specifier.zero;
            this.width = specifier.width;
            this.comma = specifier.comma;
            this.precision = specifier.precision;
            this.trim = specifier.trim;
            this.type = specifier.type;
            this.string = specifier.string;
        }
        else {
            this.fill = specifier.fill === undefined ? ' ' : String(specifier.fill);
            this.align = specifier.align === undefined ? '>' : String(specifier.align);
            this.sign = specifier.sign === undefined ? '-' : String(specifier.sign);
            this.symbol = specifier.symbol === undefined ? '' : String(specifier.symbol);
            this.zero = !!specifier.zero;
            this.width = specifier.width === undefined ? undefined : +specifier.width;
            this.comma = !!specifier.comma;
            this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
            this.trim = !!specifier.trim;
            this.type = specifier.type === undefined ? '' : String(specifier.type);
            this.string = specifier.string;
        }
    }
    return FormatSpecifier;
}());
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var formatRegEx = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
var interpolateRegEx = /(#\{(.*?)\})/g;
function makeFormatSpecifier(specifier) {
    if (specifier instanceof FormatSpecifier) {
        return new FormatSpecifier(specifier);
    }
    var found = false;
    var string = specifier.replace(interpolateRegEx, function () {
        if (!found) {
            specifier = arguments[2];
            found = true;
        }
        return '#{}';
    });
    var match = formatRegEx.exec(specifier);
    if (!match) {
        throw new Error("Invalid format: " + specifier);
    }
    return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10],
        string: found ? string : undefined
    });
}
function tickFormat(start, stop, count, specifier) {
    var step = tickStep(start, stop, count);
    var formatSpecifier = makeFormatSpecifier(specifier == undefined ? ',f' : specifier);
    var precision;
    switch (formatSpecifier.type) {
        case 's': {
            var value = Math.max(Math.abs(start), Math.abs(stop));
            if (formatSpecifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) {
                formatSpecifier.precision = precision;
            }
            return formatPrefix(formatSpecifier, value);
        }
        case '':
        case 'e':
        case 'g':
        case 'p':
        case 'r': {
            if (formatSpecifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) {
                formatSpecifier.precision = precision - +(formatSpecifier.type === 'e');
            }
            break;
        }
        case 'f':
        case '%': {
            if (formatSpecifier.precision == null && !isNaN(precision = precisionFixed(step))) {
                formatSpecifier.precision = precision - +(formatSpecifier.type === '%') * 2;
            }
            break;
        }
    }
    return format(formatSpecifier);
}
var prefixExponent;
function formatPrefixAuto(x, p) {
    if (p === void 0) { p = 0; }
    var d = formatDecimalParts(x, p);
    if (!d) {
        return String(x);
    }
    var coefficient = d[0];
    var exponent = d[1];
    prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3;
    var i = exponent - prefixExponent + 1;
    var n = coefficient.length;
    if (i === n) {
        return coefficient;
    }
    else {
        if (i > n) {
            return coefficient + new Array(i - n + 1).join('0');
        }
        if (i > 0) {
            return coefficient.slice(0, i) + '.' + coefficient.slice(i);
        }
        else {
            var parts = formatDecimalParts(x, Math.max(0, p + i - 1));
            return '0.' + new Array(1 - i).join('0') + parts[0]; // less than 1y!
        }
    }
}
function formatDecimal(x) {
    return Math.abs(x = Math.round(x)) >= 1e21
        ? x.toLocaleString('en').replace(/,/g, '')
        : x.toString(10);
}
function formatGroup(grouping, thousands) {
    return function (value, width) {
        var t = [];
        var i = value.length;
        var j = 0;
        var g = grouping[0];
        var length = 0;
        while (i > 0 && g > 0) {
            if (length + g + 1 > width) {
                g = Math.max(1, width - length);
            }
            t.push(value.substring(i -= g, i + g));
            if ((length += g + 1) > width) {
                break;
            }
            g = grouping[j = (j + 1) % grouping.length];
        }
        return t.reverse().join(thousands);
    };
}
function formatNumerals(numerals) {
    return function (value) { return value.replace(/[0-9]/g, function (i) { return numerals[+i]; }); };
}
// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1 = 0; i < n; ++i) {
        switch (s[i]) {
            case '.':
                i0 = i1 = i;
                break;
            case '0':
                if (i0 === 0)
                    i0 = i;
                i1 = i;
                break;
            default:
                if (!+s[i])
                    break out;
                if (i0 > 0)
                    i0 = 0;
                break;
        }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}
function formatRounded(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d) {
        return String(x);
    }
    var coefficient = d[0];
    var exponent = d[1];
    if (exponent < 0) {
        return '0.' + new Array(-exponent).join('0') + coefficient;
    }
    else {
        if (coefficient.length > exponent + 1) {
            return coefficient.slice(0, exponent + 1) + '.' + coefficient.slice(exponent + 1);
        }
        else {
            return coefficient + new Array(exponent - coefficient.length + 2).join('0');
        }
    }
}
// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimalParts(1.23) returns ['123', 0].
function formatDecimalParts(x, p) {
    var sx = p ? x.toExponential(p - 1) : x.toExponential();
    var i = sx.indexOf('e');
    if (i < 0) { // NaN, ±Infinity
        return undefined;
    }
    var coefficient = sx.slice(0, i);
    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +sx.slice(i + 1)
    ];
}
function identity$1(x) {
    return x;
}
var formatDefaultLocale;
var format;
var formatPrefix;
defaultLocale({
    thousands: ',',
    grouping: [3],
    currency: ['$', '']
});
function defaultLocale(definition) {
    formatDefaultLocale = formatLocale(definition);
    format = formatDefaultLocale.format;
    formatPrefix = formatDefaultLocale.formatPrefix;
}
function exponent(x) {
    var parts = formatDecimalParts(Math.abs(x));
    if (parts) {
        return parts[1];
    }
    return NaN;
}
function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
}
function precisionPrefix(step, value) {
    var x = Math.floor(exponent(value) / 3);
    x = Math.min(8, x);
    x = Math.max(-8, x);
    return Math.max(0, x * 3 - exponent(Math.abs(step)));
}
function precisionRound(step, max) {
    step = Math.abs(step);
    max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
}
function formatLocale(locale) {
    var group = locale.grouping === undefined || locale.thousands === undefined
        ? identity$1
        : formatGroup(Array.prototype.map.call(locale.grouping, Number), String(locale.thousands));
    var currencyPrefix = locale.currency === undefined ? '' : String(locale.currency[0]);
    var currencySuffix = locale.currency === undefined ? '' : String(locale.currency[1]);
    var decimal = locale.decimal === undefined ? '.' : String(locale.decimal);
    var numerals = locale.numerals === undefined
        ? identity$1
        : formatNumerals(Array.prototype.map.call(locale.numerals, String));
    var percent = locale.percent === undefined ? '%' : String(locale.percent);
    var minus = locale.minus === undefined ? '\u2212' : String(locale.minus);
    var nan = locale.nan === undefined ? 'NaN' : String(locale.nan);
    function newFormat(specifier) {
        var formatSpecifier = makeFormatSpecifier(specifier);
        var fill = formatSpecifier.fill;
        var align = formatSpecifier.align;
        var sign = formatSpecifier.sign;
        var symbol = formatSpecifier.symbol;
        var zero = formatSpecifier.zero;
        var width = formatSpecifier.width;
        var comma = formatSpecifier.comma;
        var precision = formatSpecifier.precision;
        var trim = formatSpecifier.trim;
        var type = formatSpecifier.type;
        // The 'n' type is an alias for ',g'.
        if (type === 'n') {
            comma = true;
            type = 'g';
        }
        else if (!formatTypes[type]) { // The '' type, and any invalid type, is an alias for '.12~g'.
            if (precision === undefined) {
                precision = 12;
            }
            trim = true;
            type = 'g';
        }
        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === '0' && align === '=')) {
            zero = true;
            fill = '0';
            align = '=';
        }
        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === '$' ? currencyPrefix : symbol === '#' && /[boxX]/.test(type) ? '0' + type.toLowerCase() : '';
        var suffix = symbol === '$' ? currencySuffix : /[%p]/.test(type) ? percent : '';
        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type];
        var maybeSuffix = /[defgprs%]/.test(type);
        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        if (precision === undefined) {
            precision = 6;
        }
        else if (/[gprs]/.test(type)) {
            precision = Math.max(1, Math.min(21, precision));
        }
        else {
            precision = Math.max(0, Math.min(20, precision));
        }
        function format(x) {
            var valuePrefix = prefix;
            var valueSuffix = suffix;
            var value;
            if (type === 'c') {
                valueSuffix = formatType(+x) + valueSuffix;
                value = '';
            }
            else {
                var nx = +x;
                // Determine the sign. -0 is not less than 0, but 1 / -0 is!
                var valueNegative = x < 0 || 1 / nx < 0;
                // Perform the initial formatting.
                value = isNaN(nx) ? nan : formatType(Math.abs(nx), precision);
                // Trim insignificant zeros.
                if (trim) {
                    value = formatTrim(value);
                }
                // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
                if (valueNegative && +value === 0 && sign !== '+') {
                    valueNegative = false;
                }
                // Compute the prefix and suffix.
                var signPrefix = valueNegative
                    ? (sign === '(' ? sign : minus)
                    : (sign === '-' || sign === '(' ? '' : sign);
                var signSuffix = valueNegative && sign === '(' ? ')' : '';
                valuePrefix = signPrefix + valuePrefix;
                valueSuffix = (type === 's' ? prefixes[8 + prefixExponent / 3] : '') + valueSuffix + signSuffix;
                // Break the formatted value into the integer “value” part that can be
                // grouped, and fractional or exponential “suffix” part that is not.
                if (maybeSuffix) {
                    for (var i = 0, n = value.length; i < n; i++) {
                        var c = value.charCodeAt(i);
                        if (48 > c || c > 57) {
                            valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                            value = value.slice(0, i);
                            break;
                        }
                    }
                }
            }
            // If the fill character is not '0', grouping is applied before padding.
            if (comma && !zero)
                value = group(value, Infinity);
            // Compute the padding.
            var length = valuePrefix.length + value.length + valueSuffix.length;
            var padding = length < width ? new Array(width - length + 1).join(fill) : '';
            // If the fill character is '0', grouping is applied after padding.
            if (comma && zero) {
                value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity);
                padding = '';
            }
            // Reconstruct the final output based on the desired alignment.
            switch (align) {
                case '<':
                    value = valuePrefix + value + valueSuffix + padding;
                    break;
                case '=':
                    value = valuePrefix + padding + value + valueSuffix;
                    break;
                case '^':
                    value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
                    break;
                default:
                    value = padding + valuePrefix + value + valueSuffix;
                    break;
            }
            var string = formatSpecifier.string;
            if (string) {
                return string.replace(interpolateRegEx, function () { return numerals(value); });
            }
            return numerals(value);
        }
        return format;
    }
    function formatPrefix(specifier, value) {
        var formatSpecifier = makeFormatSpecifier(specifier);
        formatSpecifier.type = 'f';
        var f = newFormat(formatSpecifier);
        var e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3;
        var k = Math.pow(10, -e);
        var prefix = prefixes[8 + e / 3];
        return function (value) {
            return f(k * +value) + prefix;
        };
    }
    return {
        format: newFormat,
        formatPrefix: formatPrefix
    };
}

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Maps continuous domain to a continuous range.
 */
var LinearScale = /** @class */ (function (_super) {
    __extends$5(LinearScale, _super);
    function LinearScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'linear';
        return _this;
    }
    LinearScale.prototype.ticks = function (count) {
        if (count === void 0) { count = 10; }
        var d = this._domain;
        return ticks(d[0], d[d.length - 1], count);
    };
    /**
     * Extends the domain so that it starts and ends on nice round values.
     * @param count Tick count.
     */
    LinearScale.prototype.nice = function (count) {
        if (count === void 0) { count = 10; }
        var d = this.domain;
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var step;
        if (stop < start) {
            step = start;
            start = stop;
            stop = step;
            step = i0;
            i0 = i1;
            i1 = step;
        }
        step = tickIncrement(start, stop, count);
        if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
            step = tickIncrement(start, stop, count);
        }
        else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
            step = tickIncrement(start, stop, count);
        }
        if (step > 0) {
            d[i0] = Math.floor(start / step) * step;
            d[i1] = Math.ceil(stop / step) * step;
            this.domain = d;
        }
        else if (step < 0) {
            d[i0] = Math.ceil(start * step) / step;
            d[i1] = Math.floor(stop * step) / step;
            this.domain = d;
        }
    };
    LinearScale.prototype.tickFormat = function (count, specifier) {
        var d = this.domain;
        return tickFormat(d[0], d[d.length - 1], count == undefined ? 10 : count, specifier);
    };
    return LinearScale;
}(ContinuousScale));

var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// Custom `Array.find` implementation for legacy browsers.
function find(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if (predicate(value, i, arr)) {
            return value;
        }
    }
}
function findIndex(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        if (predicate(arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}
function identity$2(value) {
    return value;
}
function extent(values, predicate, map) {
    var transform = map || identity$2;
    var n = values.length;
    var i = -1;
    var value;
    var min;
    var max;
    while (++i < n) { // Find the first value.
        value = values[i];
        if (predicate(value)) {
            min = max = value;
            while (++i < n) { // Compare the remaining values.
                value = values[i];
                if (predicate(value)) {
                    if (min > value) {
                        min = value;
                    }
                    if (max < value) {
                        max = value;
                    }
                }
            }
        }
    }
    return min === undefined || max === undefined ? undefined : [transform(min), transform(max)];
}
/**
 * finds the min and max using a process appropriate for stacked values. Ie,
 * summing up the positive and negative numbers, and returning the totals of each
 */
function findMinMax(values) {
    var e_1, _a;
    var min = 0;
    var max = 0;
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            if (value < 0) {
                min += value;
            }
            else {
                max += value;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { min: min, max: max };
}
function copy(array, start, count) {
    if (start === void 0) { start = 0; }
    if (count === void 0) { count = array.length; }
    var result = [];
    var n = array.length;
    if (n) {
        for (var i = 0; i < count; i++) {
            result.push(array[(start + i) % n]);
        }
    }
    return result;
}

// Simplified version of https://github.com/plotly/fast-isnumeric
// that doesn't treat number strings with leading/trailing whitespace as numbers.
function isNumber(value) {
    if (typeof value !== 'number') {
        return false;
    }
    return Number.isFinite(value);
}
function isNumberObject(value) {
    return !!value && value.hasOwnProperty('valueOf') && isNumber(value.valueOf());
}
function isNumeric(value) {
    return isNumber(value) || isNumberObject(value);
}
function isDate(value) {
    return value instanceof Date && !isNaN(+value);
}
function isString(value) {
    return typeof value === 'string';
}
function isStringObject(value) {
    return !!value && value.hasOwnProperty('toString') && isString(value.toString());
}
function isDiscrete(value) {
    return isString(value) || isStringObject(value);
}
function isContinuous(value) {
    return isNumeric(value) || isDate(value);
}

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Group = /** @class */ (function (_super) {
    __extends$6(Group, _super);
    function Group() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContainerNode = true;
        _this._opacity = 1;
        return _this;
    }
    Object.defineProperty(Group.prototype, "opacity", {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            value = Math.min(1, Math.max(0, value));
            if (this._opacity !== value) {
                this._opacity = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    // We consider a group to be boundless, thus any point belongs to it.
    Group.prototype.containsPoint = function (x, y) {
        return true;
    };
    Group.prototype.computeBBox = function () {
        var left = Infinity;
        var right = -Infinity;
        var top = Infinity;
        var bottom = -Infinity;
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        this.children.forEach(function (child) {
            if (!child.visible) {
                return;
            }
            var bbox = child.computeBBox();
            if (!bbox) {
                return;
            }
            if (!(child instanceof Group)) {
                if (child.dirtyTransform) {
                    child.computeTransformMatrix();
                }
                var matrix = Matrix.flyweight(child.matrix);
                var parent_1 = child.parent;
                while (parent_1) {
                    matrix.preMultiplySelf(parent_1.matrix);
                    parent_1 = parent_1.parent;
                }
                matrix.transformBBox(bbox, 0, bbox);
            }
            var x = bbox.x;
            var y = bbox.y;
            if (x < left) {
                left = x;
            }
            if (y < top) {
                top = y;
            }
            if (x + bbox.width > right) {
                right = x + bbox.width;
            }
            if (y + bbox.height > bottom) {
                bottom = y + bbox.height;
            }
        });
        return new BBox(left, top, right - left, bottom - top);
    };
    Group.prototype.render = function (ctx) {
        // A group can have `scaling`, `rotation`, `translation` properties
        // that are applied to the canvas context before children are rendered,
        // so all children can be transformed at once.
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        this.matrix.toContext(ctx);
        var children = this.children;
        var n = children.length;
        ctx.globalAlpha *= this.opacity;
        if (this.dirtyZIndex) {
            this.dirtyZIndex = false;
            children.sort(function (a, b) { return a.zIndex - b.zIndex; });
        }
        for (var i = 0; i < n; i++) {
            var child = children[i];
            if (child.visible) {
                ctx.save();
                child.render(ctx);
                ctx.restore();
            }
        }
        // debug
        // this.computeBBox().render(ctx, {
        //     label: this.id,
        //     resetTransform: true,
        //     fillStyle: 'rgba(0, 0, 0, 0.5)'
        // });
    };
    Group.className = 'Group';
    return Group;
}(Node));

var EnterNode = /** @class */ (function () {
    function EnterNode(parent, datum) {
        this.next = null;
        this.scene = parent.scene;
        this.parent = parent;
        this.datum = datum;
    }
    EnterNode.prototype.appendChild = function (node) {
        // This doesn't work without the `strict: true` in the `tsconfig.json`,
        // so we must have two `if` checks below, instead of this single one.
        // if (this.next && !Node.isNode(this.next)) {
        //     throw new Error(`${this.next} is not a Node.`);
        // }
        if (this.next === null) {
            return this.parent.insertBefore(node, null);
        }
        if (!Node.isNode(this.next)) {
            throw new Error(this.next + " is not a Node.");
        }
        return this.parent.insertBefore(node, this.next);
    };
    EnterNode.prototype.insertBefore = function (node, nextNode) {
        return this.parent.insertBefore(node, nextNode);
    };
    return EnterNode;
}());
/**
 * G - type of the selected node(s).
 * GDatum - type of the datum of the selected node(s).
 * P - type of the parent node(s).
 * PDatum - type of the datum of the parent node(s).
 */
var Selection = /** @class */ (function () {
    function Selection(groups, parents) {
        this.groups = groups;
        this.parents = parents;
    }
    Selection.select = function (node) {
        return new Selection([[typeof node === 'function' ? node() : node]], [undefined]);
    };
    Selection.selectAll = function (nodes) {
        return new Selection([nodes == null ? [] : nodes], [undefined]);
    };
    /**
     * Creates new nodes, appends them to the nodes of this selection and returns them
     * as a new selection. The created nodes inherit the datums and the parents of the nodes
     * they replace.
     * @param Class The constructor function to use to create the new nodes.
     */
    Selection.prototype.append = function (Class) {
        return this.select(function (node) {
            return node.appendChild(new Class());
        });
    };
    /**
     * Same as the {@link append}, but accepts a custom creator function with the
     * {@link NodeSelector} signature rather than a constructor function.
     * @param creator
     */
    Selection.prototype.appendFn = function (creator) {
        return this.select(function (node, data, index, group) {
            return node.appendChild(creator(node, data, index, group));
        });
    };
    /**
     * Runs the given selector that returns a single node for every node in each group.
     * The original nodes are then replaced by the nodes returned by the selector
     * and returned as a new selection.
     * The selected nodes inherit the datums and the parents of the original nodes.
     */
    Selection.prototype.select = function (selector) {
        var groups = this.groups;
        var numGroups = groups.length;
        var subgroups = [];
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var groupSize = group.length;
            var subgroup = subgroups[j] = new Array(groupSize);
            for (var i = 0; i < groupSize; i++) {
                var node = group[i];
                if (node) {
                    var subnode = selector(node, node.datum, i, group);
                    if (subnode) {
                        subnode.datum = node.datum;
                    }
                    subgroup[i] = subnode;
                }
                // else this can be a group of the `enter` selection,
                // for example, with no nodes at the i-th position,
                // only nodes at the end of the group
            }
        }
        return new Selection(subgroups, this.parents);
    };
    /**
     * Same as {@link select}, but uses the given {@param Class} (constructor) as a selector.
     * @param Class The constructor function to use to find matching nodes.
     */
    Selection.prototype.selectByClass = function (Class) {
        return this.select(function (node) {
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child instanceof Class) {
                        return child;
                    }
                }
            }
        });
    };
    Selection.prototype.selectByTag = function (tag) {
        return this.select(function (node) {
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child.tag === tag) {
                        return child;
                    }
                }
            }
        });
    };
    Selection.prototype.selectAllByClass = function (Class) {
        return this.selectAll(function (node) {
            var nodes = [];
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child instanceof Class) {
                        nodes.push(child);
                    }
                }
            }
            return nodes;
        });
    };
    Selection.prototype.selectAllByTag = function (tag) {
        return this.selectAll(function (node) {
            var nodes = [];
            if (Node.isNode(node)) {
                var children = node.children;
                var n = children.length;
                for (var i = 0; i < n; i++) {
                    var child = children[i];
                    if (child.tag === tag) {
                        nodes.push(child);
                    }
                }
            }
            return nodes;
        });
    };
    Selection.prototype.selectNone = function () {
        return [];
    };
    /**
     * Runs the given selector that returns a group of nodes for every node in each group.
     * The original nodes are then replaced by the groups of nodes returned by the selector
     * and returned as a new selection. The original nodes become the parent nodes for each
     * group in the new selection. The selected nodes do not inherit the datums of the original nodes.
     * If called without any parameters, creates a new selection with an empty group for each
     * node in this selection.
     */
    Selection.prototype.selectAll = function (selectorAll) {
        if (!selectorAll) {
            selectorAll = this.selectNone;
        }
        // Each subgroup is populated with the selector (run on each group node) results.
        var subgroups = [];
        // In the new selection that we return, subgroups become groups,
        // and group nodes become parents.
        var parents = [];
        var groups = this.groups;
        var groupCount = groups.length;
        for (var j = 0; j < groupCount; j++) {
            var group = groups[j];
            var groupLength = group.length;
            for (var i = 0; i < groupLength; i++) {
                var node = group[i];
                if (node) {
                    subgroups.push(selectorAll(node, node.datum, i, group));
                    parents.push(node);
                }
            }
        }
        return new Selection(subgroups, parents);
    };
    /**
     * Runs the given callback for every node in this selection and returns this selection.
     * @param cb
     */
    Selection.prototype.each = function (cb) {
        var groups = this.groups;
        var numGroups = groups.length;
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var groupSize = group.length;
            for (var i = 0; i < groupSize; i++) {
                var node = group[i];
                if (node) {
                    cb(node, node.datum, i, group);
                }
            }
        }
        return this;
    };
    Selection.prototype.remove = function () {
        return this.each(function (node) {
            if (Node.isNode(node)) {
                var parent_1 = node.parent;
                if (parent_1) {
                    parent_1.removeChild(node);
                }
            }
        });
    };
    Selection.prototype.merge = function (other) {
        var groups0 = this.groups;
        var groups1 = other.groups;
        var m0 = groups0.length;
        var m1 = groups1.length;
        var m = Math.min(m0, m1);
        var merges = new Array(m0);
        var j = 0;
        for (; j < m; j++) {
            var group0 = groups0[j];
            var group1 = groups1[j];
            var n = group0.length;
            var merge = merges[j] = new Array(n);
            for (var i = 0; i < n; i++) {
                var node = group0[i] || group1[i];
                merge[i] = node || undefined;
            }
        }
        for (; j < m0; j++) {
            merges[j] = groups0[j];
        }
        return new Selection(merges, this.parents);
    };
    /**
     * Return the first non-null element in this selection.
     * If the selection is empty, returns null.
     */
    Selection.prototype.node = function () {
        var groups = this.groups;
        var numGroups = groups.length;
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var groupSize = group.length;
            for (var i = 0; i < groupSize; i++) {
                var node = group[i];
                if (node) {
                    return node;
                }
            }
        }
        return null;
    };
    Selection.prototype.attr = function (name, value) {
        this.each(function (node) {
            node[name] = value;
        });
        return this;
    };
    Selection.prototype.attrFn = function (name, value) {
        this.each(function (node, datum, index, group) {
            node[name] = value(node, datum, index, group);
        });
        return this;
    };
    /**
     * Invokes the given function once, passing in this selection.
     * Returns this selection. Facilitates method chaining.
     * @param cb
     */
    Selection.prototype.call = function (cb) {
        cb(this);
        return this;
    };
    Object.defineProperty(Selection.prototype, "size", {
        /**
         * Returns the total number of nodes in this selection.
         */
        get: function () {
            var size = 0;
            this.each(function () { return size++; });
            return size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "data", {
        /**
         * Returns the array of data for the selected elements.
         */
        get: function () {
            var data = [];
            this.each(function (_, datum) { return data.push(datum); });
            return data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "enter", {
        get: function () {
            return new Selection(this.enterGroups ? this.enterGroups : [[]], this.parents);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "exit", {
        get: function () {
            return new Selection(this.exitGroups ? this.exitGroups : [[]], this.parents);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds the given value to each selected node and returns this selection
     * with its {@link GDatum} type changed to the type of the given value.
     * This method doesn't compute a join and doesn't affect indexes or the enter and exit selections.
     * This method can also be used to clear bound data.
     * @param value
     */
    Selection.prototype.setDatum = function (value) {
        return this.each(function (node) {
            node.datum = value;
        });
    };
    Object.defineProperty(Selection.prototype, "datum", {
        /**
         * Returns the bound datum for the first non-null element in the selection.
         * This is generally useful only if you know the selection contains exactly one element.
         */
        get: function () {
            var node = this.node();
            return node ? node.datum : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Binds the specified array of values with the selected nodes, returning a new selection
     * that represents the _update_ selection: the nodes successfully bound to the values.
     * Also defines the {@link enter} and {@link exit} selections on the returned selection,
     * which can be used to add or remove the nodes to correspond to the new data.
     * The `values` is an array of values of a particular type, or a function that returns
     * an array of values for each group.
     * When values are assigned to the nodes, they are stored in the {@link Node.datum} property.
     * @param values
     * @param key
     */
    Selection.prototype.setData = function (values, key) {
        if (typeof values !== 'function') {
            var data_1 = values;
            values = function () { return data_1; };
        }
        var groups = this.groups;
        var parents = this.parents;
        var numGroups = groups.length;
        var updateGroups = new Array(numGroups);
        var enterGroups = new Array(numGroups);
        var exitGroups = new Array(numGroups);
        for (var j = 0; j < numGroups; j++) {
            var group = groups[j];
            var parent_2 = parents[j];
            if (!parent_2) {
                throw new Error("Group #" + j + " has no parent: " + group);
            }
            var groupSize = group.length;
            var data = values(parent_2, parent_2.datum, j, parents);
            var dataSize = data.length;
            var enterGroup = enterGroups[j] = new Array(dataSize);
            var updateGroup = updateGroups[j] = new Array(dataSize);
            var exitGroup = exitGroups[j] = new Array(groupSize);
            if (key) {
                this.bindKey(parent_2, group, enterGroup, updateGroup, exitGroup, data, key);
            }
            else {
                this.bindIndex(parent_2, group, enterGroup, updateGroup, exitGroup, data);
            }
            // Now connect the enter nodes to their following update node, such that
            // appendChild can insert the materialized enter node before this node,
            // rather than at the end of the parent node.
            for (var i0 = 0, i1 = 0; i0 < dataSize; i0++) {
                var previous = enterGroup[i0];
                if (previous) {
                    if (i0 >= i1) {
                        i1 = i0 + 1;
                    }
                    var next = void 0;
                    while (!(next = updateGroup[i1]) && i1 < dataSize) {
                        i1++;
                    }
                    previous.next = next || null;
                }
            }
        }
        var result = new Selection(updateGroups, parents);
        result.enterGroups = enterGroups;
        result.exitGroups = exitGroups;
        return result;
    };
    Selection.prototype.bindIndex = function (parent, group, enter, update, exit, data) {
        var groupSize = group.length;
        var dataSize = data.length;
        var i = 0;
        for (; i < dataSize; i++) {
            var node = group[i];
            if (node) {
                node.datum = data[i];
                update[i] = node;
            }
            else { // more datums than group nodes
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        // more group nodes than datums
        for (; i < groupSize; i++) {
            var node = group[i];
            if (node) {
                exit[i] = node;
            }
        }
    };
    Selection.prototype.bindKey = function (parent, group, enter, update, exit, data, key) {
        var groupSize = group.length;
        var dataSize = data.length;
        var keyValues = new Array(groupSize);
        var nodeByKeyValue = {};
        // Compute the key for each node.
        // If multiple nodes have the same key, the duplicates are added to exit.
        for (var i = 0; i < groupSize; i++) {
            var node = group[i];
            if (node) {
                var keyValue = keyValues[i] = Selection.keyPrefix + key(node, node.datum, i, group);
                if (keyValue in nodeByKeyValue) {
                    exit[i] = node;
                }
                else {
                    nodeByKeyValue[keyValue] = node;
                }
            }
        }
        // Compute the key for each datum.
        // If there is a node associated with this key, join and add it to update.
        // If there is not (or the key is a duplicate), add it to enter.
        for (var i = 0; i < dataSize; i++) {
            var keyValue = Selection.keyPrefix + key(parent, data[i], i, data);
            var node = nodeByKeyValue[keyValue];
            if (node) {
                update[i] = node;
                node.datum = data[i];
                nodeByKeyValue[keyValue] = undefined;
            }
            else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        // Add any remaining nodes that were not bound to data to exit.
        for (var i = 0; i < groupSize; i++) {
            var node = group[i];
            if (node && (nodeByKeyValue[keyValues[i]] === node)) {
                exit[i] = node;
            }
        }
    };
    Selection.keyPrefix = '$'; // Protect against keys like '__proto__'.
    return Selection;
}());

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Line = /** @class */ (function (_super) {
    __extends$7(Line, _super);
    function Line() {
        var _this = _super.call(this) || this;
        _this._x1 = 0;
        _this._y1 = 0;
        _this._x2 = 0;
        _this._y2 = 0;
        _this.restoreOwnStyles();
        return _this;
    }
    Object.defineProperty(Line.prototype, "x1", {
        get: function () {
            // TODO: Investigate getter performance further in the context
            //       of the scene graph.
            //       In isolated benchmarks using a getter has the same
            //       performance as a direct property access in Firefox 64.
            //       But in Chrome 71 the getter is 60% slower than direct access.
            //       Direct read is 4.5+ times slower in Chrome than it is in Firefox.
            //       Property access and direct read have the same performance
            //       in Safari 12, which is 2+ times faster than Firefox at this.
            // https://jsperf.com/es5-getters-setters-versus-getter-setter-methods/18
            // This is a know Chrome issue. They say it's not a regression, since
            // the behavior is observed since M60, but jsperf.com history shows the
            // 10x slowdown happened between Chrome 48 and Chrome 57.
            // https://bugs.chromium.org/p/chromium/issues/detail?id=908743
            return this._x1;
        },
        set: function (value) {
            if (this._x1 !== value) {
                this._x1 = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y1", {
        get: function () {
            return this._y1;
        },
        set: function (value) {
            if (this._y1 !== value) {
                this._y1 = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "x2", {
        get: function () {
            return this._x2;
        },
        set: function (value) {
            if (this._x2 !== value) {
                this._x2 = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "y2", {
        get: function () {
            return this._y2;
        },
        set: function (value) {
            if (this._y2 !== value) {
                this._y2 = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Line.prototype.computeBBox = function () {
        return new BBox(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    };
    Line.prototype.isPointInPath = function (x, y) {
        return false;
    };
    Line.prototype.isPointInStroke = function (x, y) {
        return false;
    };
    Line.prototype.render = function (ctx) {
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        this.matrix.toContext(ctx);
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;
        // Align to the pixel grid if the line is strictly vertical
        // or horizontal (but not both, i.e. a dot).
        if (x1 === x2) {
            var x = Math.round(x1) + Math.floor(this.strokeWidth) % 2 / 2;
            x1 = x;
            x2 = x;
        }
        else if (y1 === y2) {
            var y = Math.round(y1) + Math.floor(this.strokeWidth) % 2 / 2;
            y1 = y;
            y2 = y;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        this.fillStroke(ctx);
        this.dirty = false;
    };
    Line.className = 'Line';
    Line.defaultStyles = chainObjects(Shape.defaultStyles, {
        fill: undefined,
        strokeWidth: 1
    });
    return Line;
}(Shape));

// @ts-ignore Suppress tsc error: Property 'sign' does not exist on type 'Math'
var sign = Math.sign ? Math.sign : function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
};
/**
 * Finds the roots of a parametric linear equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 */
function linearRoot(a, b) {
    var t = -b / a;
    return (a !== 0 && t >= 0 && t <= 1) ? [t] : [];
}
/**
 * Finds the roots of a parametric quadratic equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 */
function quadraticRoots(a, b, c) {
    if (a === 0) {
        return linearRoot(b, c);
    }
    var D = b * b - 4 * a * c; // The polynomial's discriminant.
    var roots = [];
    if (D === 0) { // A single real root.
        var t = -b / (2 * a);
        if (t >= 0 && t <= 1) {
            roots.push(t);
        }
    }
    else if (D > 0) { // A pair of distinct real roots.
        var rD = Math.sqrt(D);
        var t1 = (-b - rD) / (2 * a);
        var t2 = (-b + rD) / (2 * a);
        if (t1 >= 0 && t1 <= 1) {
            roots.push(t1);
        }
        if (t2 >= 0 && t2 <= 1) {
            roots.push(t2);
        }
    }
    // else -> Complex roots.
    return roots;
}
/**
 * Finds the roots of a parametric cubic equation in `t`,
 * where `t` lies in the interval of `[0,1]`.
 * Returns an array of parametric intersection locations along the cubic,
 * excluding out-of-bounds intersections (before or after the end point
 * or in the imaginary plane).
 * An adaptation of http://www.particleincell.com/blog/2013/cubic-line-intersection/
 */
function cubicRoots(a, b, c, d) {
    if (a === 0) {
        return quadraticRoots(b, c, d);
    }
    var A = b / a;
    var B = c / a;
    var C = d / a;
    var Q = (3 * B - A * A) / 9;
    var R = (9 * A * B - 27 * C - 2 * A * A * A) / 54;
    var D = Q * Q * Q + R * R; // The polynomial's discriminant.
    var third = 1 / 3;
    var roots = [];
    if (D >= 0) { // Complex or duplicate roots.
        var rD = Math.sqrt(D);
        var S = sign(R + rD) * Math.pow(Math.abs(R + rD), third);
        var T = sign(R - rD) * Math.pow(Math.abs(R - rD), third);
        var Im = Math.abs(Math.sqrt(3) * (S - T) / 2); // Complex part of the root pair.
        var t = -third * A + (S + T); // A real root.
        if (t >= 0 && t <= 1) {
            roots.push(t);
        }
        if (Im === 0) {
            var t_1 = -third * A - (S + T) / 2; // The real part of a complex root.
            if (t_1 >= 0 && t_1 <= 1) {
                roots.push(t_1);
            }
        }
    }
    else { // Distinct real roots.
        var theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
        var thirdA = third * A;
        var twoSqrtQ = 2 * Math.sqrt(-Q);
        var t1 = twoSqrtQ * Math.cos(third * theta) - thirdA;
        var t2 = twoSqrtQ * Math.cos(third * (theta + 2 * Math.PI)) - thirdA;
        var t3 = twoSqrtQ * Math.cos(third * (theta + 4 * Math.PI)) - thirdA;
        if (t1 >= 0 && t1 <= 1) {
            roots.push(t1);
        }
        if (t2 >= 0 && t2 <= 1) {
            roots.push(t2);
        }
        if (t3 >= 0 && t3 <= 1) {
            roots.push(t3);
        }
    }
    return roots;
}

/**
 * Returns the intersection point for the given pair of line segments, or null,
 * if the segments are parallel or don't intersect.
 * Based on http://paulbourke.net/geometry/pointlineplane/
 */
function segmentIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    var d = (ax2 - ax1) * (by2 - by1) - (ay2 - ay1) * (bx2 - bx1);
    if (d === 0) { // The lines are parallel.
        return null;
    }
    var ua = ((bx2 - bx1) * (ay1 - by1) - (ax1 - bx1) * (by2 - by1)) / d;
    var ub = ((ax2 - ax1) * (ay1 - by1) - (ay2 - ay1) * (ax1 - bx1)) / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
            x: ax1 + ua * (ax2 - ax1),
            y: ay1 + ua * (ay2 - ay1)
        };
    }
    return null; // The intersection point is outside either or both segments.
}
/**
 * Returns intersection points of the given cubic curve and the line segment.
 * Takes in x/y components of cubic control points and line segment start/end points
 * as parameters.
 */
function cubicSegmentIntersections(px1, py1, px2, py2, px3, py3, px4, py4, x1, y1, x2, y2) {
    var intersections = [];
    // Find line equation coefficients.
    var A = y1 - y2;
    var B = x2 - x1;
    var C = x1 * (y2 - y1) - y1 * (x2 - x1);
    // Find cubic Bezier curve equation coefficients from control points.
    var bx = bezierCoefficients(px1, px2, px3, px4);
    var by = bezierCoefficients(py1, py2, py3, py4);
    var a = A * bx[0] + B * by[0]; // t^3
    var b = A * bx[1] + B * by[1]; // t^2
    var c = A * bx[2] + B * by[2]; // t
    var d = A * bx[3] + B * by[3] + C; // 1
    var roots = cubicRoots(a, b, c, d);
    // Verify that the roots are within bounds of the linear segment.
    for (var i = 0; i < roots.length; i++) {
        var t = roots[i];
        var tt = t * t;
        var ttt = t * tt;
        // Find the cartesian plane coordinates for the parametric root `t`.
        var x = bx[0] * ttt + bx[1] * tt + bx[2] * t + bx[3];
        var y = by[0] * ttt + by[1] * tt + by[2] * t + by[3];
        // The parametric cubic roots we found are intersection points
        // with an infinite line, and so the x/y coordinates above are as well.
        // Make sure the x/y is also within the bounds of the given segment.
        var s = void 0;
        if (x1 !== x2) {
            s = (x - x1) / (x2 - x1);
        }
        else { // the line is vertical
            s = (y - y1) / (y2 - y1);
        }
        if (s >= 0 && s <= 1) {
            intersections.push({ x: x, y: y });
        }
    }
    return intersections;
}
/**
 * Returns the given coordinates vector multiplied by the coefficient matrix
 * of the parametric cubic Bézier equation.
 */
function bezierCoefficients(P1, P2, P3, P4) {
    return [
        -P1 + 3 * P2 - 3 * P3 + P4,
        3 * P1 - 6 * P2 + 3 * P3,
        -3 * P1 + 3 * P2,
        P1 //                 | 1  0  0  0| |P4|
    ];
}

var Path2D = /** @class */ (function () {
    function Path2D() {
        // The methods of this class will likely be called many times per animation frame,
        // and any allocation can trigger a GC cycle during animation, so we attempt
        // to minimize the number of allocations.
        this.commands = [];
        this.params = [];
        this._closedPath = false;
    }
    Path2D.prototype.draw = function (ctx) {
        var commands = this.commands;
        var params = this.params;
        var n = commands.length;
        var j = 0;
        ctx.beginPath();
        for (var i = 0; i < n; i++) {
            switch (commands[i]) {
                case 'M':
                    ctx.moveTo(params[j++], params[j++]);
                    break;
                case 'L':
                    ctx.lineTo(params[j++], params[j++]);
                    break;
                case 'C':
                    ctx.bezierCurveTo(params[j++], params[j++], params[j++], params[j++], params[j++], params[j++]);
                    break;
                case 'Z':
                    ctx.closePath();
                    break;
            }
        }
    };
    Path2D.prototype.moveTo = function (x, y) {
        if (this.xy) {
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.xy = [x, y];
        }
        this.commands.push('M');
        this.params.push(x, y);
    };
    Path2D.prototype.lineTo = function (x, y) {
        if (this.xy) {
            this.commands.push('L');
            this.params.push(x, y);
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.moveTo(x, y);
        }
    };
    Path2D.prototype.rect = function (x, y, width, height) {
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.closePath();
    };
    /**
     * Adds an arc segment to the path definition.
     * https://www.w3.org/TR/SVG11/paths.html#PathDataEllipticalArcCommands
     * @param rx The major-axis radius.
     * @param ry The minor-axis radius.
     * @param rotation The x-axis rotation, expressed in radians.
     * @param fA The large arc flag. `1` to use angle > π.
     * @param fS The sweep flag. `1` for the arc that goes to `x`/`y` clockwise.
     * @param x2 The x coordinate to arc to.
     * @param y2 The y coordinate to arc to.
     */
    Path2D.prototype.arcTo = function (rx, ry, rotation, fA, fS, x2, y2) {
        // Convert from endpoint to center parametrization:
        // https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        var xy = this.xy;
        if (!xy) {
            return;
        }
        if (rx < 0) {
            rx = -rx;
        }
        if (ry < 0) {
            ry = -ry;
        }
        var x1 = xy[0];
        var y1 = xy[1];
        var hdx = (x1 - x2) / 2;
        var hdy = (y1 - y2) / 2;
        var sinPhi = Math.sin(rotation);
        var cosPhi = Math.cos(rotation);
        var xp = cosPhi * hdx + sinPhi * hdy;
        var yp = -sinPhi * hdx + cosPhi * hdy;
        var ratX = xp / rx;
        var ratY = yp / ry;
        var lambda = ratX * ratX + ratY * ratY;
        var cx = (x1 + x2) / 2;
        var cy = (y1 + y2) / 2;
        var cpx = 0;
        var cpy = 0;
        if (lambda >= 1) {
            lambda = Math.sqrt(lambda);
            rx *= lambda;
            ry *= lambda;
            // me gives lambda == cpx == cpy == 0;
        }
        else {
            lambda = Math.sqrt(1 / lambda - 1);
            if (fA === fS) {
                lambda = -lambda;
            }
            cpx = lambda * rx * ratY;
            cpy = -lambda * ry * ratX;
            cx += cosPhi * cpx - sinPhi * cpy;
            cy += sinPhi * cpx + cosPhi * cpy;
        }
        var theta1 = Math.atan2((yp - cpy) / ry, (xp - cpx) / rx);
        var deltaTheta = Math.atan2((-yp - cpy) / ry, (-xp - cpx) / rx) - theta1;
        // if (fS) {
        //     if (deltaTheta <= 0) {
        //         deltaTheta += Math.PI * 2;
        //     }
        // }
        // else {
        //     if (deltaTheta >= 0) {
        //         deltaTheta -= Math.PI * 2;
        //     }
        // }
        this.cubicArc(cx, cy, rx, ry, rotation, theta1, theta1 + deltaTheta, 1 - fS);
    };
    /**
     * Approximates an elliptical arc with up to four cubic Bézier curves.
     * @param commands The string array to write SVG command letters to.
     * @param params The number array to write SVG command parameters (cubic control points) to.
     * @param cx The x-axis coordinate for the ellipse's center.
     * @param cy The y-axis coordinate for the ellipse's center.
     * @param rx The ellipse's major-axis radius.
     * @param ry The ellipse's minor-axis radius.
     * @param phi The rotation for this ellipse, expressed in radians.
     * @param theta1 The starting angle, measured clockwise from the positive x-axis and expressed in radians.
     * @param theta2 The ending angle, measured clockwise from the positive x-axis and expressed in radians.
     * @param anticlockwise The arc control points are always placed clockwise from `theta1` to `theta2`,
     * even when `theta1 > theta2`, unless this flag is set to `1`.
     */
    Path2D.cubicArc = function (commands, params, cx, cy, rx, ry, phi, theta1, theta2, anticlockwise) {
        if (anticlockwise) {
            var temp = theta1;
            theta1 = theta2;
            theta2 = temp;
        }
        var start = params.length;
        // See https://pomax.github.io/bezierinfo/#circles_cubic
        // Arc of unit circle (start angle = 0, end angle <= π/2) in cubic Bézier coordinates:
        // S = [1, 0]
        // C1 = [1, f]
        // C2 = [cos(θ) + f * sin(θ), sin(θ) - f * cos(θ)]
        // E = [cos(θ), sin(θ)]
        // f = 4/3 * tan(θ/4)
        var f90 = 0.5522847498307935; // f for θ = π/2 is 4/3 * (Math.sqrt(2) - 1)
        var sinTheta1 = Math.sin(theta1);
        var cosTheta1 = Math.cos(theta1);
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var rightAngle = Math.PI / 2;
        // Since we know how to draw an arc of a unit circle with a cubic Bézier,
        // to draw an elliptical arc with arbitrary rotation and radii we:
        // 1) rotate the Bézier coordinates that represent a circular arc by θ
        // 2) scale the circular arc separately along the x/y axes, making it elliptical
        // 3) rotate elliptical arc by φ
        // |cos(φ) -sin(φ)| |sx  0| |cos(θ) -sin(θ)| -> |xx xy|
        // |sin(φ)  cos(φ)| | 0 sy| |sin(θ)  cos(θ)| -> |yx yy|
        var xx = cosPhi * cosTheta1 * rx - sinPhi * sinTheta1 * ry;
        var yx = sinPhi * cosTheta1 * rx + cosPhi * sinTheta1 * ry;
        var xy = -cosPhi * sinTheta1 * rx - sinPhi * cosTheta1 * ry;
        var yy = -sinPhi * sinTheta1 * rx + cosPhi * cosTheta1 * ry;
        // TODO: what if delta between θ1 and θ2 is greater than 2π?
        // Always draw clockwise from θ1 to θ2.
        theta2 -= theta1;
        if (theta2 < 0) {
            theta2 += Math.PI * 2;
        }
        // Multiplying each point [x, y] by:
        // |xx xy cx| |x|
        // |yx yy cy| |y|
        // | 0  0  1| |1|
        // TODO: This move command may be redundant, if we are already at this point.
        // The coordinates of the point calculated here may differ ever so slightly
        // because of precision error.
        commands.push('M');
        params.push(xx + cx, yx + cy);
        while (theta2 >= rightAngle) {
            theta2 -= rightAngle;
            commands.push('C');
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var lastX = xy + cx;
            params.push(xx + xy * f90 + cx, yx + yy * f90 + cy, xx * f90 + xy + cx, yx * f90 + yy + cy, Math.abs(lastX) < 1e-8 ? 0 : lastX, yy + cy);
            // Prepend π/2 rotation matrix.
            // |xx xy| | 0 1| -> | xy -xx|
            // |yx yy| |-1 0| -> | yy -yx|
            // [xx, yx, xy, yy] = [xy, yy, -xx, -yx];
            // Compared to swapping with a temp variable, destructuring is:
            // - 10% faster in Chrome 70
            // - 99% slower in Firefox 63
            // Temp variable solution is 45% faster in FF than Chrome.
            // https://jsperf.com/multi-swap
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1165569
            var temp = xx;
            xx = xy;
            xy = -temp;
            temp = yx;
            yx = yy;
            yy = -temp;
        }
        if (theta2) {
            var f = 4 / 3 * Math.tan(theta2 / 4);
            var sinPhi2 = Math.sin(theta2);
            var cosPhi2 = Math.cos(theta2);
            var C2x = cosPhi2 + f * sinPhi2;
            var C2y = sinPhi2 - f * cosPhi2;
            commands.push('C');
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var lastX = xx * cosPhi2 + xy * sinPhi2 + cx;
            params.push(xx + xy * f + cx, yx + yy * f + cy, xx * C2x + xy * C2y + cx, yx * C2x + yy * C2y + cy, Math.abs(lastX) < 1e-8 ? 0 : lastX, yx * cosPhi2 + yy * sinPhi2 + cy);
        }
        if (anticlockwise) {
            for (var i = start, j = params.length - 2; i < j; i += 2, j -= 2) {
                var temp = params[i];
                params[i] = params[j];
                params[j] = temp;
                temp = params[i + 1];
                params[i + 1] = params[j + 1];
                params[j + 1] = temp;
            }
        }
    };
    Path2D.prototype.cubicArc = function (cx, cy, rx, ry, phi, theta1, theta2, anticlockwise) {
        var commands = this.commands;
        var params = this.params;
        var start = commands.length;
        Path2D.cubicArc(commands, params, cx, cy, rx, ry, phi, theta1, theta2, anticlockwise);
        var x = params[params.length - 2];
        var y = params[params.length - 1];
        if (this.xy) {
            commands[start] = 'L';
            this.xy[0] = x;
            this.xy[1] = y;
        }
        else {
            this.xy = [x, y];
        }
    };
    /**
     * Returns the `[x, y]` coordinates of the curve at `t`.
     * @param points `(n + 1) * 2` control point coordinates for a Bézier curve of n-th order.
     * @param t
     */
    Path2D.prototype.deCasteljau = function (points, t) {
        var n = points.length;
        if (n < 2 || n % 2 === 1) {
            throw new Error('Fewer than two points or not an even count.');
        }
        else if (n === 2 || t === 0) {
            return points.slice(0, 2);
        }
        else if (t === 1) {
            return points.slice(-2);
        }
        else {
            var newPoints = [];
            var last = n - 2;
            for (var i = 0; i < last; i += 2) {
                newPoints.push((1 - t) * points[i] + t * points[i + 2], // x
                (1 - t) * points[i + 1] + t * points[i + 3] // y
                );
            }
            return this.deCasteljau(newPoints, t);
        }
    };
    /**
     * Approximates the given curve using `n` line segments.
     * @param points `(n + 1) * 2` control point coordinates for a Bézier curve of n-th order.
     * @param n
     */
    Path2D.prototype.approximateCurve = function (points, n) {
        var xy = this.deCasteljau(points, 0);
        this.moveTo(xy[0], xy[1]);
        var step = 1 / n;
        for (var t = step; t <= 1; t += step) {
            var xy_1 = this.deCasteljau(points, t);
            this.lineTo(xy_1[0], xy_1[1]);
        }
    };
    /**
     * Adds a quadratic curve segment to the path definition.
     * Note: the given quadratic segment is converted and stored as a cubic one.
     * @param cx x-component of the curve's control point
     * @param cy y-component of the curve's control point
     * @param x x-component of the end point
     * @param y y-component of the end point
     */
    Path2D.prototype.quadraticCurveTo = function (cx, cy, x, y) {
        if (!this.xy) {
            this.moveTo(cx, cy);
        }
        // See https://pomax.github.io/bezierinfo/#reordering
        this.cubicCurveTo((this.xy[0] + 2 * cx) / 3, (this.xy[1] + 2 * cy) / 3, // 1/3 start + 2/3 control
        (2 * cx + x) / 3, (2 * cy + y) / 3, // 2/3 control + 1/3 end
        x, y);
    };
    Path2D.prototype.cubicCurveTo = function (cx1, cy1, cx2, cy2, x, y) {
        if (!this.xy) {
            this.moveTo(cx1, cy1);
        }
        this.commands.push('C');
        this.params.push(cx1, cy1, cx2, cy2, x, y);
        this.xy[0] = x;
        this.xy[1] = y;
    };
    Object.defineProperty(Path2D.prototype, "closedPath", {
        get: function () {
            return this._closedPath;
        },
        enumerable: true,
        configurable: true
    });
    Path2D.prototype.closePath = function () {
        if (this.xy) {
            this.xy = undefined;
            this.commands.push('Z');
            this._closedPath = true;
        }
    };
    Path2D.prototype.clear = function () {
        this.commands.length = 0;
        this.params.length = 0;
        this.xy = undefined;
        this._closedPath = false;
    };
    Path2D.prototype.isPointInPath = function (x, y) {
        var commands = this.commands;
        var params = this.params;
        var cn = commands.length;
        // Hit testing using ray casting method, where the ray's origin is some point
        // outside the path. In this case, an offscreen point that is remote enough, so that
        // even if the path itself is large and is partially offscreen, the ray's origin
        // will likely be outside the path anyway. To test if the given point is inside the
        // path or not, we cast a ray from the origin to the given point and check the number
        // of intersections of this segment with the path. If the number of intersections is
        // even, then the ray both entered and exited the path an equal number of times,
        // therefore the point is outside the path, and inside the path, if the number of
        // intersections is odd. Since the path is compound, we check if the ray segment
        // intersects with each of the path's segments, which can be either a line segment
        // (one or no intersection points) or a Bézier curve segment (up to 3 intersection
        // points).
        var ox = -10000;
        var oy = -10000;
        // the starting point of the  current path
        var sx = NaN;
        var sy = NaN;
        // the previous point of the current path
        var px = 0;
        var py = 0;
        var intersectionCount = 0;
        for (var ci = 0, pi = 0; ci < cn; ci++) {
            switch (commands[ci]) {
                case 'M':
                    if (!isNaN(sx)) {
                        if (segmentIntersection(sx, sy, px, py, ox, oy, x, y)) {
                            intersectionCount++;
                        }
                    }
                    sx = px = params[pi++];
                    sy = py = params[pi++];
                    break;
                case 'L':
                    if (segmentIntersection(px, py, px = params[pi++], py = params[pi++], ox, oy, x, y)) {
                        intersectionCount++;
                    }
                    break;
                case 'C':
                    intersectionCount += cubicSegmentIntersections(px, py, params[pi++], params[pi++], params[pi++], params[pi++], px = params[pi++], py = params[pi++], ox, oy, x, y).length;
                    break;
                case 'Z':
                    if (!isNaN(sx)) {
                        if (segmentIntersection(sx, sy, px, py, ox, oy, x, y)) {
                            intersectionCount++;
                        }
                    }
                    break;
            }
        }
        return intersectionCount % 2 === 1;
    };
    Path2D.fromString = function (value) {
        var path = new Path2D();
        path.setFromString(value);
        return path;
    };
    /**
     * Split the SVG path at command letters,
     * then extract the command letter and parameters from each substring.
     * @param value
     */
    Path2D.parseSvgPath = function (value) {
        return value.trim().split(Path2D.splitCommandsRe).map(function (part) {
            var strParams = part.match(Path2D.matchParamsRe);
            return {
                command: part.substr(0, 1),
                params: strParams ? strParams.map(parseFloat) : []
            };
        });
    };
    Path2D.prettifySvgPath = function (value) {
        return Path2D.parseSvgPath(value).map(function (d) { return d.command + d.params.join(','); }).join('\n');
    };
    /**
     * See https://www.w3.org/TR/SVG11/paths.html
     * @param value
     */
    Path2D.prototype.setFromString = function (value) {
        var _this = this;
        this.clear();
        var parts = Path2D.parseSvgPath(value);
        // Current point.
        var x;
        var y;
        // Last control point. Used to calculate the reflection point
        // for `S`, `s`, `T`, `t` commands.
        var cpx;
        var cpy;
        var lastCommand;
        function checkQuadraticCP() {
            if (!lastCommand.match(Path2D.quadraticCommandRe)) {
                cpx = x;
                cpy = y;
            }
        }
        function checkCubicCP() {
            if (!lastCommand.match(Path2D.cubicCommandRe)) {
                cpx = x;
                cpy = y;
            }
        }
        // But that will make compiler complain about x/y, cpx/cpy
        // being used without being set first.
        parts.forEach(function (part) {
            var p = part.params;
            var n = p.length;
            var i = 0;
            switch (part.command) {
                case 'M':
                    _this.moveTo(x = p[i++], y = p[i++]);
                    while (i < n) {
                        _this.lineTo(x = p[i++], y = p[i++]);
                    }
                    break;
                case 'm':
                    _this.moveTo(x += p[i++], y += p[i++]);
                    while (i < n) {
                        _this.lineTo(x += p[i++], y += p[i++]);
                    }
                    break;
                case 'L':
                    while (i < n) {
                        _this.lineTo(x = p[i++], y = p[i++]);
                    }
                    break;
                case 'l':
                    while (i < n) {
                        _this.lineTo(x += p[i++], y += p[i++]);
                    }
                    break;
                case 'C':
                    while (i < n) {
                        _this.cubicCurveTo(p[i++], p[i++], cpx = p[i++], cpy = p[i++], x = p[i++], y = p[i++]);
                    }
                    break;
                case 'c':
                    while (i < n) {
                        _this.cubicCurveTo(x + p[i++], y + p[i++], cpx = x + p[i++], cpy = y + p[i++], x += p[i++], y += p[i++]);
                    }
                    break;
                case 'S':
                    checkCubicCP();
                    while (i < n) {
                        _this.cubicCurveTo(x + x - cpx, y + y - cpy, cpx = p[i++], cpy = p[i++], x = p[i++], y = p[i++]);
                    }
                    break;
                case 's':
                    checkCubicCP();
                    while (i < n) {
                        _this.cubicCurveTo(x + x - cpx, y + y - cpy, cpx = x + p[i++], cpy = y + p[i++], x += p[i++], y += p[i++]);
                    }
                    break;
                case 'Q':
                    while (i < n) {
                        _this.quadraticCurveTo(cpx = p[i++], cpy = p[i++], x = p[i++], y = p[i++]);
                    }
                    break;
                case 'q':
                    while (i < n) {
                        _this.quadraticCurveTo(cpx = x + p[i++], cpy = y + p[i++], x += p[i++], y += p[i++]);
                    }
                    break;
                case 'T':
                    checkQuadraticCP();
                    while (i < n) {
                        _this.quadraticCurveTo(cpx = x + x - cpx, cpy = y + y - cpy, x = p[i++], y = p[i++]);
                    }
                    break;
                case 't':
                    checkQuadraticCP();
                    while (i < n) {
                        _this.quadraticCurveTo(cpx = x + x - cpx, cpy = y + y - cpy, x += p[i++], y += p[i++]);
                    }
                    break;
                case 'A':
                    while (i < n) {
                        _this.arcTo(p[i++], p[i++], p[i++] * Math.PI / 180, p[i++], p[i++], x = p[i++], y = p[i++]);
                    }
                    break;
                case 'a':
                    while (i < n) {
                        _this.arcTo(p[i++], p[i++], p[i++] * Math.PI / 180, p[i++], p[i++], x += p[i++], y += p[i++]);
                    }
                    break;
                case 'Z':
                case 'z':
                    _this.closePath();
                    break;
                case 'H':
                    while (i < n) {
                        _this.lineTo(x = p[i++], y);
                    }
                    break;
                case 'h':
                    while (i < n) {
                        _this.lineTo(x += p[i++], y);
                    }
                    break;
                case 'V':
                    while (i < n) {
                        _this.lineTo(x, y = p[i++]);
                    }
                    break;
                case 'v':
                    while (i < n) {
                        _this.lineTo(x, y += p[i++]);
                    }
                    break;
            }
            lastCommand = part.command;
        });
    };
    Path2D.prototype.toString = function () {
        var c = this.commands;
        var p = this.params;
        var cn = c.length;
        var out = [];
        for (var ci = 0, pi = 0; ci < cn; ci++) {
            switch (c[ci]) {
                case 'M':
                    out.push('M' + p[pi++] + ',' + p[pi++]);
                    break;
                case 'L':
                    out.push('L' + p[pi++] + ',' + p[pi++]);
                    break;
                case 'C':
                    out.push('C' + p[pi++] + ',' + p[pi++] + ' ' +
                        p[pi++] + ',' + p[pi++] + ' ' +
                        p[pi++] + ',' + p[pi++]);
                    break;
                case 'Z':
                    out.push('Z');
                    break;
            }
        }
        return out.join('');
    };
    Path2D.prototype.toPrettyString = function () {
        return Path2D.prettifySvgPath(this.toString());
    };
    Path2D.prototype.toSvg = function () {
        return Path2D.xmlDeclaration + "\n<svg width=\"100%\" height=\"100%\" viewBox=\"0 0 50 50\" version=\"1.1\" xmlns=\"" + Path2D.xmlns + "\">\n    <path d=\"" + this.toString() + "\" style=\"fill:none;stroke:#000;stroke-width:0.5;\"/>\n</svg>";
    };
    Path2D.prototype.toDebugSvg = function () {
        var d = Path2D.prettifySvgPath(this.toString());
        return Path2D.xmlDeclaration + "\n<svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" version=\"1.1\" xmlns=\"" + Path2D.xmlns + "\">\n    <path d=\"" + d + "\" style=\"fill:none;stroke:#000;stroke-width:0.5;\"/>\n</svg>";
    };
    /**
     * Returns an array of sub-paths of this Path,
     * where each sub-path is represented exclusively by cubic segments.
     */
    Path2D.prototype.toCubicPaths = function () {
        // Each sub-path is an array of `(n * 3 + 1) * 2` numbers,
        // where `n` is the number of segments.
        var paths = [];
        var params = this.params;
        // current path
        var path;
        // the starting point of the  current path
        var sx;
        var sy;
        // the previous point of the current path
        var px;
        var py;
        var i = 0; // current parameter
        this.commands.forEach(function (command) {
            switch (command) {
                case 'M':
                    path = [
                        sx = px = params[i++],
                        sy = py = params[i++]
                    ];
                    paths.push(path);
                    break;
                case 'L':
                    var x = params[i++];
                    var y = params[i++];
                    // Place control points along the line `a + (b - a) * t`
                    // at t = 1/3 and 2/3:
                    path.push((px + px + x) / 3, (py + py + y) / 3, (px + x + x) / 3, (py + y + y) / 3, px = x, py = y);
                    break;
                case 'C':
                    path.push(params[i++], params[i++], params[i++], params[i++], px = params[i++], py = params[i++]);
                    break;
                case 'Z':
                    path.push((px + px + sx) / 3, (py + py + sy) / 3, (px + sx + sx) / 3, (py + sy + sy) / 3, px = sx, py = sy);
                    break;
            }
        });
        return paths;
    };
    Path2D.cubicPathToString = function (path) {
        var n = path.length;
        if (!(n % 2 === 0 && (n / 2 - 1) / 2 >= 1)) {
            throw new Error('Invalid path.');
        }
        return 'M' + path.slice(0, 2).join(',') + 'C' + path.slice(2).join(',');
    };
    Path2D.splitCommandsRe = /(?=[AaCcHhLlMmQqSsTtVvZz])/g;
    Path2D.matchParamsRe = /-?[0-9]*\.?\d+/g;
    Path2D.quadraticCommandRe = /[QqTt]/;
    Path2D.cubicCommandRe = /[CcSs]/;
    Path2D.xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    Path2D.xmlns = 'http://www.w3.org/2000/svg';
    return Path2D;
}());

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Path = /** @class */ (function (_super) {
    __extends$8(Path, _super);
    function Path() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Declare a path to retain for later rendering and hit testing
         * using custom Path2D class. Think of it as a TypeScript version
         * of the native Path2D (with some differences) that works in all browsers.
         */
        _this.path = new Path2D();
        /**
        * The path only has to be updated when certain attributes change.
        * For example, if transform attributes (such as `translationX`)
        * are changed, we don't have to update the path. The `dirtyPath` flag
        * is how we keep track if the path has to be updated or not.
        */
        _this._dirtyPath = true;
        /**
         * Path definition in SVG path syntax:
         * https://www.w3.org/TR/SVG11/paths.html#DAttribute
         */
        _this._svgPath = '';
        return _this;
    }
    Object.defineProperty(Path.prototype, "dirtyPath", {
        get: function () {
            return this._dirtyPath;
        },
        set: function (value) {
            if (this._dirtyPath !== value) {
                this._dirtyPath = value;
                if (value) {
                    this.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Path.prototype, "svgPath", {
        get: function () {
            return this._svgPath;
        },
        set: function (value) {
            if (this._svgPath !== value) {
                this._svgPath = value;
                this.path.setFromString(value);
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Path.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        return this.path.closedPath && this.path.isPointInPath(point.x, point.y);
    };
    Path.prototype.isPointInStroke = function (x, y) {
        return false;
    };
    Path.prototype.updatePath = function () { };
    Path.prototype.render = function (ctx) {
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        // if (scene.debug.renderBoundingBoxes) {
        //     const bbox = this.computeBBox();
        //     if (bbox) {
        //         this.matrix.transformBBox(bbox).render(ctx);
        //     }
        // }
        this.matrix.toContext(ctx);
        if (this.dirtyPath) {
            this.updatePath();
            this.dirtyPath = false;
        }
        this.path.draw(ctx);
        this.fillStroke(ctx);
        this.dirty = false;
    };
    Path.className = 'Path';
    return Path;
}(Shape));

var twoPi = Math.PI * 2;
/**
 * Normalize the given angle to be in the [0, 2π) interval.
 * @param radians Angle in radians.
 */
function normalizeAngle360(radians) {
    radians %= twoPi;
    radians += twoPi;
    radians %= twoPi;
    return radians;
}
function normalizeAngle360Inclusive(radians) {
    radians %= twoPi;
    radians += twoPi;
    if (radians !== twoPi) {
        radians %= twoPi;
    }
    return radians;
}
/**
 * Normalize the given angle to be in the [-π, π) interval.
 * @param radians Angle in radians.
 */
function normalizeAngle180(radians) {
    radians %= twoPi;
    if (radians < -Math.PI) {
        radians += twoPi;
    }
    else if (radians >= Math.PI) {
        radians -= twoPi;
    }
    return radians;
}
function toRadians(degrees) {
    return degrees / 180 * Math.PI;
}
function toDegrees(radians) {
    return radians / Math.PI * 180;
}

function isEqual(a, b, epsilon) {
    if (epsilon === void 0) { epsilon = 1e-10; }
    return Math.abs(a - b) < epsilon;
}
/**
 * `Number.toFixed(n)` always formats a number so that it has `n` digits after the decimal point.
 * For example, `Number(0.00003427).toFixed(2)` returns `0.00`.
 * That's not very helpful, because all the meaningful information is lost.
 * In this case we would want the formatted value to have at least two significant digits: `0.000034`,
 * not two fraction digits.
 * @param value
 * @param fractionOrSignificantDigits
 */
function toFixed(value, fractionOrSignificantDigits) {
    if (fractionOrSignificantDigits === void 0) { fractionOrSignificantDigits = 2; }
    var power = Math.floor(Math.log(Math.abs(value)) / Math.LN10);
    if (power >= 0 || !isFinite(power)) {
        return value.toFixed(fractionOrSignificantDigits); // fraction digits
    }
    return value.toFixed(Math.abs(power) - 1 + fractionOrSignificantDigits); // significant digits
}
/**
 * Returns the mathematically correct n modulus of m. For context, the JS % operator is remainder
 * NOT modulus, which is why this is needed.
 */
function mod(n, m) {
    // https://stackoverflow.com/a/13163436
    var remain = n % m;
    return remain >= 0 ? remain : (remain + m);
}

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (ArcType) {
    ArcType[ArcType["Open"] = 0] = "Open";
    ArcType[ArcType["Chord"] = 1] = "Chord";
    ArcType[ArcType["Round"] = 2] = "Round";
})(exports.ArcType || (exports.ArcType = {}));
/**
 * Elliptical arc node.
 */
var Arc = /** @class */ (function (_super) {
    __extends$9(Arc, _super);
    function Arc() {
        var _this = _super.call(this) || this;
        _this._centerX = 0;
        _this._centerY = 0;
        _this._radiusX = 10;
        _this._radiusY = 10;
        _this._startAngle = 0;
        _this._endAngle = Math.PI * 2;
        _this._counterClockwise = false;
        /**
         * The type of arc to render:
         * - {@link ArcType.Open} - end points of the arc segment are not connected (default)
         * - {@link ArcType.Chord} - end points of the arc segment are connected by a line segment
         * - {@link ArcType.Round} - each of the end points of the arc segment are connected
         *                           to the center of the arc
         * Arcs with {@link ArcType.Open} do not support hit testing, even if they have their
         * {@link Shape.fillStyle} set, because they are not closed paths. Hit testing support
         * would require using two paths - one for rendering, another for hit testing - and there
         * doesn't seem to be a compelling reason to do that, when one can just use {@link ArcType.Chord}
         * to create a closed path.
         */
        _this._type = exports.ArcType.Open;
        _this.restoreOwnStyles();
        return _this;
    }
    Object.defineProperty(Arc.prototype, "centerX", {
        get: function () {
            return this._centerX;
        },
        set: function (value) {
            if (this._centerX !== value) {
                this._centerX = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "centerY", {
        get: function () {
            return this._centerY;
        },
        set: function (value) {
            if (this._centerY !== value) {
                this._centerY = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "radiusX", {
        get: function () {
            return this._radiusX;
        },
        set: function (value) {
            if (this._radiusX !== value) {
                this._radiusX = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "radiusY", {
        get: function () {
            return this._radiusY;
        },
        set: function (value) {
            if (this._radiusY !== value) {
                this._radiusY = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "startAngle", {
        get: function () {
            return this._startAngle;
        },
        set: function (value) {
            if (this._startAngle !== value) {
                this._startAngle = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "endAngle", {
        get: function () {
            return this._endAngle;
        },
        set: function (value) {
            if (this._endAngle !== value) {
                this._endAngle = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "fullPie", {
        get: function () {
            return isEqual(normalizeAngle360(this.startAngle), normalizeAngle360(this.endAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "counterClockwise", {
        get: function () {
            return this._counterClockwise;
        },
        set: function (value) {
            if (this._counterClockwise !== value) {
                this._counterClockwise = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Arc.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Arc.prototype.updatePath = function () {
        var path = this.path;
        path.clear(); // No need to recreate the Path, can simply clear the existing one.
        // This is much faster than the native Path2D implementation even though this `cubicArc`
        // method is pure TypeScript and actually produces the definition of an elliptical arc,
        // where you can specify two radii and rotation, while Path2D's `arc` method simply produces
        // a circular arc. Maybe it's due to the experimental nature of the Path2D class,
        // maybe it's because we have to create a new instance of it on each render, who knows...
        path.cubicArc(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, this.startAngle, this.endAngle, this.counterClockwise ? 1 : 0);
        if (this.type === exports.ArcType.Chord) {
            path.closePath();
        }
        else if (this.type === exports.ArcType.Round && !this.fullPie) {
            path.lineTo(this.centerX, this.centerY);
            path.closePath();
        }
    };
    Arc.prototype.computeBBox = function () {
        // Only works with full arcs (circles) and untransformed ellipses.
        return new BBox(this.centerX - this.radiusX, this.centerY - this.radiusY, this.radiusX * 2, this.radiusY * 2);
    };
    Arc.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return this.type !== exports.ArcType.Open
            && bbox.containsPoint(point.x, point.y)
            && this.path.isPointInPath(point.x, point.y);
    };
    Arc.className = 'Arc';
    Arc.defaultStyles = chainObjects(Shape.defaultStyles, {
        lineWidth: 1,
        fillStyle: null
    });
    return Arc;
}(Path));

var doOnceFlags = {};
/**
 * If the key was passed before, then doesn't execute the func
 * @param {Function} func
 * @param {string} key
 */
function doOnce(func, key) {
    if (doOnceFlags[key]) {
        return;
    }
    func();
    doOnceFlags[key] = true;
}

var __read$4 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values$1 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// import { Rect } from "./scene/shape/rect"; // debug (bbox)
var Tags;
(function (Tags) {
    Tags[Tags["Tick"] = 0] = "Tick";
    Tags[Tags["GridLine"] = 1] = "GridLine";
})(Tags || (Tags = {}));
var AxisTick = /** @class */ (function () {
    function AxisTick() {
        /**
         * The line width to be used by axis ticks.
         */
        this.width = 1;
        /**
         * The line length to be used by axis ticks.
         */
        this.size = 6;
        /**
         * The color of the axis ticks.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make the ticks invisible.
         */
        this.color = 'rgba(195, 195, 195, 1)';
        /**
         * A hint of how many ticks to use (the exact number of ticks might differ),
         * a `TimeInterval` or a `CountableTimeInterval`.
         * For example:
         *
         *     axis.tick.count = 5;
         *     axis.tick.count = year;
         *     axis.tick.count = month.every(6);
         */
        this.count = undefined;
    }
    return AxisTick;
}());
var AxisLabel = /** @class */ (function () {
    function AxisLabel() {
        this.fontStyle = undefined;
        this.fontWeight = undefined;
        this.fontSize = 12;
        this.fontFamily = 'Verdana, sans-serif';
        /**
         * The padding between the labels and the ticks.
         */
        this.padding = 5;
        /**
         * The color of the labels.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make labels invisible.
         */
        this.color = 'rgba(87, 87, 87, 1)';
        /**
         * Custom label rotation in degrees.
         * Labels are rendered perpendicular to the axis line by default.
         * Or parallel to the axis line, if the {@link parallel} is set to `true`.
         * The value of this config is used as the angular offset/deflection
         * from the default rotation.
         */
        this.rotation = undefined;
        /**
         * If specified and axis labels may collide, they are rotated to reduce collisions. If the
         * `rotation` property is specified, it takes precedence.
         */
        this.autoRotate = undefined;
        /**
         * Rotation angle to use when autoRotate is applied.
         */
        this.autoRotateAngle = 335;
        /**
         * By default labels and ticks are positioned to the left of the axis line.
         * `true` positions the labels to the right of the axis line.
         * However, if the axis is rotated, it's easier to think in terms
         * of this side or the opposite side, rather than left and right.
         * We use the term `mirror` for conciseness, although it's not
         * true mirroring - for example, when a label is rotated, so that
         * it is inclined at the 45 degree angle, text flowing from north-west
         * to south-east, ending at the tick to the left of the axis line,
         * and then we set this config to `true`, the text will still be flowing
         * from north-west to south-east, _starting_ at the tick to the right
         * of the axis line.
         */
        this.mirrored = false;
        /**
         * Labels are rendered perpendicular to the axis line by default.
         * Setting this config to `true` makes labels render parallel to the axis line
         * and center aligns labels' text at the ticks.
         */
        this.parallel = false;
        /**
         * In case {@param value} is a number, the {@param fractionDigits} parameter will
         * be provided as well. The `fractionDigits` corresponds to the number of fraction
         * digits used by the tick step. For example, if the tick step is `0.0005`,
         * the `fractionDigits` is 4.
         */
        this.formatter = undefined;
        this.onFormatChange = undefined;
    }
    Object.defineProperty(AxisLabel.prototype, "format", {
        get: function () {
            return this._format;
        },
        set: function (value) {
            // See `TimeLocaleObject` docs for the list of supported format directives.
            if (this._format !== value) {
                this._format = value;
                if (this.onFormatChange) {
                    this.onFormatChange(value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return AxisLabel;
}());
/**
 * A general purpose linear axis with no notion of orientation.
 * The axis is always rendered vertically, with horizontal labels positioned to the left
 * of the axis line by default. The axis can be {@link rotation | rotated} by an arbitrary angle,
 * so that it can be used as a top, right, bottom, left, radial or any other kind
 * of linear axis.
 * The generic `D` parameter is the type of the domain of the axis' scale.
 * The output range of the axis' scale is always numeric (screen coordinates).
 */
var Axis = /** @class */ (function () {
    function Axis(scale) {
        // debug (bbox)
        // private bboxRect = (() => {
        //     const rect = new Rect();
        //     rect.fill = undefined;
        //     rect.stroke = 'red';
        //     rect.strokeWidth = 1;
        //     rect.strokeOpacity = 0.2;
        //     return rect;
        // })();
        this.id = createId(this);
        this.lineNode = new Line();
        this.group = new Group();
        this.line = {
            width: 1,
            color: 'rgba(195, 195, 195, 1)'
        };
        this.tick = new AxisTick();
        this.label = new AxisLabel();
        this.translation = { x: 0, y: 0 };
        this.rotation = 0; // axis rotation angle in degrees
        this._labelAutoRotated = false;
        /**
         * This will be assigned a value when `this.calculateTickCount` is invoked.
         * If the user has specified a tick count, it will be used, otherwise a tick count will be calculated based on the available range.
         */
        this._calculatedTickCount = undefined;
        this.requestedRange = [0, 1];
        this._visibleRange = [0, 1];
        this._title = undefined;
        /**
         * The length of the grid. The grid is only visible in case of a non-zero value.
         * In case {@link radialGrid} is `true`, the value is interpreted as an angle
         * (in degrees).
         */
        this._gridLength = 0;
        /**
         * The array of styles to cycle through when rendering grid lines.
         * For example, use two {@link GridStyle} objects for alternating styles.
         * Contains only one {@link GridStyle} object by default, meaning all grid lines
         * have the same style.
         */
        this.gridStyle = [{
                stroke: 'rgba(219, 219, 219, 1)',
                lineDash: [4, 2]
            }];
        /**
         * `false` - render grid as lines of {@link gridLength} that extend the ticks
         *           on the opposite side of the axis
         * `true` - render grid as concentric circles that go through the ticks
         */
        this._radialGrid = false;
        this.fractionDigits = 0;
        this.thickness = 0;
        this.scale = scale;
        this.groupSelection = Selection.select(this.group).selectAll();
        this.label.onFormatChange = this.onLabelFormatChange.bind(this);
        this.group.append(this.lineNode);
        // this.group.append(this.bboxRect); // debug (bbox)
    }
    Object.defineProperty(Axis.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
            this.requestedRange = value.range.slice();
            this.onLabelFormatChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "ticks", {
        get: function () {
            return this._ticks;
        },
        set: function (values) {
            this._ticks = values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "labelAutoRotated", {
        get: function () {
            return this._labelAutoRotated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "calculatedTickCount", {
        get: function () {
            var _a;
            return _a = this._calculatedTickCount, (_a !== null && _a !== void 0 ? _a : this.tick.count);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Overridden in ChartAxis subclass.
     * Sets an appropriate tick count based on the available range.
     */
    Axis.prototype.calculateTickCount = function (availableRange) { };
    /**
     * Meant to be overridden in subclasses to provide extra context the the label formatter.
     * The return value of this function will be passed to the laber.formatter as the `axis` parameter.
     */
    Axis.prototype.getMeta = function () { };
    Axis.prototype.updateRange = function () {
        var _a = this, rr = _a.requestedRange, vr = _a.visibleRange, scale = _a.scale;
        var span = (rr[1] - rr[0]) / (vr[1] - vr[0]);
        var shift = span * vr[0];
        var start = rr[0] - shift;
        scale.range = [start, start + span];
    };
    /**
     * Checks if a point or an object is in range.
     * @param x A point (or object's starting point).
     * @param width Object's width.
     * @param tolerance Expands the range on both ends by this amount.
     */
    Axis.prototype.inRange = function (x, width, tolerance) {
        if (width === void 0) { width = 0; }
        if (tolerance === void 0) { tolerance = 0; }
        return this.inRangeEx(x, width, tolerance) === 0;
    };
    Axis.prototype.inRangeEx = function (x, width, tolerance) {
        if (width === void 0) { width = 0; }
        if (tolerance === void 0) { tolerance = 0; }
        var range = this.range;
        // Account for inverted ranges, for example [500, 100] as well as [100, 500]
        var min = Math.min(range[0], range[1]);
        var max = Math.max(range[0], range[1]);
        if ((x + width) < (min - tolerance)) {
            return -1; // left of range
        }
        if (x > (max + tolerance)) {
            return 1; // right of range
        }
        return 0; // in range
    };
    Object.defineProperty(Axis.prototype, "range", {
        get: function () {
            return this.requestedRange.slice();
        },
        set: function (value) {
            this.requestedRange = value.slice();
            this.updateRange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "visibleRange", {
        get: function () {
            return this._visibleRange.slice();
        },
        set: function (value) {
            if (value && value.length === 2) {
                var _a = __read$4(value, 2), min = _a[0], max = _a[1];
                min = Math.max(0, min);
                max = Math.min(1, max);
                min = Math.min(min, max);
                max = Math.max(min, max);
                this._visibleRange = [min, max];
                this.updateRange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "domain", {
        get: function () {
            return this.scale.domain.slice();
        },
        set: function (value) {
            this.scale.domain = value.slice();
            this.onLabelFormatChange(this.label.format);
        },
        enumerable: true,
        configurable: true
    });
    Axis.prototype.onLabelFormatChange = function (format) {
        if (format && this.scale && this.scale.tickFormat) {
            try {
                this.labelFormatter = this.scale.tickFormat(this.calculatedTickCount, format);
            }
            catch (e) {
                this.labelFormatter = undefined;
                doOnce(function () { return console.warn("AG Charts - the axis label format string " + format + " is invalid. No formatting will be applied"); }, "invalid axis label format string " + format);
            }
        }
        else {
            this.labelFormatter = undefined;
        }
    };
    Object.defineProperty(Axis.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var oldTitle = this._title;
            if (oldTitle !== value) {
                if (oldTitle) {
                    this.group.removeChild(oldTitle.node);
                }
                if (value) {
                    value.node.rotation = -Math.PI / 2;
                    this.group.appendChild(value.node);
                }
                this._title = value;
                // position title so that it doesn't briefly get rendered in the top left hand corner of the canvas before update is called.
                this.positionTitle();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "gridLength", {
        get: function () {
            return this._gridLength;
        },
        set: function (value) {
            // Was visible and now invisible, or was invisible and now visible.
            if (this._gridLength && !value || !this._gridLength && value) {
                this.groupSelection = this.groupSelection.remove().setData([]);
            }
            this._gridLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Axis.prototype, "radialGrid", {
        get: function () {
            return this._radialGrid;
        },
        set: function (value) {
            if (this._radialGrid !== value) {
                this._radialGrid = value;
                this.groupSelection = this.groupSelection.remove().setData([]);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates/removes/updates the scene graph nodes that constitute the axis.
     * Supposed to be called _manually_ after changing _any_ of the axis properties.
     * This allows to bulk set axis properties before updating the nodes.
     * The node changes made by this method are rendered on the next animation frame.
     * We could schedule this method call automatically on the next animation frame
     * when any of the axis properties change (the way we do when properties of scene graph's
     * nodes change), but this will mean that we first wait for the next animation
     * frame to make changes to the nodes of the axis, then wait for another animation
     * frame to render those changes. It's nice to have everything update automatically,
     * but this extra level of async indirection will not just introduce an unwanted delay,
     * it will also make it harder to reason about the program.
     */
    Axis.prototype.update = function () {
        var _this = this;
        var _a = this, group = _a.group, scale = _a.scale, tick = _a.tick, label = _a.label, gridStyle = _a.gridStyle, requestedRange = _a.requestedRange;
        var requestedRangeMin = Math.min(requestedRange[0], requestedRange[1]);
        var requestedRangeMax = Math.max(requestedRange[0], requestedRange[1]);
        var rotation = toRadians(this.rotation);
        var labelRotation = label.rotation ? normalizeAngle360(toRadians(label.rotation)) : 0;
        var parallelLabels = label.parallel;
        var labelAutoRotation = 0;
        group.translationX = this.translation.x;
        group.translationY = this.translation.y;
        group.rotation = rotation;
        var halfBandwidth = (scale.bandwidth || 0) / 2;
        // The side of the axis line to position the labels on.
        // -1 = left (default)
        //  1 = right
        var sideFlag = label.mirrored ? 1 : -1;
        // When labels are parallel to the axis line, the `parallelFlipFlag` is used to
        // flip the labels to avoid upside-down text, when the axis is rotated
        // such that it is in the right hemisphere, i.e. the angle of rotation
        // is in the [0, π] interval.
        // The rotation angle is normalized, so that we have an easier time checking
        // if it's in the said interval. Since the axis is always rendered vertically
        // and then rotated, zero rotation means 12 (not 3) o-clock.
        // -1 = flip
        //  1 = don't flip (default)
        var parallelFlipRotation = normalizeAngle360(rotation);
        var parallelFlipFlag = !labelRotation && parallelFlipRotation >= 0 && parallelFlipRotation <= Math.PI ? -1 : 1;
        var regularFlipRotation = normalizeAngle360(rotation - Math.PI / 2);
        // Flip if the axis rotation angle is in the top hemisphere.
        var regularFlipFlag = !labelRotation && regularFlipRotation >= 0 && regularFlipRotation <= Math.PI ? -1 : 1;
        var ticks = this.ticks || scale.ticks(this.calculatedTickCount);
        var update = this.groupSelection.setData(ticks);
        update.exit.remove();
        var enter = update.enter.append(Group);
        // Line auto-snaps to pixel grid if vertical or horizontal.
        enter.append(Line).each(function (node) { return node.tag = Tags.Tick; });
        if (this.gridLength) {
            if (this.radialGrid) {
                enter.append(Arc).each(function (node) { return node.tag = Tags.GridLine; });
            }
            else {
                enter.append(Line).each(function (node) { return node.tag = Tags.GridLine; });
            }
        }
        enter.append(Text);
        var groupSelection = update.merge(enter);
        groupSelection
            .attrFn('translationY', function (_, datum) {
            return Math.round(scale.convert(datum) + halfBandwidth);
        })
            .attrFn('visible', function (node) {
            var min = Math.floor(requestedRangeMin);
            var max = Math.ceil(requestedRangeMax);
            return (min !== max) && node.translationY >= min && node.translationY <= max;
        });
        // `ticks instanceof NumericTicks` doesn't work here, so we feature detect.
        this.fractionDigits = ticks.fractionDigits >= 0 ? ticks.fractionDigits : 0;
        // Update properties that affect the size of the axis labels and measure the labels
        var labelBboxes = new Map();
        var labelCount = 0;
        var halfFirstLabelLength = false;
        var halfLastLabelLength = false;
        var availableRange = requestedRangeMax - requestedRangeMin;
        var labelSelection = groupSelection.selectByClass(Text)
            .each(function (node, datum, index) {
            node.fontStyle = label.fontStyle;
            node.fontWeight = label.fontWeight;
            node.fontSize = label.fontSize;
            node.fontFamily = label.fontFamily;
            node.fill = label.color;
            node.text = _this.formatTickDatum(datum, index);
            node.visible = node.parent.visible;
            if (node.visible !== true) {
                return;
            }
            labelBboxes.set(index, node.computeBBox());
            if (node.text === '' || node.text == undefined) {
                return;
            }
            labelCount++;
            if (index === 0 && (node.translationY === scale.range[0])) {
                halfFirstLabelLength = true; // first label protrudes axis line
            }
            else if (index === ticks.length - 1 && (node.translationY === scale.range[1])) {
                halfLastLabelLength = true; // last label protrudes axis line
            }
        });
        var labelX = sideFlag * (tick.size + label.padding);
        var step = availableRange / labelCount;
        var calculateLabelsLength = function (bboxes, useWidth) {
            var e_1, _a;
            var totalLength = 0;
            var rotate = false;
            var lastIdx = bboxes.size - 1;
            var padding = 12;
            try {
                for (var _b = __values$1(bboxes.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read$4(_c.value, 2), i = _d[0], bbox = _d[1];
                    var divideBy = (i === 0 && halfFirstLabelLength) || (i === lastIdx && halfLastLabelLength) ? 2 : 1;
                    var length_1 = useWidth ? bbox.width / divideBy : bbox.height / divideBy;
                    var lengthWithPadding = length_1 <= 0 ? 0 : length_1 + padding;
                    totalLength += lengthWithPadding;
                    if (lengthWithPadding > step) {
                        rotate = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { totalLength: totalLength, rotate: rotate };
        };
        var useWidth = parallelLabels; // When the labels are parallel to the axis line, use the width of the text to calculate the total length of all labels
        var _b = calculateLabelsLength(labelBboxes, useWidth), totalLabelLength = _b.totalLength, rotate = _b.rotate;
        this._labelAutoRotated = false;
        if (label.rotation === undefined && label.autoRotate === true && rotate) {
            // When no user label rotation angle has been specified and the width of any label exceeds the average tick gap (`rotate` is `true`),
            // automatically rotate the labels
            labelAutoRotation = normalizeAngle360(toRadians(label.autoRotateAngle));
            this._labelAutoRotated = true;
        }
        if (labelRotation || labelAutoRotation) {
            // If the label rotation angle results in a non-parallel orientation, use the height of the texts to calculate the total length of all labels
            if (parallelLabels) {
                useWidth = (labelRotation === Math.PI) || (labelAutoRotation === Math.PI) ? true : false;
            }
            else {
                useWidth = labelRotation === Math.PI / 2 || labelRotation === (Math.PI + Math.PI / 2) || labelAutoRotation === Math.PI / 2 || labelAutoRotation === (Math.PI + Math.PI / 2) ? true : false;
            }
            totalLabelLength = calculateLabelsLength(labelBboxes, useWidth).totalLength;
        }
        var autoRotation = parallelLabels
            ? parallelFlipFlag * Math.PI / 2
            : (regularFlipFlag === -1 ? Math.PI : 0);
        var labelTextBaseline = parallelLabels && !labelRotation
            ? (sideFlag * parallelFlipFlag === -1 ? 'hanging' : 'bottom')
            : 'middle';
        var alignFlag = (labelRotation > 0 && labelRotation <= Math.PI) || (labelAutoRotation > 0 && labelAutoRotation <= Math.PI) ? -1 : 1;
        var labelTextAlign = parallelLabels
            ? labelRotation || labelAutoRotation ? (sideFlag * alignFlag === -1 ? 'end' : 'start') : 'center'
            : sideFlag * regularFlipFlag === -1 ? 'end' : 'start';
        labelSelection.each(function (label) {
            if (label.text === '' || label.text == undefined) {
                label.visible = false; // hide empty labels
                return;
            }
            label.textBaseline = labelTextBaseline;
            label.textAlign = labelTextAlign;
            label.x = labelX;
            label.rotationCenterX = labelX;
            label.rotation = autoRotation + labelRotation + labelAutoRotation;
        });
        if (totalLabelLength > availableRange) {
            var isContinuous_1 = scale instanceof ContinuousScale;
            var averageLabelLength = totalLabelLength / labelCount;
            var labelsToShow = Math.floor(availableRange / averageLabelLength);
            var showEvery_1 = labelsToShow > 2 ? Math.ceil(labelCount / labelsToShow) : labelCount;
            var visibleLabelIndex_1 = 0;
            labelSelection.each(function (label, _, index) {
                if (label.visible !== true) {
                    return;
                }
                var forceVisible = isContinuous_1 && _this.tick.count === undefined ? index === 0 || index === labelCount - 1 : false; // always show first and last labels for a continuous axis when tick count has not been specified by the user
                label.visible = forceVisible || visibleLabelIndex_1 % showEvery_1 === 0 ? true : false;
                visibleLabelIndex_1++;
                if (!label.visible) {
                    labelBboxes.delete(index);
                }
            });
        }
        groupSelection.selectByTag(Tags.Tick)
            .each(function (line, _, index) {
            line.strokeWidth = tick.width;
            line.stroke = tick.color;
            line.visible = labelBboxes.has(index);
        })
            .attr('x1', sideFlag * tick.size)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', 0);
        if (this.gridLength && gridStyle.length) {
            var styleCount_1 = gridStyle.length;
            var gridLines = void 0;
            if (this.radialGrid) {
                var angularGridLength_1 = normalizeAngle360Inclusive(toRadians(this.gridLength));
                gridLines = groupSelection.selectByTag(Tags.GridLine)
                    .each(function (arc, datum, index) {
                    var radius = Math.round(scale.convert(datum) + halfBandwidth);
                    arc.centerX = 0;
                    arc.centerY = scale.range[0] - radius;
                    arc.endAngle = angularGridLength_1;
                    arc.radiusX = radius;
                    arc.radiusY = radius;
                    arc.visible = labelBboxes.has(index);
                });
            }
            else {
                gridLines = groupSelection.selectByTag(Tags.GridLine)
                    .each(function (line, _, index) {
                    line.x1 = 0;
                    line.x2 = -sideFlag * _this.gridLength;
                    line.y1 = 0;
                    line.y2 = 0;
                    line.visible = Math.abs(line.parent.translationY - scale.range[0]) > 1 && labelBboxes.has(index);
                });
            }
            gridLines.each(function (gridLine, _, index) {
                var style = gridStyle[index % styleCount_1];
                gridLine.stroke = style.stroke;
                gridLine.strokeWidth = tick.width;
                gridLine.lineDash = style.lineDash;
                gridLine.fill = undefined;
            });
        }
        this.groupSelection = groupSelection;
        // Render axis line.
        var lineNode = this.lineNode;
        lineNode.x1 = 0;
        lineNode.x2 = 0;
        lineNode.y1 = requestedRange[0];
        lineNode.y2 = requestedRange[1];
        lineNode.strokeWidth = this.line.width;
        lineNode.stroke = this.line.color;
        lineNode.visible = ticks.length > 0;
        this.positionTitle();
        // debug (bbox)
        // const bbox = this.computeBBox();
        // const bboxRect = this.bboxRect;
        // bboxRect.x = bbox.x;
        // bboxRect.y = bbox.y;
        // bboxRect.width = bbox.width;
        // bboxRect.height = bbox.height;
    };
    Axis.prototype.positionTitle = function () {
        var _a = this, title = _a.title, lineNode = _a.lineNode;
        if (!title) {
            return;
        }
        var titleVisible = false;
        if (title.enabled && lineNode.visible) {
            titleVisible = true;
            var _b = this, label = _b.label, rotation = _b.rotation, requestedRange = _b.requestedRange;
            var sideFlag = label.mirrored ? 1 : -1;
            var parallelFlipRotation = normalizeAngle360(rotation);
            var padding = title.padding.bottom;
            var titleNode = title.node;
            var bbox = this.computeBBox({ excludeTitle: true });
            var titleRotationFlag = sideFlag === -1 && parallelFlipRotation > Math.PI && parallelFlipRotation < Math.PI * 2 ? -1 : 1;
            titleNode.rotation = titleRotationFlag * sideFlag * Math.PI / 2;
            // titleNode.x = titleRotationFlag * sideFlag * (lineNode.y1 + lineNode.y2) / 2; // TODO: remove?
            titleNode.x = titleRotationFlag * sideFlag * (requestedRange[0] + requestedRange[1]) / 2;
            if (sideFlag === -1) {
                titleNode.y = titleRotationFlag * (-padding - bbox.width + Math.max(bbox.x + bbox.width, 0));
            }
            else {
                titleNode.y = -padding - bbox.width - Math.min(bbox.x, 0);
            }
            titleNode.textBaseline = titleRotationFlag === 1 ? 'bottom' : 'top';
        }
        title.node.visible = titleVisible;
    };
    // For formatting (nice rounded) tick values.
    Axis.prototype.formatTickDatum = function (datum, index) {
        var _a = this, label = _a.label, labelFormatter = _a.labelFormatter, fractionDigits = _a.fractionDigits;
        var meta = this.getMeta();
        return label.formatter
            ? label.formatter({
                value: fractionDigits >= 0 ? datum : String(datum),
                index: index,
                fractionDigits: fractionDigits,
                formatter: labelFormatter,
                axis: meta
            })
            : labelFormatter
                ? labelFormatter(datum)
                : typeof datum === 'number' && fractionDigits >= 0
                    // the `datum` is a floating point number
                    ? datum.toFixed(fractionDigits)
                    // the`datum` is an integer, a string or an object
                    : String(datum);
    };
    // For formatting arbitrary values between the ticks.
    Axis.prototype.formatDatum = function (datum) {
        return String(datum);
    };
    Axis.prototype.computeBBox = function (options) {
        var _a = this, title = _a.title, lineNode = _a.lineNode;
        var labels = this.groupSelection.selectByClass(Text);
        var left = Infinity;
        var right = -Infinity;
        var top = Infinity;
        var bottom = -Infinity;
        labels.each(function (label) {
            // The label itself is rotated, but not translated, the group that
            // contains it is. So to capture the group transform in the label bbox
            // calculation we combine the transform matrices of the label and the group.
            // Depending on the timing of the `axis.computeBBox()` method call, we may
            // not have the group's and the label's transform matrices updated yet (because
            // the transform matrix is not recalculated whenever a node's transform attributes
            // change, instead it's marked for recalculation on the next frame by setting
            // the node's `dirtyTransform` flag to `true`), so we force them to update
            // right here by calling `computeTransformMatrix`.
            label.computeTransformMatrix();
            var matrix = Matrix.flyweight(label.matrix);
            var group = label.parent;
            group.computeTransformMatrix();
            matrix.preMultiplySelf(group.matrix);
            var labelBBox = label.computeBBox();
            if (labelBBox) {
                var bbox = matrix.transformBBox(labelBBox);
                left = Math.min(left, bbox.x);
                right = Math.max(right, bbox.x + bbox.width);
                top = Math.min(top, bbox.y);
                bottom = Math.max(bottom, bbox.y + bbox.height);
            }
        });
        if (title && title.enabled && lineNode.visible && (!options || !options.excludeTitle)) {
            var label = title.node;
            label.computeTransformMatrix();
            var matrix = Matrix.flyweight(label.matrix);
            var labelBBox = label.computeBBox();
            if (labelBBox) {
                var bbox = matrix.transformBBox(labelBBox);
                left = Math.min(left, bbox.x);
                right = Math.max(right, bbox.x + bbox.width);
                top = Math.min(top, bbox.y);
                bottom = Math.max(bottom, bbox.y + bbox.height);
            }
        }
        left = Math.min(left, 0);
        right = Math.max(right, 0);
        top = Math.min(top, lineNode.y1, lineNode.y2);
        bottom = Math.max(bottom, lineNode.y1, lineNode.y2);
        return new BBox(left, top, right - left, bottom - top);
    };
    return Axis;
}());

var __extends$a = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (ChartAxisDirection) {
    ChartAxisDirection["X"] = "x";
    ChartAxisDirection["Y"] = "y"; // means 'radius' in polar charts
})(exports.ChartAxisDirection || (exports.ChartAxisDirection = {}));
function flipChartAxisDirection(direction) {
    if (direction === exports.ChartAxisDirection.X) {
        return exports.ChartAxisDirection.Y;
    }
    else {
        return exports.ChartAxisDirection.X;
    }
}
(function (ChartAxisPosition) {
    ChartAxisPosition["Top"] = "top";
    ChartAxisPosition["Right"] = "right";
    ChartAxisPosition["Bottom"] = "bottom";
    ChartAxisPosition["Left"] = "left";
    ChartAxisPosition["Angle"] = "angle";
    ChartAxisPosition["Radius"] = "radius";
})(exports.ChartAxisPosition || (exports.ChartAxisPosition = {}));
var ChartAxis = /** @class */ (function (_super) {
    __extends$a(ChartAxis, _super);
    function ChartAxis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = [];
        _this.direction = exports.ChartAxisDirection.Y;
        _this.boundSeries = [];
        _this._position = exports.ChartAxisPosition.Left;
        return _this;
    }
    Object.defineProperty(ChartAxis.prototype, "type", {
        get: function () {
            return this.constructor.type || '';
        },
        enumerable: true,
        configurable: true
    });
    ChartAxis.prototype.getMeta = function () {
        return {
            id: this.id,
            direction: this.direction,
            boundSeries: this.boundSeries,
        };
    };
    ChartAxis.prototype.useCalculatedTickCount = function () {
        // We only want to use the new algorithm for number axes. Category axes don't use a
        // calculated or user-supplied tick-count, and time axes need special handling depending on
        // the time-range involved.
        return this.scale instanceof LinearScale;
    };
    /**
     * For continuous axes, if tick count has not been specified, set the number of ticks based on the available range
     */
    ChartAxis.prototype.calculateTickCount = function (availableRange) {
        if (!this.useCalculatedTickCount()) {
            return;
        }
        var tickInterval = 70; // Approximate number of pixels to allocate for each tick
        this._calculatedTickCount = this.tick.count || Math.max(2, Math.floor(availableRange / tickInterval));
    };
    Object.defineProperty(ChartAxis.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            if (this._position !== value) {
                this._position = value;
                switch (value) {
                    case exports.ChartAxisPosition.Top:
                        this.direction = exports.ChartAxisDirection.X;
                        this.rotation = -90;
                        this.label.mirrored = true;
                        this.label.parallel = true;
                        break;
                    case exports.ChartAxisPosition.Right:
                        this.direction = exports.ChartAxisDirection.Y;
                        this.rotation = 0;
                        this.label.mirrored = true;
                        this.label.parallel = false;
                        break;
                    case exports.ChartAxisPosition.Bottom:
                        this.direction = exports.ChartAxisDirection.X;
                        this.rotation = -90;
                        this.label.mirrored = false;
                        this.label.parallel = true;
                        break;
                    case exports.ChartAxisPosition.Left:
                        this.direction = exports.ChartAxisDirection.Y;
                        this.rotation = 0;
                        this.label.mirrored = false;
                        this.label.parallel = false;
                        break;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return ChartAxis;
}(Axis));

var __extends$b = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$5 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
// Instead of clamping the values outside of domain to the range,
// return NaNs to indicate invalid input.
function clamper$1(domain) {
    var _a;
    var a = domain[0];
    var b = domain[domain.length - 1];
    if (a > b) {
        _a = __read$5([b, a], 2), a = _a[0], b = _a[1];
    }
    return function (x) { return x >= a && x <= b ? x : NaN; };
}
var NumberAxis = /** @class */ (function (_super) {
    __extends$b(NumberAxis, _super);
    function NumberAxis() {
        var _this = _super.call(this, new LinearScale()) || this;
        _this._nice = true;
        _this._min = NaN;
        _this._max = NaN;
        _this.scale.clamper = clamper$1;
        return _this;
    }
    Object.defineProperty(NumberAxis.prototype, "nice", {
        get: function () {
            return this._nice;
        },
        set: function (value) {
            if (this._nice !== value) {
                this._nice = value;
                if (value && this.scale.nice) {
                    this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.setDomain = function (domain, primaryTickCount) {
        var _a = this, scale = _a.scale, min = _a.min, max = _a.max;
        if (domain.length > 2) {
            domain = extent(domain, isContinuous, Number) || [0, 1];
        }
        domain = [
            isNaN(min) ? domain[0] : min,
            isNaN(max) ? domain[1] : max
        ];
        if (primaryTickCount) {
            // when `primaryTickCount` is supplied the current axis is a secondary axis which needs to be aligned to
            // the primary by constraining the tick count to the primary axis tick count
            var _b = __read$5(calculateNiceSecondaryAxis(domain, primaryTickCount), 2), d = _b[0], ticks = _b[1];
            scale.domain = d;
            this.ticks = ticks;
            return;
        }
        else {
            scale.domain = domain;
            this.onLabelFormatChange(this.label.format); // not sure why this is required?
            this.scale.clamp = true;
            if (this.nice && this.scale.nice) {
                this.scale.nice(typeof this.calculatedTickCount === 'number' ? this.calculatedTickCount : undefined);
            }
        }
    };
    Object.defineProperty(NumberAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domain) {
            this.setDomain(domain);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (value) {
            if (this._min !== value) {
                this._min = value;
                if (!isNaN(value)) {
                    this.scale.domain = [value, this.scale.domain[1]];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberAxis.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            if (this._max !== value) {
                this._max = value;
                if (!isNaN(value)) {
                    this.scale.domain = [this.scale.domain[0], value];
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    NumberAxis.prototype.formatDatum = function (datum) {
        if (typeof datum === "number") {
            return datum.toFixed(2);
        }
        else {
            doOnce(function () { return console.warn('AG Charts - Data contains Date objects which are being plotted against a number axis, please only use a number axis for numbers.'); }, "number axis config used with Date objects");
            return String(datum);
        }
    };
    NumberAxis.className = 'NumberAxis';
    NumberAxis.type = 'number';
    return NumberAxis;
}(ChartAxis));

var __read$6 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * Maps a discrete domain to a continuous numeric range.
 * See https://github.com/d3/d3-scale#band-scales for more info.
 */
var BandScale = /** @class */ (function () {
    function BandScale() {
        this.type = 'band';
        /**
         * Maps datum to its index in the {@link domain} array.
         * Used to check for duplicate datums (not allowed).
         */
        this.index = new Map();
        /**
         * The output range values for datum at each index.
         */
        this.ordinalRange = [];
        /**
         * Contains unique datums only. Since `{}` is used in place of `Map`
         * for IE11 compatibility, the datums are converted `toString` before
         * the uniqueness check.
         */
        this._domain = [];
        this._range = [0, 1];
        this._bandwidth = 1;
        /**
         * The ratio of the range that is reserved for space between bands.
         */
        this._paddingInner = 0;
        /**
         * The ratio of the range that is reserved for space before the first
         * and after the last band.
         */
        this._paddingOuter = 0;
        this._round = false;
        /**
         * How the leftover range is distributed.
         * `0.5` - equal distribution of space before the first and after the last band,
         * with bands effectively centered within the range.
         */
        this._align = 0.5;
    }
    Object.defineProperty(BandScale.prototype, "domain", {
        get: function () {
            return this._domain;
        },
        set: function (values) {
            var domain = this._domain;
            domain.length = 0;
            this.index = new Map();
            var index = this.index;
            // In case one wants to have duplicate domain values, for example, two 'Italy' categories,
            // one should use objects rather than strings for domain values like so:
            // { toString: () => 'Italy' }
            // { toString: () => 'Italy' }
            values.forEach(function (value) {
                if (index.get(value) === undefined) {
                    index.set(value, domain.push(value) - 1);
                }
            });
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "range", {
        get: function () {
            return this._range;
        },
        set: function (values) {
            this._range[0] = values[0];
            this._range[1] = values[1];
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    BandScale.prototype.ticks = function () {
        return this._domain;
    };
    BandScale.prototype.convert = function (d) {
        var i = this.index.get(d);
        if (i === undefined) {
            return NaN;
        }
        var r = this.ordinalRange[i];
        if (r === undefined) {
            return NaN;
        }
        return r;
    };
    Object.defineProperty(BandScale.prototype, "bandwidth", {
        get: function () {
            return this._bandwidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "padding", {
        get: function () {
            return this._paddingInner;
        },
        set: function (value) {
            value = Math.max(0, Math.min(1, value));
            this._paddingInner = value;
            this._paddingOuter = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "paddingInner", {
        get: function () {
            return this._paddingInner;
        },
        set: function (value) {
            this._paddingInner = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "paddingOuter", {
        get: function () {
            return this._paddingOuter;
        },
        set: function (value) {
            this._paddingOuter = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "round", {
        get: function () {
            return this._round;
        },
        set: function (value) {
            this._round = value;
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BandScale.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (value) {
            this._align = Math.max(0, Math.min(1, value)); // [0, 1]
            this.rescale();
        },
        enumerable: true,
        configurable: true
    });
    BandScale.prototype.rescale = function () {
        var _a;
        var n = this._domain.length;
        if (!n) {
            return;
        }
        var _b = __read$6(this._range, 2), a = _b[0], b = _b[1];
        var reversed = b < a;
        if (reversed) {
            _a = __read$6([b, a], 2), a = _a[0], b = _a[1];
        }
        var step = (b - a) / Math.max(1, n - this._paddingInner + this._paddingOuter * 2);
        if (this._round) {
            step = Math.floor(step);
        }
        a += (b - a - step * (n - this._paddingInner)) * this._align;
        this._bandwidth = step * (1 - this._paddingInner);
        if (this._round) {
            a = Math.round(a);
            this._bandwidth = Math.round(this._bandwidth);
        }
        var values = [];
        for (var i = 0; i < n; i++) {
            values.push(a + step * i);
        }
        this.ordinalRange = reversed ? values.reverse() : values;
    };
    return BandScale;
}());

var __extends$c = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CategoryAxis = /** @class */ (function (_super) {
    __extends$c(CategoryAxis, _super);
    function CategoryAxis() {
        var _this = _super.call(this, new BandScale()) || this;
        _this.scale.paddingInner = 0.2;
        _this.scale.paddingOuter = 0.3;
        return _this;
    }
    Object.defineProperty(CategoryAxis.prototype, "paddingInner", {
        get: function () {
            return this.scale.paddingInner;
        },
        set: function (value) {
            this.scale.paddingInner = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxis.prototype, "paddingOuter", {
        get: function () {
            return this.scale.paddingOuter;
        },
        set: function (value) {
            this.scale.paddingOuter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain.slice();
        },
        set: function (values) {
            // Prevent duplicate categories.
            this.scale.domain = values
                .filter(function (s, i, arr) { return arr.indexOf(s) === i; });
        },
        enumerable: true,
        configurable: true
    });
    CategoryAxis.className = 'CategoryAxis';
    CategoryAxis.type = 'category';
    return CategoryAxis;
}(ChartAxis));

/**
 * The tree layout is calculated in abstract x/y coordinates, where the root is at (0, 0)
 * and the tree grows downward from the root.
 */
var TreeNode = /** @class */ (function () {
    function TreeNode(label, parent, number) {
        if (label === void 0) { label = ''; }
        if (number === void 0) { number = 0; }
        this.x = 0;
        this.y = 0;
        this.subtreeLeft = NaN;
        this.subtreeRight = NaN;
        this.screenX = 0;
        this.screenY = 0;
        this.children = [];
        this.leafCount = 0;
        this.prelim = 0;
        this.mod = 0;
        this.ancestor = this;
        this.change = 0;
        this.shift = 0;
        this.label = label;
        // screenX and screenY are meant to be recomputed from (layout) x and y
        // when the tree is resized (without performing another layout)
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        this.number = number;
    }
    TreeNode.prototype.getLeftSibling = function () {
        return this.number > 0 && this.parent ? this.parent.children[this.number - 1] : undefined;
    };
    TreeNode.prototype.getLeftmostSibling = function () {
        return this.number > 0 && this.parent ? this.parent.children[0] : undefined;
    };
    // traverse the left contour of a subtree, return the successor of v on this contour
    TreeNode.prototype.nextLeft = function () {
        return this.children ? this.children[0] : this.thread;
    };
    // traverse the right contour of a subtree, return the successor of v on this contour
    TreeNode.prototype.nextRight = function () {
        return this.children ? this.children[this.children.length - 1] : this.thread;
    };
    TreeNode.prototype.getSiblings = function () {
        var _this = this;
        return this.parent ? this.parent.children.filter(function (_, i) { return i !== _this.number; }) : [];
    };
    return TreeNode;
}());
/**
 * Converts an array of ticks, where each tick has an array of labels, to a label tree.
 * If `pad` is `true`, will ensure that every branch matches the depth of the tree by
 * creating empty labels.
 */
function ticksToTree(ticks, pad) {
    if (pad === void 0) { pad = true; }
    var root = new TreeNode();
    var depth = 0;
    if (pad) {
        ticks.forEach(function (tick) { return depth = Math.max(depth, tick.labels.length); });
    }
    ticks.forEach(function (tick) {
        if (pad) {
            while (tick.labels.length < depth) {
                tick.labels.unshift('');
            }
        }
        insertTick(root, tick);
    });
    return root;
}
function insertTick(root, tick) {
    var pathParts = tick.labels.slice().reverse(); // path elements from root to leaf label
    var lastPartIndex = pathParts.length - 1;
    pathParts.forEach(function (pathPart, partIndex) {
        var children = root.children;
        var existingNode = find(children, function (child) { return child.label === pathPart; });
        var isNotLeaf = partIndex !== lastPartIndex;
        if (existingNode && isNotLeaf) { // the isNotLeaf check is to allow duplicate leafs
            root = existingNode;
        }
        else {
            var node = new TreeNode(pathPart, root);
            node.number = children.length;
            children.push(node);
            if (isNotLeaf) {
                root = node;
            }
        }
    });
}
// Shift the subtree.
function moveSubtree(wm, wp, shift) {
    var subtrees = wp.number - wm.number;
    var ratio = shift / subtrees;
    wp.change -= ratio;
    wp.shift += shift;
    wm.change += ratio;
    wp.prelim += shift;
    wp.mod += shift;
}
function ancestor(vim, v, defaultAncestor) {
    return v.getSiblings().indexOf(vim.ancestor) >= 0 ? vim.ancestor : defaultAncestor;
}
// Spaces out the children.
function executeShifts(v) {
    var children = v.children;
    if (children) {
        var shift = 0;
        var change = 0;
        for (var i = children.length - 1; i >= 0; i--) {
            var w = children[i];
            w.prelim += shift;
            w.mod += shift;
            change += w.change;
            shift += w.shift + change;
        }
    }
}
// Moves current subtree with v as the root if some nodes are conflicting in space.
function apportion(v, defaultAncestor, distance) {
    var w = v.getLeftSibling();
    if (w) {
        var vop = v;
        var vip = v;
        var vim = w;
        var vom = vip.getLeftmostSibling();
        var sip = vip.mod;
        var sop = vop.mod;
        var sim = vim.mod;
        var som = vom.mod;
        while (vim.nextRight() && vip.nextLeft()) {
            vim = vim.nextRight();
            vip = vip.nextLeft();
            vom = vom.nextLeft();
            vop = vop.nextRight();
            vop.ancestor = v;
            var shift = (vim.prelim + sim) - (vip.prelim + sip) + distance;
            if (shift > 0) {
                moveSubtree(ancestor(vim, v, defaultAncestor), v, shift);
                sip += shift;
                sop += shift;
            }
            sim += vim.mod;
            sip += vip.mod;
            som += vom.mod;
            sop += vop.mod;
        }
        if (vim.nextRight() && !vop.nextRight()) {
            vop.thread = vim.nextRight();
            vop.mod += sim - sop;
        }
        else {
            if (vip.nextLeft() && !vom.nextLeft()) {
                vom.thread = vip.nextLeft();
                vom.mod += sip - som;
            }
            defaultAncestor = v;
        }
    }
    return defaultAncestor;
}
// Compute the preliminary x-coordinate of node and its children (recursively).
function firstWalk(node, distance) {
    var children = node.children;
    if (children.length) {
        var defaultAncestor_1 = children[0];
        children.forEach(function (child) {
            firstWalk(child, distance);
            defaultAncestor_1 = apportion(child, defaultAncestor_1, distance);
        });
        executeShifts(node);
        var midpoint = (children[0].prelim + children[children.length - 1].prelim) / 2;
        var leftSibling = node.getLeftSibling();
        if (leftSibling) {
            node.prelim = leftSibling.prelim + distance;
            node.mod = node.prelim - midpoint;
        }
        else {
            node.prelim = midpoint;
        }
    }
    else {
        var leftSibling = node.getLeftSibling();
        node.prelim = leftSibling ? leftSibling.prelim + distance : 0;
    }
}
var Dimensions = /** @class */ (function () {
    function Dimensions() {
        this.top = Infinity;
        this.right = -Infinity;
        this.bottom = -Infinity;
        this.left = Infinity;
    }
    Dimensions.prototype.update = function (node, xy) {
        var _a = xy(node), x = _a.x, y = _a.y;
        if (x > this.right) {
            this.right = x;
        }
        if (x < this.left) {
            this.left = x;
        }
        if (y > this.bottom) {
            this.bottom = y;
        }
        if (y < this.top) {
            this.top = y;
        }
    };
    return Dimensions;
}());
function secondWalk(v, m, layout) {
    v.x = v.prelim + m;
    v.y = v.depth;
    layout.update(v);
    v.children.forEach(function (w) { return secondWalk(w, m + v.mod, layout); });
}
// After the second walk the parent nodes are positioned at the center of their immediate children.
// If we want the parent nodes to be positioned at the center of the subtree for which they are roots,
// we need a third walk to adjust the positions.
function thirdWalk(v) {
    var children = v.children;
    var leafCount = 0;
    children.forEach(function (w) {
        thirdWalk(w);
        if (w.children.length) {
            leafCount += w.leafCount;
        }
        else {
            leafCount++;
        }
    });
    v.leafCount = leafCount;
    if (children.length) {
        v.subtreeLeft = children[0].subtreeLeft;
        v.subtreeRight = children[v.children.length - 1].subtreeRight;
        v.x = (v.subtreeLeft + v.subtreeRight) / 2;
    }
    else {
        v.subtreeLeft = v.x;
        v.subtreeRight = v.x;
    }
}
function treeLayout(root) {
    var layout = new TreeLayout;
    firstWalk(root, 1);
    secondWalk(root, -root.prelim, layout);
    thirdWalk(root);
    return layout;
}
var TreeLayout = /** @class */ (function () {
    function TreeLayout() {
        this.dimensions = new Dimensions;
        this.leafCount = 0;
        this.nodes = [];
        // One might want to process leaf nodes separately from the rest of the tree.
        // For example, position labels corresponding to leafs vertically, rather than horizontally.
        this.leafNodes = [];
        this.nonLeafNodes = [];
        this.depth = 0;
    }
    TreeLayout.prototype.update = function (node) {
        this.dimensions.update(node, function (node) { return ({ x: node.x, y: node.y }); });
        if (!node.children.length) {
            this.leafCount++;
            this.leafNodes.push(node);
        }
        else {
            this.nonLeafNodes.push(node);
        }
        if (node.depth > this.depth) {
            this.depth = node.depth;
        }
        this.nodes.push(node);
    };
    TreeLayout.prototype.resize = function (width, height, shiftX, shiftY, flipX) {
        if (shiftX === void 0) { shiftX = 0; }
        if (shiftY === void 0) { shiftY = 0; }
        if (flipX === void 0) { flipX = false; }
        var xSteps = this.leafCount - 1;
        var ySteps = this.depth;
        var dimensions = this.dimensions;
        var scalingX = 1;
        var scalingY = 1;
        if (width > 0 && xSteps) {
            var existingSpacingX = (dimensions.right - dimensions.left) / xSteps;
            var desiredSpacingX = width / xSteps;
            scalingX = desiredSpacingX / existingSpacingX;
            if (flipX) {
                scalingX = -scalingX;
            }
        }
        if (height > 0 && ySteps) {
            var existingSpacingY = (dimensions.bottom - dimensions.top) / ySteps;
            var desiredSpacingY = height / ySteps;
            scalingY = desiredSpacingY / existingSpacingY;
        }
        var screenDimensions = new Dimensions();
        this.nodes.forEach(function (node) {
            node.screenX = node.x * scalingX;
            node.screenY = node.y * scalingY;
            screenDimensions.update(node, function (node) { return ({ x: node.screenX, y: node.screenY }); });
        });
        // Normalize so that root top and leftmost leaf left start at zero.
        var offsetX = -screenDimensions.left;
        var offsetY = -screenDimensions.top;
        this.nodes.forEach(function (node) {
            node.screenX += offsetX + shiftX;
            node.screenY += offsetY + shiftY;
        });
    };
    return TreeLayout;
}());

var __extends$d = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GroupedCategoryAxisLabel = /** @class */ (function (_super) {
    __extends$d(GroupedCategoryAxisLabel, _super);
    function GroupedCategoryAxisLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.grid = false;
        return _this;
    }
    return GroupedCategoryAxisLabel;
}(AxisLabel));
var GroupedCategoryAxis = /** @class */ (function (_super) {
    __extends$d(GroupedCategoryAxis, _super);
    function GroupedCategoryAxis() {
        var _this = _super.call(this, new BandScale()) || this;
        // Label scale (labels are positionsed between ticks, tick count = label count + 1).
        // We don't call is `labelScale` for consistency with other axes.
        _this.tickScale = new BandScale();
        _this.longestSeparatorLength = 0;
        _this.translation = {
            x: 0,
            y: 0
        };
        /**
         * Axis rotation angle in degrees.
         */
        _this.rotation = 0;
        _this.line = {
            width: 1,
            color: 'rgba(195, 195, 195, 1)'
        };
        // readonly tick = new AxisTick();
        _this.label = new GroupedCategoryAxisLabel();
        /**
         * The color of the labels.
         * Use `undefined` rather than `rgba(0, 0, 0, 0)` to make labels invisible.
         */
        _this.labelColor = 'rgba(87, 87, 87, 1)';
        var _a = _this, group = _a.group, tickScale = _a.tickScale, scale = _a.scale;
        scale.paddingOuter = 0.1;
        scale.paddingInner = scale.paddingOuter * 2;
        _this.requestedRange = scale.range.slice();
        _this.scale = scale;
        tickScale.paddingInner = 1;
        tickScale.paddingOuter = 0;
        _this.gridLineSelection = Selection.select(group).selectAll();
        _this.axisLineSelection = Selection.select(group).selectAll();
        _this.separatorSelection = Selection.select(group).selectAll();
        _this.labelSelection = Selection.select(group).selectAll();
        return _this;
        // this.group.append(this.bboxRect); // debug (bbox)
    }
    Object.defineProperty(GroupedCategoryAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domainValues) {
            // Prevent duplicate categories.
            var values = domainValues.filter(function (s, i, arr) { return arr.indexOf(s) === i; });
            this.scale.domain = values;
            var tickTree = ticksToTree(values);
            this.tickTreeLayout = treeLayout(tickTree);
            var domain = values.slice();
            domain.push('');
            this.tickScale.domain = domain;
            this.resizeTickTree();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GroupedCategoryAxis.prototype, "range", {
        get: function () {
            return this.requestedRange.slice();
        },
        set: function (value) {
            this.requestedRange = value.slice();
            this.updateRange();
        },
        enumerable: true,
        configurable: true
    });
    GroupedCategoryAxis.prototype.updateRange = function () {
        var _a = this, rr = _a.requestedRange, vr = _a.visibleRange, scale = _a.scale;
        var span = (rr[1] - rr[0]) / (vr[1] - vr[0]);
        var shift = span * vr[0];
        var start = rr[0] - shift;
        this.tickScale.range = scale.range = [start, start + span];
        this.resizeTickTree();
    };
    GroupedCategoryAxis.prototype.resizeTickTree = function () {
        var s = this.scale;
        var range = s.domain.length ? [s.convert(s.domain[0]), s.convert(s.domain[s.domain.length - 1])] : s.range;
        var layout = this.tickTreeLayout;
        var lineHeight = this.lineHeight;
        if (layout) {
            layout.resize(Math.abs(range[1] - range[0]), layout.depth * lineHeight, (Math.min(range[0], range[1]) || 0) + (s.bandwidth || 0) / 2, -layout.depth * lineHeight, (range[1] - range[0]) < 0);
        }
    };
    Object.defineProperty(GroupedCategoryAxis.prototype, "lineHeight", {
        get: function () {
            return this.label.fontSize * 1.5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GroupedCategoryAxis.prototype, "gridLength", {
        get: function () {
            return this._gridLength;
        },
        /**
         * The length of the grid. The grid is only visible in case of a non-zero value.
         */
        set: function (value) {
            // Was visible and now invisible, or was invisible and now visible.
            if (this._gridLength && !value || !this._gridLength && value) {
                this.gridLineSelection = this.gridLineSelection.remove().setData([]);
                this.labelSelection = this.labelSelection.remove().setData([]);
            }
            this._gridLength = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates/removes/updates the scene graph nodes that constitute the axis.
     * Supposed to be called _manually_ after changing _any_ of the axis properties.
     * This allows to bulk set axis properties before updating the nodes.
     * The node changes made by this method are rendered on the next animation frame.
     * We could schedule this method call automatically on the next animation frame
     * when any of the axis properties change (the way we do when properties of scene graph's
     * nodes change), but this will mean that we first wait for the next animation
     * frame to make changes to the nodes of the axis, then wait for another animation
     * frame to render those changes. It's nice to have everything update automatically,
     * but this extra level of async indirection will not just introduce an unwanted delay,
     * it will also make it harder to reason about the program.
     */
    GroupedCategoryAxis.prototype.update = function () {
        var _this = this;
        var _a = this, group = _a.group, scale = _a.scale, label = _a.label, tickScale = _a.tickScale, requestedRange = _a.requestedRange;
        var rangeStart = scale.range[0];
        var rangeEnd = scale.range[1];
        var rangeLength = Math.abs(rangeEnd - rangeStart);
        var bandwidth = (rangeLength / scale.domain.length) || 0;
        var parallelLabels = label.parallel;
        var rotation = toRadians(this.rotation);
        var isHorizontal = Math.abs(Math.cos(rotation)) < 1e-8;
        var labelRotation = this.label.rotation ? normalizeAngle360(toRadians(this.label.rotation)) : 0;
        group.translationX = this.translation.x;
        group.translationY = this.translation.y;
        group.rotation = rotation;
        var title = this.title;
        // The Text `node` of the Caption is not used to render the title of the grouped category axis.
        // The phantom root of the tree layout is used instead.
        if (title) {
            title.node.visible = false;
        }
        var lineHeight = this.lineHeight;
        // Render ticks and labels.
        var tickTreeLayout = this.tickTreeLayout;
        var labels = scale.ticks();
        var treeLabels = tickTreeLayout ? tickTreeLayout.nodes : [];
        var isLabelTree = tickTreeLayout ? tickTreeLayout.depth > 1 : false;
        var ticks = tickScale.ticks();
        // The side of the axis line to position the labels on.
        // -1 = left (default)
        //  1 = right
        var sideFlag = label.mirrored ? 1 : -1;
        // When labels are parallel to the axis line, the `parallelFlipFlag` is used to
        // flip the labels to avoid upside-down text, when the axis is rotated
        // such that it is in the right hemisphere, i.e. the angle of rotation
        // is in the [0, π] interval.
        // The rotation angle is normalized, so that we have an easier time checking
        // if it's in the said interval. Since the axis is always rendered vertically
        // and then rotated, zero rotation means 12 (not 3) o-clock.
        // -1 = flip
        //  1 = don't flip (default)
        var parallelFlipRotation = normalizeAngle360(rotation);
        var parallelFlipFlag = (!labelRotation && parallelFlipRotation >= 0 && parallelFlipRotation <= Math.PI) ? -1 : 1;
        var regularFlipRotation = normalizeAngle360(rotation - Math.PI / 2);
        // Flip if the axis rotation angle is in the top hemisphere.
        var regularFlipFlag = (!labelRotation && regularFlipRotation >= 0 && regularFlipRotation <= Math.PI) ? -1 : 1;
        var updateGridLines = this.gridLineSelection.setData(this.gridLength ? ticks : []);
        updateGridLines.exit.remove();
        var enterGridLines = updateGridLines.enter.append(Line);
        var gridLineSelection = updateGridLines.merge(enterGridLines);
        var updateLabels = this.labelSelection.setData(treeLabels);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text);
        var labelSelection = updateLabels.merge(enterLabels);
        var labelFormatter = label.formatter;
        var labelBBoxes = new Map();
        var maxLeafLabelWidth = 0;
        labelSelection
            .each(function (node, datum, index) {
            node.fontStyle = label.fontStyle;
            node.fontWeight = label.fontWeight;
            node.fontSize = label.fontSize;
            node.fontFamily = label.fontFamily;
            node.fill = label.color;
            node.textBaseline = parallelFlipFlag === -1 ? 'bottom' : 'hanging';
            // label.textBaseline = parallelLabels && !labelRotation
            //     ? (sideFlag * parallelFlipFlag === -1 ? 'hanging' : 'bottom')
            //     : 'middle';
            node.textAlign = 'center';
            node.translationX = datum.screenY - label.fontSize * 0.25;
            node.translationY = datum.screenX;
            if (index === 0) { // use the phantom root as the axis title
                if (title && title.enabled && labels.length > 0) {
                    node.visible = true;
                    node.text = title.text;
                    node.fontSize = title.fontSize;
                    node.fontStyle = title.fontStyle;
                    node.fontWeight = title.fontWeight;
                    node.fontFamily = title.fontFamily;
                    node.textBaseline = 'hanging';
                }
                else {
                    node.visible = false;
                }
            }
            else {
                node.text = labelFormatter
                    ? labelFormatter({
                        value: String(datum.label),
                        index: index
                    })
                    : String(datum.label);
                node.visible =
                    datum.screenX >= requestedRange[0] &&
                        datum.screenX <= requestedRange[1];
            }
            var bbox = node.computeBBox();
            labelBBoxes.set(node.id, bbox);
            if (bbox.width > maxLeafLabelWidth) {
                maxLeafLabelWidth = bbox.width;
            }
        });
        var labelX = sideFlag * label.padding;
        var autoRotation = parallelLabels
            ? parallelFlipFlag * Math.PI / 2
            : (regularFlipFlag === -1 ? Math.PI : 0);
        var labelGrid = this.label.grid;
        var separatorData = [];
        labelSelection.each(function (label, datum, index) {
            label.x = labelX;
            label.rotationCenterX = labelX;
            if (!datum.children.length) {
                label.rotation = labelRotation;
                label.textAlign = 'end';
                label.textBaseline = 'middle';
                var bbox = labelBBoxes.get(label.id);
                if (bbox && bbox.height > bandwidth) {
                    label.visible = false;
                }
            }
            else {
                label.translationX -= maxLeafLabelWidth - lineHeight + _this.label.padding;
                var availableRange = datum.leafCount * bandwidth;
                var bbox = labelBBoxes.get(label.id);
                if (bbox && bbox.width > availableRange) {
                    label.visible = false;
                }
                else if (isHorizontal) {
                    label.rotation = autoRotation;
                }
                else {
                    label.rotation = -Math.PI / 2;
                }
            }
            // Calculate positions of label separators for all nodes except the root.
            // Each separator is placed to the top of the current label.
            if (datum.parent && isLabelTree) {
                var y = !datum.children.length
                    ? datum.screenX - bandwidth / 2
                    : datum.screenX - datum.leafCount * bandwidth / 2;
                if (!datum.children.length) {
                    if ((datum.number !== datum.children.length - 1) || labelGrid) {
                        separatorData.push({
                            y: y,
                            x1: 0,
                            x2: -maxLeafLabelWidth - _this.label.padding * 2,
                            toString: function () { return String(index); }
                        });
                    }
                }
                else {
                    var x = -maxLeafLabelWidth - _this.label.padding * 2 + datum.screenY;
                    separatorData.push({
                        y: y,
                        x1: x + lineHeight,
                        x2: x,
                        toString: function () { return String(index); }
                    });
                }
            }
        });
        // Calculate the position of the long separator on the far bottom of the axis.
        var minX = 0;
        separatorData.forEach(function (d) { return minX = Math.min(minX, d.x2); });
        this.longestSeparatorLength = Math.abs(minX);
        separatorData.push({
            y: Math.max(rangeStart, rangeEnd),
            x1: 0,
            x2: minX,
            toString: function () { return String(separatorData.length); }
        });
        var updateSeparators = this.separatorSelection.setData(separatorData);
        updateSeparators.exit.remove();
        var enterSeparators = updateSeparators.enter.append(Line);
        var separatorSelection = updateSeparators.merge(enterSeparators);
        this.separatorSelection = separatorSelection;
        var epsilon = 0.0000001;
        separatorSelection.each(function (line, datum, i) {
            line.x1 = datum.x1;
            line.x2 = datum.x2;
            line.y1 = datum.y;
            line.y2 = datum.y;
            line.visible = datum.y >= requestedRange[0] - epsilon && datum.y <= requestedRange[1] + epsilon;
            line.stroke = _this.tick.color;
            line.fill = undefined;
            line.strokeWidth = 1;
        });
        this.gridLineSelection = gridLineSelection;
        this.labelSelection = labelSelection;
        // Render axis lines.
        var lineCount = tickTreeLayout ? tickTreeLayout.depth + 1 : 1;
        var lines = [];
        for (var i = 0; i < lineCount; i++) {
            lines.push(i);
        }
        var updateAxisLines = this.axisLineSelection.setData(lines);
        updateAxisLines.exit.remove();
        var enterAxisLines = updateAxisLines.enter.append(Line);
        var axisLineSelection = updateAxisLines.merge(enterAxisLines);
        this.axisLineSelection = axisLineSelection;
        axisLineSelection.each(function (line, _, index) {
            var x = index > 0 ? -maxLeafLabelWidth - _this.label.padding * 2 - (index - 1) * lineHeight : 0;
            line.x1 = x;
            line.x2 = x;
            line.y1 = requestedRange[0];
            line.y2 = requestedRange[1];
            line.strokeWidth = _this.line.width;
            line.stroke = _this.line.color;
            line.visible = labels.length > 0 && (index === 0 || (labelGrid && isLabelTree));
        });
        if (this.gridLength) {
            var styles_1 = this.gridStyle;
            var styleCount_1 = styles_1.length;
            gridLineSelection
                .each(function (line, datum, index) {
                var y = Math.round(tickScale.convert(datum));
                line.x1 = 0;
                line.x2 = -sideFlag * _this.gridLength;
                line.y1 = y;
                line.y2 = y;
                line.visible = y >= requestedRange[0] && y <= requestedRange[1] &&
                    Math.abs(line.parent.translationY - rangeStart) > 1;
                var style = styles_1[index % styleCount_1];
                line.stroke = style.stroke;
                line.strokeWidth = _this.tick.width;
                line.lineDash = style.lineDash;
                line.fill = undefined;
            });
        }
        // debug (bbox)
        // const bbox = this.computeBBox();
        // const bboxRect = this.bboxRect;
        // bboxRect.x = bbox.x;
        // bboxRect.y = bbox.y;
        // bboxRect.width = bbox.width;
        // bboxRect.height = bbox.height;
    };
    GroupedCategoryAxis.prototype.computeBBox = function (options) {
        var includeTitle = !options || !options.excludeTitle;
        var left = Infinity;
        var right = -Infinity;
        var top = Infinity;
        var bottom = -Infinity;
        this.labelSelection.each(function (label, _, index) {
            // The label itself is rotated, but not translated, the group that
            // contains it is. So to capture the group transform in the label bbox
            // calculation we combine the transform matrices of the label and the group.
            // Depending on the timing of the `axis.computeBBox()` method call, we may
            // not have the group's and the label's transform matrices updated yet (because
            // the transform matrix is not recalculated whenever a node's transform attributes
            // change, instead it's marked for recalculation on the next frame by setting
            // the node's `dirtyTransform` flag to `true`), so we force them to update
            // right here by calling `computeTransformMatrix`.
            if (index > 0 || includeTitle) { // first node is the root (title)
                label.computeTransformMatrix();
                var matrix = Matrix.flyweight(label.matrix);
                var labelBBox = label.computeBBox();
                if (labelBBox) {
                    var bbox = matrix.transformBBox(labelBBox);
                    left = Math.min(left, bbox.x);
                    right = Math.max(right, bbox.x + bbox.width);
                    top = Math.min(top, bbox.y);
                    bottom = Math.max(bottom, bbox.y + bbox.height);
                }
            }
        });
        return new BBox(left, top, Math.max(right - left, this.longestSeparatorLength), bottom - top);
    };
    // debug (bbox)
    // private bboxRect = (() => {
    //     const rect = new Rect();
    //     rect.fill = undefined;
    //     rect.stroke = 'red';
    //     rect.strokeWidth = 1;
    //     rect.strokeOpacity = 0.2;
    //     return rect;
    // })();
    GroupedCategoryAxis.className = 'GroupedCategoryAxis';
    GroupedCategoryAxis.type = 'groupedCategory';
    return GroupedCategoryAxis;
}(ChartAxis));

var __extends$e = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var t0 = new Date;
var t1 = new Date;
/**
 * The interval methods don't mutate Date parameters.
 */
var TimeInterval = /** @class */ (function () {
    function TimeInterval(floor, offset) {
        this._floor = floor;
        this._offset = offset;
    }
    /**
     * Returns a new date representing the latest interval boundary date before or equal to date.
     * For example, `day.floor(date)` typically returns 12:00 AM local time on the given date.
     * @param date
     */
    TimeInterval.prototype.floor = function (date) {
        date = new Date(+date);
        this._floor(date);
        return date;
    };
    /**
     * Returns a new date representing the earliest interval boundary date after or equal to date.
     * @param date
     */
    TimeInterval.prototype.ceil = function (date) {
        date = new Date(+date - 1);
        this._floor(date);
        this._offset(date, 1);
        this._floor(date);
        return date;
    };
    /**
     * Returns a new date representing the closest interval boundary date to date.
     * @param date
     */
    TimeInterval.prototype.round = function (date) {
        var d0 = this.floor(date);
        var d1 = this.ceil(date);
        var ms = +date;
        return ms - d0.getTime() < d1.getTime() - ms ? d0 : d1;
    };
    /**
     * Returns a new date equal to date plus step intervals.
     * @param date
     * @param step
     */
    TimeInterval.prototype.offset = function (date, step) {
        if (step === void 0) { step = 1; }
        date = new Date(+date);
        this._offset(date, Math.floor(step));
        return date;
    };
    /**
     * Returns an array of dates representing every interval boundary after or equal to start (inclusive) and before stop (exclusive).
     * @param start
     * @param stop
     * @param step
     */
    TimeInterval.prototype.range = function (start, stop, step) {
        if (step === void 0) { step = 1; }
        var range = [];
        start = this.ceil(start);
        step = Math.floor(step);
        if (start > stop || step <= 0) {
            return range;
        }
        var previous;
        do {
            previous = new Date(+start);
            range.push(previous);
            this._offset(start, step);
            this._floor(start);
        } while (previous < start && start < stop);
        return range;
    };
    // Returns an interval that is a subset of this interval.
    // For example, to create an interval that return 1st, 11th, 21st and 31st of each month:
    // day.filter(date => (date.getDate() - 1) % 10 === 0)
    TimeInterval.prototype.filter = function (test) {
        var _this = this;
        var floor = function (date) {
            if (date instanceof Date) {
                _this._floor(date);
                while (!test(date)) {
                    date.setTime(date.getTime() - 1);
                    _this._floor(date);
                }
            }
            return date;
        };
        var offset = function (date, step) {
            if (date instanceof Date) {
                if (step < 0) {
                    while (++step <= 0) {
                        do {
                            _this._offset(date, -1);
                        } while (!test(date));
                    }
                }
                else {
                    while (--step >= 0) {
                        do {
                            _this._offset(date, 1);
                        } while (!test(date));
                    }
                }
            }
            return date;
        };
        return new TimeInterval(floor, offset);
    };
    return TimeInterval;
}());
var CountableTimeInterval = /** @class */ (function (_super) {
    __extends$e(CountableTimeInterval, _super);
    function CountableTimeInterval(floor, offset, count, field) {
        var _this = _super.call(this, floor, offset) || this;
        _this._count = count;
        _this._field = field;
        return _this;
    }
    /**
     * Returns the number of interval boundaries after start (exclusive) and before or equal to end (inclusive).
     * @param start
     * @param end
     */
    CountableTimeInterval.prototype.count = function (start, end) {
        t0.setTime(+start);
        t1.setTime(+end);
        this._floor(t0);
        this._floor(t1);
        return Math.floor(this._count(t0, t1));
    };
    /**
     * Returns a filtered view of this interval representing every step'th date.
     * The meaning of step is dependent on this interval’s parent interval as defined by the `field` function.
     * @param step
     */
    CountableTimeInterval.prototype.every = function (step) {
        var _this = this;
        var result;
        step = Math.floor(step);
        if (isFinite(step) && step > 0) {
            if (step > 1) {
                var field_1 = this._field;
                if (field_1) {
                    result = this.filter(function (d) { return field_1(d) % step === 0; });
                }
                else {
                    result = this.filter(function (d) { return _this.count(0, d) % step === 0; });
                }
            }
            else {
                result = this;
            }
        }
        return result;
    };
    return CountableTimeInterval;
}(TimeInterval));

function floor(date) {
    return date;
}
function offset(date, milliseconds) {
    date.setTime(date.getTime() + milliseconds);
}
function count(start, end) {
    return end.getTime() - start.getTime();
}
var millisecond = new CountableTimeInterval(floor, offset, count);

// Common time unit sizes in milliseconds.
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

function floor$1(date) {
    date.setTime(date.getTime() - date.getMilliseconds());
}
function offset$1(date, seconds) {
    date.setTime(date.getTime() + seconds * durationSecond);
}
function count$1(start, end) {
    return (end.getTime() - start.getTime()) / durationSecond;
}
var second = new CountableTimeInterval(floor$1, offset$1, count$1);

function floor$2(date) {
    date.setTime(date.getTime() - date.getMilliseconds() - date.getSeconds() * durationSecond);
}
function offset$2(date, minutes) {
    date.setTime(date.getTime() + minutes * durationMinute);
}
function count$2(start, end) {
    return (end.getTime() - start.getTime()) / durationMinute;
}
function field(date) {
    return date.getMinutes();
}
var minute = new CountableTimeInterval(floor$2, offset$2, count$2, field);

function floor$3(date) {
    date.setTime(date.getTime() - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}
function offset$3(date, hours) {
    date.setTime(date.getTime() + hours * durationHour);
}
function count$3(start, end) {
    return (end.getTime() - start.getTime()) / durationHour;
}
function field$1(date) {
    return date.getHours();
}
var hour = new CountableTimeInterval(floor$3, offset$3, count$3, field$1);

function floor$4(date) {
    date.setHours(0, 0, 0, 0);
}
function offset$4(date, days) {
    date.setDate(date.getDate() + days);
}
function count$4(start, end) {
    var tzMinuteDelta = end.getTimezoneOffset() - start.getTimezoneOffset();
    return (end.getTime() - start.getTime() - tzMinuteDelta * durationMinute) / durationDay;
}
function field$2(date) {
    return date.getDate() - 1;
}
var day = new CountableTimeInterval(floor$4, offset$4, count$4, field$2);

// Set date to n-th day of the week.
function weekday(n) {
    // Sets the `date` to the start of the `n`-th day of the current week.
    // n == 0 is Sunday.
    function floor(date) {
        //                  1..31            1..7
        date.setDate(date.getDate() - (date.getDay() + 7 - n) % 7);
        date.setHours(0, 0, 0, 0); // h, m, s, ms
    }
    // Offset the date by the given number of weeks.
    function offset(date, weeks) {
        date.setDate(date.getDate() + weeks * 7);
    }
    // Count the number of weeks between the start and end dates.
    function count(start, end) {
        var msDelta = end.getTime() - start.getTime();
        var tzMinuteDelta = end.getTimezoneOffset() - start.getTimezoneOffset();
        return (msDelta - tzMinuteDelta * durationMinute) / durationWeek;
    }
    return new CountableTimeInterval(floor, offset, count);
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

function floor$5(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
}
function offset$5(date, months) {
    date.setMonth(date.getMonth() + months);
}
function count$5(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}
function field$3(date) {
    return date.getMonth();
}
var month = new CountableTimeInterval(floor$5, offset$5, count$5, field$3);

function floor$6(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
}
function offset$6(date, years) {
    date.setFullYear(date.getFullYear() + years);
}
function count$6(start, end) {
    return end.getFullYear() - start.getFullYear();
}
function field$4(date) {
    return date.getFullYear();
}
var year = new CountableTimeInterval(floor$6, offset$6, count$6, field$4);

function floor$7(date) {
    date.setUTCHours(0, 0, 0, 0);
}
function offset$7(date, days) {
    date.setUTCDate(date.getUTCDate() + days);
}
function count$7(start, end) {
    return (end.getTime() - start.getTime()) / durationDay;
}
function field$5(date) {
    return date.getUTCDate() - 1;
}
var utcDay = new CountableTimeInterval(floor$7, offset$7, count$7, field$5);

function floor$8(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
}
function offset$8(date, years) {
    date.setUTCFullYear(date.getUTCFullYear() + years);
}
function count$8(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
}
function field$6(date) {
    return date.getUTCFullYear();
}
var utcYear = new CountableTimeInterval(floor$8, offset$8, count$8, field$6);

// Set date to n-th day of the week.
function weekday$1(n) {
    // Sets the `date` to the start of the `n`-th day of the current week.
    // n == 0 is Sunday.
    function floor(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - n) % 7);
        date.setHours(0, 0, 0, 0); // h, m, s, ms
    }
    // Offset the date by the given number of weeks.
    function offset(date, weeks) {
        date.setUTCDate(date.getUTCDate() + weeks * 7);
    }
    // Count the number of weeks between the start and end dates.
    function count(start, end) {
        return (end.getTime() - start.getTime()) / durationWeek;
    }
    return new CountableTimeInterval(floor, offset, count);
}
var utcSunday = weekday$1(0);
var utcMonday = weekday$1(1);
var utcTuesday = weekday$1(2);
var utcWednesday = weekday$1(3);
var utcThursday = weekday$1(4);
var utcFriday = weekday$1(5);
var utcSaturday = weekday$1(6);

function localDate(d) {
    // For JS Dates the [0, 100) interval is a time warp, a fast forward to the 20th century.
    // For example, -1 is -0001 BC, 0 is already 1900 AD.
    if (d.y >= 0 && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
    if (d.y >= 0 && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
/**
 * Creates a lookup map for array of names to go from a name to index.
 * @param names
 */
function formatLookup(names) {
    var map = {};
    for (var i = 0, n = names.length; i < n; i++) {
        map[names[i].toLowerCase()] = i;
    }
    return map;
}
function newYear(y) {
    return {
        y: y,
        m: 0,
        d: 1,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
var percentCharCode = 37;
var numberRe = /^\s*\d+/; // ignores next directive
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;
/**
 * Prepends any character in the `requoteRe` set with a backslash.
 * @param s
 */
var requote = function (s) { return s.replace(requoteRe, '\\$&'); }; // $& - matched substring
/**
 * Returns a RegExp that matches any string that starts with any of the given names (case insensitive).
 * @param names
 */
var formatRe = function (names) { return new RegExp('^(?:' + names.map(requote).join('|') + ')', 'i'); };
// A map of padding modifiers to padding strings. Default is `0`.
var pads = {
    '-': '',
    '_': ' ',
    '0': '0'
};
function pad(value, fill, width) {
    var sign = value < 0 ? '-' : '';
    var string = String(sign ? -value : value);
    var length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
/**
 * Create a new time-locale-based object which exposes time-formatting
 * methods for the specified locale definition.
 *
 * @param timeLocale A time locale definition.
 */
function formatLocale$1(timeLocale) {
    var lDateTime = timeLocale.dateTime;
    var lDate = timeLocale.date;
    var lTime = timeLocale.time;
    var lPeriods = timeLocale.periods;
    var lWeekdays = timeLocale.days;
    var lShortWeekdays = timeLocale.shortDays;
    var lMonths = timeLocale.months;
    var lShortMonths = timeLocale.shortMonths;
    var periodRe = formatRe(lPeriods);
    var periodLookup = formatLookup(lPeriods);
    var weekdayRe = formatRe(lWeekdays);
    var weekdayLookup = formatLookup(lWeekdays);
    var shortWeekdayRe = formatRe(lShortWeekdays);
    var shortWeekdayLookup = formatLookup(lShortWeekdays);
    var monthRe = formatRe(lMonths);
    var monthLookup = formatLookup(lMonths);
    var shortMonthRe = formatRe(lShortMonths);
    var shortMonthLookup = formatLookup(lShortMonths);
    var formats = {
        'a': formatShortWeekday,
        'A': formatWeekday,
        'b': formatShortMonth,
        'B': formatMonth,
        'c': undefined,
        'd': formatDayOfMonth,
        'e': formatDayOfMonth,
        'f': formatMicroseconds,
        'H': formatHour24,
        'I': formatHour12,
        'j': formatDayOfYear,
        'L': formatMilliseconds,
        'm': formatMonthNumber,
        'M': formatMinutes,
        'p': formatPeriod,
        'Q': formatUnixTimestamp,
        's': formatUnixTimestampSeconds,
        'S': formatSeconds,
        'u': formatWeekdayNumberMonday,
        'U': formatWeekNumberSunday,
        'V': formatWeekNumberISO,
        'w': formatWeekdayNumberSunday,
        'W': formatWeekNumberMonday,
        'x': undefined,
        'X': undefined,
        'y': formatYear,
        'Y': formatFullYear,
        'Z': formatZone,
        '%': formatLiteralPercent
    };
    var utcFormats = {
        'a': formatUTCShortWeekday,
        'A': formatUTCWeekday,
        'b': formatUTCShortMonth,
        'B': formatUTCMonth,
        'c': undefined,
        'd': formatUTCDayOfMonth,
        'e': formatUTCDayOfMonth,
        'f': formatUTCMicroseconds,
        'H': formatUTCHour24,
        'I': formatUTCHour12,
        'j': formatUTCDayOfYear,
        'L': formatUTCMilliseconds,
        'm': formatUTCMonthNumber,
        'M': formatUTCMinutes,
        'p': formatUTCPeriod,
        'Q': formatUnixTimestamp,
        's': formatUnixTimestampSeconds,
        'S': formatUTCSeconds,
        'u': formatUTCWeekdayNumberMonday,
        'U': formatUTCWeekNumberSunday,
        'V': formatUTCWeekNumberISO,
        'w': formatUTCWeekdayNumberSunday,
        'W': formatUTCWeekNumberMonday,
        'x': undefined,
        'X': undefined,
        'y': formatUTCYear,
        'Y': formatUTCFullYear,
        'Z': formatUTCZone,
        '%': formatLiteralPercent
    };
    var parses = {
        'a': parseShortWeekday,
        'A': parseWeekday,
        'b': parseShortMonth,
        'B': parseMonth,
        'c': parseLocaleDateTime,
        'd': parseDayOfMonth,
        'e': parseDayOfMonth,
        'f': parseMicroseconds,
        'H': parseHour24,
        'I': parseHour24,
        'j': parseDayOfYear,
        'L': parseMilliseconds,
        'm': parseMonthNumber,
        'M': parseMinutes,
        'p': parsePeriod,
        'Q': parseUnixTimestamp,
        's': parseUnixTimestampSeconds,
        'S': parseSeconds,
        'u': parseWeekdayNumberMonday,
        'U': parseWeekNumberSunday,
        'V': parseWeekNumberISO,
        'w': parseWeekdayNumberSunday,
        'W': parseWeekNumberMonday,
        'x': parseLocaleDate,
        'X': parseLocaleTime,
        'y': parseYear,
        'Y': parseFullYear,
        'Z': parseZone,
        '%': parseLiteralPercent
    };
    // Recursive definitions.
    formats.x = newFormat(lDate, formats);
    formats.X = newFormat(lTime, formats);
    formats.c = newFormat(lDateTime, formats);
    utcFormats.x = newFormat(lDate, utcFormats);
    utcFormats.X = newFormat(lTime, utcFormats);
    utcFormats.c = newFormat(lDateTime, utcFormats);
    function newParse(specifier, newDate) {
        return function (str) {
            var d = newYear(1900);
            var i = parseSpecifier(d, specifier, str += '', 0);
            if (i != str.length) {
                return undefined;
            }
            // If a UNIX timestamp is specified, return it.
            if ('Q' in d) {
                return new Date(d.Q);
            }
            // The am-pm flag is 0 for AM, and 1 for PM.
            if ('p' in d) {
                d.H = d.H % 12 + d.p * 12;
            }
            // Convert day-of-week and week-of-year to day-of-year.
            if ('V' in d) {
                if (d.V < 1 || d.V > 53) {
                    return undefined;
                }
                if (!('w' in d)) {
                    d.w = 1;
                }
                if ('Z' in d) {
                    var week = utcDate(newYear(d.y));
                    var day$1 = week.getUTCDay();
                    week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday.floor(week);
                    week = utcDay.offset(week, (d.V - 1) * 7);
                    d.y = week.getUTCFullYear();
                    d.m = week.getUTCMonth();
                    d.d = week.getUTCDate() + (d.w + 6) % 7;
                }
                else {
                    var week = newDate(newYear(d.y));
                    var day$1 = week.getDay();
                    week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday.floor(week);
                    week = day.offset(week, (d.V - 1) * 7);
                    d.y = week.getFullYear();
                    d.m = week.getMonth();
                    d.d = week.getDate() + (d.w + 6) % 7;
                }
            }
            else if ('W' in d || 'U' in d) {
                if (!('w' in d)) {
                    d.w = 'u' in d
                        ? d.u % 7
                        : 'W' in d ? 1 : 0;
                }
                var day$1 = 'Z' in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
                d.m = 0;
                d.d = 'W' in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
            }
            // If a time zone is specified, all fields are interpreted as UTC and then
            // offset according to the specified time zone.
            if ('Z' in d) {
                d.H += d.Z / 100 | 0;
                d.M += d.Z % 100;
                return utcDate(d);
            }
            // Otherwise, all fields are in local time.
            return newDate(d);
        };
    }
    /**
     * Creates a new function that formats the given Date or timestamp according to specifier.
     * @param specifier
     * @param formats
     */
    function newFormat(specifier, formats) {
        return function (date) {
            var string = [];
            var n = specifier.length;
            var i = -1;
            var j = 0;
            if (!(date instanceof Date)) {
                date = new Date(+date);
            }
            while (++i < n) {
                if (specifier.charCodeAt(i) === percentCharCode) {
                    string.push(specifier.slice(j, i)); // copy the chunks of specifier with no directives as is
                    var c = specifier.charAt(++i);
                    var pad_1 = pads[c];
                    if (pad_1 != undefined) { // if format directive has a padding modifier in front of it
                        c = specifier.charAt(++i); // fetch the directive itself
                    }
                    else {
                        pad_1 = c === 'e' ? ' ' : '0'; // use the default padding modifier
                    }
                    var format = formats[c];
                    if (format) { // if the directive has a corresponding formatting function
                        c = format(date, pad_1); // replace the directive with the formatted date
                    }
                    string.push(c);
                    j = i + 1;
                }
            }
            string.push(specifier.slice(j, i));
            return string.join('');
        };
    }
    // Simultaneously walks over the specifier and the parsed string, populating the `d` map with parsed values.
    // The returned number is expected to equal the length of the parsed `string`, if parsing succeeded.
    function parseSpecifier(d, specifier, string, j) {
        // i - `specifier` string index
        // j - parsed `string` index
        var i = 0;
        var n = specifier.length;
        var m = string.length;
        while (i < n) {
            if (j >= m) {
                return -1;
            }
            var code = specifier.charCodeAt(i++);
            if (code === percentCharCode) {
                var char = specifier.charAt(i++);
                var parse = parses[(char in pads ? specifier.charAt(i++) : char)];
                if (!parse || ((j = parse(d, string, j)) < 0)) {
                    return -1;
                }
            }
            else if (code != string.charCodeAt(j++)) {
                return -1;
            }
        }
        return j;
    }
    // ----------------------------- formats ----------------------------------
    function formatMicroseconds(date, fill) {
        return formatMilliseconds(date, fill) + '000';
    }
    function formatMilliseconds(date, fill) {
        return pad(date.getMilliseconds(), fill, 3);
    }
    function formatSeconds(date, fill) {
        return pad(date.getSeconds(), fill, 2);
    }
    function formatMinutes(date, fill) {
        return pad(date.getMinutes(), fill, 2);
    }
    function formatHour12(date, fill) {
        return pad(date.getHours() % 12 || 12, fill, 2);
    }
    function formatHour24(date, fill) {
        return pad(date.getHours(), fill, 2);
    }
    function formatPeriod(date) {
        return lPeriods[date.getHours() >= 12 ? 1 : 0];
    }
    function formatShortWeekday(date) {
        return lShortWeekdays[date.getDay()];
    }
    function formatWeekday(date) {
        return lWeekdays[date.getDay()];
    }
    function formatWeekdayNumberMonday(date) {
        var dayOfWeek = date.getDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    }
    function formatWeekNumberSunday(date, fill) {
        return pad(sunday.count(year.floor(date), date), fill, 2);
    }
    function formatWeekNumberISO(date, fill) {
        var day = date.getDay();
        date = (day >= 4 || day === 0) ? thursday.floor(date) : thursday.ceil(date);
        var yearStart = year.floor(date);
        return pad(thursday.count(yearStart, date) + (yearStart.getDay() === 4 ? 1 : 0), fill, 2);
    }
    function formatWeekdayNumberSunday(date) {
        return date.getDay();
    }
    function formatWeekNumberMonday(date, fill) {
        return pad(monday.count(year.floor(date), date), fill, 2);
    }
    function formatDayOfMonth(date, fill) {
        return pad(date.getDate(), fill, 2);
    }
    function formatDayOfYear(date, fill) {
        return pad(1 + day.count(year.floor(date), date), fill, 3);
    }
    function formatShortMonth(date) {
        return lShortMonths[date.getMonth()];
    }
    function formatMonth(date) {
        return lMonths[date.getMonth()];
    }
    function formatMonthNumber(date, fill) {
        return pad(date.getMonth() + 1, fill, 2);
    }
    function formatYear(date, fill) {
        return pad(date.getFullYear() % 100, fill, 2);
    }
    function formatFullYear(date, fill) {
        return pad(date.getFullYear() % 10000, fill, 4);
    }
    function formatZone(date) {
        var z = date.getTimezoneOffset();
        return (z > 0 ? '-' : (z *= -1, '+')) + pad(Math.floor(z / 60), '0', 2) + pad(z % 60, '0', 2);
    }
    // -------------------------- UTC formats -----------------------------------
    function formatUTCMicroseconds(date, fill) {
        return formatUTCMilliseconds(date, fill) + '000';
    }
    function formatUTCMilliseconds(date, fill) {
        return pad(date.getUTCMilliseconds(), fill, 3);
    }
    function formatUTCSeconds(date, fill) {
        return pad(date.getUTCSeconds(), fill, 2);
    }
    function formatUTCMinutes(date, fill) {
        return pad(date.getUTCMinutes(), fill, 2);
    }
    function formatUTCHour12(date, fill) {
        return pad(date.getUTCHours() % 12 || 12, fill, 2);
    }
    function formatUTCHour24(date, fill) {
        return pad(date.getUTCHours(), fill, 2);
    }
    function formatUTCPeriod(date) {
        return lPeriods[date.getUTCHours() >= 12 ? 1 : 0];
    }
    function formatUTCDayOfMonth(date, fill) {
        return pad(date.getUTCDate(), fill, 2);
    }
    function formatUTCDayOfYear(date, fill) {
        return pad(1 + utcDay.count(utcYear.floor(date), date), fill, 3);
    }
    function formatUTCMonthNumber(date, fill) {
        return pad(date.getUTCMonth() + 1, fill, 2);
    }
    function formatUTCShortMonth(date) {
        return lShortMonths[date.getUTCMonth()];
    }
    function formatUTCMonth(date) {
        return lMonths[date.getUTCMonth()];
    }
    function formatUTCShortWeekday(date) {
        return lShortWeekdays[date.getUTCDay()];
    }
    function formatUTCWeekday(date) {
        return lWeekdays[date.getUTCDay()];
    }
    function formatUTCWeekdayNumberMonday(date) {
        var dayOfWeek = date.getUTCDay();
        return dayOfWeek === 0 ? 7 : dayOfWeek;
    }
    function formatUTCWeekNumberSunday(date, fill) {
        return pad(utcSunday.count(utcYear.floor(date), date), fill, 2);
    }
    function formatUTCWeekNumberISO(date, fill) {
        var day = date.getUTCDay();
        date = (day >= 4 || day === 0) ? utcThursday.floor(date) : utcThursday.ceil(date);
        var yearStart = utcYear.floor(date);
        return pad(utcThursday.count(yearStart, date) + (yearStart.getUTCDay() === 4 ? 1 : 0), fill, 4);
    }
    function formatUTCWeekdayNumberSunday(date) {
        return date.getUTCDay();
    }
    function formatUTCWeekNumberMonday(date, fill) {
        return pad(utcMonday.count(utcYear.floor(date), date), fill, 2);
    }
    function formatUTCYear(date, fill) {
        return pad(date.getUTCFullYear() % 100, fill, 2);
    }
    function formatUTCFullYear(date, fill) {
        return pad(date.getUTCFullYear() % 10000, fill, 4);
    }
    function formatUTCZone() {
        return '+0000';
    }
    function formatLiteralPercent(date) {
        return '%';
    }
    function formatUnixTimestamp(date) {
        return date.getTime();
    }
    function formatUnixTimestampSeconds(date) {
        return Math.floor(date.getTime() / 1000);
    }
    // ------------------------------- parsers ------------------------------------
    function parseMicroseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 6));
        return n ? (d.L = Math.floor(parseFloat(n[0]) / 1000), i + n[0].length) : -1;
    }
    function parseMilliseconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.L = +n[0], i + n[0].length) : -1;
    }
    function parseSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.S = +n[0], i + n[0].length) : -1;
    }
    function parseMinutes(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.M = +n[0], i + n[0].length) : -1;
    }
    function parseHour24(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.H = +n[0], i + n[0].length) : -1;
    }
    function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseDayOfMonth(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.d = +n[0], i + n[0].length) : -1;
    }
    function parseDayOfYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 3));
        return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }
    function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseWeekdayNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.u = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.U = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberISO(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.V = +n[0], i + n[0].length) : -1;
    }
    function parseWeekNumberMonday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.W = +n[0], i + n[0].length) : -1;
    }
    function parseWeekdayNumberSunday(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 1));
        return n ? (d.w = +n[0], i + n[0].length) : -1;
    }
    function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }
    function parseMonthNumber(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.m = parseFloat(n[0]) - 1, i + n[0].length) : -1;
    }
    function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, lDateTime, string, i);
    }
    function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, lDate, string, i);
    }
    function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, lTime, string, i);
    }
    function parseUnixTimestamp(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }
    function parseUnixTimestampSeconds(d, string, i) {
        var n = numberRe.exec(string.slice(i));
        return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
    }
    function parseYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 2));
        return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }
    function parseFullYear(d, string, i) {
        var n = numberRe.exec(string.slice(i, i + 4));
        return n ? (d.y = +n[0], i + n[0].length) : -1;
    }
    function parseZone(d, string, i) {
        var n = /^(Z)|^([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
        return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || '00')), i + n[0].length) : -1;
    }
    function parseLiteralPercent(d, string, i) {
        var n = percentRe.exec(string.slice(i, i + 1));
        return n ? i + n[0].length : -1;
    }
    return {
        format: function (specifier) {
            var f = newFormat(specifier, formats);
            f.toString = function () { return specifier; };
            return f;
        },
        parse: function (specifier) {
            var p = newParse(specifier, localDate);
            p.toString = function () { return specifier; };
            return p;
        },
        utcFormat: function (specifier) {
            var f = newFormat(specifier, utcFormats);
            f.toString = function () { return specifier; };
            return f;
        },
        utcParse: function (specifier) {
            var p = newParse(specifier, utcDate);
            p.toString = function () { return specifier; };
            return p;
        }
    };
}

var locale;
setDefaultLocale({
    dateTime: '%x, %X',
    date: '%-m/%-d/%Y',
    time: '%-I:%M:%S %p',
    periods: ['AM', 'PM'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
});
function setDefaultLocale(definition) {
    return locale = formatLocale$1(definition);
}

var __extends$f = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$7 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var TimeScale = /** @class */ (function (_super) {
    __extends$f(TimeScale, _super);
    function TimeScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'time';
        _this.year = year;
        _this.month = month;
        _this.week = sunday;
        _this.day = day;
        _this.hour = hour;
        _this.minute = minute;
        _this.second = second;
        _this.millisecond = millisecond;
        _this.format = locale.format;
        /**
         * Array of default tick intervals in the following format:
         *
         *     [
         *         interval (unit of time),
         *         number of units (step),
         *         the length of that number of units in milliseconds
         *     ]
         */
        _this.tickIntervals = [
            [_this.second, 1, durationSecond],
            [_this.second, 5, 5 * durationSecond],
            [_this.second, 15, 15 * durationSecond],
            [_this.second, 30, 30 * durationSecond],
            [_this.minute, 1, durationMinute],
            [_this.minute, 5, 5 * durationMinute],
            [_this.minute, 15, 15 * durationMinute],
            [_this.minute, 30, 30 * durationMinute],
            [_this.hour, 1, durationHour],
            [_this.hour, 3, 3 * durationHour],
            [_this.hour, 6, 6 * durationHour],
            [_this.hour, 12, 12 * durationHour],
            [_this.day, 1, durationDay],
            [_this.day, 2, 2 * durationDay],
            [_this.week, 1, durationWeek],
            [_this.month, 1, durationMonth],
            [_this.month, 3, 3 * durationMonth],
            [_this.year, 1, durationYear]
        ];
        _this.formatMillisecond = _this.format('.%L');
        _this.formatSecond = _this.format(':%S');
        _this.formatMinute = _this.format('%I:%M');
        _this.formatHour = _this.format('%I %p');
        _this.formatDay = _this.format('%a %d');
        _this.formatWeek = _this.format('%b %d');
        _this.formatMonth = _this.format('%B');
        _this.formatYear = _this.format('%Y');
        _this._domain = [new Date(2000, 0, 1), new Date(2000, 0, 2)];
        return _this;
    }
    TimeScale.prototype.defaultTickFormat = function (date) {
        return (this.second.floor(date) < date
            ? this.formatMillisecond
            : this.minute.floor(date) < date
                ? this.formatSecond
                : this.hour.floor(date) < date
                    ? this.formatMinute
                    : this.day.floor(date) < date
                        ? this.formatHour
                        : this.month.floor(date) < date
                            ? (this.week.floor(date) < date ? this.formatDay : this.formatWeek)
                            : this.year.floor(date) < date
                                ? this.formatMonth
                                : this.formatYear)(date);
    };
    /**
     *
     * @param interval If the `interval` is a number, it's interpreted as the desired tick count
     * and the method tries to pick an appropriate interval automatically, based on the extent of the domain.
     * If the `interval` is `undefined`, it defaults to `10`.
     * If the `interval` is a time interval, simply use it.
     * @param start The start time (timestamp).
     * @param stop The end time (timestamp).
     * @param step Number of intervals between ticks.
     */
    TimeScale.prototype.tickInterval = function (interval, start, stop, step) {
        var _a;
        if (typeof interval === 'number') {
            var tickCount = interval;
            var tickIntervals = this.tickIntervals;
            var target = Math.abs(stop - start) / tickCount;
            var i = complexBisectRight(tickIntervals, target, function (interval) { return interval[2]; });
            if (i === tickIntervals.length) {
                step = tickStep(start / durationYear, stop / durationYear, tickCount);
                interval = this.year;
            }
            else if (i) {
                _a = __read$7(tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i], 2), interval = _a[0], step = _a[1];
            }
            else {
                step = Math.max(tickStep(start, stop, interval), 1);
                interval = this.millisecond;
            }
        }
        return step == undefined ? interval : interval.every(step);
    };
    Object.defineProperty(TimeScale.prototype, "domain", {
        get: function () {
            return _super.prototype.getDomain.call(this).map(function (t) { return new Date(t); });
        },
        set: function (values) {
            _super.prototype.setDomain.call(this, Array.prototype.map.call(values, function (t) { return t instanceof Date ? +t : +new Date(+t); }));
        },
        enumerable: true,
        configurable: true
    });
    TimeScale.prototype.invert = function (y) {
        return new Date(_super.prototype.invert.call(this, y));
    };
    /**
     * Returns uniformly-spaced dates that represent the scale's domain.
     * @param interval The desired tick count or a time interval object.
     */
    TimeScale.prototype.ticks = function (interval) {
        if (interval === void 0) { interval = 10; }
        var d = _super.prototype.getDomain.call(this);
        var t0 = d[0];
        var t1 = d[d.length - 1];
        var reverse = t1 < t0;
        if (reverse) {
            var _ = t0;
            t0 = t1;
            t1 = _;
        }
        var t = this.tickInterval(interval, t0, t1);
        var i = t ? t.range(t0, t1 + 1) : []; // inclusive stop
        return reverse ? i.reverse() : i;
    };
    /**
     * Returns a time format function suitable for displaying tick values.
     * @param count Ignored. Used only to satisfy the {@link Scale} interface.
     * @param specifier If the specifier string is provided, this method is equivalent to
     * the {@link TimeLocaleObject.format} method.
     * If no specifier is provided, this method returns the default time format function.
     */
    TimeScale.prototype.tickFormat = function (count, specifier) {
        return specifier == undefined ? this.defaultTickFormat.bind(this) : this.format(specifier);
    };
    /**
     * Extends the domain so that it starts and ends on nice round values.
     * This method typically modifies the scale’s domain, and may only extend the bounds to the nearest round value.
     * @param interval
     */
    TimeScale.prototype.nice = function (interval) {
        if (interval === void 0) { interval = 10; }
        var d = _super.prototype.getDomain.call(this);
        var i = this.tickInterval(interval, d[0], d[d.length - 1]);
        if (i) {
            this.domain = this._nice(d, i);
        }
    };
    TimeScale.prototype._nice = function (domain, interval) {
        var _a, _b;
        domain = domain.slice();
        var i0 = 0;
        var i1 = domain.length - 1;
        var x0 = domain[i0];
        var x1 = domain[i1];
        if (x1 < x0) {
            _a = __read$7([i1, i0], 2), i0 = _a[0], i1 = _a[1];
            _b = __read$7([x1, x0], 2), x0 = _b[0], x1 = _b[1];
        }
        domain[i0] = interval.floor(x0);
        domain[i1] = interval.ceil(x1);
        return domain;
    };
    return TimeScale;
}(ContinuousScale));

var __extends$g = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TimeAxis = /** @class */ (function (_super) {
    __extends$g(TimeAxis, _super);
    function TimeAxis() {
        var _this = _super.call(this, new TimeScale()) || this;
        _this.datumFormat = '%m/%d/%y, %H:%M:%S';
        _this._nice = true;
        var scale = _this.scale;
        scale.clamp = true;
        _this.scale = scale;
        _this.datumFormatter = scale.tickFormat(_this.calculatedTickCount, _this.datumFormat);
        return _this;
    }
    Object.defineProperty(TimeAxis.prototype, "nice", {
        get: function () {
            return this._nice;
        },
        set: function (value) {
            if (this._nice !== value) {
                this._nice = value;
                if (value && this.scale.nice) {
                    this.scale.nice(10);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeAxis.prototype, "domain", {
        get: function () {
            return this.scale.domain;
        },
        set: function (domain) {
            if (domain.length > 2) {
                domain = (extent(domain, isContinuous, Number) || [0, 1000]).map(function (x) { return new Date(x); });
            }
            this.scale.domain = domain;
            if (this.nice && this.scale.nice) {
                this.scale.nice(10);
            }
        },
        enumerable: true,
        configurable: true
    });
    TimeAxis.prototype.onLabelFormatChange = function (format) {
        if (format) {
            _super.prototype.onLabelFormatChange.call(this, format);
        }
        else {
            // For time axis labels to look nice, even if date format wasn't set.
            this.labelFormatter = this.scale.tickFormat(this.calculatedTickCount, undefined);
        }
    };
    TimeAxis.prototype.formatDatum = function (datum) {
        return this.datumFormatter(datum);
    };
    TimeAxis.className = 'TimeAxis';
    TimeAxis.type = 'time';
    return TimeAxis;
}(ChartAxis));

var __read$8 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$8(arguments[i]));
    return ar;
};
var Scene = /** @class */ (function () {
    // As a rule of thumb, constructors with no parameters are preferred.
    // A few exceptions are:
    // - we absolutely need to know something at construction time (document)
    // - knowing something at construction time meaningfully improves performance (width, height)
    function Scene(document, width, height) {
        var _this = this;
        if (document === void 0) { document = window.document; }
        this.id = createId(this);
        this._dirty = false;
        this.animationFrameId = 0;
        this._root = null;
        this.debug = {
            renderFrameIndex: false,
            renderBoundingBoxes: false
        };
        this._frameIndex = 0;
        this.render = function () {
            var _a;
            var _b = _this, ctx = _b.ctx, root = _b.root, pendingSize = _b.pendingSize;
            _this.animationFrameId = 0;
            if (pendingSize) {
                (_a = _this.canvas).resize.apply(_a, __spread(pendingSize));
                _this.pendingSize = undefined;
            }
            if (root && !root.visible) {
                _this.dirty = false;
                return;
            }
            // start with a blank canvas, clear previous drawing
            ctx.clearRect(0, 0, _this.width, _this.height);
            if (root) {
                ctx.save();
                if (root.visible) {
                    root.render(ctx);
                }
                ctx.restore();
            }
            _this._frameIndex++;
            if (_this.debug.renderFrameIndex) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 40, 15);
                ctx.fillStyle = 'black';
                ctx.fillText(_this.frameIndex.toString(), 2, 10);
            }
            _this.dirty = false;
        };
        this.canvas = new HdpiCanvas(document, width, height);
        this.ctx = this.canvas.context;
    }
    Object.defineProperty(Scene.prototype, "container", {
        get: function () {
            return this.canvas.container;
        },
        set: function (value) {
            this.canvas.container = value;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.download = function (fileName) {
        this.canvas.download(fileName);
    };
    Scene.prototype.getDataURL = function (type) {
        return this.canvas.getDataURL(type);
    };
    Object.defineProperty(Scene.prototype, "width", {
        get: function () {
            return this.pendingSize ? this.pendingSize[0] : this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "height", {
        get: function () {
            return this.pendingSize ? this.pendingSize[1] : this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.resize = function (width, height) {
        width = Math.round(width);
        height = Math.round(height);
        if (width === this.width && height === this.height) {
            return;
        }
        this.pendingSize = [width, height];
        this.dirty = true;
    };
    Object.defineProperty(Scene.prototype, "dirty", {
        get: function () {
            return this._dirty;
        },
        set: function (dirty) {
            if (dirty) {
                if (!this._dirty) {
                    this.animationFrameId = requestAnimationFrame(this.render);
                }
            }
            else if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = 0;
            }
            this._dirty = dirty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (node) {
            if (node === this._root) {
                return;
            }
            if (this._root) {
                this._root._setScene();
            }
            this._root = node;
            if (node) {
                // If `node` is the root node of another scene ...
                if (node.parent === null && node.scene && node.scene !== this) {
                    node.scene.root = null;
                }
                node._setScene(this);
            }
            this.dirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "frameIndex", {
        get: function () {
            return this._frameIndex;
        },
        enumerable: true,
        configurable: true
    });
    Scene.className = 'Scene';
    return Scene;
}());

var Gradient = /** @class */ (function () {
    function Gradient() {
        this.stops = [];
    }
    return Gradient;
}());

var __extends$h = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LinearGradient = /** @class */ (function (_super) {
    __extends$h(LinearGradient, _super);
    function LinearGradient() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = 0;
        return _this;
    }
    LinearGradient.prototype.createGradient = function (ctx, bbox) {
        var stops = this.stops;
        var radians = (this.angle % 360) * Math.PI / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var w = bbox.width;
        var h = bbox.height;
        var cx = bbox.x + w * 0.5;
        var cy = bbox.y + h * 0.5;
        if (w > 0 && h > 0) {
            var l = (Math.sqrt(h * h + w * w) * Math.abs(Math.cos(radians - Math.atan(h / w)))) / 2;
            var gradient_1 = ctx.createLinearGradient(cx + cos * l, cy + sin * l, cx - cos * l, cy - sin * l);
            stops.forEach(function (stop) {
                gradient_1.addColorStop(stop.offset, stop.color);
            });
            return gradient_1;
        }
        return 'black';
    };
    return LinearGradient;
}(Gradient));

var __extends$i = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (RectSizing) {
    RectSizing[RectSizing["Content"] = 0] = "Content";
    RectSizing[RectSizing["Border"] = 1] = "Border";
})(exports.RectSizing || (exports.RectSizing = {}));
var Rect = /** @class */ (function (_super) {
    __extends$i(Rect, _super);
    function Rect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._x = 0;
        _this._y = 0;
        _this._width = 10;
        _this._height = 10;
        _this._radius = 0;
        /**
         * If `true`, the rect is aligned to the pixel grid for crisp looking lines.
         * Animated rects may not look nice with this option enabled, for example
         * when a rect is translated by a sub-pixel value on each frame.
         */
        _this._crisp = false;
        _this._gradient = false;
        _this.effectiveStrokeWidth = Shape.defaultStyles.strokeWidth;
        /**
         * Similar to https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
         */
        _this._sizing = exports.RectSizing.Content;
        return _this;
    }
    Object.defineProperty(Rect.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            if (this._radius !== value) {
                this._radius = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "crisp", {
        get: function () {
            return this._crisp;
        },
        set: function (value) {
            if (this._crisp !== value) {
                this._crisp = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "gradient", {
        get: function () {
            return this._gradient;
        },
        set: function (value) {
            if (this._gradient !== value) {
                this._gradient = value;
                this.updateGradientInstance();
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.updateGradientInstance = function () {
        if (this.gradient) {
            var fill = this.fill;
            if (fill) {
                var gradient = new LinearGradient();
                gradient.angle = 270;
                gradient.stops = [{
                        offset: 0,
                        color: Color.fromString(fill).brighter().toString()
                    }, {
                        offset: 1,
                        color: Color.fromString(fill).darker().toString()
                    }];
                this.gradientInstance = gradient;
            }
        }
        else {
            this.gradientInstance = undefined;
        }
    };
    Object.defineProperty(Rect.prototype, "fill", {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            if (this._fill !== value) {
                this._fill = value;
                this.updateGradientInstance();
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                // Normally, when the `lineWidth` changes, we only need to repaint the rect
                // without updating the path. If the `isCrisp` is set to `true` however,
                // we need to update the path to make sure the new stroke aligns to
                // the pixel grid. This is the reason we override the `lineWidth` setter
                // and getter here.
                if (this.crisp || this.sizing === exports.RectSizing.Border) {
                    this.dirtyPath = true;
                }
                else {
                    this.effectiveStrokeWidth = value;
                    this.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "sizing", {
        get: function () {
            return this._sizing;
        },
        set: function (value) {
            if (this._sizing !== value) {
                this._sizing = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.updatePath = function () {
        var borderSizing = this.sizing === exports.RectSizing.Border;
        var path = this.path;
        path.clear();
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;
        var strokeWidth;
        if (borderSizing) {
            var halfWidth = width / 2;
            var halfHeight = height / 2;
            strokeWidth = Math.min(this.strokeWidth, halfWidth, halfHeight);
            x = Math.min(x + strokeWidth / 2, x + halfWidth);
            y = Math.min(y + strokeWidth / 2, y + halfHeight);
            width = Math.max(width - strokeWidth, 0);
            height = Math.max(height - strokeWidth, 0);
        }
        else {
            strokeWidth = this.strokeWidth;
        }
        this.effectiveStrokeWidth = strokeWidth;
        if (this.crisp && !borderSizing) {
            var _a = this, a = _a.alignment, al = _a.align;
            path.rect(al(a, x), al(a, y), al(a, x, width), al(a, y, height));
        }
        else {
            path.rect(x, y, width, height);
        }
    };
    Rect.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    Rect.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox.containsPoint(point.x, point.y);
    };
    Rect.prototype.isPointInStroke = function (x, y) {
        return false;
    };
    Rect.prototype.fillStroke = function (ctx) {
        if (!this.scene) {
            return;
        }
        var pixelRatio = this.scene.canvas.pixelRatio || 1;
        if (this.fill) {
            if (this.gradientInstance) {
                ctx.fillStyle = this.gradientInstance.createGradient(ctx, this.computeBBox());
            }
            else {
                ctx.fillStyle = this.fill;
            }
            ctx.globalAlpha = this.opacity * this.fillOpacity;
            // The canvas context scaling (depends on the device's pixel ratio)
            // has no effect on shadows, so we have to account for the pixel ratio
            // manually here.
            var fillShadow = this.fillShadow;
            if (fillShadow && fillShadow.enabled) {
                ctx.shadowColor = fillShadow.color;
                ctx.shadowOffsetX = fillShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = fillShadow.yOffset * pixelRatio;
                ctx.shadowBlur = fillShadow.blur * pixelRatio;
            }
            ctx.fill();
        }
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        if (this.stroke && this.effectiveStrokeWidth) {
            ctx.strokeStyle = this.stroke;
            ctx.globalAlpha = this.opacity * this.strokeOpacity;
            ctx.lineWidth = this.effectiveStrokeWidth;
            if (this.lineDash) {
                ctx.setLineDash(this.lineDash);
            }
            if (this.lineDashOffset) {
                ctx.lineDashOffset = this.lineDashOffset;
            }
            if (this.lineCap) {
                ctx.lineCap = this.lineCap;
            }
            if (this.lineJoin) {
                ctx.lineJoin = this.lineJoin;
            }
            var strokeShadow = this.strokeShadow;
            if (strokeShadow && strokeShadow.enabled) {
                ctx.shadowColor = strokeShadow.color;
                ctx.shadowOffsetX = strokeShadow.xOffset * pixelRatio;
                ctx.shadowOffsetY = strokeShadow.yOffset * pixelRatio;
                ctx.shadowBlur = strokeShadow.blur * pixelRatio;
            }
            ctx.stroke();
        }
    };
    Rect.className = 'Rect';
    return Rect;
}(Path));

var __extends$j = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Marker = /** @class */ (function (_super) {
    __extends$j(Marker, _super);
    function Marker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._x = 0;
        _this._y = 0;
        _this._size = 12;
        return _this;
    }
    Object.defineProperty(Marker.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            if (this._size !== value) {
                this._size = Math.abs(value);
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Marker.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, size = _a.size;
        var half = size / 2;
        return new BBox(x - half, y - half, size, size);
    };
    return Marker;
}(Path));

var __extends$k = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Square = /** @class */ (function (_super) {
    __extends$k(Square, _super);
    function Square() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Square.prototype.updatePath = function () {
        var _a = this, path = _a.path, x = _a.x, y = _a.y;
        var hs = this.size / 2;
        var _b = this, a = _b.alignment, al = _b.align;
        path.clear();
        path.moveTo(al(a, x - hs), al(a, y - hs));
        path.lineTo(al(a, x + hs), al(a, y - hs));
        path.lineTo(al(a, x + hs), al(a, y + hs));
        path.lineTo(al(a, x - hs), al(a, y + hs));
        path.closePath();
    };
    Square.className = 'Square';
    return Square;
}(Marker));

var __extends$l = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MarkerLabel = /** @class */ (function (_super) {
    __extends$l(MarkerLabel, _super);
    function MarkerLabel() {
        var _this = _super.call(this) || this;
        _this.label = new Text();
        _this._marker = new Square();
        _this._markerSize = 15;
        _this._spacing = 8;
        var label = _this.label;
        label.textBaseline = 'middle';
        label.fontSize = 12;
        label.fontFamily = 'Verdana, sans-serif';
        label.fill = 'black';
        // For better looking vertical alignment of labels to markers.
        label.y = HdpiCanvas.has.textMetrics ? 1 : 0;
        _this.append([_this.marker, label]);
        _this.update();
        return _this;
    }
    Object.defineProperty(MarkerLabel.prototype, "text", {
        get: function () {
            return this.label.text;
        },
        set: function (value) {
            this.label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontStyle", {
        get: function () {
            return this.label.fontStyle;
        },
        set: function (value) {
            this.label.fontStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontWeight", {
        get: function () {
            return this.label.fontWeight;
        },
        set: function (value) {
            this.label.fontWeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontSize", {
        get: function () {
            return this.label.fontSize;
        },
        set: function (value) {
            this.label.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "fontFamily", {
        get: function () {
            return this.label.fontFamily;
        },
        set: function (value) {
            this.label.fontFamily = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "color", {
        get: function () {
            return this.label.fill;
        },
        set: function (value) {
            this.label.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "marker", {
        get: function () {
            return this._marker;
        },
        set: function (value) {
            if (this._marker !== value) {
                this.removeChild(this._marker);
                this._marker = value;
                this.appendChild(value);
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerSize", {
        get: function () {
            return this._markerSize;
        },
        set: function (value) {
            if (this._markerSize !== value) {
                this._markerSize = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFill", {
        get: function () {
            return this.marker.fill;
        },
        set: function (value) {
            this.marker.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStroke", {
        get: function () {
            return this.marker.stroke;
        },
        set: function (value) {
            this.marker.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeWidth", {
        get: function () {
            return this.marker.strokeWidth;
        },
        set: function (value) {
            this.marker.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerFillOpacity", {
        get: function () {
            return this.marker.fillOpacity;
        },
        set: function (value) {
            this.marker.fillOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "markerStrokeOpacity", {
        get: function () {
            return this.marker.strokeOpacity;
        },
        set: function (value) {
            this.marker.strokeOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "opacity", {
        get: function () {
            return this.marker.opacity;
        },
        set: function (value) {
            this.marker.opacity = value;
            this.label.opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerLabel.prototype, "spacing", {
        get: function () {
            return this._spacing;
        },
        set: function (value) {
            if (this._spacing !== value) {
                this._spacing = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkerLabel.prototype.update = function () {
        var marker = this.marker;
        var markerSize = this.markerSize;
        marker.size = markerSize;
        this.label.x = markerSize / 2 + this.spacing;
    };
    MarkerLabel.className = 'MarkerLabel';
    return MarkerLabel;
}(Group));

var __extends$m = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Circle = /** @class */ (function (_super) {
    __extends$m(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y, path = _a.path, size = _a.size;
        var r = size / 2;
        path.clear();
        path.cubicArc(x, y, r, r, 0, 0, Math.PI * 2, 0);
        path.closePath();
    };
    Circle.className = 'Circle';
    return Circle;
}(Marker));

var __extends$n = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Cross = /** @class */ (function (_super) {
    __extends$n(Cross, _super);
    function Cross() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cross.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y;
        var _b = this, path = _b.path, size = _b.size;
        var s = size / 4.2;
        path.clear();
        path.moveTo(x -= s, y);
        path.lineTo(x -= s, y -= s);
        path.lineTo(x += s, y -= s);
        path.lineTo(x += s, y += s);
        path.lineTo(x += s, y -= s);
        path.lineTo(x += s, y += s);
        path.lineTo(x -= s, y += s);
        path.lineTo(x += s, y += s);
        path.lineTo(x -= s, y += s);
        path.lineTo(x -= s, y -= s);
        path.lineTo(x -= s, y += s);
        path.lineTo(x -= s, y -= s);
        path.closePath();
    };
    Cross.className = 'Cross';
    return Cross;
}(Marker));

var __extends$o = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Diamond = /** @class */ (function (_super) {
    __extends$o(Diamond, _super);
    function Diamond() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Diamond.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y;
        var _b = this, path = _b.path, size = _b.size;
        var s = size / 2;
        path.clear();
        path.moveTo(x, y -= s);
        path.lineTo(x += s, y += s);
        path.lineTo(x -= s, y += s);
        path.lineTo(x -= s, y -= s);
        path.lineTo(x += s, y -= s);
        path.closePath();
    };
    Diamond.className = 'Diamond';
    return Diamond;
}(Marker));

var __extends$p = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Heart = /** @class */ (function (_super) {
    __extends$p(Heart, _super);
    function Heart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heart.prototype.rad = function (degree) {
        return degree / 180 * Math.PI;
    };
    Heart.prototype.updatePath = function () {
        var _a = this, x = _a.x, path = _a.path, size = _a.size, rad = _a.rad;
        var r = size / 4;
        var y = this.y + r / 2;
        path.clear();
        path.cubicArc(x - r, y - r, r, r, 0, rad(130), rad(330), 0);
        path.cubicArc(x + r, y - r, r, r, 0, rad(220), rad(50), 0);
        path.lineTo(x, y + r);
        path.closePath();
    };
    Heart.className = 'Heart';
    return Heart;
}(Marker));

var __extends$q = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Plus = /** @class */ (function (_super) {
    __extends$q(Plus, _super);
    function Plus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Plus.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y;
        var _b = this, path = _b.path, size = _b.size;
        var s = size / 3;
        var hs = s / 2;
        path.clear();
        path.moveTo(x -= hs, y -= hs);
        path.lineTo(x, y -= s);
        path.lineTo(x += s, y);
        path.lineTo(x, y += s);
        path.lineTo(x += s, y);
        path.lineTo(x, y += s);
        path.lineTo(x -= s, y);
        path.lineTo(x, y += s);
        path.lineTo(x -= s, y);
        path.lineTo(x, y -= s);
        path.lineTo(x -= s, y);
        path.lineTo(x, y -= s);
        path.closePath();
    };
    Plus.className = 'Plus';
    return Plus;
}(Marker));

var __extends$r = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Triangle = /** @class */ (function (_super) {
    __extends$r(Triangle, _super);
    function Triangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Triangle.prototype.updatePath = function () {
        var _a = this, x = _a.x, y = _a.y;
        var _b = this, path = _b.path, size = _b.size;
        var s = size * 1.1;
        path.clear();
        path.moveTo(x, y -= s * 0.48);
        path.lineTo(x += s * 0.5, y += s * 0.87);
        path.lineTo(x -= s, y);
        path.closePath();
    };
    Triangle.className = 'Triangle';
    return Triangle;
}(Marker));

// This function is in its own file because putting it into SeriesMarker makes the Legend
// suddenly aware of the series (it's an agnostic component), and putting it into Marker
// introduces circular dependencies.
function getMarker(shape) {
    if (shape === void 0) { shape = Square; }
    if (typeof shape === 'string') {
        switch (shape) {
            case 'circle':
                return Circle;
            case 'cross':
                return Cross;
            case 'diamond':
                return Diamond;
            case 'heart':
                return Heart;
            case 'plus':
                return Plus;
            case 'triangle':
                return Triangle;
            default:
                return Square;
        }
    }
    if (typeof shape === 'function') {
        return shape;
    }
    return Square;
}

var __extends$s = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (LegendOrientation) {
    LegendOrientation[LegendOrientation["Vertical"] = 0] = "Vertical";
    LegendOrientation[LegendOrientation["Horizontal"] = 1] = "Horizontal";
})(exports.LegendOrientation || (exports.LegendOrientation = {}));
(function (LegendPosition) {
    LegendPosition["Top"] = "top";
    LegendPosition["Right"] = "right";
    LegendPosition["Bottom"] = "bottom";
    LegendPosition["Left"] = "left";
})(exports.LegendPosition || (exports.LegendPosition = {}));
var LegendLabel = /** @class */ (function (_super) {
    __extends$s(LegendLabel, _super);
    function LegendLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = 'black';
        _this.fontSize = 12;
        _this.fontFamily = 'Verdana, sans-serif';
        return _this;
    }
    __decorate$2([
        reactive('change')
    ], LegendLabel.prototype, "color", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendLabel.prototype, "fontStyle", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendLabel.prototype, "fontWeight", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendLabel.prototype, "fontSize", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendLabel.prototype, "fontFamily", void 0);
    __decorate$2([
        reactive()
    ], LegendLabel.prototype, "formatter", void 0);
    return LegendLabel;
}(Observable));
var LegendMarker = /** @class */ (function (_super) {
    __extends$s(LegendMarker, _super);
    function LegendMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.size = 15;
        /**
         * Padding between the marker and the label within each legend item.
         */
        _this.padding = 8;
        _this.strokeWidth = 1;
        return _this;
    }
    __decorate$2([
        reactive('layoutChange')
    ], LegendMarker.prototype, "size", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendMarker.prototype, "shape", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendMarker.prototype, "padding", void 0);
    __decorate$2([
        reactive('change')
    ], LegendMarker.prototype, "strokeWidth", void 0);
    return LegendMarker;
}(Observable));
var LegendItem = /** @class */ (function (_super) {
    __extends$s(LegendItem, _super);
    function LegendItem() {
        var _this = _super.call(this) || this;
        _this.marker = new LegendMarker();
        _this.label = new LegendLabel();
        /**
         * The legend uses grid layout for its items, occupying as few columns as possible when positioned to left or right,
         * and as few rows as possible when positioned to top or bottom. This config specifies the amount of horizontal
         * padding between legend items.
         */
        _this.paddingX = 16;
        /**
         * The legend uses grid layout for its items, occupying as few columns as possible when positioned to left or right,
         * and as few rows as possible when positioned to top or bottom. This config specifies the amount of vertical
         * padding between legend items.
         */
        _this.paddingY = 8;
        var changeListener = function () { return _this.fireEvent({ type: 'change' }); };
        _this.marker.addEventListener('change', changeListener);
        _this.label.addEventListener('change', changeListener);
        var layoutChangeListener = function () { return _this.fireEvent({ type: 'layoutChange' }); };
        _this.marker.addEventListener('layoutChange', layoutChangeListener);
        _this.label.addEventListener('layoutChange', layoutChangeListener);
        return _this;
    }
    __decorate$2([
        reactive('layoutChange')
    ], LegendItem.prototype, "paddingX", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], LegendItem.prototype, "paddingY", void 0);
    return LegendItem;
}(Observable));
var Legend = /** @class */ (function (_super) {
    __extends$s(Legend, _super);
    function Legend() {
        var _this = _super.call(this) || this;
        _this.id = createId(_this);
        _this.group = new Group();
        _this.itemSelection = Selection.select(_this.group).selectAll();
        _this.oldSize = [0, 0];
        _this.item = new LegendItem();
        _this.data = [];
        _this.enabled = true;
        _this.orientation = exports.LegendOrientation.Vertical;
        _this.position = exports.LegendPosition.Right;
        /**
         * Spacing between the legend and the edge of the chart's element.
         */
        _this.spacing = 20;
        _this._size = [0, 0];
        _this.addPropertyListener('data', _this.onDataChange);
        _this.addPropertyListener('enabled', _this.onEnabledChange);
        _this.addPropertyListener('position', _this.onPositionChange);
        _this.item.marker.addPropertyListener('shape', _this.onMarkerShapeChange, _this);
        _this.addEventListener('change', _this.update);
        _this.item.addEventListener('change', function () { return _this.fireEvent({ type: 'change' }); });
        _this.item.addEventListener('layoutChange', function () { return _this.fireEvent({ type: 'layoutChange' }); });
        return _this;
    }
    Object.defineProperty(Legend.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Legend.prototype.onDataChange = function (event) {
        this.group.visible = event.value.length > 0 && this.enabled;
    };
    Legend.prototype.onEnabledChange = function (event) {
        this.group.visible = event.value && this.data.length > 0;
    };
    Legend.prototype.onPositionChange = function (event) {
        switch (event.value) {
            case 'right':
            case 'left':
                this.orientation = exports.LegendOrientation.Vertical;
                break;
            case 'bottom':
            case 'top':
                this.orientation = exports.LegendOrientation.Horizontal;
                break;
        }
    };
    Legend.prototype.onMarkerShapeChange = function () {
        this.itemSelection = this.itemSelection.setData([]);
        this.itemSelection.exit.remove();
        if (this.group.scene) {
            this.group.scene.dirty = false;
        }
    };
    /**
     * The method is given the desired size of the legend, which only serves as a hint.
     * The vertically oriented legend will take as much horizontal space as needed, but will
     * respect the height constraints, and the horizontal legend will take as much vertical
     * space as needed in an attempt not to exceed the given width.
     * After the layout is done, the {@link size} will contain the actual size of the legend.
     * If the actual size is not the same as the previous actual size, the legend will fire
     * the 'layoutChange' event to communicate that another layout is needed, and the above
     * process should be repeated.
     * @param width
     * @param height
     */
    Legend.prototype.performLayout = function (width, height) {
        var item = this.item;
        var marker = item.marker, paddingX = item.paddingX, paddingY = item.paddingY;
        var updateSelection = this.itemSelection.setData(this.data, function (_, datum) {
            var MarkerShape = getMarker(marker.shape || datum.marker.shape);
            return datum.id + '-' + datum.itemId + '-' + MarkerShape.name;
        });
        updateSelection.exit.remove();
        var enterSelection = updateSelection.enter.append(MarkerLabel).each(function (node, datum) {
            var MarkerShape = getMarker(marker.shape || datum.marker.shape);
            node.marker = new MarkerShape();
        });
        var itemSelection = this.itemSelection = updateSelection.merge(enterSelection);
        var itemCount = itemSelection.size;
        // Update properties that affect the size of the legend items and measure them.
        var bboxes = [];
        var itemMarker = this.item.marker;
        var itemLabel = this.item.label;
        var maxCharCount = 25;
        var ellipsis = "...";
        itemSelection.each(function (markerLabel, datum) {
            // TODO: measure only when one of these properties or data change (in a separate routine)
            markerLabel.markerSize = itemMarker.size;
            markerLabel.spacing = itemMarker.padding;
            markerLabel.fontStyle = itemLabel.fontStyle;
            markerLabel.fontWeight = itemLabel.fontWeight;
            markerLabel.fontSize = itemLabel.fontSize;
            markerLabel.fontFamily = itemLabel.fontFamily;
            var text = datum.label.text;
            if (text.length > maxCharCount) {
                text = "" + text.substring(0, maxCharCount - ellipsis.length) + ellipsis;
            }
            markerLabel.text = text;
            bboxes.push(markerLabel.computeBBox());
        });
        var itemHeight = bboxes.length && bboxes[0].height;
        var rowCount = 0;
        var columnWidth = 0;
        var paddedItemsWidth = 0;
        var paddedItemsHeight = 0;
        width = Math.max(1, width);
        height = Math.max(1, height);
        switch (this.orientation) {
            case exports.LegendOrientation.Horizontal:
                if (!(isFinite(width) && width > 0)) {
                    return false;
                }
                rowCount = 0;
                var columnCount = 0;
                // Split legend items into columns until the width is suitable.
                do {
                    var itemsWidth = 0;
                    columnCount = 0;
                    columnWidth = 0;
                    rowCount++;
                    var i = 0;
                    while (i < itemCount) {
                        var bbox = bboxes[i];
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        i++;
                        if (i % rowCount === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount++;
                        }
                    }
                    if (i % rowCount !== 0) {
                        itemsWidth += columnWidth;
                        columnCount++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount - 1) * paddingX;
                } while (paddedItemsWidth > width && columnCount > 1);
                paddedItemsHeight = itemHeight * rowCount + (rowCount - 1) * paddingY;
                break;
            case exports.LegendOrientation.Vertical:
                if (!(isFinite(height) && height > 0)) {
                    return false;
                }
                rowCount = itemCount * 2;
                // Split legend items into columns until the height is suitable.
                do {
                    rowCount = (rowCount >> 1) + (rowCount % 2);
                    columnWidth = 0;
                    var itemsWidth = 0;
                    var itemsHeight = 0;
                    var columnCount_1 = 0;
                    var i = 0;
                    while (i < itemCount) {
                        var bbox = bboxes[i];
                        if (!columnCount_1) {
                            itemsHeight += bbox.height;
                        }
                        if (bbox.width > columnWidth) {
                            columnWidth = bbox.width;
                        }
                        i++;
                        if (i % rowCount === 0) {
                            itemsWidth += columnWidth;
                            columnWidth = 0;
                            columnCount_1++;
                        }
                    }
                    if (i % rowCount !== 0) {
                        itemsWidth += columnWidth;
                        columnCount_1++;
                    }
                    paddedItemsWidth = itemsWidth + (columnCount_1 - 1) * paddingX;
                    paddedItemsHeight = itemsHeight + (rowCount - 1) * paddingY;
                } while (paddedItemsHeight > height && rowCount > 1);
                break;
        }
        // Top-left corner of the first legend item.
        var startX = (width - paddedItemsWidth) / 2;
        var startY = (height - paddedItemsHeight) / 2;
        var x = 0;
        var y = 0;
        columnWidth = 0;
        // Position legend items using the layout computed above.
        itemSelection.each(function (markerLabel, datum, i) {
            // Round off for pixel grid alignment to work properly.
            markerLabel.translationX = Math.floor(startX + x);
            markerLabel.translationY = Math.floor(startY + y);
            var bbox = bboxes[i];
            if (bbox.width > columnWidth) {
                columnWidth = bbox.width;
            }
            if ((i + 1) % rowCount === 0) {
                x += columnWidth + paddingX;
                y = 0;
                columnWidth = 0;
            }
            else {
                y += bbox.height + paddingY;
            }
        });
        // Update legend item properties that don't affect the layout.
        this.update();
        var size = this._size;
        var oldSize = this.oldSize;
        size[0] = paddedItemsWidth;
        size[1] = paddedItemsHeight;
        if (size[0] !== oldSize[0] || size[1] !== oldSize[1]) {
            oldSize[0] = size[0];
            oldSize[1] = size[1];
        }
    };
    Legend.prototype.update = function () {
        var _this = this;
        this.itemSelection.each(function (markerLabel, datum) {
            var marker = datum.marker;
            markerLabel.markerFill = marker.fill;
            markerLabel.markerStroke = marker.stroke;
            markerLabel.markerStrokeWidth = _this.item.marker.strokeWidth;
            markerLabel.markerFillOpacity = marker.fillOpacity;
            markerLabel.markerStrokeOpacity = marker.strokeOpacity;
            markerLabel.opacity = datum.enabled ? 1 : 0.5;
            markerLabel.color = _this.item.label.color;
        });
    };
    Legend.prototype.getDatumForPoint = function (x, y) {
        var node = this.group.pickNode(x, y);
        if (node && node.parent) {
            return node.parent.datum;
        }
    };
    Legend.className = 'Legend';
    __decorate$2([
        reactive('layoutChange')
    ], Legend.prototype, "data", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], Legend.prototype, "enabled", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], Legend.prototype, "orientation", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], Legend.prototype, "position", void 0);
    __decorate$2([
        reactive('layoutChange')
    ], Legend.prototype, "spacing", void 0);
    return Legend;
}(Observable));

var __values$2 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var SizeMonitor = /** @class */ (function () {
    function SizeMonitor() {
    }
    SizeMonitor.init = function () {
        var _this = this;
        var NativeResizeObserver = window.ResizeObserver;
        if (NativeResizeObserver) {
            this.resizeObserver = new NativeResizeObserver(function (entries) {
                var e_1, _a;
                try {
                    for (var entries_1 = __values$2(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        var entry = entries_1_1.value;
                        var _b = entry.contentRect, width = _b.width, height = _b.height;
                        _this.checkSize(_this.elements.get(entry.target), entry.target, width, height);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        else { // polyfill (more reliable even in browsers that support ResizeObserver)
            var step = function () {
                _this.elements.forEach(function (entry, element) {
                    _this.checkClientSize(element, entry);
                });
            };
            window.setInterval(step, 100);
        }
        this.ready = true;
    };
    SizeMonitor.checkSize = function (entry, element, width, height) {
        if (entry) {
            if (!entry.size || width !== entry.size.width || height !== entry.size.height) {
                entry.size = { width: width, height: height };
                entry.cb(entry.size, element);
            }
        }
    };
    // Only a single callback is supported.
    SizeMonitor.observe = function (element, cb) {
        if (!this.ready) {
            this.init();
        }
        this.unobserve(element);
        if (this.resizeObserver) {
            this.resizeObserver.observe(element);
        }
        this.elements.set(element, { cb: cb });
        // Ensure first size callback happens synchronously.
        this.checkClientSize(element, { cb: cb });
    };
    SizeMonitor.unobserve = function (element) {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(element);
        }
        this.elements.delete(element);
    };
    SizeMonitor.checkClientSize = function (element, entry) {
        var width = element.clientWidth ? element.clientWidth : 0;
        var height = element.clientHeight ? element.clientHeight : 0;
        this.checkSize(entry, element, width, height);
    };
    SizeMonitor.elements = new Map();
    SizeMonitor.ready = false;
    return SizeMonitor;
}());

function circleRectOverlap(cx, cy, r, x, y, w, h) {
    // Find closest horizontal and vertical edges.
    var edgeX = cx < x ? x : cx > x + w ? x + w : cx;
    var edgeY = cy < y ? y : cy > y + h ? y + h : cy;
    // Find distance to closest edges.
    var dx = cx - edgeX;
    var dy = cy - edgeY;
    var d = Math.sqrt((dx * dx) + (dy * dy));
    return d <= r;
}
function rectRectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    var xOverlap = (x1 + w1) > x2 && x1 < (x2 + w2);
    var yOverlap = (y1 + h1) > y2 && y1 < (y2 + h2);
    return xOverlap && yOverlap;
}
function rectContainsRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    return (r2x + r2w) < (r1x + r1w) && (r2x) > (r1x) && (r2y) > (r1y) && (r2y + r2h) < (r1y + r1h);
}
/**
 * @param data Points and labels for one or more series. The order of series determines label placement precedence.
 * @param bounds Bounds to fit the labels into. If a label can't be fully contained, it doesn't fit.
 * @returns Placed labels for the given series (in the given order).
 */
function placeLabels(data, bounds, padding) {
    if (padding === void 0) { padding = 5; }
    var result = [];
    data = data.map(function (d) { return d.slice().sort(function (a, b) { return b.size - a.size; }); });
    for (var j = 0; j < data.length; j++) {
        var labels = result[j] = [];
        var datum = data[j];
        if (!(datum && datum.length && datum[0].label)) {
            continue;
        }
        var _loop_1 = function (i, ln) {
            var d = datum[i];
            var l = d.label;
            var r = d.size * 0.5;
            var x = d.point.x - l.width * 0.5;
            var y = d.point.y - r - l.height - padding;
            var width = l.width, height = l.height;
            var withinBounds = !bounds || rectContainsRect(bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
            if (!withinBounds) {
                return "continue";
            }
            var overlapPoints = data.some(function (datum) { return datum.some(function (d) { return circleRectOverlap(d.point.x, d.point.y, d.size * 0.5, x, y, width, height); }); });
            if (overlapPoints) {
                return "continue";
            }
            var overlapLabels = result.some(function (labels) { return labels.some(function (l) { return rectRectOverlap(l.x, l.y, l.width, l.height, x, y, width, height); }); });
            if (overlapLabels) {
                return "continue";
            }
            labels.push({
                index: i,
                text: l.text,
                x: x,
                y: y,
                width: width,
                height: height
            });
        };
        for (var i = 0, ln = datum.length; i < ln; i++) {
            _loop_1(i, ln);
        }
    }
    return result;
}

var __extends$t = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$3 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var defaultTooltipCss = "\n.ag-chart-tooltip {\n    display: table;\n    position: absolute;\n    user-select: none;\n    pointer-events: none;\n    white-space: nowrap;\n    z-index: 99999;\n    font: 12px Verdana, sans-serif;\n    color: black;\n    background: rgb(244, 244, 244);\n    border-radius: 5px;\n    box-shadow: 0 0 1px rgba(3, 3, 3, 0.7), 0.5vh 0.5vh 1vh rgba(3, 3, 3, 0.25);\n}\n\n.ag-chart-tooltip-hidden {\n    top: -10000px !important;\n}\n\n.ag-chart-tooltip-title {\n    font-weight: bold;\n    padding: 7px;\n    border-top-left-radius: 5px;\n    border-top-right-radius: 5px;\n    color: white;\n    background-color: #888888;\n    border-top-left-radius: 5px;\n    border-top-right-radius: 5px;\n}\n\n.ag-chart-tooltip-content {\n    padding: 7px;\n    line-height: 1.7em;\n    border-bottom-left-radius: 5px;\n    border-bottom-right-radius: 5px;\n    overflow: hidden;\n}\n\n.ag-chart-tooltip-content:empty {\n    padding: 0;\n    height: 7px;\n}\n\n.ag-chart-tooltip-arrow::before {\n    content: \"\";\n\n    position: absolute;\n    top: 100%;\n    left: 50%;\n    transform: translateX(-50%);\n\n    border: 6px solid #989898;\n\n    border-left-color: transparent;\n    border-right-color: transparent;\n    border-top-color: #989898;\n    border-bottom-color: transparent;\n\n    width: 0;\n    height: 0;\n\n    margin: 0 auto;\n}\n\n.ag-chart-tooltip-arrow::after {\n    content: \"\";\n\n    position: absolute;\n    top: 100%;\n    left: 50%;\n    transform: translateX(-50%);\n\n    border: 5px solid black;\n\n    border-left-color: transparent;\n    border-right-color: transparent;\n    border-top-color: rgb(244, 244, 244);\n    border-bottom-color: transparent;\n\n    width: 0;\n    height: 0;\n\n    margin: 0 auto;\n}\n\n.ag-chart-wrapper {\n    box-sizing: border-box;\n    overflow: hidden;\n}\n";
function toTooltipHtml(input, defaults) {
    if (typeof input === 'string') {
        return input;
    }
    defaults = defaults || {};
    var _a = input.content, content = _a === void 0 ? defaults.content || '' : _a, _b = input.title, title = _b === void 0 ? defaults.title || undefined : _b, _c = input.color, color = _c === void 0 ? defaults.color || 'white' : _c, _d = input.backgroundColor, backgroundColor = _d === void 0 ? defaults.backgroundColor || '#888' : _d;
    var titleHtml = title ? "<div class=\"" + Chart.defaultTooltipClass + "-title\"\n        style=\"color: " + color + "; background-color: " + backgroundColor + "\">" + title + "</div>" : '';
    return titleHtml + "<div class=\"" + Chart.defaultTooltipClass + "-content\">" + content + "</div>";
}
var ChartTooltip = /** @class */ (function (_super) {
    __extends$t(ChartTooltip, _super);
    function ChartTooltip(chart, document) {
        var _this = _super.call(this) || this;
        _this.enabled = true;
        _this.class = Chart.defaultTooltipClass;
        _this.delay = 0;
        /**
         * If `true`, the tooltip will be shown for the marker closest to the mouse cursor.
         * Only has effect on series with markers.
         */
        _this.tracking = true;
        _this.showTimeout = 0;
        _this.constrained = false;
        _this.chart = chart;
        _this.class = '';
        var tooltipRoot = document.body;
        var element = document.createElement('div');
        _this.element = tooltipRoot.appendChild(element);
        // Detect when the chart becomes invisible and hide the tooltip as well.
        if (window.IntersectionObserver) {
            var target_1 = _this.chart.scene.canvas.element;
            var observer = new IntersectionObserver(function (entries) {
                var e_1, _a;
                try {
                    for (var entries_1 = __values$3(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        var entry = entries_1_1.value;
                        if (entry.target === target_1 && entry.intersectionRatio === 0) {
                            _this.toggle(false);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }, { root: tooltipRoot });
            observer.observe(target_1);
            _this.observer = observer;
        }
        return _this;
    }
    ChartTooltip.prototype.destroy = function () {
        var parentNode = this.element.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.element);
        }
        if (this.observer) {
            this.observer.unobserve(this.chart.scene.canvas.element);
        }
    };
    ChartTooltip.prototype.isVisible = function () {
        var element = this.element;
        if (element.classList) { // if not IE11
            return !element.classList.contains(Chart.defaultTooltipClass + '-hidden');
        }
        // IE11 part.
        var classes = element.getAttribute('class');
        if (classes) {
            return classes.split(' ').indexOf(Chart.defaultTooltipClass + '-hidden') < 0;
        }
        return false;
    };
    ChartTooltip.prototype.updateClass = function (visible, constrained) {
        var classList = [Chart.defaultTooltipClass, this.class];
        if (visible !== true) {
            classList.push(Chart.defaultTooltipClass + "-hidden");
        }
        if (constrained !== true) {
            classList.push(Chart.defaultTooltipClass + "-arrow");
        }
        this.element.setAttribute('class', classList.join(' '));
    };
    /**
     * Shows tooltip at the given event's coordinates.
     * If the `html` parameter is missing, moves the existing tooltip to the new position.
     */
    ChartTooltip.prototype.show = function (meta, html, instantly) {
        var _this = this;
        if (instantly === void 0) { instantly = false; }
        var el = this.element;
        if (html !== undefined) {
            el.innerHTML = html;
        }
        else if (!el.innerHTML) {
            return;
        }
        var left = meta.pageX - el.clientWidth / 2;
        var top = meta.pageY - el.clientHeight - 8;
        this.constrained = false;
        if (this.chart.container) {
            var tooltipRect = el.getBoundingClientRect();
            var minLeft = 0;
            var maxLeft = window.innerWidth - tooltipRect.width - 1;
            if (left < minLeft) {
                left = minLeft;
                this.updateClass(true, this.constrained = true);
            }
            else if (left > maxLeft) {
                left = maxLeft;
                this.updateClass(true, this.constrained = true);
            }
            if (top < window.pageYOffset) {
                top = meta.pageY + 20;
                this.updateClass(true, this.constrained = true);
            }
        }
        el.style.left = Math.round(left) + "px";
        el.style.top = Math.round(top) + "px";
        if (this.delay > 0 && !instantly) {
            this.toggle(false);
            this.showTimeout = window.setTimeout(function () {
                _this.toggle(true);
            }, this.delay);
            return;
        }
        this.toggle(true);
    };
    ChartTooltip.prototype.toggle = function (visible) {
        if (!visible) {
            window.clearTimeout(this.showTimeout);
            if (this.chart.lastPick && !this.delay) {
                this.chart.dehighlightDatum();
                this.chart.lastPick = undefined;
            }
        }
        this.updateClass(visible, this.constrained);
    };
    __decorate$3([
        reactive()
    ], ChartTooltip.prototype, "enabled", void 0);
    __decorate$3([
        reactive()
    ], ChartTooltip.prototype, "class", void 0);
    __decorate$3([
        reactive()
    ], ChartTooltip.prototype, "delay", void 0);
    __decorate$3([
        reactive()
    ], ChartTooltip.prototype, "tracking", void 0);
    return ChartTooltip;
}(Observable));
var Chart = /** @class */ (function (_super) {
    __extends$t(Chart, _super);
    function Chart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this) || this;
        _this.id = createId(_this);
        _this.background = new Rect();
        _this.legend = new Legend();
        _this.legendAutoPadding = new Padding();
        _this.captionAutoPadding = 0; // top padding only
        _this._container = undefined;
        _this._data = [];
        _this._autoSize = false;
        _this.padding = new Padding(20);
        _this._axes = [];
        _this._series = [];
        _this._axesChanged = false;
        _this._seriesChanged = false;
        _this.layoutCallbackId = 0;
        _this._performLayout = function () {
            _this.layoutCallbackId = 0;
            _this.background.width = _this.width;
            _this.background.height = _this.height;
            _this.performLayout();
            if (!_this.layoutPending) {
                _this.fireEvent({ type: 'layoutDone' });
            }
        };
        _this.dataCallbackId = 0;
        _this.nodeData = new Map();
        _this.updateCallbackId = 0;
        _this.legendBBox = new BBox(0, 0, 0, 0);
        _this._onMouseDown = _this.onMouseDown.bind(_this);
        _this._onMouseMove = _this.onMouseMove.bind(_this);
        _this._onMouseUp = _this.onMouseUp.bind(_this);
        _this._onMouseOut = _this.onMouseOut.bind(_this);
        _this._onClick = _this.onClick.bind(_this);
        _this.pointerInsideLegend = false;
        _this.pointerOverLegendDatum = false;
        var root = new Group();
        var background = _this.background;
        background.fill = 'white';
        root.appendChild(background);
        var element = _this._element = document.createElement('div');
        element.setAttribute('class', 'ag-chart-wrapper');
        var scene = new Scene(document);
        _this.scene = scene;
        _this.autoSize = true; // Triggers width/height calc - needs to happen before root group assignment.
        scene.root = root;
        scene.container = element;
        _this.padding.addEventListener('layoutChange', _this.scheduleLayout, _this);
        var legend = _this.legend;
        legend.addEventListener('layoutChange', _this.scheduleLayout, _this);
        legend.item.label.addPropertyListener('formatter', _this.updateLegend, _this);
        legend.addPropertyListener('position', _this.onLegendPositionChange, _this);
        _this.tooltip = new ChartTooltip(_this, document);
        _this.tooltip.addPropertyListener('class', function () { return _this.tooltip.toggle(); });
        if (Chart.tooltipDocuments.indexOf(document) < 0) {
            var styleElement = document.createElement('style');
            styleElement.innerHTML = defaultTooltipCss;
            // Make sure the default tooltip style goes before other styles so it can be overridden.
            document.head.insertBefore(styleElement, document.head.querySelector('style'));
            Chart.tooltipDocuments.push(document);
        }
        _this.setupDomListeners(scene.canvas.element);
        _this.addPropertyListener('title', _this.onCaptionChange);
        _this.addPropertyListener('subtitle', _this.onCaptionChange);
        _this.addEventListener('layoutChange', _this.scheduleLayout);
        return _this;
    }
    Object.defineProperty(Chart.prototype, "container", {
        get: function () {
            return this._container;
        },
        set: function (value) {
            if (this._container !== value) {
                var parentNode = this.element.parentNode;
                if (parentNode != null) {
                    parentNode.removeChild(this.element);
                }
                if (value) {
                    value.appendChild(this.element);
                }
                this._container = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
            this.series.forEach(function (series) { return series.data = data; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "width", {
        get: function () {
            return this.scene.width;
        },
        set: function (value) {
            this.autoSize = false;
            if (this.width !== value) {
                this.scene.resize(value, this.height);
                this.fireEvent({ type: 'layoutChange' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "height", {
        get: function () {
            return this.scene.height;
        },
        set: function (value) {
            this.autoSize = false;
            if (this.height !== value) {
                this.scene.resize(this.width, value);
                this.fireEvent({ type: 'layoutChange' });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "autoSize", {
        get: function () {
            return this._autoSize;
        },
        set: function (value) {
            if (this._autoSize !== value) {
                this._autoSize = value;
                var style = this.element.style;
                if (value) {
                    var chart_1 = this; // capture `this` for IE11
                    SizeMonitor.observe(this.element, function (size) {
                        if (size.width !== chart_1.width || size.height !== chart_1.height) {
                            chart_1.scene.resize(size.width, size.height);
                            chart_1.fireEvent({ type: 'layoutChange' });
                        }
                    });
                    style.display = 'block';
                    style.width = '100%';
                    style.height = '100%';
                }
                else {
                    SizeMonitor.unobserve(this.element);
                    style.display = 'inline-block';
                    style.width = 'auto';
                    style.height = 'auto';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.download = function (fileName) {
        this.scene.download(fileName);
    };
    Chart.prototype.destroy = function () {
        this.tooltip.destroy();
        SizeMonitor.unobserve(this.element);
        this.container = undefined;
        this.cleanupDomListeners(this.scene.canvas.element);
        this.scene.container = undefined;
    };
    Chart.prototype.onLegendPositionChange = function () {
        this.legendAutoPadding.clear();
        this.layoutPending = true;
    };
    Chart.prototype.onCaptionChange = function (event) {
        var value = event.value, oldValue = event.oldValue;
        if (oldValue) {
            oldValue.removeEventListener('change', this.scheduleLayout, this);
            this.scene.root.removeChild(oldValue.node);
        }
        if (value) {
            value.addEventListener('change', this.scheduleLayout, this);
            this.scene.root.appendChild(value.node);
        }
    };
    Object.defineProperty(Chart.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "axes", {
        get: function () {
            return this._axes;
        },
        set: function (values) {
            var _this = this;
            this._axes.forEach(function (axis) { return _this.detachAxis(axis); });
            // make linked axes go after the regular ones (simulates stable sort by `linkedTo` property)
            this._axes = values.filter(function (a) { return !a.linkedTo; }).concat(values.filter(function (a) { return a.linkedTo; }));
            this._axes.forEach(function (axis) { return _this.attachAxis(axis); });
            this.axesChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.attachAxis = function (axis) {
        this.scene.root.insertBefore(axis.group, this.seriesRoot);
    };
    Chart.prototype.detachAxis = function (axis) {
        this.scene.root.removeChild(axis.group);
    };
    Object.defineProperty(Chart.prototype, "series", {
        get: function () {
            return this._series;
        },
        set: function (values) {
            var _this = this;
            this.removeAllSeries();
            values.forEach(function (series) { return _this.addSeries(series); });
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.scheduleLayout = function () {
        this.layoutPending = true;
    };
    Chart.prototype.scheduleData = function () {
        // To prevent the chart from thinking the cursor is over the same node
        // after a change to data (the nodes are reused on data changes).
        this.dehighlightDatum();
        this.dataPending = true;
    };
    Chart.prototype.addSeries = function (series, before) {
        var _a = this, allSeries = _a.series, seriesRoot = _a.seriesRoot;
        var canAdd = allSeries.indexOf(series) < 0;
        if (canAdd) {
            var beforeIndex = before ? allSeries.indexOf(before) : -1;
            if (beforeIndex >= 0) {
                allSeries.splice(beforeIndex, 0, series);
                seriesRoot.insertBefore(series.group, before.group);
            }
            else {
                allSeries.push(series);
                seriesRoot.append(series.group);
            }
            this.initSeries(series);
            this.seriesChanged = true;
            this.axesChanged = true;
            return true;
        }
        return false;
    };
    Chart.prototype.initSeries = function (series) {
        series.chart = this;
        if (!series.data) {
            series.data = this.data;
        }
        series.addEventListener('layoutChange', this.scheduleLayout, this);
        series.addEventListener('dataChange', this.scheduleData, this);
        series.addEventListener('legendChange', this.updateLegend, this);
        series.addEventListener('nodeClick', this.onSeriesNodeClick, this);
    };
    Chart.prototype.freeSeries = function (series) {
        series.chart = undefined;
        series.removeEventListener('layoutChange', this.scheduleLayout, this);
        series.removeEventListener('dataChange', this.scheduleData, this);
        series.removeEventListener('legendChange', this.updateLegend, this);
        series.removeEventListener('nodeClick', this.onSeriesNodeClick, this);
    };
    Chart.prototype.addSeriesAfter = function (series, after) {
        var _a = this, allSeries = _a.series, seriesRoot = _a.seriesRoot;
        var canAdd = allSeries.indexOf(series) < 0;
        if (canAdd) {
            var afterIndex = after ? this.series.indexOf(after) : -1;
            if (afterIndex >= 0) {
                if (afterIndex + 1 < allSeries.length) {
                    seriesRoot.insertBefore(series.group, allSeries[afterIndex + 1].group);
                }
                else {
                    seriesRoot.append(series.group);
                }
                this.initSeries(series);
                allSeries.splice(afterIndex + 1, 0, series);
            }
            else {
                if (allSeries.length > 0) {
                    seriesRoot.insertBefore(series.group, allSeries[0].group);
                }
                else {
                    seriesRoot.append(series.group);
                }
                this.initSeries(series);
                allSeries.unshift(series);
            }
            this.seriesChanged = true;
            this.axesChanged = true;
        }
        return false;
    };
    Chart.prototype.removeSeries = function (series) {
        var index = this.series.indexOf(series);
        if (index >= 0) {
            this.series.splice(index, 1);
            this.freeSeries(series);
            this.seriesRoot.removeChild(series.group);
            this.seriesChanged = true;
            return true;
        }
        return false;
    };
    Chart.prototype.removeAllSeries = function () {
        var _this = this;
        this.series.forEach(function (series) {
            _this.freeSeries(series);
            _this.seriesRoot.removeChild(series.group);
        });
        this._series = []; // using `_series` instead of `series` to prevent infinite recursion
        this.seriesChanged = true;
    };
    Chart.prototype.assignSeriesToAxes = function () {
        var _this = this;
        this.axes.forEach(function (axis) {
            var axisName = axis.direction + 'Axis';
            var boundSeries = [];
            _this.series.forEach(function (series) {
                if (series[axisName] === axis) {
                    boundSeries.push(series);
                }
            });
            axis.boundSeries = boundSeries;
        });
        this.seriesChanged = false;
    };
    Chart.prototype.assignAxesToSeries = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // This method has to run before `assignSeriesToAxes`.
        var directionToAxesMap = {};
        this.axes.forEach(function (axis) {
            var direction = axis.direction;
            var directionAxes = directionToAxesMap[direction] || (directionToAxesMap[direction] = []);
            directionAxes.push(axis);
        });
        this.series.forEach(function (series) {
            series.directions.forEach(function (direction) {
                var axisName = direction + 'Axis';
                if (!series[axisName] || force) {
                    var directionAxes = directionToAxesMap[direction];
                    if (directionAxes) {
                        var axis = _this.findMatchingAxis(directionAxes, series.getKeys(direction));
                        if (axis) {
                            series[axisName] = axis;
                        }
                    }
                }
            });
        });
        this.axesChanged = false;
    };
    Chart.prototype.findMatchingAxis = function (directionAxes, directionKeys) {
        for (var i = 0; i < directionAxes.length; i++) {
            var axis = directionAxes[i];
            var axisKeys = axis.keys;
            if (!axisKeys.length) {
                return axis;
            }
            else if (directionKeys) {
                for (var j = 0; j < directionKeys.length; j++) {
                    if (axisKeys.indexOf(directionKeys[j]) >= 0) {
                        return axis;
                    }
                }
            }
        }
    };
    Object.defineProperty(Chart.prototype, "axesChanged", {
        get: function () {
            return this._axesChanged;
        },
        set: function (value) {
            this._axesChanged = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "seriesChanged", {
        get: function () {
            return this._seriesChanged;
        },
        set: function (value) {
            this._seriesChanged = value;
            if (value) {
                this.dataPending = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "layoutPending", {
        /**
         * Only `true` while we are waiting for the layout to start.
         * This will be `false` if the layout has already started and is ongoing.
         */
        get: function () {
            return !!this.layoutCallbackId;
        },
        set: function (value) {
            if (value) {
                if (!(this.layoutCallbackId || this.dataPending)) {
                    this.layoutCallbackId = requestAnimationFrame(this._performLayout);
                    this.series.forEach(function (s) { return s.nodeDataPending = true; });
                }
            }
            else if (this.layoutCallbackId) {
                cancelAnimationFrame(this.layoutCallbackId);
                this.layoutCallbackId = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "dataPending", {
        get: function () {
            return !!this.dataCallbackId;
        },
        set: function (value) {
            var _this = this;
            if (this.dataCallbackId) {
                clearTimeout(this.dataCallbackId);
                this.dataCallbackId = 0;
            }
            if (value) {
                this.dataCallbackId = window.setTimeout(function () {
                    _this.dataPending = false;
                    _this.processData();
                }, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.processData = function () {
        this.layoutPending = false;
        if (this.axesChanged) {
            this.assignAxesToSeries(true);
            this.assignSeriesToAxes();
        }
        if (this.seriesChanged) {
            this.assignSeriesToAxes();
        }
        this.series.forEach(function (s) { return s.processData(); });
        this.updateLegend(); // sets legend data which schedules a layout
        this.layoutPending = true;
    };
    Chart.prototype.createNodeData = function () {
        var _this = this;
        this.nodeData.clear();
        this.series.forEach(function (s) {
            var data = s.visible ? s.createNodeData() : [];
            _this.nodeData.set(s, data);
        });
    };
    Chart.prototype.placeLabels = function () {
        var series = [];
        var data = [];
        this.nodeData.forEach(function (d, s) {
            if (s.visible && s.label.enabled) {
                series.push(s);
                data.push(s.getLabelData());
            }
        });
        var seriesRect = this.seriesRect;
        var labels = seriesRect
            ? placeLabels(data, { x: 0, y: 0, width: seriesRect.width, height: seriesRect.height })
            : [];
        return new Map(labels.map(function (l, i) { return [series[i], l]; }));
    };
    Chart.prototype.updateLegend = function () {
        var legendData = [];
        this.series.filter(function (s) { return s.showInLegend; }).forEach(function (series) { return series.listSeriesItems(legendData); });
        var formatter = this.legend.item.label.formatter;
        if (formatter) {
            legendData.forEach(function (datum) { return datum.label.text = formatter({
                id: datum.id,
                itemId: datum.itemId,
                value: datum.label.text
            }); });
        }
        this.legend.data = legendData;
    };
    Object.defineProperty(Chart.prototype, "updatePending", {
        get: function () {
            return !!this.updateCallbackId;
        },
        set: function (value) {
            var _this = this;
            if (this.updateCallbackId) {
                clearTimeout(this.updateCallbackId);
                this.updateCallbackId = 0;
            }
            if (value && !this.layoutPending) {
                this.updateCallbackId = window.setTimeout(function () {
                    _this.update();
                }, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Chart.prototype.update = function () {
        this.updatePending = false;
        this.series.forEach(function (series) {
            if (series.updatePending) {
                series.update();
            }
        });
    };
    Chart.prototype.positionCaptions = function () {
        var _a = this, title = _a.title, subtitle = _a.subtitle;
        var titleVisible = false;
        var subtitleVisible = false;
        var spacing = 10;
        var paddingTop = spacing;
        if (title && title.enabled) {
            title.node.x = this.width / 2;
            title.node.y = paddingTop;
            titleVisible = true;
            var titleBBox = title.node.computeBBox(); // make sure to set node's x/y, then computeBBox
            if (titleBBox) {
                paddingTop = titleBBox.y + titleBBox.height;
            }
            if (subtitle && subtitle.enabled) {
                subtitle.node.x = this.width / 2;
                subtitle.node.y = paddingTop + spacing;
                subtitleVisible = true;
                var subtitleBBox = subtitle.node.computeBBox();
                if (subtitleBBox) {
                    paddingTop = subtitleBBox.y + subtitleBBox.height;
                }
            }
        }
        if (title) {
            title.node.visible = titleVisible;
        }
        if (subtitle) {
            subtitle.node.visible = subtitleVisible;
        }
        this.captionAutoPadding = Math.floor(paddingTop);
    };
    Chart.prototype.positionLegend = function () {
        if (!this.legend.enabled || !this.legend.data.length) {
            return;
        }
        var _a = this, legend = _a.legend, captionAutoPadding = _a.captionAutoPadding, legendAutoPadding = _a.legendAutoPadding;
        var width = this.width;
        var height = this.height - captionAutoPadding;
        var legendGroup = legend.group;
        var legendSpacing = legend.spacing;
        var translationX = 0;
        var translationY = 0;
        var legendBBox;
        switch (legend.position) {
            case 'bottom':
                legend.performLayout(width - legendSpacing * 2, 0);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.height < Math.floor((height * 0.5)); // Remove legend if it takes up more than 50% of the chart height.
                if (legendGroup.visible) {
                    translationX = (width - legendBBox.width) / 2 - legendBBox.x;
                    translationY = captionAutoPadding + height - legendBBox.height - legendBBox.y - legendSpacing;
                    legendAutoPadding.bottom = legendBBox.height;
                }
                else {
                    legendAutoPadding.bottom = 0;
                }
                break;
            case 'top':
                legend.performLayout(width - legendSpacing * 2, 0);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.height < Math.floor((height * 0.5));
                if (legendGroup.visible) {
                    translationX = (width - legendBBox.width) / 2 - legendBBox.x;
                    translationY = captionAutoPadding + legendSpacing - legendBBox.y;
                    legendAutoPadding.top = legendBBox.height;
                }
                else {
                    legendAutoPadding.top = 0;
                }
                break;
            case 'left':
                legend.performLayout(0, height - legendSpacing * 2);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.width < Math.floor((width * 0.5)); // Remove legend if it takes up more than 50% of the chart width.
                if (legendGroup.visible) {
                    translationX = legendSpacing - legendBBox.x;
                    translationY = captionAutoPadding + (height - legendBBox.height) / 2 - legendBBox.y;
                    legendAutoPadding.left = legendBBox.width;
                }
                else {
                    legendAutoPadding.left = 0;
                }
                break;
            default: // case 'right':
                legend.performLayout(0, height - legendSpacing * 2);
                legendBBox = legendGroup.computeBBox();
                legendGroup.visible = legendBBox.width < Math.floor((width * 0.5));
                if (legendGroup.visible) {
                    translationX = width - legendBBox.width - legendBBox.x - legendSpacing;
                    translationY = captionAutoPadding + (height - legendBBox.height) / 2 - legendBBox.y;
                    legendAutoPadding.right = legendBBox.width;
                }
                else {
                    legendAutoPadding.right = 0;
                }
                break;
        }
        if (legendGroup.visible) {
            // Round off for pixel grid alignment to work properly.
            legendGroup.translationX = Math.floor(translationX + legendGroup.translationX);
            legendGroup.translationY = Math.floor(translationY + legendGroup.translationY);
            this.legendBBox = legendGroup.computeBBox();
        }
    };
    Chart.prototype.setupDomListeners = function (chartElement) {
        chartElement.addEventListener('mousedown', this._onMouseDown);
        chartElement.addEventListener('mousemove', this._onMouseMove);
        chartElement.addEventListener('mouseup', this._onMouseUp);
        chartElement.addEventListener('mouseout', this._onMouseOut);
        chartElement.addEventListener('click', this._onClick);
    };
    Chart.prototype.cleanupDomListeners = function (chartElement) {
        chartElement.removeEventListener('mousedown', this._onMouseDown);
        chartElement.removeEventListener('mousemove', this._onMouseMove);
        chartElement.removeEventListener('mouseup', this._onMouseUp);
        chartElement.removeEventListener('mouseout', this._onMouseOut);
        chartElement.removeEventListener('click', this._onClick);
    };
    Chart.prototype.getSeriesRect = function () {
        return this.seriesRect;
    };
    // x/y are local canvas coordinates in CSS pixels, not actual pixels
    Chart.prototype.pickSeriesNode = function (x, y) {
        if (!(this.seriesRect && this.seriesRect.containsPoint(x, y))) {
            return undefined;
        }
        var allSeries = this.series;
        var node = undefined;
        for (var i = allSeries.length - 1; i >= 0; i--) {
            var series = allSeries[i];
            if (!series.visible || !series.group.visible) {
                continue;
            }
            node = series.pickGroup.pickNode(x, y);
            if (node) {
                return {
                    series: series,
                    node: node
                };
            }
        }
    };
    // Provided x/y are in canvas coordinates.
    Chart.prototype.pickClosestSeriesNodeDatum = function (x, y) {
        if (!this.seriesRect || !this.seriesRect.containsPoint(x, y)) {
            return undefined;
        }
        var allSeries = this.series;
        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        }
        var minDistance = Infinity;
        var closestDatum;
        var _loop_1 = function (i) {
            var series = allSeries[i];
            if (!series.visible || !series.group.visible) {
                return "continue";
            }
            var hitPoint = series.group.transformPoint(x, y);
            series.getNodeData().forEach(function (datum) {
                var _a, _b;
                if (!datum.point) {
                    return;
                }
                // Ignore off-screen points when finding the closest series node datum in tracking mode.
                var xAxis = series.xAxis, yAxis = series.yAxis;
                var isInRange = ((_a = xAxis) === null || _a === void 0 ? void 0 : _a.inRange(datum.point.x)) && ((_b = yAxis) === null || _b === void 0 ? void 0 : _b.inRange(datum.point.y));
                if (!isInRange) {
                    return;
                }
                var distance = getDistance(hitPoint, datum.point);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDatum = datum;
                }
            });
        };
        for (var i = allSeries.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        return closestDatum;
    };
    Chart.prototype.onMouseMove = function (event) {
        this.handleLegendMouseMove(event);
        if (this.tooltip.enabled) {
            if (this.tooltip.delay > 0) {
                this.tooltip.toggle(false);
            }
            this.handleTooltip(event);
        }
    };
    Chart.prototype.handleTooltip = function (event) {
        var _a = this, lastPick = _a.lastPick, tooltipTracking = _a.tooltip.tracking;
        var offsetX = event.offsetX, offsetY = event.offsetY;
        var pick = this.pickSeriesNode(offsetX, offsetY);
        var nodeDatum;
        if (pick && pick.node instanceof Shape) {
            var node = pick.node;
            nodeDatum = node.datum;
            if (lastPick && lastPick.datum === nodeDatum) {
                lastPick.node = node;
                lastPick.event = event;
            }
            // Marker nodes will have the `point` info in their datums.
            // Highlight if not a marker node or, if not in the tracking mode, highlight markers too.
            if ((!node.datum.point || !tooltipTracking)) {
                if (!lastPick // cursor moved from empty space to a node
                    || lastPick.node !== node) { // cursor moved from one node to another
                    this.onSeriesDatumPick(event, node.datum, node, event);
                }
                else if (pick.series.tooltip.enabled) { // cursor moved within the same node
                    this.tooltip.show(event);
                }
                // A non-marker node (takes precedence over marker nodes) was highlighted.
                // Or we are not in the tracking mode.
                // Either way, we are done at this point.
                return;
            }
        }
        var hideTooltip = false;
        // In tracking mode a tooltip is shown for the closest rendered datum.
        // This makes it easier to show tooltips when markers are small and/or plentiful
        // and also gives the ability to show tooltips even when the series were configured
        // to not render markers.
        if (tooltipTracking) {
            var closestDatum = this.pickClosestSeriesNodeDatum(offsetX, offsetY);
            if (closestDatum && closestDatum.point) {
                var _b = closestDatum.point, x = _b.x, y = _b.y;
                var canvas = this.scene.canvas;
                var point = closestDatum.series.group.inverseTransformPoint(x, y);
                var canvasRect = canvas.element.getBoundingClientRect();
                this.onSeriesDatumPick({
                    pageX: Math.round(canvasRect.left + window.pageXOffset + point.x),
                    pageY: Math.round(canvasRect.top + window.pageYOffset + point.y)
                }, closestDatum, nodeDatum === closestDatum && pick ? pick.node : undefined, event);
            }
            else {
                hideTooltip = true;
            }
        }
        if (lastPick && (hideTooltip || !tooltipTracking)) {
            // Cursor moved from a non-marker node to empty space.
            this.dehighlightDatum();
            this.tooltip.toggle(false);
            this.lastPick = undefined;
        }
    };
    Chart.prototype.onMouseDown = function (event) { };
    Chart.prototype.onMouseUp = function (event) { };
    Chart.prototype.onMouseOut = function (event) {
        this.tooltip.toggle(false);
    };
    Chart.prototype.onClick = function (event) {
        if (this.checkSeriesNodeClick()) {
            return;
        }
        if (this.checkLegendClick(event)) {
            return;
        }
        this.fireEvent({
            type: 'click',
            event: event
        });
    };
    Chart.prototype.checkSeriesNodeClick = function () {
        var lastPick = this.lastPick;
        if (lastPick && lastPick.event && lastPick.node) {
            var event_1 = lastPick.event, datum = lastPick.datum;
            datum.series.fireNodeClickEvent(event_1, datum);
            return true;
        }
        return false;
    };
    Chart.prototype.onSeriesNodeClick = function (event) {
        this.fireEvent(__assign$1(__assign$1({}, event), { type: 'seriesNodeClick' }));
    };
    Chart.prototype.checkLegendClick = function (event) {
        var datum = this.legend.getDatumForPoint(event.offsetX, event.offsetY);
        if (datum) {
            var id_1 = datum.id, itemId = datum.itemId, enabled = datum.enabled;
            var series = find(this.series, function (series) { return series.id === id_1; });
            if (series) {
                series.toggleSeriesItem(itemId, !enabled);
                if (enabled) {
                    this.tooltip.toggle(false);
                }
                this.legend.fireEvent({
                    type: 'click',
                    event: event,
                    itemId: itemId,
                    enabled: !enabled
                });
                return true;
            }
        }
        return false;
    };
    Chart.prototype.handleLegendMouseMove = function (event) {
        if (!this.legend.enabled) {
            return;
        }
        var offsetX = event.offsetX, offsetY = event.offsetY;
        var datum = this.legend.getDatumForPoint(offsetX, offsetY);
        var pointerInsideLegend = this.legendBBox.containsPoint(offsetX, offsetY);
        var pointerOverLegendDatum = pointerInsideLegend && datum !== undefined;
        if (!pointerInsideLegend && this.pointerInsideLegend) {
            this.pointerInsideLegend = false;
            this.scene.canvas.element.style.cursor = 'default';
            // Dehighlight if the pointer was inside the legend and is now leaving it.
            this.dehighlightDatum();
            return;
        }
        if (pointerOverLegendDatum && !this.pointerOverLegendDatum) {
            this.scene.canvas.element.style.cursor = 'pointer';
        }
        if (!pointerOverLegendDatum && this.pointerOverLegendDatum) {
            this.scene.canvas.element.style.cursor = 'default';
        }
        this.pointerInsideLegend = pointerInsideLegend;
        this.pointerOverLegendDatum = pointerOverLegendDatum;
        var oldHighlightedDatum = this.highlightedDatum;
        if (datum) {
            var id_2 = datum.id, itemId = datum.itemId, enabled = datum.enabled;
            if (enabled) {
                var series = find(this.series, function (series) { return series.id === id_2; });
                if (series) {
                    this.highlightedDatum = {
                        series: series,
                        itemId: itemId,
                        datum: undefined
                    };
                }
            }
        }
        // Careful to only schedule updates when necessary.
        if ((this.highlightedDatum && !oldHighlightedDatum) ||
            (this.highlightedDatum && oldHighlightedDatum &&
                (this.highlightedDatum.series !== oldHighlightedDatum.series ||
                    this.highlightedDatum.itemId !== oldHighlightedDatum.itemId))) {
            this.series.forEach(function (s) { return s.updatePending = true; });
        }
    };
    Chart.prototype.onSeriesDatumPick = function (meta, datum, node, event) {
        var lastPick = this.lastPick;
        if (lastPick) {
            if (lastPick.datum === datum) {
                return;
            }
            this.dehighlightDatum();
        }
        this.lastPick = {
            datum: datum,
            node: node,
            event: event
        };
        this.highlightDatum(datum);
        var html = datum.series.tooltip.enabled && datum.series.getTooltipHtml(datum);
        if (html) {
            this.tooltip.show(meta, html);
        }
    };
    Chart.prototype.highlightDatum = function (datum) {
        this.scene.canvas.element.style.cursor = datum.series.cursor;
        this.highlightedDatum = datum;
        this.series.forEach(function (s) { return s.updatePending = true; });
    };
    Chart.prototype.dehighlightDatum = function () {
        if (this.highlightedDatum) {
            this.highlightedDatum = undefined;
            this.series.forEach(function (s) { return s.updatePending = true; });
        }
    };
    Chart.defaultTooltipClass = 'ag-chart-tooltip';
    Chart.tooltipDocuments = [];
    __decorate$3([
        reactive('layoutChange')
    ], Chart.prototype, "title", void 0);
    __decorate$3([
        reactive('layoutChange')
    ], Chart.prototype, "subtitle", void 0);
    return Chart;
}(Observable));

var __extends$u = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Acts as `Group` node but with specified bounds that form a rectangle.
 * Any parts of the child nodes outside that rectangle will not be visible.
 * Unlike the `Group` node, the `ClipRect` node cannot be transformed.
 */
var ClipRect = /** @class */ (function (_super) {
    __extends$u(ClipRect, _super);
    function ClipRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContainerNode = true;
        _this.path = new Path2D();
        _this._enabled = true;
        _this._dirtyPath = true;
        _this._x = 0;
        _this._y = 0;
        _this._width = 10;
        _this._height = 10;
        return _this;
    }
    ClipRect.prototype.containsPoint = function (x, y) {
        var point = this.transformPoint(x, y);
        return point.x >= this.x && point.x <= this.x + this.width
            && point.y >= this.y && point.y <= this.y + this.height;
    };
    Object.defineProperty(ClipRect.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
                this.dirty = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipRect.prototype, "dirtyPath", {
        get: function () {
            return this._dirtyPath;
        },
        set: function (value) {
            if (this._dirtyPath !== value) {
                this._dirtyPath = value;
                if (value) {
                    this.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipRect.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipRect.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipRect.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClipRect.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    ClipRect.prototype.updatePath = function () {
        var path = this.path;
        path.clear();
        path.rect(this.x, this.y, this.width, this.height);
        this.dirtyPath = false;
    };
    ClipRect.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    ClipRect.prototype.render = function (ctx) {
        if (this.enabled) {
            if (this.dirtyPath) {
                this.updatePath();
            }
            this.path.draw(ctx);
            ctx.clip();
        }
        var children = this.children;
        var n = children.length;
        for (var i = 0; i < n; i++) {
            ctx.save();
            var child = children[i];
            if (child.visible) {
                child.render(ctx);
            }
            ctx.restore();
        }
        // debug
        // this.computeBBox().render(ctx, {
        //     label: this.id,
        //     resetTransform: true,
        //     fillStyle: 'rgba(0, 0, 0, 0.5)'
        // });
    };
    ClipRect.className = 'ClipRect';
    return ClipRect;
}(Node));

var __extends$v = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RangeHandle = /** @class */ (function (_super) {
    __extends$v(RangeHandle, _super);
    function RangeHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fill = '#f2f2f2';
        _this._stroke = '#999999';
        _this._strokeWidth = 1;
        _this._lineCap = 'square';
        _this._centerX = 0;
        _this._centerY = 0;
        // Use an even number for better looking results.
        _this._width = 8;
        // Use an even number for better looking results.
        _this._gripLineGap = 2;
        // Use an even number for better looking results.
        _this._gripLineLength = 8;
        _this._height = 16;
        return _this;
    }
    Object.defineProperty(RangeHandle.prototype, "centerX", {
        get: function () {
            return this._centerX;
        },
        set: function (value) {
            if (this._centerX !== value) {
                this._centerX = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "centerY", {
        get: function () {
            return this._centerY;
        },
        set: function (value) {
            if (this._centerY !== value) {
                this._centerY = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "gripLineGap", {
        get: function () {
            return this._gripLineGap;
        },
        set: function (value) {
            if (this._gripLineGap !== value) {
                this._gripLineGap = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "gripLineLength", {
        get: function () {
            return this._gripLineLength;
        },
        set: function (value) {
            if (this._gripLineLength !== value) {
                this._gripLineLength = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeHandle.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    RangeHandle.prototype.computeBBox = function () {
        var _a = this, centerX = _a.centerX, centerY = _a.centerY, width = _a.width, height = _a.height;
        var x = centerX - width / 2;
        var y = centerY - height / 2;
        return new BBox(x, y, width, height);
    };
    RangeHandle.prototype.isPointInPath = function (x, y) {
        var point = this.transformPoint(x, y);
        var bbox = this.computeBBox();
        return bbox.containsPoint(point.x, point.y);
    };
    RangeHandle.prototype.updatePath = function () {
        var _a = this, path = _a.path, centerX = _a.centerX, centerY = _a.centerY, width = _a.width, height = _a.height;
        var _b = this, a = _b.alignment, al = _b.align;
        path.clear();
        var x = centerX - width / 2;
        var y = centerY - height / 2;
        var ax = al(a, x);
        var ay = al(a, y);
        var axw = ax + al(a, x, width);
        var ayh = ay + al(a, y, height);
        // Handle.
        path.moveTo(ax, ay);
        path.lineTo(axw, ay);
        path.lineTo(axw, ayh);
        path.lineTo(ax, ayh);
        path.lineTo(ax, ay);
        // Grip lines.
        var dx = this.gripLineGap / 2;
        var dy = this.gripLineLength / 2;
        path.moveTo(al(a, centerX - dx), al(a, centerY - dy));
        path.lineTo(al(a, centerX - dx), al(a, centerY + dy));
        path.moveTo(al(a, centerX + dx), al(a, centerY - dy));
        path.lineTo(al(a, centerX + dx), al(a, centerY + dy));
    };
    RangeHandle.className = 'RangeHandle';
    return RangeHandle;
}(Path));

var __extends$w = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RangeMask = /** @class */ (function (_super) {
    __extends$w(RangeMask, _super);
    function RangeMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._stroke = '#999999';
        _this._strokeWidth = 1;
        _this._fill = '#999999';
        _this._fillOpacity = 0.2;
        _this._lineCap = 'square';
        _this._x = 0;
        _this._y = 0;
        _this._width = 200;
        _this._height = 30;
        _this.minRange = 0.05;
        _this._min = 0;
        _this._max = 1;
        return _this;
    }
    Object.defineProperty(RangeMask.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (this._x !== value) {
                this._x = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            if (this._y !== value) {
                this._y = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width !== value) {
                this._width = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height !== value) {
                this._height = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (value) {
            value = Math.min(Math.max(value, 0), this.max - this.minRange);
            if (isNaN(value)) {
                return;
            }
            if (this._min !== value) {
                this._min = value;
                this.dirtyPath = true;
                this.onRangeChange && this.onRangeChange(value, this.max);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMask.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (value) {
            value = Math.max(Math.min(value, 1), this.min + this.minRange);
            if (isNaN(value)) {
                return;
            }
            if (this._max !== value) {
                this._max = value;
                this.dirtyPath = true;
                this.onRangeChange && this.onRangeChange(this.min, value);
            }
        },
        enumerable: true,
        configurable: true
    });
    RangeMask.prototype.computeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        return new BBox(x, y, width, height);
    };
    RangeMask.prototype.computeVisibleRangeBBox = function () {
        var _a = this, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
        var minX = x + width * min;
        var maxX = x + width * max;
        return new BBox(minX, y, maxX - minX, height);
    };
    RangeMask.prototype.updatePath = function () {
        var _a = this, path = _a.path, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
        var _b = this, a = _b.alignment, al = _b.align;
        path.clear();
        var ax = al(a, x);
        var ay = al(a, y);
        var axw = ax + al(a, x, width);
        var ayh = ay + al(a, y, height);
        // Whole range.
        path.moveTo(ax, ay);
        path.lineTo(axw, ay);
        path.lineTo(axw, ayh);
        path.lineTo(ax, ayh);
        path.lineTo(ax, ay);
        var minX = al(a, x + width * min);
        var maxX = al(a, x + width * max);
        // Visible range.
        path.moveTo(minX, ay);
        path.lineTo(minX, ayh);
        path.lineTo(maxX, ayh);
        path.lineTo(maxX, ay);
        path.lineTo(minX, ay);
    };
    RangeMask.className = 'RangeMask';
    return RangeMask;
}(Path));

var __extends$x = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RangeSelector = /** @class */ (function (_super) {
    __extends$x(RangeSelector, _super);
    function RangeSelector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isContainerNode = true;
        _this.minHandle = new RangeHandle();
        _this.maxHandle = new RangeHandle();
        _this.mask = (function () {
            var _a = RangeSelector.defaults, x = _a.x, y = _a.y, width = _a.width, height = _a.height, min = _a.min, max = _a.max;
            var mask = new RangeMask();
            mask.x = x;
            mask.y = y;
            mask.width = width;
            mask.height = height;
            mask.min = min;
            mask.max = max;
            var _b = _this, minHandle = _b.minHandle, maxHandle = _b.maxHandle;
            minHandle.centerX = x;
            maxHandle.centerX = x + width;
            minHandle.centerY = maxHandle.centerY = y + height / 2;
            _this.append([mask, minHandle, maxHandle]);
            mask.onRangeChange = function (min, max) {
                _this.updateHandles();
                _this.onRangeChange && _this.onRangeChange(min, max);
            };
            return mask;
        })();
        _this._x = RangeSelector.defaults.x;
        _this._y = RangeSelector.defaults.y;
        _this._width = RangeSelector.defaults.width;
        _this._height = RangeSelector.defaults.height;
        _this._min = RangeSelector.defaults.min;
        _this._max = RangeSelector.defaults.max;
        return _this;
    }
    Object.defineProperty(RangeSelector.prototype, "x", {
        get: function () {
            return this.mask.x;
        },
        set: function (value) {
            this.mask.x = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "y", {
        get: function () {
            return this.mask.y;
        },
        set: function (value) {
            this.mask.y = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "width", {
        get: function () {
            return this.mask.width;
        },
        set: function (value) {
            this.mask.width = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "height", {
        get: function () {
            return this.mask.height;
        },
        set: function (value) {
            this.mask.height = value;
            this.updateHandles();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "min", {
        get: function () {
            return this.mask.min;
        },
        set: function (value) {
            this.mask.min = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeSelector.prototype, "max", {
        get: function () {
            return this.mask.max;
        },
        set: function (value) {
            this.mask.max = value;
        },
        enumerable: true,
        configurable: true
    });
    RangeSelector.prototype.updateHandles = function () {
        var _a = this, minHandle = _a.minHandle, maxHandle = _a.maxHandle, x = _a.x, y = _a.y, width = _a.width, height = _a.height, mask = _a.mask;
        minHandle.centerX = x + width * mask.min;
        maxHandle.centerX = x + width * mask.max;
        minHandle.centerY = maxHandle.centerY = y + height / 2;
    };
    RangeSelector.prototype.computeBBox = function () {
        return this.mask.computeBBox();
    };
    RangeSelector.prototype.computeVisibleRangeBBox = function () {
        return this.mask.computeVisibleRangeBBox();
    };
    RangeSelector.prototype.render = function (ctx) {
        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        this.matrix.toContext(ctx);
        var _a = this, mask = _a.mask, minHandle = _a.minHandle, maxHandle = _a.maxHandle;
        [mask, minHandle, maxHandle].forEach(function (child) {
            ctx.save();
            if (child.visible) {
                child.render(ctx);
            }
            ctx.restore();
        });
    };
    RangeSelector.className = 'Range';
    RangeSelector.defaults = {
        x: 0,
        y: 0,
        width: 200,
        height: 30,
        min: 0,
        max: 1
    };
    return RangeSelector;
}(Group));

var NavigatorMask = /** @class */ (function () {
    function NavigatorMask(rangeMask) {
        this.rm = rangeMask;
    }
    Object.defineProperty(NavigatorMask.prototype, "fill", {
        get: function () {
            return this.rm.fill;
        },
        set: function (value) {
            this.rm.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "stroke", {
        get: function () {
            return this.rm.stroke;
        },
        set: function (value) {
            this.rm.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "strokeWidth", {
        get: function () {
            return this.rm.strokeWidth;
        },
        set: function (value) {
            this.rm.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorMask.prototype, "fillOpacity", {
        get: function () {
            return this.rm.fillOpacity;
        },
        set: function (value) {
            this.rm.fillOpacity = value;
        },
        enumerable: true,
        configurable: true
    });
    return NavigatorMask;
}());

var NavigatorHandle = /** @class */ (function () {
    function NavigatorHandle(rangeHandle) {
        this.rh = rangeHandle;
    }
    Object.defineProperty(NavigatorHandle.prototype, "fill", {
        get: function () {
            return this.rh.fill;
        },
        set: function (value) {
            this.rh.fill = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "stroke", {
        get: function () {
            return this.rh.stroke;
        },
        set: function (value) {
            this.rh.stroke = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "strokeWidth", {
        get: function () {
            return this.rh.strokeWidth;
        },
        set: function (value) {
            this.rh.strokeWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "width", {
        get: function () {
            return this.rh.width;
        },
        set: function (value) {
            this.rh.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "height", {
        get: function () {
            return this.rh.height;
        },
        set: function (value) {
            this.rh.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineGap", {
        get: function () {
            return this.rh.gripLineGap;
        },
        set: function (value) {
            this.rh.gripLineGap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigatorHandle.prototype, "gripLineLength", {
        get: function () {
            return this.rh.gripLineLength;
        },
        set: function (value) {
            this.rh.gripLineLength = value;
        },
        enumerable: true,
        configurable: true
    });
    return NavigatorHandle;
}());

var Navigator = /** @class */ (function () {
    function Navigator(chart) {
        var _this = this;
        this.rs = new RangeSelector();
        this.mask = new NavigatorMask(this.rs.mask);
        this.minHandle = new NavigatorHandle(this.rs.minHandle);
        this.maxHandle = new NavigatorHandle(this.rs.maxHandle);
        this.minHandleDragging = false;
        this.maxHandleDragging = false;
        this.panHandleOffset = NaN;
        this._margin = 10;
        this.chart = chart;
        chart.scene.root.append(this.rs);
        this.rs.onRangeChange = function (min, max) { return _this.updateAxes(min, max); };
    }
    Object.defineProperty(Navigator.prototype, "enabled", {
        get: function () {
            return this.rs.visible;
        },
        set: function (value) {
            this.rs.visible = value;
            this.chart.layoutPending = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "x", {
        get: function () {
            return this.rs.x;
        },
        set: function (value) {
            this.rs.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "y", {
        get: function () {
            return this.rs.y;
        },
        set: function (value) {
            this.rs.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "width", {
        get: function () {
            return this.rs.width;
        },
        set: function (value) {
            this.rs.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "height", {
        get: function () {
            return this.rs.height;
        },
        set: function (value) {
            this.rs.height = value;
            this.chart.layoutPending = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "margin", {
        get: function () {
            return this._margin;
        },
        set: function (value) {
            this._margin = value;
            this.chart.layoutPending = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "min", {
        get: function () {
            return this.rs.min;
        },
        set: function (value) {
            this.rs.min = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "max", {
        get: function () {
            return this.rs.max;
        },
        set: function (value) {
            this.rs.max = value;
        },
        enumerable: true,
        configurable: true
    });
    Navigator.prototype.updateAxes = function (min, max) {
        var _this = this;
        var chart = this.chart;
        var clipSeries = false;
        chart.axes.forEach(function (axis) {
            if (axis.direction === exports.ChartAxisDirection.X) {
                if (!clipSeries && (min > 0 || max < 1)) {
                    clipSeries = true;
                }
                axis.visibleRange = [min, max];
                var oldLabelAutoRotated = axis.labelAutoRotated;
                axis.update();
                if (axis.labelAutoRotated !== oldLabelAutoRotated) {
                    _this.chart.layoutPending = true;
                }
            }
        });
        chart.seriesRoot.enabled = clipSeries;
        chart.series.forEach(function (s) { return s.nodeDataPending = true; });
    };
    Navigator.prototype.onDragStart = function (offset) {
        if (!this.enabled) {
            return;
        }
        var offsetX = offset.offsetX, offsetY = offset.offsetY;
        var rs = this.rs;
        var minHandle = rs.minHandle, maxHandle = rs.maxHandle, x = rs.x, width = rs.width, min = rs.min;
        var visibleRange = rs.computeVisibleRangeBBox();
        if (!(this.minHandleDragging || this.maxHandleDragging)) {
            if (minHandle.containsPoint(offsetX, offsetY)) {
                this.minHandleDragging = true;
            }
            else if (maxHandle.containsPoint(offsetX, offsetY)) {
                this.maxHandleDragging = true;
            }
            else if (visibleRange.containsPoint(offsetX, offsetY)) {
                this.panHandleOffset = (offsetX - x) / width - min;
            }
        }
    };
    Navigator.prototype.onDrag = function (offset) {
        if (!this.enabled) {
            return;
        }
        var _a = this, rs = _a.rs, panHandleOffset = _a.panHandleOffset;
        var x = rs.x, y = rs.y, width = rs.width, height = rs.height, minHandle = rs.minHandle, maxHandle = rs.maxHandle;
        var style = this.chart.element.style;
        var offsetX = offset.offsetX, offsetY = offset.offsetY;
        var minX = x + width * rs.min;
        var maxX = x + width * rs.max;
        var visibleRange = new BBox(minX, y, maxX - minX, height);
        function getRatio() {
            return Math.min(Math.max((offsetX - x) / width, 0), 1);
        }
        if (minHandle.containsPoint(offsetX, offsetY)) {
            style.cursor = 'ew-resize';
        }
        else if (maxHandle.containsPoint(offsetX, offsetY)) {
            style.cursor = 'ew-resize';
        }
        else if (visibleRange.containsPoint(offsetX, offsetY)) {
            style.cursor = 'grab';
        }
        else {
            style.cursor = 'default';
        }
        if (this.minHandleDragging) {
            rs.min = getRatio();
        }
        else if (this.maxHandleDragging) {
            rs.max = getRatio();
        }
        else if (!isNaN(panHandleOffset)) {
            var span = rs.max - rs.min;
            var min = Math.min(getRatio() - panHandleOffset, 1 - span);
            if (min <= rs.min) { // pan left
                rs.min = min;
                rs.max = rs.min + span;
            }
            else { // pan right
                rs.max = min + span;
                rs.min = rs.max - span;
            }
        }
    };
    Navigator.prototype.onDragStop = function () {
        this.stopHandleDragging();
    };
    Navigator.prototype.stopHandleDragging = function () {
        this.minHandleDragging = this.maxHandleDragging = false;
        this.panHandleOffset = NaN;
    };
    return Navigator;
}());

var __extends$y = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$9 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$1 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$9(arguments[i]));
    return ar;
};
var CartesianChart = /** @class */ (function (_super) {
    __extends$y(CartesianChart, _super);
    function CartesianChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this._seriesRoot = new ClipRect();
        _this.navigator = new Navigator(_this);
        // Prevent the scene from rendering chart components in an invalid state
        // (before first layout is performed).
        _this.scene.root.visible = false;
        var root = _this.scene.root;
        root.append(_this.seriesRoot);
        root.append(_this.legend.group);
        _this.navigator.enabled = false;
        return _this;
    }
    Object.defineProperty(CartesianChart.prototype, "seriesRoot", {
        get: function () {
            return this._seriesRoot;
        },
        enumerable: true,
        configurable: true
    });
    CartesianChart.prototype.performLayout = function () {
        if (this.dataPending) {
            return;
        }
        this.scene.root.visible = true;
        var _a = this, width = _a.width, height = _a.height, axes = _a.axes, legend = _a.legend, navigator = _a.navigator;
        var shrinkRect = new BBox(0, 0, width, height);
        this.positionCaptions();
        this.positionLegend();
        if (legend.enabled && legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            var legendPadding = this.legend.spacing;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var _b = this, captionAutoPadding = _b.captionAutoPadding, padding = _b.padding;
        shrinkRect.x += padding.left;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.y += padding.top + captionAutoPadding;
        shrinkRect.height -= padding.top + captionAutoPadding + padding.bottom;
        if (navigator.enabled) {
            shrinkRect.height -= navigator.height + navigator.margin;
        }
        // Set the number of ticks for continuous axes based on the available range
        // before updating the axis domain via `this.updateAxes()` as the tick count has an effect on the calculated `nice` domain extent
        axes.forEach(function (axis) {
            var availableRange = 0;
            switch (axis.position) {
                case exports.ChartAxisPosition.Top:
                case exports.ChartAxisPosition.Bottom:
                    availableRange = shrinkRect.width;
                    break;
                case exports.ChartAxisPosition.Left:
                case exports.ChartAxisPosition.Right:
                    availableRange = shrinkRect.height;
                    break;
            }
            axis.calculateTickCount(availableRange);
        });
        this.updateAxes();
        var bottomAxesHeight = 0;
        var axisPositionVisited = {
            top: false,
            right: false,
            bottom: false,
            left: false,
            angle: false,
            radius: false
        };
        axes.forEach(function (axis) {
            axis.group.visible = true;
            var axisThickness = Math.floor(axis.thickness || axis.computeBBox().width);
            // for multiple axes in the same direction and position, apply padding at the top of each inner axis (i.e. between axes).
            var axisPadding = axis.title && axis.title.padding.top || 15;
            if (axisPositionVisited[axis.position]) {
                axisThickness += axisPadding;
            }
            switch (axis.position) {
                case exports.ChartAxisPosition.Top:
                    axisPositionVisited[exports.ChartAxisPosition.Top] = true;
                    shrinkRect.y += axisThickness;
                    shrinkRect.height -= axisThickness;
                    axis.translation.y = Math.floor(shrinkRect.y + 1);
                    axis.label.mirrored = true;
                    break;
                case exports.ChartAxisPosition.Right:
                    axisPositionVisited[exports.ChartAxisPosition.Right] = true;
                    shrinkRect.width -= axisThickness;
                    axis.translation.x = Math.max(Math.floor(shrinkRect.x), Math.floor(shrinkRect.x + shrinkRect.width));
                    axis.label.mirrored = true;
                    break;
                case exports.ChartAxisPosition.Bottom:
                    axisPositionVisited[exports.ChartAxisPosition.Bottom] = true;
                    shrinkRect.height -= axisThickness;
                    bottomAxesHeight += axisThickness;
                    axis.translation.y = Math.max(Math.floor(shrinkRect.y), Math.floor(shrinkRect.y + shrinkRect.height + 1));
                    break;
                case exports.ChartAxisPosition.Left:
                    axisPositionVisited[exports.ChartAxisPosition.Left] = true;
                    shrinkRect.x += axisThickness;
                    shrinkRect.width -= axisThickness;
                    axis.translation.x = Math.floor(shrinkRect.x);
                    break;
            }
        });
        // width and height should not be negative
        shrinkRect.width = Math.max(0, shrinkRect.width);
        shrinkRect.height = Math.max(0, shrinkRect.height);
        axes.forEach(function (axis) {
            switch (axis.position) {
                case exports.ChartAxisPosition.Top:
                case exports.ChartAxisPosition.Bottom:
                    axis.translation.x = Math.floor(shrinkRect.x);
                    axis.range = [0, shrinkRect.width];
                    axis.gridLength = shrinkRect.height;
                    break;
                case exports.ChartAxisPosition.Left:
                case exports.ChartAxisPosition.Right:
                    axis.translation.y = Math.floor(shrinkRect.y);
                    if (axis instanceof CategoryAxis || axis instanceof GroupedCategoryAxis) {
                        axis.range = [0, shrinkRect.height];
                    }
                    else {
                        axis.range = [shrinkRect.height, 0];
                    }
                    axis.gridLength = shrinkRect.width;
                    break;
            }
        });
        this.createNodeData();
        this.seriesRect = shrinkRect;
        this.series.forEach(function (series) {
            series.group.translationX = Math.floor(shrinkRect.x);
            series.group.translationY = Math.floor(shrinkRect.y);
            series.update(); // this has to happen after the `updateAxes` call
        });
        var seriesRoot = this.seriesRoot;
        seriesRoot.x = shrinkRect.x;
        seriesRoot.y = shrinkRect.y;
        seriesRoot.width = shrinkRect.width;
        seriesRoot.height = shrinkRect.height;
        if (navigator.enabled) {
            navigator.x = shrinkRect.x;
            navigator.y = shrinkRect.y + shrinkRect.height + bottomAxesHeight + navigator.margin;
            navigator.width = shrinkRect.width;
        }
        this.axes.forEach(function (axis) { return axis.update(); });
    };
    CartesianChart.prototype.initSeries = function (series) {
        _super.prototype.initSeries.call(this, series);
    };
    CartesianChart.prototype.freeSeries = function (series) {
        _super.prototype.freeSeries.call(this, series);
    };
    CartesianChart.prototype.setupDomListeners = function (chartElement) {
        _super.prototype.setupDomListeners.call(this, chartElement);
        this._onTouchStart = this.onTouchStart.bind(this);
        this._onTouchMove = this.onTouchMove.bind(this);
        this._onTouchEnd = this.onTouchEnd.bind(this);
        this._onTouchCancel = this.onTouchCancel.bind(this);
        chartElement.addEventListener('touchstart', this._onTouchStart, { passive: true });
        chartElement.addEventListener('touchmove', this._onTouchMove, { passive: true });
        chartElement.addEventListener('touchend', this._onTouchEnd, { passive: true });
        chartElement.addEventListener('touchcancel', this._onTouchCancel, { passive: true });
    };
    CartesianChart.prototype.cleanupDomListeners = function (chartElement) {
        _super.prototype.cleanupDomListeners.call(this, chartElement);
        chartElement.removeEventListener('touchstart', this._onTouchStart);
        chartElement.removeEventListener('touchmove', this._onTouchMove);
        chartElement.removeEventListener('touchend', this._onTouchEnd);
        chartElement.removeEventListener('touchcancel', this._onTouchCancel);
    };
    CartesianChart.prototype.getTouchOffset = function (event) {
        var rect = this.scene.canvas.element.getBoundingClientRect();
        var touch = event.touches[0];
        return touch ? {
            offsetX: touch.clientX - rect.left,
            offsetY: touch.clientY - rect.top
        } : undefined;
    };
    CartesianChart.prototype.onTouchStart = function (event) {
        var offset = this.getTouchOffset(event);
        if (offset) {
            this.navigator.onDragStart(offset);
        }
    };
    CartesianChart.prototype.onTouchMove = function (event) {
        var offset = this.getTouchOffset(event);
        if (offset) {
            this.navigator.onDrag(offset);
        }
    };
    CartesianChart.prototype.onTouchEnd = function (event) {
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onTouchCancel = function (event) {
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onMouseDown = function (event) {
        _super.prototype.onMouseDown.call(this, event);
        this.navigator.onDragStart(event);
    };
    CartesianChart.prototype.onMouseMove = function (event) {
        _super.prototype.onMouseMove.call(this, event);
        this.navigator.onDrag(event);
    };
    CartesianChart.prototype.onMouseUp = function (event) {
        _super.prototype.onMouseUp.call(this, event);
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.onMouseOut = function (event) {
        _super.prototype.onMouseOut.call(this, event);
        this.navigator.onDragStop();
    };
    CartesianChart.prototype.assignAxesToSeries = function (force) {
        if (force === void 0) { force = false; }
        _super.prototype.assignAxesToSeries.call(this, force);
        this.series.forEach(function (series) {
            if (!series.xAxis) {
                console.warn("Could not find a matching xAxis for the " + series.id + " series.");
            }
            if (!series.yAxis) {
                console.warn("Could not find a matching yAxis for the " + series.id + " series.");
            }
        });
    };
    CartesianChart.prototype.updateAxes = function () {
        var _this = this;
        var navigator = this.navigator;
        var clipSeries = false;
        var primaryTickCount;
        this.axes.forEach(function (axis) {
            var _a;
            var direction = axis.direction, boundSeries = axis.boundSeries;
            if (boundSeries.length === 0 && _this._series.length > 0) {
                console.warn('AG Charts - chart series not initialised; check series and axes configuration.');
            }
            if (axis.linkedTo) {
                axis.domain = axis.linkedTo.domain;
            }
            else {
                var domains_1 = [];
                boundSeries.filter(function (s) { return s.visible; }).forEach(function (series) {
                    domains_1.push(series.getDomain(direction));
                });
                var domain = (_a = new Array()).concat.apply(_a, __spread$1(domains_1));
                var isYAxis = axis.direction === 'y';
                if (axis instanceof NumberAxis && isYAxis) {
                    // the `primaryTickCount` is used to align the secondary axis tick count with the primary
                    axis.setDomain(domain, primaryTickCount);
                    primaryTickCount = primaryTickCount || axis.scale.ticks(axis.calculatedTickCount).length;
                }
                else {
                    axis.domain = domain;
                }
            }
            if (axis.direction === exports.ChartAxisDirection.X) {
                axis.visibleRange = [navigator.min, navigator.max];
            }
            if (!clipSeries && (axis.visibleRange[0] > 0 || axis.visibleRange[1] < 1)) {
                clipSeries = true;
            }
            axis.update();
        });
        this.seriesRoot.enabled = clipSeries;
    };
    CartesianChart.className = 'CartesianChart';
    CartesianChart.type = 'cartesian';
    return CartesianChart;
}(Chart));

var __extends$z = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HierarchyChart = /** @class */ (function (_super) {
    __extends$z(HierarchyChart, _super);
    function HierarchyChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this._data = {};
        _this._seriesRoot = new ClipRect();
        // Prevent the scene from rendering chart components in an invalid state
        // (before first layout is performed).
        _this.scene.root.visible = false;
        var root = _this.scene.root;
        root.append(_this.seriesRoot);
        root.append(_this.legend.group);
        return _this;
    }
    Object.defineProperty(HierarchyChart.prototype, "seriesRoot", {
        get: function () {
            return this._seriesRoot;
        },
        enumerable: true,
        configurable: true
    });
    HierarchyChart.prototype.performLayout = function () {
        if (this.dataPending) {
            return;
        }
        this.scene.root.visible = true;
        var _a = this, width = _a.width, height = _a.height, legend = _a.legend;
        var shrinkRect = new BBox(0, 0, width, height);
        this.positionCaptions();
        this.positionLegend();
        if (legend.enabled && legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            var legendPadding = this.legend.spacing;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var _b = this, captionAutoPadding = _b.captionAutoPadding, padding = _b.padding;
        shrinkRect.x += padding.left;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.y += padding.top + captionAutoPadding;
        shrinkRect.height -= padding.top + captionAutoPadding + padding.bottom;
        this.seriesRect = shrinkRect;
        this.series.forEach(function (series) {
            series.group.translationX = Math.floor(shrinkRect.x);
            series.group.translationY = Math.floor(shrinkRect.y);
            series.update(); // this has to happen after the `updateAxes` call
        });
        var seriesRoot = this.seriesRoot;
        seriesRoot.x = shrinkRect.x;
        seriesRoot.y = shrinkRect.y;
        seriesRoot.width = shrinkRect.width;
        seriesRoot.height = shrinkRect.height;
    };
    HierarchyChart.className = 'HierarchyChart';
    HierarchyChart.type = 'hierarchy';
    return HierarchyChart;
}(Chart));

var __extends$A = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$a = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$2 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$a(arguments[i]));
    return ar;
};
var GroupedCategoryChart = /** @class */ (function (_super) {
    __extends$A(GroupedCategoryChart, _super);
    function GroupedCategoryChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedCategoryChart.prototype.updateAxes = function () {
        this.axes.forEach(function (axis) {
            var _a;
            var direction = axis.direction, boundSeries = axis.boundSeries;
            var domains = [];
            var isNumericX = undefined;
            boundSeries.filter(function (s) { return s.visible; }).forEach(function (series) {
                if (direction === exports.ChartAxisDirection.X) {
                    if (isNumericX === undefined) {
                        // always add first X domain
                        var domain_1 = series.getDomain(direction);
                        domains.push(domain_1);
                        isNumericX = typeof domain_1[0] === 'number';
                    }
                    else if (isNumericX) {
                        // only add further X domains if the axis is numeric
                        domains.push(series.getDomain(direction));
                    }
                }
                else {
                    domains.push(series.getDomain(direction));
                }
            });
            var domain = (_a = new Array()).concat.apply(_a, __spread$2(domains));
            axis.domain = extent(domain, isContinuous) || domain;
            axis.update();
        });
    };
    GroupedCategoryChart.className = 'GroupedCategoryChart';
    GroupedCategoryChart.type = 'groupedCategory';
    return GroupedCategoryChart;
}(CartesianChart));

var __extends$B = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Label = /** @class */ (function (_super) {
    __extends$B(Label, _super);
    function Label() {
        var _this = _super.call(this) || this;
        _this.enabled = true;
        _this.fontSize = 12;
        _this.fontFamily = 'Verdana, sans-serif';
        _this.color = 'rgba(70, 70, 70, 1)';
        return _this;
    }
    Label.prototype.getFont = function () {
        return getFont(this.fontSize, this.fontFamily, this.fontStyle, this.fontWeight);
    };
    __decorate$4([
        reactive('change', 'dataChange')
    ], Label.prototype, "enabled", void 0);
    __decorate$4([
        reactive('change')
    ], Label.prototype, "fontSize", void 0);
    __decorate$4([
        reactive('change')
    ], Label.prototype, "fontFamily", void 0);
    __decorate$4([
        reactive('change')
    ], Label.prototype, "fontStyle", void 0);
    __decorate$4([
        reactive('change')
    ], Label.prototype, "fontWeight", void 0);
    __decorate$4([
        reactive('change')
    ], Label.prototype, "color", void 0);
    return Label;
}(Observable));

var __extends$C = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$b = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$3 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$b(arguments[i]));
    return ar;
};
var SeriesItemHighlightStyle = /** @class */ (function () {
    function SeriesItemHighlightStyle() {
        this.fill = 'yellow';
        this.stroke = undefined;
        this.strokeWidth = undefined;
    }
    return SeriesItemHighlightStyle;
}());
var SeriesHighlightStyle = /** @class */ (function () {
    function SeriesHighlightStyle() {
        this.strokeWidth = undefined;
        this.dimOpacity = undefined;
    }
    return SeriesHighlightStyle;
}());
var HighlightStyle = /** @class */ (function () {
    function HighlightStyle() {
        /**
         * @deprecated Use item.fill instead.
         */
        this.fill = undefined;
        /**
         * @deprecated Use item.stroke instead.
         */
        this.stroke = undefined;
        /**
        * @deprecated Use item.strokeWidth instead.
        */
        this.strokeWidth = undefined;
        this.item = new SeriesItemHighlightStyle();
        this.series = new SeriesHighlightStyle();
    }
    return HighlightStyle;
}());
var SeriesTooltip = /** @class */ (function (_super) {
    __extends$C(SeriesTooltip, _super);
    function SeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        return _this;
    }
    __decorate$5([
        reactive('change')
    ], SeriesTooltip.prototype, "enabled", void 0);
    return SeriesTooltip;
}(Observable));
var Series = /** @class */ (function (_super) {
    __extends$C(Series, _super);
    function Series() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = createId(_this);
        // The group node that contains all the nodes used to render this series.
        _this.group = new Group();
        // The group node that contains all the nodes that can be "picked" (react to hover, tap, click).
        _this.pickGroup = _this.group.appendChild(new Group());
        _this.directions = [exports.ChartAxisDirection.X, exports.ChartAxisDirection.Y];
        _this.directionKeys = {};
        _this.label = new Label();
        _this.data = undefined;
        _this.visible = true;
        _this.showInLegend = true;
        _this.cursor = 'default';
        _this._nodeDataPending = true;
        _this._updatePending = false;
        _this.highlightStyle = new HighlightStyle();
        _this.scheduleLayout = function () {
            _this.fireEvent({ type: 'layoutChange' });
        };
        _this.scheduleData = function () {
            _this.fireEvent({ type: 'dataChange' });
        };
        return _this;
    }
    Object.defineProperty(Series.prototype, "type", {
        get: function () {
            return this.constructor.type || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Series.prototype, "grouped", {
        set: function (g) {
            if (g === true) {
                throw new Error("AG Charts - grouped: true is unsupported for series of type: " + this.type);
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.setColors = function (fills, strokes) { };
    // Returns the actual keys used (to fetch the values from `data` items) for the given direction.
    Series.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values.push.apply(values, __spread$3(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    // Using processed data, create data that backs visible nodes.
    Series.prototype.createNodeData = function () { return []; };
    // Returns persisted node data associated with the rendered portion of the series' data.
    Series.prototype.getNodeData = function () { return []; };
    Series.prototype.getLabelData = function () { return []; };
    Object.defineProperty(Series.prototype, "nodeDataPending", {
        get: function () {
            return this._nodeDataPending;
        },
        set: function (value) {
            if (this._nodeDataPending !== value) {
                this._nodeDataPending = value;
                this.updatePending = true;
                if (value && this.chart) {
                    this.chart.updatePending = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.scheduleNodeDate = function () {
        this.nodeDataPending = true;
    };
    Object.defineProperty(Series.prototype, "updatePending", {
        get: function () {
            return this._updatePending;
        },
        set: function (value) {
            if (this._updatePending !== value) {
                this._updatePending = value;
                if (value && this.chart) {
                    this.chart.updatePending = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.scheduleUpdate = function () {
        this.updatePending = true;
    };
    Series.prototype.getOpacity = function (datum) {
        var _a = this, chart = _a.chart, _b = _a.highlightStyle.series.dimOpacity, dimOpacity = _b === void 0 ? 1 : _b;
        return !chart || !chart.highlightedDatum ||
            chart.highlightedDatum.series === this &&
                (!datum || chart.highlightedDatum.itemId === datum.itemId) ? 1 : dimOpacity;
    };
    Series.prototype.getStrokeWidth = function (defaultStrokeWidth, datum) {
        var _a = this, chart = _a.chart, strokeWidth = _a.highlightStyle.series.strokeWidth;
        return chart && chart.highlightedDatum &&
            chart.highlightedDatum.series === this &&
            (!datum || chart.highlightedDatum.itemId === datum.itemId) &&
            strokeWidth !== undefined ? strokeWidth : defaultStrokeWidth;
    };
    Series.prototype.fireNodeClickEvent = function (event, datum) { };
    Series.prototype.toggleSeriesItem = function (itemId, enabled) {
        this.visible = enabled;
    };
    // Each series is expected to have its own logic to efficiently update its nodes
    // on hightlight changes.
    Series.prototype.onHighlightChange = function () { };
    Series.prototype.fixNumericExtent = function (extent, type, axis) {
        if (!extent) {
            return [0, 1];
        }
        var _a = __read$b(extent, 2), min = _a[0], max = _a[1];
        min = +min;
        max = +max;
        if (min === 0 && max === 0) {
            // domain has zero length and the single valid value is 0. Use the default of [0, 1].
            return [0, 1];
        }
        if (min === max) {
            // domain has zero length, there is only a single valid value in data
            if (axis instanceof TimeAxis) { // numbers in domain correspond to Unix timestamps
                // automatically expand domain by 1 in each direction
                min -= 1;
                max += 1;
            }
            else {
                var padding = Math.abs(min * 0.01);
                min -= padding;
                max += padding;
            }
        }
        if (!(isNumber(min) && isNumber(max))) {
            return [0, 1];
        }
        return [min, max];
    };
    Series.highlightedZIndex = 1000000000000;
    __decorate$5([
        reactive('dataChange')
    ], Series.prototype, "data", void 0);
    __decorate$5([
        reactive('dataChange')
    ], Series.prototype, "visible", void 0);
    __decorate$5([
        reactive('layoutChange')
    ], Series.prototype, "showInLegend", void 0);
    return Series;
}(Observable));

var __extends$D = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SeriesMarker = /** @class */ (function (_super) {
    __extends$D(SeriesMarker, _super);
    function SeriesMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        /**
         * One of the predefined marker names, or a marker constructor function (for user-defined markers).
         * A series will create one marker instance per data point.
         */
        _this.shape = Circle;
        _this.size = 6;
        /**
         * In case a series has the `sizeKey` set, the `sizeKey` values along with the `size` and `maxSize` configs
         * will be used to determine the size of the marker. All values will be mapped to a marker size
         * within the `[size, maxSize]` range, where the largest values will correspond to the `maxSize`
         * and the lowest to the `size`.
         */
        _this.maxSize = 30;
        _this.strokeWidth = 1;
        return _this;
    }
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "enabled", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "shape", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "size", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "maxSize", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "domain", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "fill", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "stroke", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "strokeWidth", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "fillOpacity", void 0);
    __decorate$6([
        reactive('change')
    ], SeriesMarker.prototype, "strokeOpacity", void 0);
    return SeriesMarker;
}(Observable));

var __extends$E = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PolarSeries = /** @class */ (function (_super) {
    __extends$E(PolarSeries, _super);
    function PolarSeries() {
        var _a;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.directionKeys = (_a = {},
            _a[exports.ChartAxisDirection.X] = ['angleKey'],
            _a[exports.ChartAxisDirection.Y] = ['radiusKey'],
            _a);
        /**
         * The center of the polar series (for example, the center of a pie).
         * If the polar chart has multiple series, all of them will have their
         * center set to the same value as a result of the polar chart layout.
         * The center coordinates are not supposed to be set by the user.
         */
        _this.centerX = 0;
        _this.centerY = 0;
        /**
         * The maximum radius the series can use.
         * This value is set automatically as a result of the polar chart layout
         * and is not supposed to be set by the user.
         */
        _this.radius = 0;
        return _this;
    }
    return PolarSeries;
}(Series));
var PolarSeriesMarker = /** @class */ (function (_super) {
    __extends$E(PolarSeriesMarker, _super);
    function PolarSeriesMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PolarSeriesMarker;
}(SeriesMarker));

var __extends$F = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PolarChart = /** @class */ (function (_super) {
    __extends$F(PolarChart, _super);
    function PolarChart(document) {
        if (document === void 0) { document = window.document; }
        var _this = _super.call(this, document) || this;
        _this.padding = new Padding(40);
        _this.scene.root.append(_this.legend.group);
        _this.padding.addEventListener('layoutChange', _this.scheduleLayout, _this);
        return _this;
    }
    Object.defineProperty(PolarChart.prototype, "seriesRoot", {
        get: function () {
            return this.scene.root;
        },
        enumerable: true,
        configurable: true
    });
    PolarChart.prototype.performLayout = function () {
        var shrinkRect = new BBox(0, 0, this.width, this.height);
        this.positionCaptions();
        this.positionLegend();
        var captionAutoPadding = this.captionAutoPadding;
        shrinkRect.y += captionAutoPadding;
        shrinkRect.height -= captionAutoPadding;
        if (this.legend.enabled && this.legend.data.length) {
            var legendAutoPadding = this.legendAutoPadding;
            shrinkRect.x += legendAutoPadding.left;
            shrinkRect.y += legendAutoPadding.top;
            shrinkRect.width -= legendAutoPadding.left + legendAutoPadding.right;
            shrinkRect.height -= legendAutoPadding.top + legendAutoPadding.bottom;
            var legendPadding = this.legend.spacing;
            switch (this.legend.position) {
                case 'right':
                    shrinkRect.width -= legendPadding;
                    break;
                case 'bottom':
                    shrinkRect.height -= legendPadding;
                    break;
                case 'left':
                    shrinkRect.x += legendPadding;
                    shrinkRect.width -= legendPadding;
                    break;
                case 'top':
                    shrinkRect.y += legendPadding;
                    shrinkRect.height -= legendPadding;
                    break;
            }
        }
        var padding = this.padding;
        shrinkRect.x += padding.left;
        shrinkRect.y += padding.top;
        shrinkRect.width -= padding.left + padding.right;
        shrinkRect.height -= padding.top + padding.bottom;
        this.seriesRect = shrinkRect;
        var centerX = shrinkRect.x + shrinkRect.width / 2;
        var centerY = shrinkRect.y + shrinkRect.height / 2;
        var radius = Math.max(0, Math.min(shrinkRect.width, shrinkRect.height) / 2); // radius shouldn't be negative
        this.series.forEach(function (series) {
            if (series instanceof PolarSeries) {
                series.centerX = centerX;
                series.centerY = centerY;
                series.radius = radius;
                series.update();
            }
        });
    };
    PolarChart.className = 'PolarChart';
    PolarChart.type = 'polar';
    return PolarChart;
}(Chart));

var __extends$G = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CartesianSeries = /** @class */ (function (_super) {
    __extends$G(CartesianSeries, _super);
    function CartesianSeries() {
        var _a;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.directionKeys = (_a = {},
            _a[exports.ChartAxisDirection.X] = ['xKey'],
            _a[exports.ChartAxisDirection.Y] = ['yKey'],
            _a);
        return _this;
    }
    /**
     * Note: we are passing `isContinuousX` and `isContinuousY` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param x A domain value to be plotted along the x-axis.
     * @param y A domain value to be plotted along the y-axis.
     * @param isContinuousX Typically this will be the value of `xAxis.scale instanceof ContinuousScale`.
     * @param isContinuousY Typically this will be the value of `yAxis.scale instanceof ContinuousScale`.
     * @returns `[x, y]`, if both x and y are valid domain values for their respective axes/scales, or `undefined`.
     */
    CartesianSeries.prototype.checkDomainXY = function (x, y, isContinuousX, isContinuousY) {
        var isValidDatum = (isContinuousX && isContinuous(x) || !isContinuousX && isDiscrete(x)) &&
            (isContinuousY && isContinuous(y) || !isContinuousY && isDiscrete(y));
        return isValidDatum ? [x, y] : undefined;
    };
    /**
     * Note: we are passing `isContinuousScale` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param value A domain value to be plotted along an axis.
     * @param isContinuousScale Typically this will be the value of `xAxis.scale instanceof ContinuousScale` or `yAxis.scale instanceof ContinuousScale`.
     * @returns `value`, if the value is valid for its axis/scale, or `undefined`.
     */
    CartesianSeries.prototype.checkDatum = function (value, isContinuousScale) {
        if (isContinuousScale && isContinuous(value)) {
            return value;
        }
        else if (!isContinuousScale) {
            if (!isDiscrete(value)) {
                return String(value);
            }
            return value;
        }
        return undefined;
    };
    /**
     * Note: we are passing the xAxis and yAxis because the calling code is supposed to make sure
     *       that series has both of them defined, and also to avoid one level of indirection,
     *       e.g. `this.xAxis!.inRange(x)`, both of which are suboptimal in tight loops where this method is used.
     * @param x A range value to be plotted along the x-axis.
     * @param y A range value to be plotted along the y-axis.
     * @param xAxis The series' x-axis.
     * @param yAxis The series' y-axis.
     * @returns
     */
    CartesianSeries.prototype.checkRangeXY = function (x, y, xAxis, yAxis) {
        return !isNaN(x) && !isNaN(y) && xAxis.inRange(x) && yAxis.inRange(y);
    };
    return CartesianSeries;
}(Series));
var CartesianSeriesMarker = /** @class */ (function (_super) {
    __extends$G(CartesianSeriesMarker, _super);
    function CartesianSeriesMarker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.formatter = undefined;
        return _this;
    }
    return CartesianSeriesMarker;
}(SeriesMarker));

function equal(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor)
            return false;
        var length_1, i = void 0;
        if (Array.isArray(a)) {
            length_1 = a.length;
            if (length_1 != b.length)
                return false;
            for (i = length_1; i-- !== 0;)
                if (!equal(a[i], b[i]))
                    return false;
            return true;
        }
        // if ((a instanceof Map) && (b instanceof Map)) {
        //     if (a.size !== b.size) return false;
        //     for (i of a.entries())
        //         if (!b.has(i[0])) return false;
        //     for (i of a.entries())
        //         if (!equal(i[1], b.get(i[0]))) return false;
        //     return true;
        // }
        //
        // if ((a instanceof Set) && (b instanceof Set)) {
        //     if (a.size !== b.size) return false;
        //     for (i of a.entries())
        //         if (!b.has(i[0])) return false;
        //     return true;
        // }
        //
        // if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        //     length = a.length;
        //     if (length != b.length) return false;
        //     for (i = length; i-- !== 0;)
        //         if (a[i] !== b[i]) return false;
        //     return true;
        // }
        if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
        var keys = Object.keys(a);
        length_1 = keys.length;
        if (length_1 !== Object.keys(b).length)
            return false;
        for (i = length_1; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        for (i = length_1; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key]))
                return false;
        }
        return true;
    }
    // true if both NaN, false otherwise
    return a !== a && b !== b;
}

var __read$c = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var interpolatePattern = /(#\{(.*?)\})/g;
function interpolate(input, values, formats) {
    return input.replace(interpolatePattern, function () {
        var name = arguments[2];
        var _a = __read$c(name.split(':'), 2), valueName = _a[0], formatName = _a[1];
        var value = values[valueName];
        if (typeof value === 'number') {
            var format = formatName && formats && formats[formatName];
            if (format) {
                var _b = format, locales = _b.locales, options = _b.options;
                return value.toLocaleString(locales, options);
            }
            return String(value);
        }
        if (value instanceof Date) {
            var format = formatName && formats && formats[formatName];
            if (typeof format === 'string') {
                var formatter = locale.format(format);
                return formatter(value);
            }
            return value.toDateString();
        }
        if (typeof value === 'string' || (value && value.toString)) {
            return String(value);
        }
        return '';
    });
}

var element = null;
function sanitizeHtml(text) {
    element = element || document.createElement('div');
    if (!text) {
        return '';
    }
    element.innerText = text;
    return element.innerHTML;
}

var __extends$H = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$4 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$d = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$4 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$d(arguments[i]));
    return ar;
};
var AreaSeriesLabel = /** @class */ (function (_super) {
    __extends$H(AreaSeriesLabel, _super);
    function AreaSeriesLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        reactive('change')
    ], AreaSeriesLabel.prototype, "formatter", void 0);
    return AreaSeriesLabel;
}(Label));
var AreaSeriesTooltip = /** @class */ (function (_super) {
    __extends$H(AreaSeriesTooltip, _super);
    function AreaSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$7([
        reactive('change')
    ], AreaSeriesTooltip.prototype, "renderer", void 0);
    __decorate$7([
        reactive('change')
    ], AreaSeriesTooltip.prototype, "format", void 0);
    return AreaSeriesTooltip;
}(SeriesTooltip));
var AreaSeries = /** @class */ (function (_super) {
    __extends$H(AreaSeries, _super);
    function AreaSeries() {
        var _this = _super.call(this) || this;
        _this.tooltip = new AreaSeriesTooltip();
        _this.areaGroup = _this.group.insertBefore(new Group, _this.pickGroup);
        _this.strokeGroup = _this.group.insertBefore(new Group, _this.pickGroup);
        _this.markerGroup = _this.pickGroup.appendChild(new Group);
        _this.labelGroup = _this.group.appendChild(new Group);
        _this.fillSelection = Selection.select(_this.areaGroup).selectAll();
        _this.strokeSelection = Selection.select(_this.strokeGroup).selectAll();
        _this.markerSelection = Selection.select(_this.markerGroup).selectAll();
        _this.labelSelection = Selection.select(_this.labelGroup).selectAll();
        /**
         * The assumption is that the values will be reset (to `true`)
         * in the {@link yKeys} setter.
         */
        _this.seriesItemEnabled = new Map();
        _this.xData = [];
        _this.yData = [];
        _this.fillSelectionData = [];
        _this.strokeSelectionData = [];
        _this.markerSelectionData = [];
        _this.labelSelectionData = [];
        _this.yDomain = [];
        _this.xDomain = [];
        _this.directionKeys = {
            x: ['xKey'],
            y: ['yKeys']
        };
        _this.marker = new CartesianSeriesMarker();
        _this.label = new AreaSeriesLabel();
        _this.fills = [
            '#c16068',
            '#a2bf8a',
            '#ebcc87',
            '#80a0c3',
            '#b58dae',
            '#85c0d1'
        ];
        _this.strokes = [
            '#874349',
            '#718661',
            '#a48f5f',
            '#5a7088',
            '#7f637a',
            '#5d8692'
        ];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this._xKey = '';
        _this.xName = '';
        _this._yKeys = [];
        _this.yNames = [];
        _this.strokeWidth = 2;
        _this.addEventListener('update', _this.scheduleUpdate);
        var _a = _this, marker = _a.marker, label = _a.label;
        marker.enabled = false;
        marker.addPropertyListener('shape', _this.onMarkerShapeChange, _this);
        marker.addEventListener('change', _this.scheduleUpdate, _this);
        label.enabled = false;
        label.addEventListener('change', _this.scheduleUpdate, _this);
        return _this;
    }
    AreaSeries.prototype.onMarkerShapeChange = function () {
        this.markerSelection = this.markerSelection.setData([]);
        this.markerSelection.exit.remove();
        this.fireEvent({ type: 'legendChange' });
    };
    Object.defineProperty(AreaSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            if (this._xKey !== value) {
                this._xKey = value;
                this.xData = [];
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AreaSeries.prototype, "yKeys", {
        get: function () {
            return this._yKeys;
        },
        set: function (values) {
            if (!equal(this._yKeys, values)) {
                this._yKeys = values;
                this.yData = [];
                var seriesItemEnabled_1 = this.seriesItemEnabled;
                seriesItemEnabled_1.clear();
                values.forEach(function (key) { return seriesItemEnabled_1.set(key, true); });
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    AreaSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
    };
    Object.defineProperty(AreaSeries.prototype, "normalizedTo", {
        get: function () {
            return this._normalizedTo;
        },
        set: function (value) {
            var absValue = value ? Math.abs(value) : undefined;
            if (this._normalizedTo !== absValue) {
                this._normalizedTo = absValue;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    AreaSeries.prototype.processData = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        var _this = this;
        var _d = this, xKey = _d.xKey, yKeys = _d.yKeys, seriesItemEnabled = _d.seriesItemEnabled, xAxis = _d.xAxis, yAxis = _d.yAxis, normalizedTo = _d.normalizedTo;
        var data = xKey && yKeys.length && this.data ? this.data : [];
        if (!xAxis || !yAxis) {
            return false;
        }
        // If the data is an array of rows like so:
        //
        // [{
        //   xKey: 'Jan',
        //   yKey1: 5,
        //   yKey2: 7,
        //   yKey3: -9,
        // }, {
        //   xKey: 'Feb',
        //   yKey1: 10,
        //   yKey2: -15,
        //   yKey3: 20
        // }]
        //
        var isContinuousX = xAxis.scale instanceof ContinuousScale;
        var isContinuousY = yAxis.scale instanceof ContinuousScale;
        var normalized = normalizedTo && isFinite(normalizedTo);
        var yData = [];
        var xData = [];
        var xValues = [];
        var _loop_1 = function (datum) {
            // X datum
            if (!(xKey in datum)) {
                doOnce(function () { return console.warn("The key '" + xKey + "' was not found in the data: ", datum); }, xKey + " not found in data");
                return "continue";
            }
            var xDatum = this_1.checkDatum(datum[xKey], isContinuousX);
            if (isContinuousX && xDatum === undefined) {
                return "continue";
            }
            else {
                xValues.push(xDatum);
                xData.push({ xDatum: xDatum, seriesDatum: datum });
            }
            // Y datum
            yKeys.forEach(function (yKey, i) {
                if (!(yKey in datum)) {
                    doOnce(function () { return console.warn("The key '" + yKey + "' was not found in the data: ", datum); }, yKey + " not found in data");
                    return;
                }
                var value = datum[yKey];
                var seriesYs = yData[i] || (yData[i] = []);
                if (!seriesItemEnabled.get(yKey)) {
                    seriesYs.push(0);
                }
                else {
                    var yDatum = _this.checkDatum(value, isContinuousY);
                    seriesYs.push(yDatum);
                }
            });
        };
        var this_1 = this;
        try {
            for (var data_1 = __values$4(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var datum = data_1_1.value;
                _loop_1(datum);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.yData = yData;
        this.xData = xData;
        this.xDomain = isContinuousX ? this.fixNumericExtent(extent(xValues, isContinuous), 'x', xAxis) : xValues;
        // xData: ['Jan', 'Feb', undefined]
        //
        // yData: [
        //   [5, 10], <- series 1 (yKey1)
        //   [7, -15], <- series 2 (yKey2)
        //   [-9, 20] <- series 3 (yKey3)
        // ]
        var yMin = 0;
        var yMax = 0;
        for (var i = 0; i < xData.length; i++) {
            var total = { sum: 0, absSum: 0 };
            try {
                for (var yData_1 = (e_2 = void 0, __values$4(yData)), yData_1_1 = yData_1.next(); !yData_1_1.done; yData_1_1 = yData_1.next()) {
                    var seriesYs = yData_1_1.value;
                    if (seriesYs[i] === undefined) {
                        continue;
                    }
                    var y = +seriesYs[i]; // convert to number as the value could be a Date object
                    total.absSum += Math.abs(y);
                    total.sum += y;
                    if (total.sum > yMax) {
                        yMax = total.sum;
                    }
                    else if (total.sum < yMin) {
                        yMin = total.sum;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (yData_1_1 && !yData_1_1.done && (_b = yData_1.return)) _b.call(yData_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!(normalized && normalizedTo)) {
                continue;
            }
            var normalizedTotal = 0;
            try {
                // normalize y values using the absolute sum of y values in the stack
                for (var yData_2 = (e_3 = void 0, __values$4(yData)), yData_2_1 = yData_2.next(); !yData_2_1.done; yData_2_1 = yData_2.next()) {
                    var seriesYs = yData_2_1.value;
                    var normalizedY = +seriesYs[i] / total.absSum * normalizedTo;
                    seriesYs[i] = normalizedY;
                    // sum normalized values to get updated yMin and yMax of normalized area
                    normalizedTotal += normalizedY;
                    if (normalizedTotal > yMax) {
                        yMax = normalizedTotal;
                    }
                    else if (normalizedTotal < yMin) {
                        yMin = normalizedTotal;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (yData_2_1 && !yData_2_1.done && (_c = yData_2.return)) _c.call(yData_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        if (normalized && normalizedTo) {
            // multiplier to control the unused whitespace in the y domain, value selected by subjective visual 'niceness'.
            var domainWhitespaceAdjustment = 0.5;
            // set the yMin and yMax based on cumulative sum of normalized values
            yMin = yMin < (-normalizedTo * domainWhitespaceAdjustment) ? -normalizedTo : yMin;
            yMax = yMax > (normalizedTo * domainWhitespaceAdjustment) ? normalizedTo : yMax;
        }
        this.yDomain = this.fixNumericExtent([yMin, yMax], 'y', yAxis);
        this.fireEvent({ type: 'dataProcessed' });
        return true;
    };
    AreaSeries.prototype.findLargestMinMax = function (totals) {
        var e_4, _a;
        var min = 0;
        var max = 0;
        try {
            for (var totals_1 = __values$4(totals), totals_1_1 = totals_1.next(); !totals_1_1.done; totals_1_1 = totals_1.next()) {
                var total = totals_1_1.value;
                if (total.min < min) {
                    min = total.min;
                }
                if (total.max > max) {
                    max = total.max;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (totals_1_1 && !totals_1_1.done && (_a = totals_1.return)) _a.call(totals_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return { min: min, max: max };
    };
    AreaSeries.prototype.getDomain = function (direction) {
        if (direction === exports.ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    AreaSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    AreaSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        this.createSelectionData();
        this.updateFillSelection();
        this.updateStrokeSelection();
        this.updateMarkerSelection();
        this.updateLabelSelection();
    };
    AreaSeries.prototype.updateNodes = function () {
        this.group.visible = this.visible && this.xData.length > 0 && this.yData.length > 0;
        this.updateFillNodes();
        this.updateStrokeNodes();
        this.updateMarkerNodes();
        this.updateLabelNodes();
    };
    AreaSeries.prototype.createSelectionData = function () {
        var _this = this;
        var _a = this, data = _a.data, xAxis = _a.xAxis, yAxis = _a.yAxis, xData = _a.xData, yData = _a.yData, labelSelectionData = _a.labelSelectionData, markerSelectionData = _a.markerSelectionData, strokeSelectionData = _a.strokeSelectionData, fillSelectionData = _a.fillSelectionData, xKey = _a.xKey;
        if (!data || !xAxis || !yAxis || !xData.length || !yData.length) {
            return;
        }
        var _b = this, yKeys = _b.yKeys, marker = _b.marker, label = _b.label, fills = _b.fills, strokes = _b.strokes;
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var continuousY = yScale instanceof ContinuousScale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        markerSelectionData.length = 0;
        labelSelectionData.length = 0;
        strokeSelectionData.length = 0;
        fillSelectionData.length = 0;
        var cumulativePathValues = new Array(xData.length).fill(null).map(function () { return ({ left: 0, right: 0 }); });
        var cumulativeMarkerValues = new Array(xData.length).fill(0);
        var createPathCoordinates = function (xDatum, yDatum, idx, side) {
            var x = xScale.convert(xDatum) + xOffset;
            var prevY = cumulativePathValues[idx][side];
            var currY = cumulativePathValues[idx][side] + yDatum;
            var prevYCoordinate = yScale.convert(prevY, continuousY ? clamper : undefined);
            var currYCoordinate = yScale.convert(currY, continuousY ? clamper : undefined);
            cumulativePathValues[idx][side] = currY;
            return [
                { x: x, y: currYCoordinate },
                { x: x, y: prevYCoordinate },
            ];
        };
        var createMarkerCoordinate = function (xDatum, yDatum, idx, rawYDatum) {
            var currY;
            // if not normalized, the invalid data points will be processed as `undefined` in processData()
            // if normalized, the invalid data points will be processed as 0 rather than `undefined`
            // check if unprocessed datum is valid as we only want to show markers for valid points
            var normalized = _this.normalizedTo && isFinite(_this.normalizedTo);
            var normalizedAndValid = normalized && continuousY && isContinuous(rawYDatum);
            var valid = (!normalized && !isNaN(yDatum)) || normalizedAndValid;
            if (valid) {
                currY = cumulativeMarkerValues[idx] += yDatum;
            }
            var x = xScale.convert(xDatum) + xOffset;
            var y = yScale.convert(currY, continuousY ? clamper : undefined);
            return { x: x, y: y };
        };
        yData.forEach(function (seriesYs, seriesIdx) {
            var yKey = yKeys[seriesIdx];
            var fillSelectionForSeries = fillSelectionData[seriesIdx] || (fillSelectionData[seriesIdx] = { itemId: yKey, points: [] });
            var fillPoints = fillSelectionForSeries.points;
            var fillPhantomPoints = [];
            var strokeDatum = strokeSelectionData[seriesIdx] || (strokeSelectionData[seriesIdx] = { itemId: yKey, points: [], yValues: [] });
            var strokePoints = strokeDatum.points;
            var yValues = strokeDatum.yValues;
            seriesYs.forEach(function (yDatum, datumIdx) {
                var _a;
                var _b = xData[datumIdx], xDatum = _b.xDatum, seriesDatum = _b.seriesDatum;
                var nextXDatum = (_a = xData[datumIdx + 1]) === null || _a === void 0 ? void 0 : _a.xDatum;
                var nextYDatum = seriesYs[datumIdx + 1];
                // marker data
                var point = createMarkerCoordinate(xDatum, +yDatum, datumIdx, seriesDatum[yKey]);
                if (marker) {
                    markerSelectionData.push({
                        index: datumIdx,
                        series: _this,
                        itemId: yKey,
                        datum: seriesDatum,
                        yValue: yDatum,
                        yKey: yKey,
                        point: point,
                        fill: fills[seriesIdx % fills.length],
                        stroke: strokes[seriesIdx % strokes.length]
                    });
                }
                // label data
                var labelText;
                if (label.formatter) {
                    labelText = label.formatter({ value: yDatum });
                }
                else {
                    labelText = isNumber(yDatum) ? Number(yDatum).toFixed(2) : String(yDatum);
                }
                if (label) {
                    labelSelectionData.push({
                        index: datumIdx,
                        itemId: yKey,
                        point: point,
                        label: _this.seriesItemEnabled.get(yKey) && labelText ? {
                            text: labelText,
                            fontStyle: label.fontStyle,
                            fontWeight: label.fontWeight,
                            fontSize: label.fontSize,
                            fontFamily: label.fontFamily,
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            fill: label.color
                        } : undefined
                    });
                }
                // fill data
                // Handle data in pairs of current and next x and y values
                var windowX = [xDatum, nextXDatum];
                var windowY = [yDatum, nextYDatum];
                if (windowX.some(function (v) { return v == undefined; })) {
                    return;
                }
                if (windowY.some(function (v) { return v == undefined; })) {
                    windowY[0] = 0;
                    windowY[1] = 0;
                }
                var currCoordinates = createPathCoordinates(windowX[0], +windowY[0], datumIdx, 'right');
                fillPoints.push(currCoordinates[0]);
                fillPhantomPoints.push(currCoordinates[1]);
                var nextCoordinates = createPathCoordinates(windowX[1], +windowY[1], datumIdx, 'left');
                fillPoints.push(nextCoordinates[0]);
                fillPhantomPoints.push(nextCoordinates[1]);
                // stroke data
                strokePoints.push({ x: NaN, y: NaN }); // moveTo
                yValues.push(undefined);
                strokePoints.push(currCoordinates[0]);
                yValues.push(yDatum);
                if (nextYDatum !== undefined) {
                    strokePoints.push(nextCoordinates[0]);
                    yValues.push(yDatum);
                }
            });
            fillPoints.push.apply(fillPoints, __spread$4(fillPhantomPoints.slice().reverse()));
        });
    };
    AreaSeries.prototype.updateFillSelection = function () {
        var updateFills = this.fillSelection.setData(this.fillSelectionData);
        updateFills.exit.remove();
        var enterFills = updateFills.enter.append(Path)
            .each(function (path) {
            path.lineJoin = 'round';
            path.stroke = undefined;
            path.pointerEvents = PointerEvents.None;
        });
        this.fillSelection = updateFills.merge(enterFills);
    };
    AreaSeries.prototype.updateFillNodes = function () {
        var _this = this;
        var _a = this, fills = _a.fills, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, strokeWidth = _a.strokeWidth, shadow = _a.shadow, seriesItemEnabled = _a.seriesItemEnabled;
        this.fillSelection.each(function (shape, datum, index) {
            shape.fill = fills[index % fills.length];
            shape.fillOpacity = fillOpacity;
            shape.strokeOpacity = strokeOpacity;
            shape.strokeWidth = strokeWidth;
            shape.lineDash = _this.lineDash;
            shape.lineDashOffset = _this.lineDashOffset;
            shape.fillShadow = shadow;
            shape.visible = !!seriesItemEnabled.get(datum.itemId);
            shape.opacity = _this.getOpacity(datum);
            var points = datum.points;
            var path = shape.path;
            path.clear();
            points.forEach(function (_a, i) {
                var x = _a.x, y = _a.y;
                if (i > 0) {
                    path.lineTo(x, y);
                }
                else {
                    path.moveTo(x, y);
                }
            });
            path.closePath();
        });
    };
    AreaSeries.prototype.updateStrokeSelection = function () {
        var updateStrokes = this.strokeSelection.setData(this.strokeSelectionData);
        updateStrokes.exit.remove();
        var enterStrokes = updateStrokes.enter.append(Path)
            .each(function (path) {
            path.fill = undefined;
            path.lineJoin = path.lineCap = 'round';
            path.pointerEvents = PointerEvents.None;
        });
        this.strokeSelection = updateStrokes.merge(enterStrokes);
    };
    AreaSeries.prototype.updateStrokeNodes = function () {
        var _this = this;
        if (!this.data) {
            return;
        }
        var _a = this, strokes = _a.strokes, strokeOpacity = _a.strokeOpacity, seriesItemEnabled = _a.seriesItemEnabled;
        var moveTo = true;
        this.strokeSelection.each(function (shape, datum, index) {
            shape.visible = !!seriesItemEnabled.get(datum.itemId);
            shape.opacity = _this.getOpacity(datum);
            shape.stroke = strokes[index % strokes.length];
            shape.strokeWidth = _this.getStrokeWidth(_this.strokeWidth, datum);
            shape.strokeOpacity = strokeOpacity;
            shape.lineDash = _this.lineDash;
            shape.lineDashOffset = _this.lineDashOffset;
            var points = datum.points, yValues = datum.yValues;
            var path = shape.path;
            path.clear();
            for (var i = 0; i < points.length; i++) {
                var _a = points[i], x = _a.x, y = _a.y;
                if (yValues[i] === undefined) {
                    moveTo = true;
                }
                else {
                    if (moveTo) {
                        path.moveTo(x, y);
                        moveTo = false;
                    }
                    else {
                        path.lineTo(x, y);
                    }
                }
            }
        });
    };
    AreaSeries.prototype.updateMarkerSelection = function () {
        var MarkerShape = getMarker(this.marker.shape);
        var data = MarkerShape ? this.markerSelectionData : [];
        var updateMarkers = this.markerSelection.setData(data);
        updateMarkers.exit.remove();
        var enterMarkers = updateMarkers.enter.append(MarkerShape);
        this.markerSelection = updateMarkers.merge(enterMarkers);
    };
    AreaSeries.prototype.updateMarkerNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, xKey = _a.xKey, marker = _a.marker, seriesItemEnabled = _a.seriesItemEnabled, yKeys = _a.yKeys, fills = _a.fills, strokes = _a.strokes, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        var size = marker.size, formatter = marker.formatter;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : this.strokeWidth;
        this.markerSelection.each(function (node, datum) {
            var yKeyIndex = yKeys.indexOf(datum.yKey);
            var isDatumHighlighted = datum === highlightedDatum;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : marker.fill || fills[yKeyIndex % fills.length];
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : marker.stroke || strokes[yKeyIndex % fills.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : markerStrokeWidth;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: datum.yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted
                });
            }
            node.fill = format && format.fill || fill;
            node.stroke = format && format.stroke || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined
                ? format.strokeWidth
                : strokeWidth;
            node.size = format && format.size !== undefined
                ? format.size
                : size;
            node.translationX = datum.point.x;
            node.translationY = datum.point.y;
            node.visible = marker.enabled && node.size > 0 && !!seriesItemEnabled.get(datum.yKey) && !isNaN(datum.point.x) && !isNaN(datum.point.y);
            node.opacity = _this.getOpacity(datum);
        });
    };
    AreaSeries.prototype.updateLabelSelection = function () {
        var updateLabels = this.labelSelection.setData(this.labelSelectionData);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text);
        this.labelSelection = updateLabels.merge(enterLabels);
    };
    AreaSeries.prototype.updateLabelNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this.label, labelEnabled = _a.enabled, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, color = _a.color;
        this.labelSelection.each(function (text, datum) {
            var point = datum.point, label = datum.label;
            if (label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = point.x;
                text.y = point.y - 10;
                text.fill = color;
                text.visible = true;
                text.opacity = _this.getOpacity(datum);
            }
            else {
                text.visible = false;
            }
        });
    };
    AreaSeries.prototype.getNodeData = function () {
        return this.markerSelectionData;
    };
    AreaSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: datum.yKey
        });
    };
    AreaSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var xKey = this.xKey;
        var yKey = nodeDatum.yKey;
        if (!(xKey && yKey) || !this.seriesItemEnabled.get(yKey)) {
            return '';
        }
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var _a = this, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!(xAxis && yAxis && isNumber(yValue))) {
            return '';
        }
        var _b = this, xName = _b.xName, yKeys = _b.yKeys, yNames = _b.yNames, yData = _b.yData, fills = _b.fills, strokes = _b.strokes, tooltip = _b.tooltip, marker = _b.marker;
        var size = marker.size, markerFormatter = marker.formatter, markerStrokeWidth = marker.strokeWidth, markerFill = marker.fill, markerStroke = marker.stroke;
        var xString = xAxis.formatDatum(xValue);
        var yString = yAxis.formatDatum(yValue);
        var yKeyIndex = yKeys.indexOf(yKey);
        var seriesYs = yData[yKeyIndex];
        var processedYValue = seriesYs[nodeDatum.index];
        var yName = yNames[yKeyIndex];
        var title = sanitizeHtml(yName);
        var content = sanitizeHtml(xString + ': ' + yString);
        var strokeWidth = markerStrokeWidth !== undefined ? markerStrokeWidth : this.strokeWidth;
        var fill = markerFill || fills[yKeyIndex % fills.length];
        var stroke = markerStroke || strokes[yKeyIndex % fills.length];
        var format = undefined;
        if (markerFormatter) {
            format = markerFormatter({
                datum: datum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: size,
                highlighted: false
            });
        }
        var color = format && format.fill || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        var tooltipRenderer = tooltip.renderer, tooltipFormat = tooltip.format;
        if (tooltipFormat || tooltipRenderer) {
            var params = {
                datum: datum,
                xKey: xKey,
                xName: xName,
                xValue: xValue,
                yKey: yKey,
                yValue: yValue,
                processedYValue: processedYValue,
                yName: yName,
                color: color
            };
            if (tooltipFormat) {
                return toTooltipHtml({
                    content: interpolate(tooltipFormat, params)
                }, defaults);
            }
            if (tooltipRenderer) {
                return toTooltipHtml(tooltipRenderer(params), defaults);
            }
        }
        return toTooltipHtml(defaults);
    };
    AreaSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, data = _a.data, id = _a.id, xKey = _a.xKey, yKeys = _a.yKeys, yNames = _a.yNames, seriesItemEnabled = _a.seriesItemEnabled, marker = _a.marker, fills = _a.fills, strokes = _a.strokes, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKeys.length) {
            yKeys.forEach(function (yKey, index) {
                legendData.push({
                    id: id,
                    itemId: yKey,
                    enabled: seriesItemEnabled.get(yKey) || false,
                    label: {
                        text: yNames[index] || yKeys[index]
                    },
                    marker: {
                        shape: marker.shape,
                        fill: marker.fill || fills[index % fills.length],
                        stroke: marker.stroke || strokes[index % strokes.length],
                        fillOpacity: fillOpacity,
                        strokeOpacity: strokeOpacity
                    }
                });
            });
        }
    };
    AreaSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        this.seriesItemEnabled.set(itemId, enabled);
        this.scheduleData();
    };
    AreaSeries.className = 'AreaSeries';
    AreaSeries.type = 'area';
    __decorate$7([
        reactive('dataChange')
    ], AreaSeries.prototype, "fills", void 0);
    __decorate$7([
        reactive('dataChange')
    ], AreaSeries.prototype, "strokes", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "fillOpacity", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "strokeOpacity", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "lineDash", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "lineDashOffset", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "xName", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "yNames", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "strokeWidth", void 0);
    __decorate$7([
        reactive('update')
    ], AreaSeries.prototype, "shadow", void 0);
    return AreaSeries;
}(CartesianSeries));

var __extends$I = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values$5 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BarSeriesNodeTag;
(function (BarSeriesNodeTag) {
    BarSeriesNodeTag[BarSeriesNodeTag["Bar"] = 0] = "Bar";
    BarSeriesNodeTag[BarSeriesNodeTag["Label"] = 1] = "Label";
})(BarSeriesNodeTag || (BarSeriesNodeTag = {}));
(function (BarLabelPlacement) {
    BarLabelPlacement["Inside"] = "inside";
    BarLabelPlacement["Outside"] = "outside";
})(exports.BarLabelPlacement || (exports.BarLabelPlacement = {}));
var BarSeriesLabel = /** @class */ (function (_super) {
    __extends$I(BarSeriesLabel, _super);
    function BarSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.placement = exports.BarLabelPlacement.Inside;
        return _this;
    }
    __decorate$8([
        reactive('change')
    ], BarSeriesLabel.prototype, "formatter", void 0);
    __decorate$8([
        reactive('change')
    ], BarSeriesLabel.prototype, "placement", void 0);
    return BarSeriesLabel;
}(Label));
var BarSeriesTooltip = /** @class */ (function (_super) {
    __extends$I(BarSeriesTooltip, _super);
    function BarSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$8([
        reactive('change')
    ], BarSeriesTooltip.prototype, "renderer", void 0);
    return BarSeriesTooltip;
}(SeriesTooltip));
function flat(arr, target) {
    if (target === void 0) { target = []; }
    arr.forEach(function (v) {
        if (Array.isArray(v)) {
            flat(v, target);
        }
        else {
            target.push(v);
        }
    });
    return target;
}
function is2dArray(array) {
    return array.length > 0 && Array.isArray(array[0]);
}
var BarSeries = /** @class */ (function (_super) {
    __extends$I(BarSeries, _super);
    function BarSeries() {
        var _a;
        var _this = _super.call(this) || this;
        // Need to put bar and label nodes into separate groups, because even though label nodes are
        // created after the bar nodes, this only guarantees that labels will always be on top of bars
        // on the first run. If on the next run more bars are added, they might clip the labels
        // rendered during the previous run.
        _this.rectGroup = _this.pickGroup.appendChild(new Group);
        _this.labelGroup = _this.group.appendChild(new Group);
        _this.rectSelection = Selection.select(_this.rectGroup).selectAll();
        _this.labelSelection = Selection.select(_this.labelGroup).selectAll();
        _this.nodeData = [];
        _this.xData = [];
        _this.yData = [];
        _this.yDomain = [];
        _this.label = new BarSeriesLabel();
        /**
         * The assumption is that the values will be reset (to `true`)
         * in the {@link yKeys} setter.
         */
        _this.seriesItemEnabled = new Map();
        _this.tooltip = new BarSeriesTooltip();
        _this.flipXY = false;
        _this.fills = [
            '#c16068',
            '#a2bf8a',
            '#ebcc87',
            '#80a0c3',
            '#b58dae',
            '#85c0d1'
        ];
        _this.strokes = [
            '#874349',
            '#718661',
            '#a48f5f',
            '#5a7088',
            '#7f637a',
            '#5d8692'
        ];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        /**
         * Used to get the position of bars within each group.
         */
        _this.groupScale = new BandScale();
        _this.directionKeys = (_a = {},
            _a[exports.ChartAxisDirection.X] = ['xKey'],
            _a[exports.ChartAxisDirection.Y] = ['yKeys'],
            _a);
        _this._xKey = '';
        _this._xName = '';
        _this.cumYKeyCount = [];
        _this.flatYKeys = undefined; // only set when a user used a flat array for yKeys
        _this.hideInLegend = [];
        /**
         * yKeys: [['coffee']] - regular bars, each category has a single bar that shows a value for coffee
         * yKeys: [['coffee'], ['tea'], ['milk']] - each category has three bars that show values for coffee, tea and milk
         * yKeys: [['coffee', 'tea', 'milk']] - each category has a single bar with three stacks that show values for coffee, tea and milk
         * yKeys: [['coffee', 'tea', 'milk'], ['paper', 'ink']] - each category has 2 stacked bars,
         *     first showing values for coffee, tea and milk and second values for paper and ink
         */
        _this._yKeys = [];
        _this._grouped = false;
        /**
         * A map of `yKeys` to their names (used in legends and tooltips).
         * For example, if a key is `product_name` it's name can be a more presentable `Product Name`.
         */
        _this._yNames = {};
        _this._strokeWidth = 1;
        _this.addEventListener('update', _this.scheduleUpdate);
        _this.label.enabled = false;
        _this.label.addEventListener('change', _this.scheduleUpdate, _this);
        return _this;
    }
    BarSeries.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[this.flipXY ? flipChartAxisDirection(direction) : direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values = values.concat(flat(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    Object.defineProperty(BarSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            if (this._xKey !== value) {
                this._xKey = value;
                this.xData = [];
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "xName", {
        get: function () {
            return this._xName;
        },
        set: function (value) {
            if (this._xName !== value) {
                this._xName = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "yKeys", {
        get: function () {
            return this._yKeys;
        },
        set: function (yKeys) {
            var _this = this;
            var flatYKeys = undefined;
            // Convert from flat y-keys to grouped y-keys.
            if (!is2dArray(yKeys)) {
                flatYKeys = yKeys;
                yKeys = this.grouped ? flatYKeys.map(function (k) { return [k]; }) : [flatYKeys];
            }
            if (!equal(this._yKeys, yKeys)) {
                this.flatYKeys = flatYKeys ? flatYKeys : undefined;
                this._yKeys = yKeys;
                var prevYKeyCount_1 = 0;
                this.cumYKeyCount = [];
                var visibleStacks_1 = [];
                yKeys.forEach(function (stack, index) {
                    if (stack.length > 0) {
                        visibleStacks_1.push(String(index));
                    }
                    _this.cumYKeyCount.push(prevYKeyCount_1);
                    prevYKeyCount_1 += stack.length;
                });
                this.yData = [];
                var seriesItemEnabled_1 = this.seriesItemEnabled;
                seriesItemEnabled_1.clear();
                yKeys.forEach(function (stack) {
                    stack.forEach(function (yKey) { return seriesItemEnabled_1.set(yKey, true); });
                });
                var groupScale = this.groupScale;
                groupScale.domain = visibleStacks_1;
                groupScale.padding = 0.1;
                groupScale.round = true;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "grouped", {
        get: function () {
            return this._grouped;
        },
        set: function (value) {
            if (this._grouped !== value) {
                this._grouped = value;
                if (this.flatYKeys) {
                    this.yKeys = this.flatYKeys;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "yNames", {
        get: function () {
            return this._yNames;
        },
        set: function (values) {
            if (Array.isArray(values) && this.flatYKeys) {
                var map_1 = {};
                this.flatYKeys.forEach(function (k, i) {
                    map_1[k] = values[i];
                });
                values = map_1;
            }
            this._yNames = values;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    BarSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
    };
    Object.defineProperty(BarSeries.prototype, "normalizedTo", {
        get: function () {
            return this._normalizedTo;
        },
        set: function (value) {
            var absValue = value ? Math.abs(value) : undefined;
            if (this._normalizedTo !== absValue) {
                this._normalizedTo = absValue;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BarSeries.prototype, "shadow", {
        get: function () {
            return this._shadow;
        },
        set: function (value) {
            if (this._shadow !== value) {
                this._shadow = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    BarSeries.prototype.onHighlightChange = function () {
        this.updateRectNodes();
    };
    BarSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, xKey = _a.xKey, yKeys = _a.yKeys, seriesItemEnabled = _a.seriesItemEnabled, xAxis = _a.xAxis;
        var data = xKey && yKeys.length && this.data ? this.data : [];
        if (!xAxis) {
            return false;
        }
        var keysFound = true; // only warn once
        this.xData = data.map(function (datum) {
            if (keysFound && !(xKey in datum)) {
                keysFound = false;
                console.warn("The key '" + xKey + "' was not found in the data: ", datum);
            }
            return _this.checkDatum(datum[xKey], false);
        });
        this.yData = data.map(function (datum) { return yKeys.map(function (stack) {
            return stack.map(function (yKey) {
                if (keysFound && !(yKey in datum)) {
                    keysFound = false;
                    console.warn("The key '" + yKey + "' was not found in the data: ", datum);
                }
                var yDatum = _this.checkDatum(datum[yKey], true);
                if (!seriesItemEnabled.get(yKey) || yDatum === undefined) {
                    return 0;
                }
                return yDatum;
            });
        }); });
        // Contains min/max values for each stack in each group,
        // where min is zero and max is a positive total of all values in the stack
        // or min is a negative total of all values in the stack and max is zero.
        var yMinMax = this.yData.map(function (group) { return group.map(function (stack) { return findMinMax(stack); }); });
        var _b = this, yData = _b.yData, normalizedTo = _b.normalizedTo;
        // Calculate the sum of the absolute values of all items in each stack in each group. Used for normalization of stacked bars.
        var yAbsTotal = this.yData.map(function (group) { return group.map(function (stack) { return stack.reduce(function (acc, stack) {
            acc += Math.abs(stack);
            return acc;
        }, 0); }); });
        var yLargestMinMax = this.findLargestMinMax(yMinMax);
        var yMin;
        var yMax;
        if (normalizedTo && isFinite(normalizedTo)) {
            yMin = yLargestMinMax.min < 0 ? -normalizedTo : 0;
            yMax = yLargestMinMax.max > 0 ? normalizedTo : 0;
            yData.forEach(function (group, i) {
                group.forEach(function (stack, j) {
                    stack.forEach(function (y, k) {
                        stack[k] = y / yAbsTotal[i][j] * normalizedTo;
                    });
                });
            });
        }
        else {
            yMin = yLargestMinMax.min;
            yMax = yLargestMinMax.max;
        }
        this.yDomain = this.fixNumericExtent([yMin, yMax], 'y', this.yAxis);
        this.fireEvent({ type: 'dataProcessed' });
        return true;
    };
    BarSeries.prototype.findLargestMinMax = function (groups) {
        var e_1, _a, e_2, _b;
        var tallestStackMin = 0;
        var tallestStackMax = 0;
        try {
            for (var groups_1 = __values$5(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
                var group = groups_1_1.value;
                try {
                    for (var group_1 = (e_2 = void 0, __values$5(group)), group_1_1 = group_1.next(); !group_1_1.done; group_1_1 = group_1.next()) {
                        var stack = group_1_1.value;
                        if (stack.min < tallestStackMin) {
                            tallestStackMin = stack.min;
                        }
                        if (stack.max > tallestStackMax) {
                            tallestStackMax = stack.max;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (group_1_1 && !group_1_1.done && (_b = group_1.return)) _b.call(group_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { min: tallestStackMin, max: tallestStackMax };
    };
    BarSeries.prototype.getDomain = function (direction) {
        if (this.flipXY) {
            direction = flipChartAxisDirection(direction);
        }
        if (direction === exports.ChartAxisDirection.X) {
            return this.xData;
        }
        else {
            return this.yDomain;
        }
    };
    BarSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: datum.yKey
        });
    };
    BarSeries.prototype.getCategoryAxis = function () {
        return this.flipXY ? this.yAxis : this.xAxis;
    };
    BarSeries.prototype.getValueAxis = function () {
        return this.flipXY ? this.xAxis : this.yAxis;
    };
    BarSeries.prototype.createNodeData = function () {
        var _this = this;
        var _a = this, chart = _a.chart, data = _a.data, visible = _a.visible;
        var xAxis = this.getCategoryAxis();
        var yAxis = this.getValueAxis();
        if (!(chart && data && visible && xAxis && yAxis) || chart.layoutPending || chart.dataPending) {
            return [];
        }
        var flipXY = this.flipXY;
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var _b = this, groupScale = _b.groupScale, yKeys = _b.yKeys, cumYKeyCount = _b.cumYKeyCount, fills = _b.fills, strokes = _b.strokes, strokeWidth = _b.strokeWidth, seriesItemEnabled = _b.seriesItemEnabled, xData = _b.xData, yData = _b.yData, label = _b.label;
        var labelFontStyle = label.fontStyle, labelFontWeight = label.fontWeight, labelFontSize = label.fontSize, labelFontFamily = label.fontFamily, labelColor = label.color, labelFormatter = label.formatter, labelPlacement = label.placement;
        groupScale.range = [0, xScale.bandwidth];
        var barWidth =  groupScale.bandwidth ;
        var nodeData = [];
        xData.forEach(function (group, groupIndex) {
            var seriesDatum = data[groupIndex];
            var x = xScale.convert(group);
            var groupYs = yData[groupIndex]; // y-data for groups of stacks
            for (var stackIndex = 0; stackIndex < groupYs.length; stackIndex++) {
                var stackYs = groupYs[stackIndex]; // y-data for a stack within a group
                var prevMinY = 0;
                var prevMaxY = 0;
                for (var levelIndex = 0; levelIndex < stackYs.length; levelIndex++) {
                    var currY = +stackYs[levelIndex];
                    var yKey = yKeys[stackIndex][levelIndex];
                    var barX =  x + groupScale.convert(String(stackIndex)) ;
                    // Bars outside of visible range are not rendered, so we create node data
                    // only for the visible subset of user data.
                    if (!xAxis.inRange(barX, barWidth)) {
                        continue;
                    }
                    var prevY = currY < 0 ? prevMinY : prevMaxY;
                    var continuousY = yScale instanceof ContinuousScale;
                    var y = yScale.convert(prevY + currY, continuousY ? clamper : undefined);
                    var bottomY = yScale.convert(prevY, continuousY ? clamper : undefined);
                    var yValue = seriesDatum[yKey]; // unprocessed y-value
                    var labelText = void 0;
                    if (labelFormatter) {
                        labelText = labelFormatter({ value: isNumber(yValue) ? yValue : undefined });
                    }
                    else {
                        labelText = isNumber(yValue) ? yValue.toFixed(2) : '';
                    }
                    var labelX = void 0;
                    var labelY = void 0;
                    if (flipXY) {
                        labelY = barX + barWidth / 2;
                        if (labelPlacement === exports.BarLabelPlacement.Inside) {
                            labelX = y + (yValue >= 0 ? -1 : 1) * Math.abs(bottomY - y) / 2;
                        }
                        else {
                            labelX = y + (yValue >= 0 ? 1 : -1) * 4;
                        }
                    }
                    else {
                        labelX = barX + barWidth / 2;
                        if (labelPlacement === exports.BarLabelPlacement.Inside) {
                            labelY = y + (yValue >= 0 ? 1 : -1) * Math.abs(bottomY - y) / 2;
                        }
                        else {
                            labelY = y + (yValue >= 0 ? -3 : 4);
                        }
                    }
                    var labelTextAlign = void 0;
                    var labelTextBaseline = void 0;
                    if (labelPlacement === exports.BarLabelPlacement.Inside) {
                        labelTextAlign = 'center';
                        labelTextBaseline = 'middle';
                    }
                    else {
                        labelTextAlign = flipXY ? (yValue >= 0 ? 'start' : 'end') : 'center';
                        labelTextBaseline = flipXY ? 'middle' : (yValue >= 0 ? 'bottom' : 'top');
                    }
                    var colorIndex = cumYKeyCount[stackIndex] + levelIndex;
                    nodeData.push({
                        index: groupIndex,
                        series: _this,
                        itemId: yKey,
                        datum: seriesDatum,
                        yValue: yValue,
                        yKey: yKey,
                        x: flipXY ? Math.min(y, bottomY) : barX,
                        y: flipXY ? barX : Math.min(y, bottomY),
                        width: flipXY ? Math.abs(bottomY - y) : barWidth,
                        height: flipXY ? barWidth : Math.abs(bottomY - y),
                        fill: fills[colorIndex % fills.length],
                        stroke: strokes[colorIndex % strokes.length],
                        strokeWidth: strokeWidth,
                        label: seriesItemEnabled.get(yKey) && labelText ? {
                            text: labelText,
                            fontStyle: labelFontStyle,
                            fontWeight: labelFontWeight,
                            fontSize: labelFontSize,
                            fontFamily: labelFontFamily,
                            textAlign: labelTextAlign,
                            textBaseline: labelTextBaseline,
                            fill: labelColor,
                            x: labelX,
                            y: labelY
                        } : undefined
                    });
                    if (currY < 0) {
                        prevMinY += currY;
                    }
                    else {
                        prevMaxY += currY;
                    }
                }
            }
        });
        return this.nodeData = nodeData;
    };
    BarSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    BarSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        this.createNodeData();
        this.updateRectSelection();
        this.updateLabelSelection();
    };
    BarSeries.prototype.updateNodes = function () {
        this.group.visible = this.visible;
        this.updateRectNodes();
        this.updateLabelNodes();
    };
    BarSeries.prototype.updateRectSelection = function () {
        var updateRects = this.rectSelection.setData(this.nodeData);
        updateRects.exit.remove();
        var enterRects = updateRects.enter.append(Rect).each(function (rect) {
            rect.tag = BarSeriesNodeTag.Bar;
            rect.crisp = true;
        });
        this.rectSelection = updateRects.merge(enterRects);
    };
    BarSeries.prototype.updateRectNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, fills = _a.fills, strokes = _a.strokes, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, shadow = _a.shadow, formatter = _a.formatter, xKey = _a.xKey, flipXY = _a.flipXY, yKeys = _a.yKeys, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        this.rectSelection.each(function (rect, datum, index) {
            var colorIndex = 0;
            var i = 0;
            for (var j = 0; j < yKeys.length; j++) {
                var stack = yKeys[j];
                i = stack.indexOf(datum.yKey);
                if (i >= 0) {
                    colorIndex += i;
                    break;
                }
                colorIndex += stack.length;
            }
            var isDatumHighlighted = datum === highlightedDatum;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : fills[colorIndex % fills.length];
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : strokes[colorIndex % fills.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(_this.strokeWidth, datum);
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    highlighted: isDatumHighlighted,
                    xKey: xKey,
                    yKey: datum.yKey
                });
            }
            rect.x = datum.x;
            rect.y = datum.y;
            rect.width = datum.width;
            rect.height = datum.height;
            rect.fill = format && format.fill || fill;
            rect.stroke = format && format.stroke || stroke;
            rect.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            rect.fillOpacity = fillOpacity;
            rect.strokeOpacity = strokeOpacity;
            rect.lineDash = _this.lineDash;
            rect.lineDashOffset = _this.lineDashOffset;
            rect.fillShadow = shadow;
            // Prevent stroke from rendering for zero height columns and zero width bars.
            rect.visible = flipXY ? datum.width > 0 : datum.height > 0;
            rect.zIndex = isDatumHighlighted ? Series.highlightedZIndex : index;
            rect.opacity = _this.getOpacity(datum);
        });
    };
    BarSeries.prototype.updateLabelSelection = function () {
        var updateLabels = this.labelSelection.setData(this.nodeData);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text).each(function (text) {
            text.tag = BarSeriesNodeTag.Label;
            text.pointerEvents = PointerEvents.None;
        });
        this.labelSelection = updateLabels.merge(enterLabels);
    };
    BarSeries.prototype.updateLabelNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, highlightedDatum = _a.chart.highlightedDatum, _b = _a.label, labelEnabled = _b.enabled, fontStyle = _b.fontStyle, fontWeight = _b.fontWeight, fontSize = _b.fontSize, fontFamily = _b.fontFamily, color = _b.color;
        this.labelSelection.each(function (text, datum, index) {
            var label = datum.label;
            if (label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = label.x;
                text.y = label.y;
                text.fill = color;
                text.visible = true;
                text.opacity = _this.getOpacity(datum);
            }
            else {
                text.visible = false;
            }
        });
    };
    BarSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKeys = _a.yKeys, yData = _a.yData;
        var xAxis = this.getCategoryAxis();
        var yAxis = this.getValueAxis();
        var yKey = nodeDatum.yKey;
        if (!yData.length || !xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var yGroup = yData[nodeDatum.index];
        var fillIndex = 0;
        var i = 0;
        var j = 0;
        for (; j < yKeys.length; j++) {
            var stack = yKeys[j];
            i = stack.indexOf(yKey);
            if (i >= 0) {
                fillIndex += i;
                break;
            }
            fillIndex += stack.length;
        }
        var _b = this, xName = _b.xName, yNames = _b.yNames, fills = _b.fills, strokes = _b.strokes, tooltip = _b.tooltip, formatter = _b.formatter;
        var tooltipRenderer = tooltip.renderer;
        var datum = nodeDatum.datum;
        var yName = yNames[yKey];
        var fill = fills[fillIndex % fills.length];
        var stroke = strokes[fillIndex % fills.length];
        var strokeWidth = this.getStrokeWidth(this.strokeWidth, datum);
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var processedYValue = yGroup[j][i];
        var xString = sanitizeHtml(xAxis.formatDatum(xValue));
        var yString = sanitizeHtml(yAxis.formatDatum(yValue));
        var title = sanitizeHtml(yName);
        var content = xString + ': ' + yString;
        var format = undefined;
        if (formatter) {
            format = formatter({
                datum: datum,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                highlighted: false,
                xKey: xKey,
                yKey: yKey
            });
        }
        var color = format && format.fill || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                processedYValue: processedYValue,
                yName: yName,
                color: color
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    BarSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKeys = _a.yKeys, yNames = _a.yNames, cumYKeyCount = _a.cumYKeyCount, seriesItemEnabled = _a.seriesItemEnabled, hideInLegend = _a.hideInLegend, fills = _a.fills, strokes = _a.strokes, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKeys.length) {
            this.yKeys.forEach(function (stack, stackIndex) {
                stack.forEach(function (yKey, levelIndex) {
                    if (hideInLegend.indexOf(yKey) < 0) {
                        var colorIndex = cumYKeyCount[stackIndex] + levelIndex;
                        legendData.push({
                            id: id,
                            itemId: yKey,
                            enabled: seriesItemEnabled.get(yKey) || false,
                            label: {
                                text: yNames[yKey] || yKey
                            },
                            marker: {
                                fill: fills[colorIndex % fills.length],
                                stroke: strokes[colorIndex % strokes.length],
                                fillOpacity: fillOpacity,
                                strokeOpacity: strokeOpacity
                            }
                        });
                    }
                });
            });
        }
    };
    BarSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        var seriesItemEnabled = this.seriesItemEnabled;
        seriesItemEnabled.set(itemId, enabled);
        var yKeys = this.yKeys.map(function (stack) { return stack.slice(); }); // deep clone
        seriesItemEnabled.forEach(function (enabled, yKey) {
            if (!enabled) {
                yKeys.forEach(function (stack) {
                    var index = stack.indexOf(yKey);
                    if (index >= 0) {
                        stack.splice(index, 1);
                    }
                });
            }
        });
        var visibleStacks = [];
        yKeys.forEach(function (stack, index) {
            if (stack.length > 0) {
                visibleStacks.push(String(index));
            }
        });
        this.groupScale.domain = visibleStacks;
        this.scheduleData();
    };
    BarSeries.className = 'BarSeries';
    BarSeries.type = 'bar';
    __decorate$8([
        reactive('dataChange')
    ], BarSeries.prototype, "flipXY", void 0);
    __decorate$8([
        reactive('dataChange')
    ], BarSeries.prototype, "fills", void 0);
    __decorate$8([
        reactive('dataChange')
    ], BarSeries.prototype, "strokes", void 0);
    __decorate$8([
        reactive('update')
    ], BarSeries.prototype, "fillOpacity", void 0);
    __decorate$8([
        reactive('update')
    ], BarSeries.prototype, "strokeOpacity", void 0);
    __decorate$8([
        reactive('update')
    ], BarSeries.prototype, "lineDash", void 0);
    __decorate$8([
        reactive('update')
    ], BarSeries.prototype, "lineDashOffset", void 0);
    __decorate$8([
        reactive('update')
    ], BarSeries.prototype, "formatter", void 0);
    __decorate$8([
        reactive('layoutChange')
    ], BarSeries.prototype, "hideInLegend", void 0);
    return BarSeries;
}(CartesianSeries));

var __extends$J = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$e = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var LineSeriesLabel = /** @class */ (function (_super) {
    __extends$J(LineSeriesLabel, _super);
    function LineSeriesLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$9([
        reactive('change')
    ], LineSeriesLabel.prototype, "formatter", void 0);
    return LineSeriesLabel;
}(Label));
var LineSeriesTooltip = /** @class */ (function (_super) {
    __extends$J(LineSeriesTooltip, _super);
    function LineSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$9([
        reactive('change')
    ], LineSeriesTooltip.prototype, "renderer", void 0);
    __decorate$9([
        reactive('change')
    ], LineSeriesTooltip.prototype, "format", void 0);
    return LineSeriesTooltip;
}(SeriesTooltip));
var LineSeries = /** @class */ (function (_super) {
    __extends$J(LineSeries, _super);
    function LineSeries() {
        var _this = _super.call(this) || this;
        _this.xDomain = [];
        _this.yDomain = [];
        _this.xData = [];
        _this.yData = [];
        _this.lineNode = new Path();
        // We use groups for this selection even though each group only contains a marker ATM
        // because in the future we might want to add label support as well.
        _this.nodeSelection = Selection.select(_this.pickGroup).selectAll();
        _this.nodeData = [];
        _this.marker = new CartesianSeriesMarker();
        _this.label = new LineSeriesLabel();
        _this.stroke = '#874349';
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.strokeWidth = 2;
        _this.strokeOpacity = 1;
        _this.tooltip = new LineSeriesTooltip();
        _this._xKey = '';
        _this.xName = '';
        _this._yKey = '';
        _this.yName = '';
        var lineNode = _this.lineNode;
        lineNode.fill = undefined;
        lineNode.lineJoin = 'round';
        lineNode.pointerEvents = PointerEvents.None;
        // Make line render before markers in the pick group.
        _this.group.insertBefore(lineNode, _this.pickGroup);
        _this.addEventListener('update', _this.scheduleUpdate);
        var _a = _this, marker = _a.marker, label = _a.label;
        marker.fill = '#c16068';
        marker.stroke = '#874349';
        marker.addPropertyListener('shape', _this.onMarkerShapeChange, _this);
        marker.addEventListener('change', _this.scheduleUpdate, _this);
        label.enabled = false;
        label.addEventListener('change', _this.scheduleUpdate, _this);
        return _this;
    }
    LineSeries.prototype.onMarkerShapeChange = function () {
        this.nodeSelection = this.nodeSelection.setData([]);
        this.nodeSelection.exit.remove();
        this.fireEvent({ type: 'legendChange' });
    };
    LineSeries.prototype.setColors = function (fills, strokes) {
        this.stroke = fills[0];
        this.marker.stroke = strokes[0];
        this.marker.fill = fills[0];
    };
    Object.defineProperty(LineSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            if (this._xKey !== value) {
                this._xKey = value;
                this.xData = [];
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LineSeries.prototype, "yKey", {
        get: function () {
            return this._yKey;
        },
        set: function (value) {
            if (this._yKey !== value) {
                this._yKey = value;
                this.yData = [];
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    LineSeries.prototype.processData = function () {
        var _a = this, xAxis = _a.xAxis, yAxis = _a.yAxis, xKey = _a.xKey, yKey = _a.yKey, xData = _a.xData, yData = _a.yData;
        var data = xKey && yKey && this.data ? this.data : [];
        if (!xAxis || !yAxis) {
            return false;
        }
        var isContinuousX = xAxis.scale instanceof ContinuousScale;
        var isContinuousY = yAxis.scale instanceof ContinuousScale;
        xData.length = 0;
        yData.length = 0;
        for (var i = 0, n = data.length; i < n; i++) {
            var datum = data[i];
            var x = datum[xKey];
            var y = datum[yKey];
            var xDatum = this.checkDatum(x, isContinuousX);
            if (isContinuousX && xDatum === undefined) {
                continue;
            }
            else {
                xData.push(xDatum);
            }
            var yDatum = this.checkDatum(y, isContinuousY);
            yData.push(yDatum);
        }
        this.xDomain = isContinuousX ? this.fixNumericExtent(extent(xData, isContinuous), 'x', xAxis) : xData;
        this.yDomain = isContinuousY ? this.fixNumericExtent(extent(yData, isContinuous), 'y', yAxis) : yData;
        return true;
    };
    LineSeries.prototype.getDomain = function (direction) {
        if (direction === exports.ChartAxisDirection.X) {
            return this.xDomain;
        }
        return this.yDomain;
    };
    LineSeries.prototype.onHighlightChange = function () {
        this.updateNodes();
    };
    LineSeries.prototype.resetHighlight = function () {
        this.lineNode.strokeWidth = this.strokeWidth;
    };
    LineSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    LineSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        this.updateLinePath(); // this will create node data too
        this.updateNodeSelection();
    };
    LineSeries.prototype.updateLinePath = function () {
        var _a;
        var _b = this, data = _b.data, xAxis = _b.xAxis, yAxis = _b.yAxis;
        if (!data || !xAxis || !yAxis) {
            return;
        }
        var _c = this, xData = _c.xData, yData = _c.yData, lineNode = _c.lineNode, label = _c.label, xKey = _c.xKey, yKey = _c.yKey;
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var yOffset = (yScale.bandwidth || 0) / 2;
        var linePath = lineNode.path;
        var nodeData = [];
        linePath.clear();
        var moveTo = true;
        var prevXInRange = undefined;
        var nextXYDatums = undefined;
        for (var i = 0; i < xData.length; i++) {
            var xyDatums = nextXYDatums || [xData[i], yData[i]];
            if (xyDatums[1] === undefined) {
                prevXInRange = undefined;
                moveTo = true;
            }
            else {
                var _d = __read$e(xyDatums, 2), xDatum = _d[0], yDatum = _d[1];
                var x = xScale.convert(xDatum) + xOffset;
                if (isNaN(x)) {
                    prevXInRange = undefined;
                    moveTo = true;
                    continue;
                }
                var tolerance = (xScale.bandwidth || (this.marker.size * 0.5 + (this.marker.strokeWidth || 0))) + 1;
                nextXYDatums = yData[i + 1] === undefined ? undefined : [xData[i + 1], yData[i + 1]];
                var xInRange = xAxis.inRangeEx(x, 0, tolerance);
                var nextXInRange = nextXYDatums && xAxis.inRangeEx(xScale.convert(nextXYDatums[0]) + xOffset, 0, tolerance);
                if (xInRange === -1 && nextXInRange === -1) {
                    moveTo = true;
                    continue;
                }
                if (xInRange === 1 && prevXInRange === 1) {
                    moveTo = true;
                    continue;
                }
                prevXInRange = xInRange;
                var y = yScale.convert(yDatum) + yOffset;
                if (moveTo) {
                    linePath.moveTo(x, y);
                    moveTo = false;
                }
                else {
                    linePath.lineTo(x, y);
                }
                var labelText = void 0;
                if (label.formatter) {
                    labelText = label.formatter({ value: yDatum });
                }
                else {
                    labelText = typeof yDatum === 'number' && isFinite(yDatum) ? yDatum.toFixed(2) : yDatum ? String(yDatum) : '';
                }
                var seriesDatum = (_a = {}, _a[xKey] = xDatum, _a[yKey] = yDatum, _a);
                nodeData.push({
                    series: this,
                    datum: seriesDatum,
                    point: { x: x, y: y },
                    label: labelText ? {
                        text: labelText,
                        fontStyle: label.fontStyle,
                        fontWeight: label.fontWeight,
                        fontSize: label.fontSize,
                        fontFamily: label.fontFamily,
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        fill: label.color
                    } : undefined
                });
            }
        }
        // Used by marker nodes and for hit-testing even when not using markers
        // when `chart.tooltip.tracking` is true.
        this.nodeData = nodeData;
    };
    LineSeries.prototype.updateNodeSelection = function () {
        var marker = this.marker;
        var nodeData = marker.shape ? this.nodeData : [];
        var MarkerShape = getMarker(marker.shape);
        var updateSelection = this.nodeSelection.setData(nodeData);
        updateSelection.exit.remove();
        var enterSelection = updateSelection.enter.append(Group);
        enterSelection.append(MarkerShape);
        enterSelection.append(Text);
        this.nodeSelection = updateSelection.merge(enterSelection);
    };
    LineSeries.prototype.updateNodes = function () {
        this.group.visible = this.visible;
        this.updateLineNode();
        this.updateMarkerNodes();
        this.updateTextNodes();
    };
    LineSeries.prototype.updateLineNode = function () {
        var lineNode = this.lineNode;
        lineNode.stroke = this.stroke;
        lineNode.strokeWidth = this.getStrokeWidth(this.strokeWidth);
        lineNode.strokeOpacity = this.strokeOpacity;
        lineNode.lineDash = this.lineDash;
        lineNode.lineDashOffset = this.lineDashOffset;
        lineNode.opacity = this.getOpacity();
    };
    LineSeries.prototype.updateMarkerNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, marker = _a.marker, xKey = _a.xKey, yKey = _a.yKey, lineStroke = _a.stroke, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        var size = marker.size, formatter = marker.formatter;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : this.strokeWidth;
        var MarkerShape = getMarker(marker.shape);
        this.nodeSelection.selectByClass(MarkerShape)
            .each(function (node, datum) {
            var isDatumHighlighted = datum === highlightedDatum;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : marker.fill;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : marker.stroke || lineStroke;
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : markerStrokeWidth;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted
                });
            }
            node.fill = format && format.fill || fill;
            node.stroke = format && format.stroke || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined
                ? format.strokeWidth
                : strokeWidth;
            node.size = format && format.size !== undefined
                ? format.size
                : size;
            node.translationX = datum.point.x;
            node.translationY = datum.point.y;
            node.opacity = _this.getOpacity(datum);
            node.visible = marker.enabled && node.size > 0;
        });
    };
    LineSeries.prototype.updateTextNodes = function () {
        var _this = this;
        this.nodeSelection.selectByClass(Text)
            .each(function (text, datum) {
            var point = datum.point, label = datum.label;
            var _a = _this.label, labelEnabled = _a.enabled, fontStyle = _a.fontStyle, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily, color = _a.color;
            if (label && labelEnabled) {
                text.fontStyle = fontStyle;
                text.fontWeight = fontWeight;
                text.fontSize = fontSize;
                text.fontFamily = fontFamily;
                text.textAlign = label.textAlign;
                text.textBaseline = label.textBaseline;
                text.text = label.text;
                text.x = point.x;
                text.y = point.y - 10;
                text.fill = color;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    LineSeries.prototype.getNodeData = function () {
        return this.nodeData;
    };
    LineSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: this.yKey
        });
    };
    LineSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var _b = this, xName = _b.xName, yName = _b.yName, tooltip = _b.tooltip, marker = _b.marker;
        var tooltipRenderer = tooltip.renderer, tooltipFormat = tooltip.format;
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var xString = xAxis.formatDatum(xValue);
        var yString = yAxis.formatDatum(yValue);
        var title = sanitizeHtml(this.title || yName);
        var content = sanitizeHtml(xString + ': ' + yString);
        var markerFormatter = marker.formatter, fill = marker.fill, stroke = marker.stroke, markerStrokeWidth = marker.strokeWidth, size = marker.size;
        var strokeWidth = markerStrokeWidth !== undefined ? markerStrokeWidth : this.strokeWidth;
        var format = undefined;
        if (markerFormatter) {
            format = markerFormatter({
                datum: datum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: size,
                highlighted: false
            });
        }
        var color = format && format.fill || fill;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        if (tooltipFormat || tooltipRenderer) {
            var params = {
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                yName: yName,
                title: title,
                color: color
            };
            if (tooltipFormat) {
                return toTooltipHtml({
                    content: interpolate(tooltipFormat, params)
                }, defaults);
            }
            if (tooltipRenderer) {
                return toTooltipHtml(tooltipRenderer(params), defaults);
            }
        }
        return toTooltipHtml(defaults);
    };
    LineSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKey = _a.yKey, yName = _a.yName, visible = _a.visible, title = _a.title, marker = _a.marker, stroke = _a.stroke, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKey) {
            legendData.push({
                id: id,
                itemId: undefined,
                enabled: visible,
                label: {
                    text: title || yName || yKey
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || 'rgba(0, 0, 0, 0)',
                    stroke: marker.stroke || stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: 1,
                    strokeOpacity: strokeOpacity
                }
            });
        }
    };
    LineSeries.className = 'LineSeries';
    LineSeries.type = 'line';
    __decorate$9([
        reactive('layoutChange')
    ], LineSeries.prototype, "title", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "stroke", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "lineDash", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "lineDashOffset", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "strokeWidth", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "strokeOpacity", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "xName", void 0);
    __decorate$9([
        reactive('update')
    ], LineSeries.prototype, "yName", void 0);
    return LineSeries;
}(CartesianSeries));

var __extends$K = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScatterSeriesTooltip = /** @class */ (function (_super) {
    __extends$K(ScatterSeriesTooltip, _super);
    function ScatterSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$a([
        reactive('change')
    ], ScatterSeriesTooltip.prototype, "renderer", void 0);
    return ScatterSeriesTooltip;
}(SeriesTooltip));
var ScatterSeries = /** @class */ (function (_super) {
    __extends$K(ScatterSeries, _super);
    function ScatterSeries() {
        var _this = _super.call(this) || this;
        _this.xDomain = [];
        _this.yDomain = [];
        _this.xData = [];
        _this.yData = [];
        _this.validData = [];
        _this.sizeData = [];
        _this.sizeScale = new LinearScale();
        _this.nodeData = [];
        _this.markerSelection = Selection.select(_this.pickGroup).selectAll();
        _this.labelData = [];
        _this.labelSelection = Selection.select(_this.group).selectAll();
        _this.marker = new CartesianSeriesMarker();
        _this.label = new Label();
        _this._fill = '#c16068';
        _this._stroke = '#874349';
        _this._strokeWidth = 2;
        _this._fillOpacity = 1;
        _this._strokeOpacity = 1;
        _this.xKey = '';
        _this.yKey = '';
        _this.xName = '';
        _this.yName = '';
        _this.sizeName = 'Size';
        _this.labelName = 'Label';
        _this.tooltip = new ScatterSeriesTooltip();
        var _a = _this, marker = _a.marker, label = _a.label;
        marker.addPropertyListener('shape', _this.onMarkerShapeChange, _this);
        marker.addEventListener('change', _this.scheduleUpdate, _this);
        _this.addPropertyListener('xKey', function () { return _this.xData = []; });
        _this.addPropertyListener('yKey', function () { return _this.yData = []; });
        _this.addPropertyListener('sizeKey', function () { return _this.sizeData = []; });
        label.enabled = false;
        label.addEventListener('change', _this.scheduleUpdate, _this);
        label.addEventListener('dataChange', _this.scheduleData, _this);
        return _this;
    }
    Object.defineProperty(ScatterSeries.prototype, "fill", {
        get: function () {
            return this._fill;
        },
        /**
         * @deprecated Use {@link marker.fill} instead.
         */
        set: function (value) {
            if (this._fill !== value) {
                this._fill = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "stroke", {
        get: function () {
            return this._stroke;
        },
        /**
         * @deprecated Use {@link marker.stroke} instead.
         */
        set: function (value) {
            if (this._stroke !== value) {
                this._stroke = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        /**
         * @deprecated Use {@link marker.strokeWidth} instead.
         */
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "fillOpacity", {
        get: function () {
            return this._fillOpacity;
        },
        /**
         * @deprecated Use {@link marker.fillOpacity} instead.
         */
        set: function (value) {
            if (this._fillOpacity !== value) {
                this._fillOpacity = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "strokeOpacity", {
        get: function () {
            return this._strokeOpacity;
        },
        /**
         * @deprecated Use {@link marker.strokeOpacity} instead.
         */
        set: function (value) {
            if (this._strokeOpacity !== value) {
                this._strokeOpacity = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    ScatterSeries.prototype.onHighlightChange = function () {
        this.updateMarkerNodes();
    };
    ScatterSeries.prototype.onMarkerShapeChange = function () {
        this.markerSelection = this.markerSelection.setData([]);
        this.markerSelection.exit.remove();
        this.fireEvent({ type: 'legendChange' });
    };
    ScatterSeries.prototype.setColors = function (fills, strokes) {
        this.fill = fills[0];
        this.stroke = strokes[0];
        this.marker.fill = fills[0];
        this.marker.stroke = strokes[0];
    };
    ScatterSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, sizeKey = _a.sizeKey, labelKey = _a.labelKey, xAxis = _a.xAxis, yAxis = _a.yAxis, marker = _a.marker, label = _a.label;
        if (!xAxis || !yAxis) {
            return false;
        }
        var data = xKey && yKey && this.data ? this.data : [];
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var isContinuousX = xScale instanceof ContinuousScale;
        var isContinuousY = yScale instanceof ContinuousScale;
        this.validData = data.filter(function (d) { return _this.checkDatum(d[xKey], isContinuousX) !== undefined && _this.checkDatum(d[yKey], isContinuousY) !== undefined; });
        this.xData = this.validData.map(function (d) { return d[xKey]; });
        this.yData = this.validData.map(function (d) { return d[yKey]; });
        this.sizeData = sizeKey ? this.validData.map(function (d) { return d[sizeKey]; }) : [];
        var font = label.getFont();
        this.labelData = labelKey ? this.validData.map(function (d) {
            var text = String(d[labelKey]);
            var size = HdpiCanvas.getTextSize(text, font);
            return __assign$2({ text: text }, size);
        }) : [];
        this.sizeScale.domain = marker.domain ? marker.domain : extent(this.sizeData, isContinuous) || [1, 1];
        if (xAxis.scale instanceof ContinuousScale) {
            this.xDomain = this.fixNumericExtent(extent(this.xData, isContinuous), 'x', xAxis);
        }
        else {
            this.xDomain = this.xData;
        }
        if (yAxis.scale instanceof ContinuousScale) {
            this.yDomain = this.fixNumericExtent(extent(this.yData, isContinuous), 'y', yAxis);
        }
        else {
            this.yDomain = this.yData;
        }
        return true;
    };
    ScatterSeries.prototype.getDomain = function (direction) {
        if (direction === exports.ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    ScatterSeries.prototype.getNodeData = function () {
        return this.nodeData;
    };
    ScatterSeries.prototype.getLabelData = function () {
        return this.nodeData;
    };
    ScatterSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey,
            yKey: this.yKey,
            sizeKey: this.sizeKey
        });
    };
    ScatterSeries.prototype.createNodeData = function () {
        var _a = this, chart = _a.chart, data = _a.data, visible = _a.visible, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!(chart && data && visible && xAxis && yAxis) || chart.layoutPending || chart.dataPending) {
            return [];
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var isContinuousX = xScale instanceof ContinuousScale;
        var isContinuousY = yScale instanceof ContinuousScale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var yOffset = (yScale.bandwidth || 0) / 2;
        var _b = this, xData = _b.xData, yData = _b.yData, validData = _b.validData, sizeData = _b.sizeData, sizeScale = _b.sizeScale, marker = _b.marker;
        var nodeData = [];
        sizeScale.range = [marker.size, marker.maxSize];
        for (var i = 0; i < xData.length; i++) {
            var xy = this.checkDomainXY(xData[i], yData[i], isContinuousX, isContinuousY);
            if (!xy) {
                continue;
            }
            var x = xScale.convert(xy[0]) + xOffset;
            var y = yScale.convert(xy[1]) + yOffset;
            if (!this.checkRangeXY(x, y, xAxis, yAxis)) {
                continue;
            }
            nodeData.push({
                series: this,
                datum: validData[i],
                point: { x: x, y: y },
                size: sizeData.length ? sizeScale.convert(sizeData[i]) : marker.size,
                label: this.labelData[i]
            });
        }
        return this.nodeData = nodeData;
    };
    ScatterSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    ScatterSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        this.createNodeData();
        this.updateMarkerSelection();
        this.updateLabelSelection();
    };
    ScatterSeries.prototype.updateNodes = function () {
        this.group.visible = this.visible;
        this.updateMarkerNodes();
        this.updateLabelNodes();
    };
    ScatterSeries.prototype.updateLabelSelection = function () {
        var placedLabels = this.chart && this.chart.placeLabels().get(this) || [];
        var updateLabels = this.labelSelection.setData(placedLabels);
        updateLabels.exit.remove();
        var enterLabels = updateLabels.enter.append(Text);
        this.labelSelection = updateLabels.merge(enterLabels);
    };
    ScatterSeries.prototype.updateMarkerSelection = function () {
        var MarkerShape = getMarker(this.marker.shape);
        var updateMarkers = this.markerSelection.setData(this.nodeData);
        updateMarkers.exit.remove();
        var enterMarkers = updateMarkers.enter.append(MarkerShape);
        this.markerSelection = updateMarkers.merge(enterMarkers);
    };
    ScatterSeries.prototype.updateLabelNodes = function () {
        var label = this.label;
        this.labelSelection.each(function (text, datum) {
            text.text = datum.text;
            text.fill = label.color;
            text.x = datum.x;
            text.y = datum.y;
            text.fontStyle = label.fontStyle;
            text.fontWeight = label.fontWeight;
            text.fontSize = label.fontSize;
            text.fontFamily = label.fontFamily;
            text.textAlign = 'left';
            text.textBaseline = 'top';
        });
    };
    ScatterSeries.prototype.updateMarkerNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, marker = _a.marker, xKey = _a.xKey, yKey = _a.yKey, strokeWidth = _a.strokeWidth, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, seriesFill = _a.fill, seriesStroke = _a.stroke, highlightedDatum = _a.chart.highlightedDatum, sizeScale = _a.sizeScale, sizeData = _a.sizeData, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : strokeWidth;
        var formatter = marker.formatter;
        sizeScale.range = [marker.size, marker.maxSize];
        this.markerSelection.each(function (node, datum, index) {
            var isDatumHighlighted = datum === highlightedDatum;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : marker.fill || seriesFill;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : marker.stroke || seriesStroke;
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(markerStrokeWidth, datum);
            var size = sizeData.length ? sizeScale.convert(sizeData[index]) : marker.size;
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    xKey: xKey,
                    yKey: yKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    size: size,
                    highlighted: isDatumHighlighted
                });
            }
            node.fill = format && format.fill || fill;
            node.stroke = format && format.stroke || stroke;
            node.strokeWidth = format && format.strokeWidth !== undefined
                ? format.strokeWidth
                : strokeWidth;
            node.size = format && format.size !== undefined
                ? format.size
                : size;
            node.fillOpacity = marker.fillOpacity !== undefined ? marker.fillOpacity : fillOpacity;
            node.strokeOpacity = marker.strokeOpacity !== undefined ? marker.strokeOpacity : strokeOpacity;
            node.translationX = datum.point.x;
            node.translationY = datum.point.y;
            node.opacity = _this.getOpacity(datum);
            node.zIndex = isDatumHighlighted ? Series.highlightedZIndex : index;
            node.visible = marker.enabled && node.size > 0;
        });
    };
    ScatterSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!xKey || !yKey || !xAxis || !yAxis) {
            return '';
        }
        var _b = this, seriesFill = _b.fill, seriesStroke = _b.stroke, marker = _b.marker, tooltip = _b.tooltip, xName = _b.xName, yName = _b.yName, sizeKey = _b.sizeKey, sizeName = _b.sizeName, labelKey = _b.labelKey, labelName = _b.labelName;
        var fill = marker.fill || seriesFill;
        var stroke = marker.stroke || seriesStroke;
        var strokeWidth = this.getStrokeWidth(marker.strokeWidth || this.strokeWidth, nodeDatum);
        var formatter = this.marker.formatter;
        var format = undefined;
        if (formatter) {
            format = formatter({
                datum: nodeDatum,
                xKey: xKey,
                yKey: yKey,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                size: nodeDatum.size,
                highlighted: false
            });
        }
        var color = format && format.fill || fill || 'gray';
        var title = this.title || yName;
        var datum = nodeDatum.datum;
        var xValue = datum[xKey];
        var yValue = datum[yKey];
        var xString = sanitizeHtml(xAxis.formatDatum(xValue));
        var yString = sanitizeHtml(yAxis.formatDatum(yValue));
        var content = "<b>" + sanitizeHtml(xName || xKey) + "</b>: " + xString + "<br>" +
            ("<b>" + sanitizeHtml(yName || yKey) + "</b>: " + yString);
        if (sizeKey) {
            content += "<br><b>" + sanitizeHtml(sizeName || sizeKey) + "</b>: " + sanitizeHtml(datum[sizeKey]);
        }
        if (labelKey) {
            content = "<b>" + sanitizeHtml(labelName || labelKey) + "</b>: " + sanitizeHtml(datum[labelKey]) + "<br>" + content;
        }
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        var tooltipRenderer = tooltip.renderer;
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                xKey: xKey,
                xValue: xValue,
                xName: xName,
                yKey: yKey,
                yValue: yValue,
                yName: yName,
                sizeKey: sizeKey,
                sizeName: sizeName,
                labelKey: labelKey,
                labelName: labelName,
                title: title,
                color: color
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    ScatterSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKey = _a.yKey, yName = _a.yName, title = _a.title, visible = _a.visible, marker = _a.marker, fill = _a.fill, stroke = _a.stroke, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKey) {
            legendData.push({
                id: id,
                itemId: undefined,
                enabled: visible,
                label: {
                    text: title || yName || yKey
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || fill || 'rgba(0, 0, 0, 0)',
                    stroke: marker.stroke || stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: marker.fillOpacity !== undefined ? marker.fillOpacity : fillOpacity,
                    strokeOpacity: marker.strokeOpacity !== undefined ? marker.strokeOpacity : strokeOpacity
                }
            });
        }
    };
    ScatterSeries.className = 'ScatterSeries';
    ScatterSeries.type = 'scatter';
    __decorate$a([
        reactive('layoutChange')
    ], ScatterSeries.prototype, "title", void 0);
    __decorate$a([
        reactive('dataChange')
    ], ScatterSeries.prototype, "xKey", void 0);
    __decorate$a([
        reactive('dataChange')
    ], ScatterSeries.prototype, "yKey", void 0);
    __decorate$a([
        reactive('dataChange')
    ], ScatterSeries.prototype, "sizeKey", void 0);
    __decorate$a([
        reactive('dataChange')
    ], ScatterSeries.prototype, "labelKey", void 0);
    return ScatterSeries;
}(CartesianSeries));

var __extends$L = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$f = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$5 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$f(arguments[i]));
    return ar;
};
var HistogramSeriesNodeTag;
(function (HistogramSeriesNodeTag) {
    HistogramSeriesNodeTag[HistogramSeriesNodeTag["Bin"] = 0] = "Bin";
    HistogramSeriesNodeTag[HistogramSeriesNodeTag["Label"] = 1] = "Label";
})(HistogramSeriesNodeTag || (HistogramSeriesNodeTag = {}));
var HistogramSeriesLabel = /** @class */ (function (_super) {
    __extends$L(HistogramSeriesLabel, _super);
    function HistogramSeriesLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$b([
        reactive('change')
    ], HistogramSeriesLabel.prototype, "formatter", void 0);
    return HistogramSeriesLabel;
}(Label));
var defaultBinCount = 10;
var aggregationFunctions = {
    count: function (bin) { return bin.data.length; },
    sum: function (bin, yKey) { return bin.data.reduce(function (acc, datum) { return acc + datum[yKey]; }, 0); },
    mean: function (bin, yKey) { return aggregationFunctions.sum(bin, yKey) / aggregationFunctions.count(bin, yKey); }
};
var HistogramBin = /** @class */ (function () {
    function HistogramBin(_a) {
        var _b = __read$f(_a, 2), domainMin = _b[0], domainMax = _b[1];
        this.data = [];
        this.aggregatedValue = 0;
        this.frequency = 0;
        this.domain = [domainMin, domainMax];
    }
    HistogramBin.prototype.addDatum = function (datum) {
        this.data.push(datum);
        this.frequency++;
    };
    Object.defineProperty(HistogramBin.prototype, "domainWidth", {
        get: function () {
            var _a = __read$f(this.domain, 2), domainMin = _a[0], domainMax = _a[1];
            return domainMax - domainMin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramBin.prototype, "relativeHeight", {
        get: function () {
            return this.aggregatedValue / this.domainWidth;
        },
        enumerable: true,
        configurable: true
    });
    HistogramBin.prototype.calculateAggregatedValue = function (aggregationName, yKey) {
        if (!yKey) {
            // not having a yKey forces us into a frequency plot
            aggregationName = 'count';
        }
        var aggregationFunction = aggregationFunctions[aggregationName];
        this.aggregatedValue = aggregationFunction(this, yKey);
    };
    HistogramBin.prototype.getY = function (areaPlot) {
        return areaPlot ? this.relativeHeight : this.aggregatedValue;
    };
    return HistogramBin;
}());
var HistogramSeriesTooltip = /** @class */ (function (_super) {
    __extends$L(HistogramSeriesTooltip, _super);
    function HistogramSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$b([
        reactive('change')
    ], HistogramSeriesTooltip.prototype, "renderer", void 0);
    return HistogramSeriesTooltip;
}(SeriesTooltip));
var HistogramSeries = /** @class */ (function (_super) {
    __extends$L(HistogramSeries, _super);
    function HistogramSeries() {
        var _a;
        var _this = _super.call(this) || this;
        // Need to put column and label nodes into separate groups, because even though label nodes are
        // created after the column nodes, this only guarantees that labels will always be on top of columns
        // on the first run. If on the next run more columns are added, they might clip the labels
        // rendered during the previous run.
        _this.rectGroup = _this.pickGroup.appendChild(new Group());
        _this.textGroup = _this.group.appendChild(new Group());
        _this.rectSelection = Selection.select(_this.rectGroup).selectAll();
        _this.textSelection = Selection.select(_this.textGroup).selectAll();
        _this.binnedData = [];
        _this.xDomain = [];
        _this.yDomain = [];
        _this.label = new HistogramSeriesLabel();
        _this.seriesItemEnabled = true;
        _this.tooltip = new HistogramSeriesTooltip();
        _this.fill = undefined;
        _this.stroke = undefined;
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        _this.directionKeys = (_a = {},
            _a[exports.ChartAxisDirection.X] = ['xKey'],
            _a[exports.ChartAxisDirection.Y] = ['yKey'],
            _a);
        _this._xKey = '';
        _this._areaPlot = false;
        _this._bins = undefined;
        _this._aggregation = 'count';
        _this._binCount = undefined;
        _this._xName = '';
        _this._yKey = '';
        _this._yName = '';
        _this._strokeWidth = 1;
        _this.label.enabled = false;
        _this.label.addEventListener('change', _this.scheduleUpdate, _this);
        return _this;
    }
    HistogramSeries.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values.push.apply(values, __spread$5(value));
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    Object.defineProperty(HistogramSeries.prototype, "xKey", {
        get: function () {
            return this._xKey;
        },
        set: function (value) {
            if (this._xKey !== value) {
                this._xKey = value;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "areaPlot", {
        get: function () {
            return this._areaPlot;
        },
        set: function (c) {
            this._areaPlot = c;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "bins", {
        get: function () {
            return this._bins;
        },
        set: function (bins) {
            this._bins = bins;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "aggregation", {
        get: function () {
            return this._aggregation;
        },
        set: function (aggregation) {
            this._aggregation = aggregation;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "binCount", {
        get: function () {
            return this._binCount;
        },
        set: function (binCount) {
            this._binCount = binCount;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "xName", {
        get: function () {
            return this._xName;
        },
        set: function (value) {
            if (this._xName !== value) {
                this._xName = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "yKey", {
        get: function () {
            return this._yKey;
        },
        set: function (yKey) {
            this._yKey = yKey;
            this.seriesItemEnabled = true;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "yName", {
        get: function () {
            return this._yName;
        },
        set: function (values) {
            this._yName = values;
            this.scheduleData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistogramSeries.prototype, "shadow", {
        get: function () {
            return this._shadow;
        },
        set: function (value) {
            if (this._shadow !== value) {
                this._shadow = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    HistogramSeries.prototype.onHighlightChange = function () {
        this.updateRectNodes();
    };
    HistogramSeries.prototype.setColors = function (fills, strokes) {
        this.fill = fills[0];
        this.stroke = strokes[0];
    };
    // During processData phase, used to unify different ways of the user specifying
    // the bins. Returns bins in format[[min1, max1], [min2, max2], ... ].
    HistogramSeries.prototype.deriveBins = function () {
        var _this = this;
        var _a = this, bins = _a.bins, binCount = _a.binCount;
        if (!this.data) {
            return [];
        }
        if (bins) {
            return bins;
        }
        var xData = this.data.map(function (datum) { return datum[_this.xKey]; });
        var xDomain = this.fixNumericExtent(extent(xData, isContinuous), 'x');
        var binStarts = ticks(xDomain[0], xDomain[1], this.binCount || defaultBinCount);
        var binSize = tickStep(xDomain[0], xDomain[1], this.binCount || defaultBinCount);
        var firstBinEnd = binStarts[0];
        var expandStartToBin = function (n) { return [n, n + binSize]; };
        return __spread$5([
            [firstBinEnd - binSize, firstBinEnd]
        ], binStarts.map(expandStartToBin));
    };
    HistogramSeries.prototype.placeDataInBins = function (data) {
        var _this = this;
        var xKey = this.xKey;
        var derivedBins = this.deriveBins();
        // creating a sorted copy allows binning in O(n) rather than O(n²)
        // but at the expense of more temporary memory
        var sortedData = data.slice().sort(function (a, b) {
            if (a[xKey] < b[xKey]) {
                return -1;
            }
            if (a[xKey] > b[xKey]) {
                return 1;
            }
            return 0;
        });
        var currentBin = 0;
        var bins = [new HistogramBin(derivedBins[0])];
        loop: for (var i = 0, ln = sortedData.length; i < ln; i++) {
            var datum = sortedData[i];
            while (datum[xKey] > derivedBins[currentBin][1]) {
                currentBin++;
                var bin = derivedBins[currentBin];
                if (!bin) {
                    break loop;
                }
                bins.push(new HistogramBin(bin));
            }
            bins[currentBin].addDatum(datum);
        }
        bins.forEach(function (b) { return b.calculateAggregatedValue(_this._aggregation, _this.yKey); });
        return bins;
    };
    Object.defineProperty(HistogramSeries.prototype, "xMax", {
        get: function () {
            var _this = this;
            return this.data && this.data.reduce(function (acc, datum) {
                return Math.max(acc, datum[_this.xKey]);
            }, Number.NEGATIVE_INFINITY);
        },
        enumerable: true,
        configurable: true
    });
    HistogramSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, xKey = _a.xKey, data = _a.data;
        this.binnedData = this.placeDataInBins(xKey && data ? data : []);
        var yData = this.binnedData.map(function (b) { return b.getY(_this.areaPlot); });
        var yMinMax = extent(yData, isContinuous);
        this.yDomain = this.fixNumericExtent([0, yMinMax ? yMinMax[1] : 1], 'y');
        var firstBin = this.binnedData[0];
        var lastBin = this.binnedData[this.binnedData.length - 1];
        var xMin = firstBin.domain[0];
        var xMax = lastBin.domain[1];
        this.xDomain = [xMin, xMax];
        this.fireEvent({ type: 'dataProcessed' });
        return true;
    };
    HistogramSeries.prototype.getDomain = function (direction) {
        if (direction === exports.ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    HistogramSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            xKey: this.xKey
        });
    };
    HistogramSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    HistogramSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        var nodeData = this.createNodeData();
        this.updateRectSelection(nodeData);
        this.updateTextSelection(nodeData);
    };
    HistogramSeries.prototype.updateNodes = function () {
        this.group.visible = this.visible;
        this.updateRectNodes();
        this.updateTextNodes();
    };
    HistogramSeries.prototype.createNodeData = function () {
        var _this = this;
        var _a = this, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!this.seriesItemEnabled || !xAxis || !yAxis) {
            return [];
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var _b = this, fill = _b.fill, stroke = _b.stroke, strokeWidth = _b.strokeWidth;
        var nodeData = [];
        var defaultLabelFormatter = function (params) { return String(params.value); };
        var _c = this.label, _d = _c.formatter, labelFormatter = _d === void 0 ? defaultLabelFormatter : _d, labelFontStyle = _c.fontStyle, labelFontWeight = _c.fontWeight, labelFontSize = _c.fontSize, labelFontFamily = _c.fontFamily, labelColor = _c.color;
        this.binnedData.forEach(function (binOfData) {
            var total = binOfData.aggregatedValue, frequency = binOfData.frequency, _a = __read$f(binOfData.domain, 2), xDomainMin = _a[0], xDomainMax = _a[1], relativeHeight = binOfData.relativeHeight;
            var xMinPx = xScale.convert(xDomainMin), xMaxPx = xScale.convert(xDomainMax), 
            // note: assuming can't be negative:
            y = _this.areaPlot ? relativeHeight : (_this.yKey ? total : frequency), yZeroPx = yScale.convert(0), yMaxPx = yScale.convert(y), w = xMaxPx - xMinPx, h = Math.abs(yMaxPx - yZeroPx);
            var selectionDatumLabel = y !== 0 ? {
                text: labelFormatter({ value: binOfData.aggregatedValue }),
                fontStyle: labelFontStyle,
                fontWeight: labelFontWeight,
                fontSize: labelFontSize,
                fontFamily: labelFontFamily,
                fill: labelColor,
                x: xMinPx + w / 2,
                y: yMaxPx + h / 2
            } : undefined;
            nodeData.push({
                series: _this,
                datum: binOfData,
                // since each selection is an aggregation of multiple data.
                x: xMinPx,
                y: yMaxPx,
                width: w,
                height: h,
                fill: fill,
                stroke: stroke,
                strokeWidth: strokeWidth,
                label: selectionDatumLabel,
            });
        });
        return nodeData;
    };
    HistogramSeries.prototype.updateRectSelection = function (nodeData) {
        var updateRects = this.rectSelection.setData(nodeData);
        updateRects.exit.remove();
        var enterRects = updateRects.enter.append(Rect).each(function (rect) {
            rect.tag = HistogramSeriesNodeTag.Bin;
            rect.crisp = true;
        });
        this.rectSelection = updateRects.merge(enterRects);
    };
    HistogramSeries.prototype.updateRectNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, shadow = _a.shadow, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        this.rectSelection.each(function (rect, datum, index) {
            var isDatumHighlighted = datum === highlightedDatum;
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(datum.strokeWidth, datum);
            rect.x = datum.x;
            rect.y = datum.y;
            rect.width = datum.width;
            rect.height = datum.height;
            rect.fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : datum.fill;
            rect.stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : datum.stroke;
            rect.fillOpacity = fillOpacity;
            rect.strokeOpacity = strokeOpacity;
            rect.strokeWidth = strokeWidth;
            rect.lineDash = _this.lineDash;
            rect.lineDashOffset = _this.lineDashOffset;
            rect.fillShadow = shadow;
            rect.zIndex = isDatumHighlighted ? Series.highlightedZIndex : index;
            rect.visible = datum.height > 0; // prevent stroke from rendering for zero height columns
            rect.opacity = _this.getOpacity(datum);
        });
    };
    HistogramSeries.prototype.updateTextSelection = function (nodeData) {
        var updateTexts = this.textSelection.setData(nodeData);
        updateTexts.exit.remove();
        var enterTexts = updateTexts.enter.append(Text).each(function (text) {
            text.tag = HistogramSeriesNodeTag.Label;
            text.pointerEvents = PointerEvents.None;
            text.textAlign = 'center';
            text.textBaseline = 'middle';
        });
        this.textSelection = updateTexts.merge(enterTexts);
    };
    HistogramSeries.prototype.updateTextNodes = function () {
        var labelEnabled = this.label.enabled;
        this.textSelection.each(function (text, datum) {
            var label = datum.label;
            if (label && labelEnabled) {
                text.text = label.text;
                text.x = label.x;
                text.y = label.y;
                text.fontStyle = label.fontStyle;
                text.fontWeight = label.fontWeight;
                text.fontSize = label.fontSize;
                text.fontFamily = label.fontFamily;
                text.fill = label.fill;
                text.visible = true;
            }
            else {
                text.visible = false;
            }
        });
    };
    HistogramSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        if (!xKey || !xAxis || !yAxis) {
            return '';
        }
        var _b = this, xName = _b.xName, yName = _b.yName, color = _b.fill, tooltip = _b.tooltip, aggregation = _b.aggregation;
        var tooltipRenderer = tooltip.renderer;
        var bin = nodeDatum.datum;
        var aggregatedValue = bin.aggregatedValue, frequency = bin.frequency, _c = __read$f(bin.domain, 2), rangeMin = _c[0], rangeMax = _c[1];
        var title = sanitizeHtml(xName || xKey) + ": " + xAxis.formatDatum(rangeMin) + " - " + xAxis.formatDatum(rangeMax);
        var content = yKey ?
            "<b>" + sanitizeHtml(yName || yKey) + " (" + aggregation + ")</b>: " + yAxis.formatDatum(aggregatedValue) + "<br>" :
            '';
        content += "<b>Frequency</b>: " + frequency;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: bin,
                xKey: xKey,
                xValue: bin.domain,
                xName: xName,
                yKey: yKey,
                yValue: bin.aggregatedValue,
                yName: yName,
                color: color
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    HistogramSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, yKey = _a.yKey, yName = _a.yName, seriesItemEnabled = _a.seriesItemEnabled, fill = _a.fill, stroke = _a.stroke, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length) {
            legendData.push({
                id: id,
                itemId: yKey,
                enabled: seriesItemEnabled,
                label: {
                    text: yName || yKey || 'Frequency'
                },
                marker: {
                    fill: fill || 'rgba(0, 0, 0, 0)',
                    stroke: stroke || 'rgba(0, 0, 0, 0)',
                    fillOpacity: fillOpacity,
                    strokeOpacity: strokeOpacity
                }
            });
        }
    };
    HistogramSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        if (itemId === this.yKey) {
            this.seriesItemEnabled = enabled;
        }
        this.scheduleData();
    };
    HistogramSeries.className = 'HistogramSeries';
    HistogramSeries.type = 'histogram';
    __decorate$b([
        reactive('dataChange')
    ], HistogramSeries.prototype, "fill", void 0);
    __decorate$b([
        reactive('dataChange')
    ], HistogramSeries.prototype, "stroke", void 0);
    __decorate$b([
        reactive('layoutChange')
    ], HistogramSeries.prototype, "fillOpacity", void 0);
    __decorate$b([
        reactive('layoutChange')
    ], HistogramSeries.prototype, "strokeOpacity", void 0);
    __decorate$b([
        reactive('update')
    ], HistogramSeries.prototype, "lineDash", void 0);
    __decorate$b([
        reactive('update')
    ], HistogramSeries.prototype, "lineDashOffset", void 0);
    return HistogramSeries;
}(CartesianSeries));

var __extends$M = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HierarchySeries = /** @class */ (function (_super) {
    __extends$M(HierarchySeries, _super);
    function HierarchySeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = undefined;
        return _this;
    }
    __decorate$c([
        reactive('dataChange')
    ], HierarchySeries.prototype, "data", void 0);
    return HierarchySeries;
}(Series));

var __extends$N = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DropShadow = /** @class */ (function (_super) {
    __extends$N(DropShadow, _super);
    function DropShadow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        _this.color = 'rgba(0, 0, 0, 0.5)';
        _this.xOffset = 0;
        _this.yOffset = 0;
        _this.blur = 5;
        return _this;
    }
    __decorate$d([
        reactive('change')
    ], DropShadow.prototype, "enabled", void 0);
    __decorate$d([
        reactive('change')
    ], DropShadow.prototype, "color", void 0);
    __decorate$d([
        reactive('change')
    ], DropShadow.prototype, "xOffset", void 0);
    __decorate$d([
        reactive('change')
    ], DropShadow.prototype, "yOffset", void 0);
    __decorate$d([
        reactive('change')
    ], DropShadow.prototype, "blur", void 0);
    return DropShadow;
}(Observable));

function slice(parent, x0, y0, x1, y1) {
    var nodes = parent.children;
    var k = parent.value && (y1 - y0) / parent.value;
    nodes.forEach(function (node) {
        node.x0 = x0;
        node.x1 = x1;
        node.y0 = y0;
        node.y1 = y0 += node.value * k;
    });
}
function dice(parent, x0, y0, x1, y1) {
    var nodes = parent.children;
    var k = parent.value && (x1 - x0) / parent.value;
    nodes.forEach(function (node) {
        node.x0 = x0;
        node.x1 = x0 += node.value * k;
        node.y0 = y0;
        node.y1 = y1;
    });
}
function roundNode(node) {
    node.x0 = Math.round(node.x0);
    node.y0 = Math.round(node.y0);
    node.x1 = Math.round(node.x1);
    node.y1 = Math.round(node.y1);
}
function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
    var rows = [];
    var nodes = parent.children;
    var n = nodes.length;
    var value = parent.value;
    var i0 = 0;
    var i1 = 0;
    var dx;
    var dy;
    var nodeValue;
    var sumValue;
    var minValue;
    var maxValue;
    var newRatio;
    var minRatio;
    var alpha;
    var beta;
    while (i0 < n) {
        dx = x1 - x0;
        dy = y1 - y0;
        // Find the next non-empty node.
        do {
            sumValue = nodes[i1++].value;
        } while (!sumValue && i1 < n);
        minValue = maxValue = sumValue;
        alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
        beta = sumValue * sumValue * alpha;
        minRatio = Math.max(maxValue / beta, beta / minValue);
        // Keep adding nodes while the aspect ratio maintains or improves.
        for (; i1 < n; ++i1) {
            nodeValue = nodes[i1].value;
            sumValue += nodeValue;
            if (nodeValue < minValue) {
                minValue = nodeValue;
            }
            if (nodeValue > maxValue) {
                maxValue = nodeValue;
            }
            beta = sumValue * sumValue * alpha;
            newRatio = Math.max(maxValue / beta, beta / minValue);
            if (newRatio > minRatio) {
                sumValue -= nodeValue;
                break;
            }
            minRatio = newRatio;
        }
        // Position and record the row orientation.
        var row = {
            value: sumValue,
            dice: dx < dy,
            children: nodes.slice(i0, i1)
        };
        rows.push(row);
        if (row.dice) {
            dice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
        }
        else {
            slice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
        }
        value -= sumValue;
        i0 = i1;
    }
    return rows;
}
var phi = (1 + Math.sqrt(5)) / 2;
var squarify = (function custom(ratio) {
    function squarify(parent, x0, y0, x1, y1) {
        squarifyRatio(ratio, parent, x0, y0, x1, y1);
    }
    squarify.ratio = function (x) { return custom((x = +x) > 1 ? x : 1); };
    return squarify;
})(phi);
var Treemap = /** @class */ (function () {
    function Treemap() {
        this.paddingStack = [0];
        this.dx = 1;
        this.dy = 1;
        this.round = true;
        this.tile = squarify;
        this.paddingInner = function (_) { return 0; };
        this.paddingTop = function (_) { return 0; };
        this.paddingRight = function (_) { return 0; };
        this.paddingBottom = function (_) { return 0; };
        this.paddingLeft = function (_) { return 0; };
    }
    Object.defineProperty(Treemap.prototype, "size", {
        get: function () {
            return [this.dx, this.dy];
        },
        set: function (size) {
            this.dx = size[0];
            this.dy = size[1];
        },
        enumerable: true,
        configurable: true
    });
    Treemap.prototype.processData = function (root) {
        root.x0 = 0;
        root.y0 = 0;
        root.x1 = this.dx;
        root.y1 = this.dy;
        root.eachBefore(this.positionNode.bind(this));
        this.paddingStack = [0];
        if (this.round) {
            root.eachBefore(roundNode);
        }
        return root;
    };
    Treemap.prototype.positionNode = function (node) {
        var p = this.paddingStack[node.depth];
        var x0 = node.x0 + p;
        var y0 = node.y0 + p;
        var x1 = node.x1 - p;
        var y1 = node.y1 - p;
        if (x1 < x0) {
            x0 = x1 = (x0 + x1) / 2;
        }
        if (y1 < y0) {
            y0 = y1 = (y0 + y1) / 2;
        }
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
        if (node.children) {
            p = this.paddingStack[node.depth + 1] = this.paddingInner(node) / 2;
            x0 += this.paddingLeft(node) - p;
            y0 += this.paddingTop(node) - p;
            x1 -= this.paddingRight(node) - p;
            y1 -= this.paddingBottom(node) - p;
            if (x1 < x0) {
                x0 = x1 = (x0 + x1) / 2;
            }
            if (y1 < y0) {
                y0 = y1 = (y0 + y1) / 2;
            }
            this.tile(node, x0, y0, x1, y1);
        }
    };
    return Treemap;
}());

var HierarchyNode = /** @class */ (function () {
    function HierarchyNode(datum) {
        this.value = 0;
        this.depth = 0;
        this.height = 0;
        this.parent = undefined;
        this.children = undefined;
        this.datum = datum;
    }
    HierarchyNode.prototype.countFn = function (node) {
        var sum = 0, children = node.children;
        if (!children || !children.length) {
            sum = 1;
        }
        else {
            var i = children.length;
            while (--i >= 0) {
                sum += children[i].value;
            }
        }
        node.value = sum;
    };
    HierarchyNode.prototype.count = function () {
        return this.eachAfter(this.countFn);
    };
    HierarchyNode.prototype.each = function (callback, scope) {
        var _this = this;
        var index = -1;
        this.iterator(function (node) {
            callback.call(scope, node, ++index, _this);
        });
        return this;
    };
    /**
     * Invokes the given callback for each node in post-order traversal.
     * @param callback
     * @param scope
     */
    HierarchyNode.prototype.eachAfter = function (callback, scope) {
        var node = this;
        var nodes = [node];
        var next = [];
        while (node = nodes.pop()) {
            next.push(node);
            var children = node.children;
            if (children) {
                for (var i = 0, n = children.length; i < n; ++i) {
                    nodes.push(children[i]);
                }
            }
        }
        var index = -1;
        while (node = next.pop()) {
            callback.call(scope, node, ++index, this);
        }
        return this;
    };
    /**
     * Invokes the given callback for each node in pre-order traversal.
     * @param callback
     * @param scope
     */
    HierarchyNode.prototype.eachBefore = function (callback, scope) {
        var node = this;
        var nodes = [node];
        var index = -1;
        while (node = nodes.pop()) {
            callback.call(scope, node, ++index, this);
            var children = node.children;
            if (children) {
                for (var i = children.length - 1; i >= 0; --i) {
                    var child = children[i];
                    nodes.push(child);
                }
            }
        }
        return this;
    };
    HierarchyNode.prototype.find = function (callback, scope) {
        var _this = this;
        var index = -1;
        var result;
        this.iterator(function (node) {
            if (callback.call(scope, node, ++index, _this)) {
                result = node;
                return false;
            }
        });
        return result;
    };
    HierarchyNode.prototype.sum = function (value) {
        return this.eachAfter(function (node) {
            var sum = +value(node.datum) || 0;
            var children = node.children;
            if (children) {
                var i = children.length;
                while (--i >= 0) {
                    sum += children[i].value;
                }
            }
            node.value = sum;
        });
    };
    HierarchyNode.prototype.sort = function (compare) {
        return this.eachBefore(function (node) {
            if (node.children) {
                node.children.sort(compare);
            }
        });
    };
    HierarchyNode.prototype.path = function (end) {
        var start = this;
        var ancestor = leastCommonAncestor(start, end);
        var nodes = [start];
        while (start !== ancestor) {
            start = start.parent;
            nodes.push(start);
        }
        var k = nodes.length;
        while (end !== ancestor) {
            nodes.splice(k, 0, end);
            end = end.parent;
        }
        // const otherBranch = [];
        // while (end !== ancestor) {
        //     otherBranch.push(end);
        //     end = end.parent;
        // }
        // nodes.concat(otherBranch.reverse());
        return nodes;
    };
    HierarchyNode.prototype.ancestors = function () {
        var node = this;
        var nodes = [node];
        while (node = node.parent) {
            nodes.push(node);
        }
        return nodes;
    };
    HierarchyNode.prototype.descendants = function () {
        var nodes = [];
        this.iterator(function (node) { return nodes.push(node); });
        return nodes;
    };
    HierarchyNode.prototype.leaves = function () {
        var leaves = [];
        this.eachBefore(function (node) {
            if (!node.children) {
                leaves.push(node);
            }
        });
        return leaves;
    };
    HierarchyNode.prototype.links = function () {
        var root = this;
        var links = [];
        root.each(function (node) {
            if (node !== root) { // Don’t include the root’s parent, if any.
                links.push({ source: node.parent, target: node });
            }
        });
        return links;
    };
    HierarchyNode.prototype.copy = function () {
        // TODO
    };
    HierarchyNode.prototype.iterator = function (callback) {
        var node = this;
        var next = [node];
        var current;
        doLoop: do {
            current = next.reverse();
            next = [];
            while (node = current.pop()) {
                if (callback(node) === false) {
                    break doLoop;
                }
                var children = node.children;
                if (children) {
                    for (var i = 0, n = children.length; i < n; ++i) {
                        next.push(children[i]);
                    }
                }
            }
        } while (next.length);
    };
    return HierarchyNode;
}());
function hierarchy(data, children) {
    if (data instanceof Map) {
        data = [undefined, data];
        if (children === undefined) {
            children = mapChildren;
        }
    }
    else if (children === undefined) {
        children = objectChildren;
    }
    var root = new HierarchyNode(data);
    var nodes = [root];
    var node;
    var child, childs, i, n;
    while (node = nodes.pop()) {
        if ((childs = children(node.datum)) && (n = (childs = Array.from(childs)).length)) {
            node.children = childs;
            for (i = n - 1; i >= 0; --i) {
                nodes.push(child = childs[i] = new HierarchyNode(childs[i]));
                child.parent = node;
                child.depth = node.depth + 1;
            }
        }
    }
    return root.eachBefore(computeHeight);
}
function computeHeight(node) {
    var height = 0;
    do {
        node.height = height;
    } while ((node = node.parent) && (node.height < ++height));
}
function mapChildren(d) {
    return Array.isArray(d) ? d[1] : undefined;
}
function objectChildren(d) {
    return d.children;
}
function leastCommonAncestor(a, b) {
    if (!(a && b)) {
        return undefined;
    }
    if (a === b) {
        return a;
    }
    var aNodes = a.ancestors();
    var bNodes = b.ancestors();
    var c = undefined;
    a = aNodes.pop();
    b = bNodes.pop();
    while (a === b) {
        c = a;
        a = aNodes.pop();
        b = bNodes.pop();
    }
    return c;
}

var __extends$O = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$e = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TreemapSeriesTooltip = /** @class */ (function (_super) {
    __extends$O(TreemapSeriesTooltip, _super);
    function TreemapSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$e([
        reactive('change')
    ], TreemapSeriesTooltip.prototype, "renderer", void 0);
    return TreemapSeriesTooltip;
}(SeriesTooltip));
var TreemapSeriesLabel = /** @class */ (function (_super) {
    __extends$O(TreemapSeriesLabel, _super);
    function TreemapSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padding = 10;
        return _this;
    }
    __decorate$e([
        reactive('change')
    ], TreemapSeriesLabel.prototype, "padding", void 0);
    return TreemapSeriesLabel;
}(Label));
var TextNodeTag;
(function (TextNodeTag) {
    TextNodeTag[TextNodeTag["Name"] = 0] = "Name";
    TextNodeTag[TextNodeTag["Value"] = 1] = "Value";
})(TextNodeTag || (TextNodeTag = {}));
var TreemapSeries = /** @class */ (function (_super) {
    __extends$O(TreemapSeries, _super);
    function TreemapSeries() {
        var _this = _super.call(this) || this;
        _this.groupSelection = Selection.select(_this.pickGroup).selectAll();
        _this.labelMap = new Map();
        _this.layout = new Treemap();
        _this.title = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontWeight = 'bold';
            label.fontSize = 12;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 15;
            return label;
        })();
        _this.subtitle = (function () {
            var label = new TreemapSeriesLabel();
            label.color = 'white';
            label.fontSize = 9;
            label.fontFamily = 'Verdana, sans-serif';
            label.padding = 13;
            return label;
        })();
        _this.labels = {
            large: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 18;
                return label;
            })(),
            medium: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 14;
                return label;
            })(),
            small: (function () {
                var label = new Label();
                label.color = 'white';
                label.fontWeight = 'bold';
                label.fontSize = 10;
                return label;
            })(),
            color: (function () {
                var label = new Label();
                label.color = 'white';
                return label;
            })()
        };
        _this._nodePadding = 2;
        _this.labelKey = 'label';
        _this.sizeKey = 'size';
        _this.colorKey = 'color';
        _this.colorDomain = [-5, 5];
        _this.colorRange = ['#cb4b3f', '#6acb64'];
        _this.colorParents = false;
        _this.gradient = true;
        _this.colorName = 'Change';
        _this.rootName = 'Root';
        _this._shadow = (function () {
            var shadow = new DropShadow();
            shadow.color = 'rgba(0, 0, 0, 0.4)';
            shadow.xOffset = 1.5;
            shadow.yOffset = 1.5;
            return shadow;
        })();
        _this.tooltip = new TreemapSeriesTooltip();
        _this.shadow.addEventListener('change', _this.scheduleUpdate, _this);
        _this.title.addEventListener('change', _this.scheduleUpdate, _this);
        _this.subtitle.addEventListener('change', _this.scheduleUpdate, _this);
        _this.labels.small.addEventListener('change', _this.scheduleUpdate, _this);
        _this.labels.medium.addEventListener('change', _this.scheduleUpdate, _this);
        _this.labels.large.addEventListener('change', _this.scheduleUpdate, _this);
        _this.labels.color.addEventListener('change', _this.scheduleUpdate, _this);
        return _this;
    }
    Object.defineProperty(TreemapSeries.prototype, "nodePadding", {
        get: function () {
            return this._nodePadding;
        },
        set: function (value) {
            if (this._nodePadding !== value) {
                this._nodePadding = value;
                this.updateLayoutPadding();
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreemapSeries.prototype, "shadow", {
        get: function () {
            return this._shadow;
        },
        set: function (value) {
            if (this._shadow !== value) {
                this._shadow = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    TreemapSeries.prototype.onHighlightChange = function () {
        this.updateNodes();
    };
    TreemapSeries.prototype.updateLayoutPadding = function () {
        var _a = this, title = _a.title, subtitle = _a.subtitle, nodePadding = _a.nodePadding, labelKey = _a.labelKey;
        this.layout.paddingRight = function (_) { return nodePadding; };
        this.layout.paddingBottom = function (_) { return nodePadding; };
        this.layout.paddingLeft = function (_) { return nodePadding; };
        this.layout.paddingTop = function (node) {
            var name = node.datum[labelKey] || '';
            if (node.children) {
                name = name.toUpperCase();
            }
            var font = node.depth > 1 ? subtitle : title;
            var textSize = HdpiCanvas.getTextSize(name, [font.fontWeight, font.fontSize + 'px', font.fontFamily].join(' ').trim());
            var innerNodeWidth = node.x1 - node.x0 - nodePadding * 2;
            var hasTitle = node.depth > 0 && node.children && textSize.width <= innerNodeWidth;
            node.hasTitle = !!hasTitle;
            return hasTitle ? textSize.height + nodePadding * 2 : nodePadding;
        };
    };
    TreemapSeries.prototype.processData = function () {
        if (!this.data) {
            return false;
        }
        var _a = this, data = _a.data, sizeKey = _a.sizeKey, labelKey = _a.labelKey, colorKey = _a.colorKey, colorDomain = _a.colorDomain, colorRange = _a.colorRange, colorParents = _a.colorParents;
        var dataRoot;
        if (sizeKey) {
            dataRoot = hierarchy(data).sum(function (datum) { return datum.children ? 1 : datum[sizeKey]; });
        }
        else {
            dataRoot = hierarchy(data).sum(function (datum) { return datum.children ? 0 : 1; });
        }
        this.dataRoot = dataRoot;
        var colorScale = new LinearScale();
        colorScale.domain = colorDomain;
        colorScale.range = colorRange;
        var series = this;
        function traverse(root, depth) {
            if (depth === void 0) { depth = 0; }
            var children = root.children, datum = root.datum;
            var label = datum[labelKey];
            var colorValue = colorKey ? datum[colorKey] : depth;
            root.series = series;
            root.fill = !children || colorParents ? colorScale.convert(colorValue) : '#272931';
            root.colorValue = colorValue;
            if (label) {
                root.label = children ? label.toUpperCase() : label;
            }
            else {
                root.label = '';
            }
            if (children) {
                children.forEach(function (child) { return traverse(child, depth + 1); });
            }
        }
        traverse(this.dataRoot);
        return true;
    };
    TreemapSeries.prototype.getLabelCenterX = function (datum) {
        return (datum.x0 + datum.x1) / 2;
    };
    TreemapSeries.prototype.getLabelCenterY = function (datum) {
        return (datum.y0 + datum.y1) / 2 + 2;
    };
    TreemapSeries.prototype.update = function () {
        this.updatePending = false;
        this.updateSelections();
        this.updateNodes();
    };
    TreemapSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        var _a = this, chart = _a.chart, dataRoot = _a.dataRoot;
        if (!chart || !dataRoot) {
            return;
        }
        var seriesRect = chart.getSeriesRect();
        if (!seriesRect) {
            return;
        }
        this.layout.size = [seriesRect.width, seriesRect.height];
        this.updateLayoutPadding();
        var descendants = this.layout.processData(dataRoot).descendants();
        var updateGroups = this.groupSelection.setData(descendants);
        updateGroups.exit.remove();
        var enterGroups = updateGroups.enter.append(Group);
        enterGroups.append(Rect);
        enterGroups.append(Text).each(function (node) { return node.tag = TextNodeTag.Name; });
        enterGroups.append(Text).each(function (node) { return node.tag = TextNodeTag.Value; });
        this.groupSelection = updateGroups.merge(enterGroups);
    };
    TreemapSeries.prototype.updateNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        var _a = this, colorKey = _a.colorKey, labelMap = _a.labelMap, nodePadding = _a.nodePadding, title = _a.title, subtitle = _a.subtitle, labels = _a.labels, shadow = _a.shadow, gradient = _a.gradient, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f;
        this.groupSelection.selectByClass(Rect).each(function (rect, datum) {
            var isDatumHighlighted = datum === highlightedDatum;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : datum.fill;
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : datum.depth < 2 ? undefined : 'black';
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(1, datum);
            rect.fill = fill;
            rect.stroke = stroke;
            rect.strokeWidth = strokeWidth;
            rect.crisp = true;
            rect.gradient = gradient;
            rect.x = datum.x0;
            rect.y = datum.y0;
            rect.width = datum.x1 - datum.x0;
            rect.height = datum.y1 - datum.y0;
        });
        this.groupSelection.selectByTag(TextNodeTag.Name).each(function (text, datum, index) {
            var isLeaf = !datum.children;
            var innerNodeWidth = datum.x1 - datum.x0 - nodePadding * 2;
            var innerNodeHeight = datum.y1 - datum.y0 - nodePadding * 2;
            var hasTitle = datum.hasTitle;
            var highlighted = datum === highlightedDatum;
            var label;
            if (isLeaf) {
                if (innerNodeWidth > 40 && innerNodeHeight > 40) {
                    label = labels.large;
                }
                else if (innerNodeWidth > 20 && innerNodeHeight > 20) {
                    label = labels.medium;
                }
                else {
                    label = labels.small;
                }
            }
            else {
                if (datum.depth > 1) {
                    label = subtitle;
                }
                else {
                    label = title;
                }
            }
            text.fontWeight = label.fontWeight;
            text.fontSize = label.fontSize;
            text.fontFamily = label.fontFamily;
            text.textBaseline = isLeaf ? 'bottom' : (hasTitle ? 'top' : 'middle');
            text.textAlign = hasTitle ? 'left' : 'center';
            text.text = datum.label;
            var textBBox = text.computeBBox();
            var hasLabel = isLeaf && !!textBBox
                && textBBox.width <= innerNodeWidth
                && textBBox.height * 2 + 8 <= innerNodeHeight;
            labelMap.set(index, text);
            text.fill = highlighted ? 'black' : label.color;
            text.fillShadow = hasLabel && !highlighted ? shadow : undefined;
            text.visible = hasTitle || hasLabel;
            if (hasTitle) {
                text.x = datum.x0 + nodePadding;
                text.y = datum.y0 + nodePadding;
            }
            else {
                text.x = _this.getLabelCenterX(datum);
                text.y = _this.getLabelCenterY(datum);
            }
        });
        this.groupSelection.selectByTag(TextNodeTag.Value).each(function (text, datum, index) {
            var isLeaf = !datum.children;
            var innerNodeWidth = datum.x1 - datum.x0 - nodePadding * 2;
            var highlighted = datum === highlightedDatum;
            var value = datum.colorValue;
            var label = labels.color;
            text.fontSize = label.fontSize;
            text.fontFamily = label.fontFamily;
            text.fontStyle = label.fontStyle;
            text.fontWeight = label.fontWeight;
            text.textBaseline = 'top';
            text.textAlign = 'center';
            text.text = typeof value === 'number' && isFinite(value)
                ? String(toFixed(datum.colorValue)) + '%'
                : '';
            var textBBox = text.computeBBox();
            var nameNode = labelMap.get(index);
            var hasLabel = !!nameNode && nameNode.visible;
            var isVisible = isLeaf && !!colorKey && hasLabel && !!textBBox && textBBox.width < innerNodeWidth;
            text.fill = highlighted ? 'black' : label.color;
            text.fillShadow = highlighted ? undefined : shadow;
            text.visible = isVisible;
            if (isVisible) {
                text.x = _this.getLabelCenterX(datum);
                text.y = _this.getLabelCenterY(datum);
            }
            else {
                if (nameNode && !(datum.children && datum.children.length)) {
                    nameNode.textBaseline = 'middle';
                    nameNode.y = _this.getLabelCenterY(datum);
                }
            }
        });
    };
    TreemapSeries.prototype.getDomain = function (direction) {
        return [0, 1];
    };
    TreemapSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            labelKey: this.labelKey,
            sizeKey: this.sizeKey,
            colorKey: this.colorKey
        });
    };
    TreemapSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, tooltip = _a.tooltip, sizeKey = _a.sizeKey, labelKey = _a.labelKey, colorKey = _a.colorKey, colorName = _a.colorName, rootName = _a.rootName;
        var datum = nodeDatum.datum;
        var tooltipRenderer = tooltip.renderer;
        var title = nodeDatum.depth ? datum[labelKey] : (rootName || datum[labelKey]);
        var content = undefined;
        var color = nodeDatum.fill || 'gray';
        if (colorKey && colorName) {
            var colorValue = datum[colorKey];
            if (typeof colorValue === 'number' && isFinite(colorValue)) {
                content = "<b>" + colorName + "</b>: " + toFixed(datum[colorKey]);
            }
        }
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: nodeDatum,
                sizeKey: sizeKey,
                labelKey: labelKey,
                colorKey: colorKey,
                title: title,
                color: color
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    TreemapSeries.prototype.listSeriesItems = function (legendData) {
    };
    TreemapSeries.className = 'TreemapSeries';
    TreemapSeries.type = 'treemap';
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "labelKey", void 0);
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "sizeKey", void 0);
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "colorKey", void 0);
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "colorDomain", void 0);
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "colorRange", void 0);
    __decorate$e([
        reactive('dataChange')
    ], TreemapSeries.prototype, "colorParents", void 0);
    __decorate$e([
        reactive('update')
    ], TreemapSeries.prototype, "gradient", void 0);
    return TreemapSeries;
}(HierarchySeries));

var __extends$P = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sector = /** @class */ (function (_super) {
    __extends$P(Sector, _super);
    function Sector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._centerX = 0;
        _this._centerY = 0;
        _this._centerOffset = 0;
        _this._innerRadius = 10;
        _this._outerRadius = 20;
        _this._startAngle = 0;
        _this._endAngle = Math.PI * 2;
        _this._angleOffset = 0;
        return _this;
    }
    Object.defineProperty(Sector.prototype, "centerX", {
        get: function () {
            return this._centerX;
        },
        set: function (value) {
            if (this._centerX !== value) {
                this._centerX = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "centerY", {
        get: function () {
            return this._centerY;
        },
        set: function (value) {
            if (this._centerY !== value) {
                this._centerY = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "centerOffset", {
        get: function () {
            return this._centerOffset;
        },
        set: function (value) {
            if (this._centerOffset !== value) {
                this._centerOffset = Math.max(0, value);
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "innerRadius", {
        get: function () {
            return this._innerRadius;
        },
        set: function (value) {
            if (this._innerRadius !== value) {
                this._innerRadius = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "outerRadius", {
        get: function () {
            return this._outerRadius;
        },
        set: function (value) {
            if (this._outerRadius !== value) {
                this._outerRadius = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "startAngle", {
        get: function () {
            return this._startAngle;
        },
        set: function (value) {
            if (this._startAngle !== value) {
                this._startAngle = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "endAngle", {
        get: function () {
            return this._endAngle;
        },
        set: function (value) {
            if (this._endAngle !== value) {
                this._endAngle = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sector.prototype, "angleOffset", {
        get: function () {
            return this._angleOffset;
        },
        set: function (value) {
            if (this._angleOffset !== value) {
                this._angleOffset = value;
                this.dirtyPath = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Sector.prototype.computeBBox = function () {
        var radius = this.outerRadius;
        return new BBox(this.centerX - radius, this.centerY - radius, radius * 2, radius * 2);
    };
    Sector.prototype.isFullPie = function () {
        return isEqual(normalizeAngle360(this.startAngle), normalizeAngle360(this.endAngle));
    };
    Sector.prototype.updatePath = function () {
        var path = this.path;
        var angleOffset = this.angleOffset;
        var startAngle = Math.min(this.startAngle, this.endAngle) + angleOffset;
        var endAngle = Math.max(this.startAngle, this.endAngle) + angleOffset;
        var midAngle = (startAngle + endAngle) * 0.5;
        var innerRadius = Math.min(this.innerRadius, this.outerRadius);
        var outerRadius = Math.max(this.innerRadius, this.outerRadius);
        var centerOffset = this.centerOffset;
        var fullPie = this.isFullPie();
        var centerX = this.centerX;
        var centerY = this.centerY;
        path.clear();
        if (centerOffset) {
            centerX += centerOffset * Math.cos(midAngle);
            centerY += centerOffset * Math.sin(midAngle);
        }
        if (!fullPie) {
            path.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle));
            // if (showTip) {
            //     path.lineTo(
            //         centerX + 0.5 * (innerRadius + outerRadius) * Math.cos(startAngle) + tipOffset * Math.cos(startAngle + Math.PI / 2),
            //         centerY + 0.5 * (innerRadius + outerRadius) * Math.sin(startAngle) + tipOffset * Math.sin(startAngle + Math.PI / 2)
            //     );
            // }
            path.lineTo(centerX + outerRadius * Math.cos(startAngle), centerY + outerRadius * Math.sin(startAngle));
        }
        path.cubicArc(centerX, centerY, outerRadius, outerRadius, 0, startAngle, endAngle, 0);
        // path[fullPie ? 'moveTo' : 'lineTo'](
        //     centerX + innerRadius * Math.cos(endAngle),
        //     centerY + innerRadius * Math.sin(endAngle)
        // );
        if (fullPie) {
            path.moveTo(centerX + innerRadius * Math.cos(endAngle), centerY + innerRadius * Math.sin(endAngle));
        }
        else {
            // if (showTip) {
            //     path.lineTo(
            //         centerX + 0.5 * (innerRadius + outerRadius) * Math.cos(endAngle) + tipOffset * Math.cos(endAngle + Math.PI / 2),
            //         centerY + 0.5 * (innerRadius + outerRadius) * Math.sin(endAngle) + tipOffset * Math.sin(endAngle + Math.PI / 2)
            //     );
            // }
            // Temp workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=993330
            // Revert this commit when fixed ^^.
            var x = centerX + innerRadius * Math.cos(endAngle);
            path.lineTo(Math.abs(x) < 1e-8 ? 0 : x, centerY + innerRadius * Math.sin(endAngle));
        }
        path.cubicArc(centerX, centerY, innerRadius, innerRadius, 0, endAngle, startAngle, 1);
        path.closePath();
        this.dirtyPath = false;
    };
    Sector.className = 'Sector';
    return Sector;
}(Path));

var __extends$Q = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$f = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$g = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$6 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$g(arguments[i]));
    return ar;
};
var PieHighlightStyle = /** @class */ (function (_super) {
    __extends$Q(PieHighlightStyle, _super);
    function PieHighlightStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PieHighlightStyle;
}(HighlightStyle));
var PieNodeTag;
(function (PieNodeTag) {
    PieNodeTag[PieNodeTag["Sector"] = 0] = "Sector";
    PieNodeTag[PieNodeTag["Callout"] = 1] = "Callout";
    PieNodeTag[PieNodeTag["Label"] = 2] = "Label";
})(PieNodeTag || (PieNodeTag = {}));
var PieSeriesLabel = /** @class */ (function (_super) {
    __extends$Q(PieSeriesLabel, _super);
    function PieSeriesLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = 3; // from the callout line
        _this.minAngle = 20; // in degrees
        return _this;
    }
    __decorate$f([
        reactive('change')
    ], PieSeriesLabel.prototype, "offset", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeriesLabel.prototype, "minAngle", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeriesLabel.prototype, "formatter", void 0);
    return PieSeriesLabel;
}(Label));
var PieSeriesCallout = /** @class */ (function (_super) {
    __extends$Q(PieSeriesCallout, _super);
    function PieSeriesCallout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colors = [
            '#874349',
            '#718661',
            '#a48f5f',
            '#5a7088',
            '#7f637a',
            '#5d8692'
        ];
        _this.length = 10;
        _this.strokeWidth = 1;
        return _this;
    }
    __decorate$f([
        reactive('change')
    ], PieSeriesCallout.prototype, "colors", void 0);
    __decorate$f([
        reactive('change')
    ], PieSeriesCallout.prototype, "length", void 0);
    __decorate$f([
        reactive('change')
    ], PieSeriesCallout.prototype, "strokeWidth", void 0);
    return PieSeriesCallout;
}(Observable));
var PieSeriesTooltip = /** @class */ (function (_super) {
    __extends$Q(PieSeriesTooltip, _super);
    function PieSeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$f([
        reactive('change')
    ], PieSeriesTooltip.prototype, "renderer", void 0);
    return PieSeriesTooltip;
}(SeriesTooltip));
var PieTitle = /** @class */ (function (_super) {
    __extends$Q(PieTitle, _super);
    function PieTitle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showInLegend = false;
        return _this;
    }
    __decorate$f([
        reactive()
    ], PieTitle.prototype, "showInLegend", void 0);
    return PieTitle;
}(Caption));
var PieSeries = /** @class */ (function (_super) {
    __extends$Q(PieSeries, _super);
    function PieSeries() {
        var _this = _super.call(this) || this;
        _this.radiusScale = new LinearScale();
        _this.groupSelection = Selection.select(_this.pickGroup).selectAll();
        /**
         * The processed data that gets visualized.
         */
        _this.groupSelectionData = [];
        _this.angleScale = (function () {
            var scale = new LinearScale();
            // Each slice is a ratio of the whole, where all ratios add up to 1.
            scale.domain = [0, 1];
            // Add 90 deg to start the first pie at 12 o'clock.
            scale.range = [-Math.PI, Math.PI].map(function (angle) { return angle + Math.PI / 2; });
            return scale;
        })();
        // When a user toggles a series item (e.g. from the legend), its boolean state is recorded here.
        _this.seriesItemEnabled = [];
        _this.label = new PieSeriesLabel();
        _this.callout = new PieSeriesCallout();
        _this.tooltip = new PieSeriesTooltip();
        /**
         * The key of the numeric field to use to determine the angle (for example,
         * a pie slice angle).
         */
        _this.angleKey = '';
        _this.angleName = '';
        _this._fills = [
            '#c16068',
            '#a2bf8a',
            '#ebcc87',
            '#80a0c3',
            '#b58dae',
            '#85c0d1'
        ];
        _this._strokes = [
            '#874349',
            '#718661',
            '#a48f5f',
            '#5a7088',
            '#7f637a',
            '#5d8692'
        ];
        _this.fillOpacity = 1;
        _this.strokeOpacity = 1;
        _this.lineDash = [0];
        _this.lineDashOffset = 0;
        /**
         * The series rotation in degrees.
         */
        _this.rotation = 0;
        _this.outerRadiusOffset = 0;
        _this.innerRadiusOffset = 0;
        _this.strokeWidth = 1;
        _this.highlightStyle = new PieHighlightStyle();
        _this.addEventListener('update', _this.scheduleUpdate, _this);
        _this.label.addEventListener('change', _this.scheduleUpdate, _this);
        _this.label.addEventListener('dataChange', _this.scheduleData, _this);
        _this.callout.addEventListener('change', _this.scheduleLayout, _this);
        _this.addPropertyListener('data', function (event) {
            if (event.value) {
                event.source.seriesItemEnabled = event.value.map(function () { return true; });
            }
        });
        return _this;
    }
    Object.defineProperty(PieSeries.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            var oldTitle = this._title;
            function updateLegend() {
                this.fireEvent({ type: 'legendChange' });
            }
            if (oldTitle !== value) {
                if (oldTitle) {
                    oldTitle.removeEventListener('change', this.scheduleUpdate, this);
                    oldTitle.removePropertyListener('showInLegend', updateLegend, this);
                    this.group.removeChild(oldTitle.node);
                }
                if (value) {
                    value.node.textBaseline = 'bottom';
                    value.addEventListener('change', this.scheduleUpdate, this);
                    value.addPropertyListener('showInLegend', updateLegend, this);
                    this.group.appendChild(value.node);
                }
                this._title = value;
                this.scheduleUpdate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "fills", {
        get: function () {
            return this._fills;
        },
        set: function (values) {
            this._fills = values;
            this.scheduleUpdate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSeries.prototype, "strokes", {
        get: function () {
            return this._strokes;
        },
        set: function (values) {
            this._strokes = values;
            this.scheduleUpdate();
        },
        enumerable: true,
        configurable: true
    });
    PieSeries.prototype.onHighlightChange = function () {
        this.updateNodes();
    };
    PieSeries.prototype.setColors = function (fills, strokes) {
        this.fills = fills;
        this.strokes = strokes;
        this.callout.colors = strokes;
    };
    PieSeries.prototype.getDomain = function (direction) {
        if (direction === exports.ChartAxisDirection.X) {
            return this.angleScale.domain;
        }
        else {
            return this.radiusScale.domain;
        }
    };
    PieSeries.prototype.processData = function () {
        var _this = this;
        var _a = this, angleKey = _a.angleKey, radiusKey = _a.radiusKey, seriesItemEnabled = _a.seriesItemEnabled, angleScale = _a.angleScale, groupSelectionData = _a.groupSelectionData, label = _a.label;
        var data = angleKey && this.data ? this.data : [];
        var angleData = data.map(function (datum, index) { return seriesItemEnabled[index] && Math.abs(+datum[angleKey]) || 0; });
        var angleDataTotal = angleData.reduce(function (a, b) { return a + b; }, 0);
        // The ratios (in [0, 1] interval) used to calculate the end angle value for every pie slice.
        // Each slice starts where the previous one ends, so we only keep the ratios for end angles.
        var angleDataRatios = (function () {
            var sum = 0;
            return angleData.map(function (datum) { return sum += datum / angleDataTotal; });
        })();
        var labelFormatter = label.formatter;
        var labelKey = label.enabled && this.labelKey;
        var labelData = [];
        var radiusData = [];
        if (labelKey) {
            if (labelFormatter) {
                labelData = data.map(function (datum) { return labelFormatter({ value: datum[labelKey] }); });
            }
            else {
                labelData = data.map(function (datum) { return String(datum[labelKey]); });
            }
        }
        if (radiusKey) {
            var _b = this, radiusMin = _b.radiusMin, radiusMax = _b.radiusMax;
            var radii = data.map(function (datum) { return Math.abs(datum[radiusKey]); });
            var min_1 = radiusMin !== undefined ? radiusMin : Math.min.apply(Math, __spread$6(radii));
            var max = radiusMax !== undefined ? radiusMax : Math.max.apply(Math, __spread$6(radii));
            var delta_1 = max - min_1;
            radiusData = radii.map(function (value) { return delta_1 ? (value - min_1) / delta_1 : 1; });
        }
        groupSelectionData.length = 0;
        var rotation = toRadians(this.rotation);
        var halfPi = Math.PI / 2;
        var datumIndex = 0;
        var quadrantTextOpts = [
            { textAlign: 'center', textBaseline: 'bottom' },
            { textAlign: 'left', textBaseline: 'middle' },
            { textAlign: 'center', textBaseline: 'hanging' },
            { textAlign: 'right', textBaseline: 'middle' },
        ];
        // Process segments.
        var end = 0;
        angleDataRatios.forEach(function (start) {
            if (isNaN(start)) {
                return;
            } // No segments displayed - nothing to do.
            var radius = radiusKey ? radiusData[datumIndex] : 1;
            var startAngle = angleScale.convert(start) + rotation;
            var endAngle = angleScale.convert(end) + rotation;
            var midAngle = (startAngle + endAngle) / 2;
            var span = Math.abs(endAngle - startAngle);
            var midCos = Math.cos(midAngle);
            var midSin = Math.sin(midAngle);
            var labelMinAngle = toRadians(label.minAngle);
            var labelVisible = labelKey && span > labelMinAngle;
            var midAngle180 = normalizeAngle180(midAngle);
            // Split the circle into quadrants like so: ⊗
            var quadrantStart = -3 * Math.PI / 4; // same as `normalizeAngle180(toRadians(-135))`
            var quadrantOffset = midAngle180 - quadrantStart;
            var quadrant = Math.floor(quadrantOffset / halfPi);
            var quadrantIndex = mod(quadrant, quadrantTextOpts.length);
            var _a = quadrantTextOpts[quadrantIndex], textAlign = _a.textAlign, textBaseline = _a.textBaseline;
            groupSelectionData.push({
                series: _this,
                datum: data[datumIndex],
                itemId: datumIndex,
                index: datumIndex,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle,
                midAngle: midAngle,
                midCos: midCos,
                midSin: midSin,
                label: labelVisible ? {
                    text: labelData[datumIndex],
                    textAlign: textAlign,
                    textBaseline: textBaseline
                } : undefined
            });
            datumIndex++;
            end = start; // Update for next iteration.
        });
        return true;
    };
    PieSeries.prototype.update = function () {
        this.updatePending = false;
        var _a = this, radius = _a.radius, innerRadiusOffset = _a.innerRadiusOffset, outerRadiusOffset = _a.outerRadiusOffset, title = _a.title;
        this.radiusScale.range = [
            innerRadiusOffset ? radius + innerRadiusOffset : 0,
            radius + (outerRadiusOffset || 0)
        ];
        this.group.translationX = this.centerX;
        this.group.translationY = this.centerY;
        if (title) {
            var outerRadius = Math.max(0, this.radiusScale.range[1]);
            if (outerRadius === 0) {
                title.node.visible = false;
            }
            else {
                title.node.translationY = -radius - outerRadiusOffset - 2;
                title.node.visible = title.enabled;
            }
        }
        this.updateSelections();
        this.updateNodes();
    };
    PieSeries.prototype.updateSelections = function () {
        if (!this.nodeDataPending) {
            return;
        }
        this.nodeDataPending = false;
        this.updateGroupSelection();
    };
    PieSeries.prototype.updateGroupSelection = function () {
        var updateGroups = this.groupSelection.setData(this.groupSelectionData);
        updateGroups.exit.remove();
        var enterGroups = updateGroups.enter.append(Group);
        enterGroups.append(Sector).each(function (node) { return node.tag = PieNodeTag.Sector; });
        enterGroups.append(Line).each(function (node) {
            node.tag = PieNodeTag.Callout;
            node.pointerEvents = PointerEvents.None;
        });
        enterGroups.append(Text).each(function (node) {
            node.tag = PieNodeTag.Label;
            node.pointerEvents = PointerEvents.None;
        });
        this.groupSelection = updateGroups.merge(enterGroups);
    };
    PieSeries.prototype.updateNodes = function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        this.group.visible = this.visible && this.seriesItemEnabled.indexOf(true) >= 0;
        var _a = this, fills = _a.fills, strokes = _a.strokes, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity, radiusScale = _a.radiusScale, callout = _a.callout, shadow = _a.shadow, highlightedDatum = _a.chart.highlightedDatum, _b = _a.highlightStyle, deprecatedFill = _b.fill, deprecatedStroke = _b.stroke, deprecatedStrokeWidth = _b.strokeWidth, _c = _b.item, _d = _c.fill, highlightedFill = _d === void 0 ? deprecatedFill : _d, _e = _c.stroke, highlightedStroke = _e === void 0 ? deprecatedStroke : _e, _f = _c.strokeWidth, highlightedDatumStrokeWidth = _f === void 0 ? deprecatedStrokeWidth : _f, angleKey = _a.angleKey, radiusKey = _a.radiusKey, formatter = _a.formatter;
        var centerOffsets = [];
        var innerRadius = radiusScale.convert(0);
        this.groupSelection.selectByTag(PieNodeTag.Sector).each(function (sector, datum, index) {
            var radius = radiusScale.convert(datum.radius);
            var isDatumHighlighted = !!highlightedDatum && highlightedDatum.series === _this && datum.itemId === highlightedDatum.itemId;
            var fill = isDatumHighlighted && highlightedFill !== undefined ? highlightedFill : fills[index % fills.length];
            var stroke = isDatumHighlighted && highlightedStroke !== undefined ? highlightedStroke : strokes[index % strokes.length];
            var strokeWidth = isDatumHighlighted && highlightedDatumStrokeWidth !== undefined
                ? highlightedDatumStrokeWidth
                : _this.getStrokeWidth(_this.strokeWidth);
            var format = undefined;
            if (formatter) {
                format = formatter({
                    datum: datum.datum,
                    angleKey: angleKey,
                    radiusKey: radiusKey,
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    highlighted: isDatumHighlighted
                });
            }
            // Bring highlighted slice's parent group to front.
            var parent = sector.parent && sector.parent.parent;
            if (isDatumHighlighted && parent) {
                parent.removeChild(sector.parent);
                parent.appendChild(sector.parent);
            }
            sector.innerRadius = Math.max(0, innerRadius);
            sector.outerRadius = Math.max(0, radius);
            sector.startAngle = datum.startAngle;
            sector.endAngle = datum.endAngle;
            sector.fill = format && format.fill || fill;
            sector.stroke = format && format.stroke || stroke;
            sector.strokeWidth = format && format.strokeWidth !== undefined ? format.strokeWidth : strokeWidth;
            sector.fillOpacity = fillOpacity;
            sector.strokeOpacity = strokeOpacity;
            sector.lineDash = _this.lineDash;
            sector.lineDashOffset = _this.lineDashOffset;
            sector.fillShadow = shadow;
            sector.lineJoin = 'round';
            sector.opacity = _this.getOpacity();
            centerOffsets.push(sector.centerOffset);
        });
        var calloutColors = callout.colors, calloutLength = callout.length, calloutStrokeWidth = callout.strokeWidth;
        this.groupSelection.selectByTag(PieNodeTag.Callout).each(function (line, datum, index) {
            var radius = radiusScale.convert(datum.radius);
            var outerRadius = Math.max(0, radius);
            if (datum.label && outerRadius !== 0) {
                line.strokeWidth = calloutStrokeWidth;
                line.stroke = calloutColors[index % calloutColors.length];
                line.x1 = datum.midCos * outerRadius;
                line.y1 = datum.midSin * outerRadius;
                line.x2 = datum.midCos * (outerRadius + calloutLength);
                line.y2 = datum.midSin * (outerRadius + calloutLength);
            }
            else {
                line.stroke = undefined;
            }
        });
        {
            var _g = this.label, offset_1 = _g.offset, fontStyle_1 = _g.fontStyle, fontWeight_1 = _g.fontWeight, fontSize_1 = _g.fontSize, fontFamily_1 = _g.fontFamily, color_1 = _g.color;
            this.groupSelection.selectByTag(PieNodeTag.Label).each(function (text, datum, index) {
                var label = datum.label;
                var radius = radiusScale.convert(datum.radius);
                var outerRadius = Math.max(0, radius);
                if (label && outerRadius !== 0) {
                    var labelRadius = centerOffsets[index] + outerRadius + calloutLength + offset_1;
                    text.fontStyle = fontStyle_1;
                    text.fontWeight = fontWeight_1;
                    text.fontSize = fontSize_1;
                    text.fontFamily = fontFamily_1;
                    text.text = label.text;
                    text.x = datum.midCos * labelRadius;
                    text.y = datum.midSin * labelRadius;
                    text.fill = color_1;
                    text.textAlign = label.textAlign;
                    text.textBaseline = label.textBaseline;
                }
                else {
                    text.fill = undefined;
                }
            });
        }
    };
    PieSeries.prototype.fireNodeClickEvent = function (event, datum) {
        this.fireEvent({
            type: 'nodeClick',
            event: event,
            series: this,
            datum: datum.datum,
            angleKey: this.angleKey,
            labelKey: this.labelKey,
            radiusKey: this.radiusKey
        });
    };
    PieSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var angleKey = this.angleKey;
        if (!angleKey) {
            return '';
        }
        var _a = this, fills = _a.fills, tooltip = _a.tooltip, angleName = _a.angleName, radiusKey = _a.radiusKey, radiusName = _a.radiusName, labelKey = _a.labelKey, labelName = _a.labelName;
        var tooltipRenderer = tooltip.renderer;
        var color = fills[nodeDatum.index % fills.length];
        var datum = nodeDatum.datum;
        var label = labelKey ? datum[labelKey] + ": " : '';
        var angleValue = datum[angleKey];
        var formattedAngleValue = typeof angleValue === 'number' ? toFixed(angleValue) : angleValue.toString();
        var title = this.title ? this.title.text : undefined;
        var content = label + formattedAngleValue;
        var defaults = {
            title: title,
            backgroundColor: color,
            content: content
        };
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                datum: datum,
                angleKey: angleKey,
                angleValue: angleValue,
                angleName: angleName,
                radiusKey: radiusKey,
                radiusValue: radiusKey ? datum[radiusKey] : undefined,
                radiusName: radiusName,
                labelKey: labelKey,
                labelName: labelName,
                title: title,
                color: color,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    };
    PieSeries.prototype.listSeriesItems = function (legendData) {
        var _this = this;
        var _a = this, labelKey = _a.labelKey, data = _a.data;
        if (data && data.length && labelKey) {
            var _b = this, fills_1 = _b.fills, strokes_1 = _b.strokes, id_1 = _b.id;
            var titleText_1 = this.title && this.title.showInLegend && this.title.text;
            data.forEach(function (datum, index) {
                var labelParts = [];
                titleText_1 && labelParts.push(titleText_1);
                labelParts.push(String(datum[labelKey]));
                legendData.push({
                    id: id_1,
                    itemId: index,
                    enabled: _this.seriesItemEnabled[index],
                    label: {
                        text: labelParts.join(' - ')
                    },
                    marker: {
                        fill: fills_1[index % fills_1.length],
                        stroke: strokes_1[index % strokes_1.length],
                        fillOpacity: _this.fillOpacity,
                        strokeOpacity: _this.strokeOpacity
                    }
                });
            });
        }
    };
    PieSeries.prototype.toggleSeriesItem = function (itemId, enabled) {
        this.seriesItemEnabled[itemId] = enabled;
        this.scheduleData();
    };
    PieSeries.className = 'PieSeries';
    PieSeries.type = 'pie';
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "angleKey", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "angleName", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "radiusKey", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "radiusName", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "radiusMin", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "radiusMax", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "labelKey", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "labelName", void 0);
    __decorate$f([
        reactive('layoutChange')
    ], PieSeries.prototype, "fillOpacity", void 0);
    __decorate$f([
        reactive('layoutChange')
    ], PieSeries.prototype, "strokeOpacity", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "lineDash", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "lineDashOffset", void 0);
    __decorate$f([
        reactive('update')
    ], PieSeries.prototype, "formatter", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "rotation", void 0);
    __decorate$f([
        reactive('layoutChange')
    ], PieSeries.prototype, "outerRadiusOffset", void 0);
    __decorate$f([
        reactive('dataChange')
    ], PieSeries.prototype, "innerRadiusOffset", void 0);
    __decorate$f([
        reactive('layoutChange')
    ], PieSeries.prototype, "strokeWidth", void 0);
    __decorate$f([
        reactive('layoutChange')
    ], PieSeries.prototype, "shadow", void 0);
    return PieSeries;
}(PolarSeries));

function floor$9(date) {
    date.setUTCSeconds(0, 0);
}
function offset$9(date, minutes) {
    date.setTime(date.getTime() + minutes * durationMinute);
}
function count$9(start, end) {
    return (end.getTime() - start.getTime()) / durationMinute;
}
function field$7(date) {
    return date.getUTCMinutes();
}
var utcMinute = new CountableTimeInterval(floor$9, offset$9, count$9, field$7);

function floor$a(date) {
    date.setUTCMinutes(0, 0, 0);
}
function offset$a(date, hours) {
    date.setTime(date.getTime() + hours * durationHour);
}
function count$a(start, end) {
    return (end.getTime() - start.getTime()) / durationHour;
}
function field$8(date) {
    return date.getUTCHours();
}
var utcHour = new CountableTimeInterval(floor$a, offset$a, count$a, field$8);

function floor$b(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
}
function offset$b(date, months) {
    date.setUTCMonth(date.getUTCMonth() + months);
}
function count$b(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}
function field$9(date) {
    return date.getUTCMonth();
}
var utcMonth = new CountableTimeInterval(floor$b, offset$b, count$b, field$9);

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
var __read$h = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var palette = {
    fills: [
        '#f3622d',
        '#fba71b',
        '#57b757',
        '#41a9c9',
        '#4258c9',
        '#9a42c8',
        '#c84164',
        '#888888'
    ],
    strokes: [
        '#aa4520',
        '#b07513',
        '#3d803d',
        '#2d768d',
        '#2e3e8d',
        '#6c2e8c',
        '#8c2d46',
        '#5f5f5f'
    ]
};
function arrayMerge(target, source, options) {
    return source;
}
function isMergeableObject(value) {
    return defaultIsMergeableObject(value) && !(value instanceof TimeInterval);
}
var mergeOptions = { arrayMerge: arrayMerge, isMergeableObject: isMergeableObject };
var BOLD = 'bold';
var INSIDE = 'inside';
var RIGHT = 'right';
var ChartTheme = /** @class */ (function () {
    function ChartTheme(options) {
        options = deepMerge({}, options || {}, mergeOptions);
        var _a = options.overrides, overrides = _a === void 0 ? null : _a, _b = options.palette, palette = _b === void 0 ? null : _b;
        var defaults = this.createChartConfigPerSeries(this.getDefaults());
        if (overrides) {
            var common = overrides.common, cartesian = overrides.cartesian, polar = overrides.polar, hierarchy = overrides.hierarchy;
            var applyOverrides = function (type, seriesTypes, overrideOpts) {
                if (overrideOpts) {
                    defaults[type] = deepMerge(defaults[type], overrideOpts, mergeOptions);
                    seriesTypes.forEach(function (seriesType) {
                        defaults[seriesType] = deepMerge(defaults[seriesType], overrideOpts, mergeOptions);
                    });
                }
            };
            applyOverrides('common', Object.keys(defaults), common);
            applyOverrides('cartesian', ChartTheme.cartesianSeriesTypes, cartesian);
            applyOverrides('polar', ChartTheme.polarSeriesTypes, polar);
            applyOverrides('hierarchy', ChartTheme.hierarchySeriesTypes, hierarchy);
            var seriesOverridesMap_1 = {};
            ChartTheme.seriesTypes.forEach(function (seriesType) {
                var chartConfig = overrides[seriesType];
                if (chartConfig) {
                    if (chartConfig.series) {
                        seriesOverridesMap_1[seriesType] = chartConfig.series;
                        chartConfig.series = seriesOverridesMap_1;
                    }
                    defaults[seriesType] = deepMerge(defaults[seriesType], chartConfig, mergeOptions);
                }
            });
        }
        this.palette = (palette !== null && palette !== void 0 ? palette : this.getPalette());
        this.config = Object.freeze(defaults);
    }
    ChartTheme.prototype.getPalette = function () {
        return palette;
    };
    ChartTheme.getAxisDefaults = function () {
        return {
            top: {},
            right: {},
            bottom: {},
            left: {},
            thickness: 0,
            title: {
                enabled: false,
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                text: 'Axis Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)'
            },
            label: {
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                padding: 5,
                rotation: undefined,
                color: 'rgb(87, 87, 87)',
                formatter: undefined,
                autoRotate: false
            },
            line: {
                width: 1,
                color: 'rgb(195, 195, 195)'
            },
            tick: {
                width: 1,
                size: 6,
                color: 'rgb(195, 195, 195)',
            },
            gridStyle: [{
                    stroke: 'rgb(219, 219, 219)',
                    lineDash: [4, 2]
                }]
        };
    };
    ChartTheme.getSeriesDefaults = function () {
        return {
            tooltip: {
                enabled: true,
                renderer: undefined,
            },
            visible: true,
            showInLegend: true,
            cursor: 'default',
            highlightStyle: {
                item: {
                    fill: 'yellow'
                },
                series: {
                    dimOpacity: 1
                }
            }
        };
    };
    ChartTheme.getBarSeriesDefaults = function () {
        return __assign$3(__assign$3({}, this.getSeriesDefaults()), { flipXY: false, fillOpacity: 1, strokeOpacity: 1, xKey: '', xName: '', yKeys: [], yNames: [], grouped: false, normalizedTo: undefined, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, label: {
                enabled: false,
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)',
                formatter: undefined,
                placement: INSIDE,
            }, shadow: {
                enabled: false,
                color: 'rgba(0, 0, 0, 0.5)',
                xOffset: 3,
                yOffset: 3,
                blur: 5
            } });
    };
    ChartTheme.getLineSeriesDefaults = function () {
        var seriesDefaults = this.getSeriesDefaults();
        return __assign$3(__assign$3({}, seriesDefaults), { tooltip: __assign$3(__assign$3({}, seriesDefaults.tooltip), { format: undefined }) });
    };
    ChartTheme.getCartesianSeriesMarkerDefaults = function () {
        return {
            enabled: true,
            shape: 'circle',
            size: 6,
            maxSize: 30,
            strokeWidth: 1,
            formatter: undefined
        };
    };
    ChartTheme.getChartDefaults = function () {
        return {
            background: {
                visible: true,
                fill: 'white'
            },
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            title: {
                enabled: false,
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                text: 'Title',
                fontStyle: undefined,
                fontWeight: BOLD,
                fontSize: 16,
                fontFamily: this.fontFamily,
                color: 'rgb(70, 70, 70)'
            },
            subtitle: {
                enabled: false,
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                },
                text: 'Subtitle',
                fontStyle: undefined,
                fontWeight: undefined,
                fontSize: 12,
                fontFamily: this.fontFamily,
                color: 'rgb(140, 140, 140)'
            },
            legend: {
                enabled: true,
                position: RIGHT,
                spacing: 20,
                item: {
                    paddingX: 16,
                    paddingY: 8,
                    marker: {
                        shape: undefined,
                        size: 15,
                        strokeWidth: 1,
                        padding: 8
                    },
                    label: {
                        color: 'black',
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: this.fontFamily,
                        formatter: undefined
                    }
                }
            },
            tooltip: {
                enabled: true,
                tracking: true,
                delay: 0,
                class: Chart.defaultTooltipClass
            }
        };
    };
    ChartTheme.prototype.createChartConfigPerSeries = function (config) {
        var typeToAliases = {
            cartesian: ChartTheme.cartesianSeriesTypes,
            polar: ChartTheme.polarSeriesTypes,
            hierarchy: ChartTheme.hierarchySeriesTypes,
            groupedCategory: [],
        };
        Object.entries(typeToAliases).forEach(function (_a) {
            var _b = __read$h(_a, 2), type = _b[0], aliases = _b[1];
            aliases.forEach(function (alias) {
                if (!config[alias]) {
                    config[alias] = deepMerge({}, config[type], mergeOptions);
                }
            });
        });
        return config;
    };
    ChartTheme.prototype.getConfig = function (path, defaultValue) {
        var value = getValue(this.config, path, defaultValue);
        if (Array.isArray(value)) {
            return deepMerge([], value, mergeOptions);
        }
        if (isObject(value)) {
            return deepMerge({}, value, mergeOptions);
        }
        return value;
    };
    /**
     * Meant to be overridden in subclasses. For example:
     * ```
     *     getDefaults() {
     *         const subclassDefaults = { ... };
     *         return this.mergeWithParentDefaults(subclassDefaults);
     *     }
     * ```
     */
    ChartTheme.prototype.getDefaults = function () {
        return deepMerge({}, ChartTheme.defaults, mergeOptions);
    };
    ChartTheme.prototype.mergeWithParentDefaults = function (parentDefaults, defaults) {
        return deepMerge(parentDefaults, defaults, mergeOptions);
    };
    ChartTheme.fontFamily = 'Verdana, sans-serif';
    ChartTheme.cartesianDefaults = __assign$3(__assign$3({}, ChartTheme.getChartDefaults()), { axes: {
            number: __assign$3({}, ChartTheme.getAxisDefaults()),
            log: __assign$3(__assign$3({}, ChartTheme.getAxisDefaults()), { base: 10 }),
            category: __assign$3(__assign$3({}, ChartTheme.getAxisDefaults()), { label: __assign$3(__assign$3({}, ChartTheme.getAxisDefaults().label), { autoRotate: true }) }),
            groupedCategory: __assign$3({}, ChartTheme.getAxisDefaults()),
            time: __assign$3({}, ChartTheme.getAxisDefaults())
        }, series: {
            column: __assign$3(__assign$3({}, ChartTheme.getBarSeriesDefaults()), { flipXY: false }),
            bar: __assign$3(__assign$3({}, ChartTheme.getBarSeriesDefaults()), { flipXY: true }),
            line: __assign$3(__assign$3({}, ChartTheme.getLineSeriesDefaults()), { title: undefined, xKey: '', xName: '', yKey: '', yName: '', strokeWidth: 2, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, marker: __assign$3({}, ChartTheme.getCartesianSeriesMarkerDefaults()), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined
                } }),
            scatter: __assign$3(__assign$3({}, ChartTheme.getSeriesDefaults()), { title: undefined, xKey: '', yKey: '', sizeKey: undefined, labelKey: undefined, xName: '', yName: '', sizeName: 'Size', labelName: 'Label', strokeWidth: 2, fillOpacity: 1, strokeOpacity: 1, marker: __assign$3({}, ChartTheme.getCartesianSeriesMarkerDefaults()), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)'
                } }),
            area: __assign$3(__assign$3({}, ChartTheme.getSeriesDefaults()), { xKey: '', xName: '', yKeys: [], yNames: [], normalizedTo: undefined, fillOpacity: 0.8, strokeOpacity: 1, strokeWidth: 2, lineDash: [0], lineDashOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5
                }, marker: __assign$3(__assign$3({}, ChartTheme.getCartesianSeriesMarkerDefaults()), { enabled: false }), label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined
                } }),
            histogram: __assign$3(__assign$3({}, ChartTheme.getSeriesDefaults()), { xKey: '', yKey: '', xName: '', yName: '', strokeWidth: 1, fillOpacity: 1, strokeOpacity: 1, lineDash: [0], lineDashOffset: 0, areaPlot: false, binCount: 10, bins: undefined, aggregation: 'sum', label: {
                    enabled: false,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    formatter: undefined
                }, shadow: {
                    enabled: true,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 0,
                    yOffset: 0,
                    blur: 5,
                } })
        }, navigator: {
            enabled: false,
            height: 30,
            mask: {
                fill: '#999999',
                stroke: '#999999',
                strokeWidth: 1,
                fillOpacity: 0.2
            },
            minHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8
            },
            maxHandle: {
                fill: '#f2f2f2',
                stroke: '#999999',
                strokeWidth: 1,
                width: 8,
                height: 16,
                gripLineGap: 2,
                gripLineLength: 8
            }
        } });
    ChartTheme.polarDefaults = __assign$3(__assign$3({}, ChartTheme.getChartDefaults()), { series: {
            pie: __assign$3(__assign$3({}, ChartTheme.getSeriesDefaults()), { title: {
                    enabled: true,
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    },
                    text: '',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)'
                }, angleKey: '', angleName: '', radiusKey: undefined, radiusName: undefined, labelKey: undefined, labelName: undefined, label: {
                    enabled: true,
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 12,
                    fontFamily: ChartTheme.fontFamily,
                    color: 'rgb(70, 70, 70)',
                    offset: 3,
                    minAngle: 20
                }, callout: {
                    length: 10,
                    strokeWidth: 2
                }, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, lineDash: [0], lineDashOffset: 0, rotation: 0, outerRadiusOffset: 0, innerRadiusOffset: 0, shadow: {
                    enabled: false,
                    color: 'rgba(0, 0, 0, 0.5)',
                    xOffset: 3,
                    yOffset: 3,
                    blur: 5
                } })
        } });
    ChartTheme.hierarchyDefaults = __assign$3(__assign$3({}, ChartTheme.getChartDefaults()), { series: {
            treemap: __assign$3(__assign$3({}, ChartTheme.getSeriesDefaults()), { showInLegend: false, labelKey: 'label', sizeKey: 'size', colorKey: 'color', colorDomain: [-5, 5], colorRange: ['#cb4b3f', '#6acb64'], colorParents: false, gradient: true, nodePadding: 2, title: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: 'bold',
                    fontSize: 12,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 15
                }, subtitle: {
                    enabled: true,
                    color: 'white',
                    fontStyle: undefined,
                    fontWeight: undefined,
                    fontSize: 9,
                    fontFamily: 'Verdana, sans-serif',
                    padding: 13
                }, labels: {
                    large: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 18,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white'
                    },
                    medium: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white'
                    },
                    small: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: 'bold',
                        fontSize: 10,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white'
                    },
                    color: {
                        enabled: true,
                        fontStyle: undefined,
                        fontWeight: undefined,
                        fontSize: 12,
                        fontFamily: 'Verdana, sans-serif',
                        color: 'white'
                    }
                } })
        } });
    ChartTheme.defaults = {
        cartesian: ChartTheme.cartesianDefaults,
        groupedCategory: ChartTheme.cartesianDefaults,
        polar: ChartTheme.polarDefaults,
        hierarchy: ChartTheme.hierarchyDefaults,
    };
    ChartTheme.cartesianSeriesTypes = ['line', 'area', 'bar', 'column', 'scatter', 'histogram'];
    ChartTheme.polarSeriesTypes = ['pie'];
    ChartTheme.hierarchySeriesTypes = ['treemap'];
    ChartTheme.seriesTypes = ChartTheme.cartesianSeriesTypes
        .concat(ChartTheme.polarSeriesTypes)
        .concat(ChartTheme.hierarchySeriesTypes);
    return ChartTheme;
}());

var __extends$R = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign$4 = (undefined && undefined.__assign) || function () {
    __assign$4 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$4.apply(this, arguments);
};
var DarkTheme = /** @class */ (function (_super) {
    __extends$R(DarkTheme, _super);
    function DarkTheme(options) {
        return _super.call(this, options) || this;
    }
    DarkTheme.prototype.getDefaults = function () {
        var fontColor = 'rgb(200, 200, 200)';
        var mutedFontColor = 'rgb(150, 150, 150)';
        var axisDefaults = {
            title: {
                color: fontColor
            },
            label: {
                color: fontColor
            },
            gridStyle: [{
                    stroke: 'rgb(88, 88, 88)',
                    lineDash: [4, 2]
                }]
        };
        var seriesLabelDefaults = {
            label: {
                color: fontColor
            }
        };
        var chartAxesDefaults = {
            axes: {
                number: __assign$4({}, axisDefaults),
                category: __assign$4({}, axisDefaults),
                time: __assign$4({}, axisDefaults)
            },
        };
        var chartDefaults = {
            background: {
                fill: 'rgb(34, 38, 41)'
            },
            title: {
                color: fontColor
            },
            subtitle: {
                color: mutedFontColor
            },
            legend: {
                item: {
                    label: {
                        color: fontColor
                    }
                }
            }
        };
        return this.mergeWithParentDefaults(_super.prototype.getDefaults.call(this), {
            cartesian: __assign$4(__assign$4(__assign$4({}, chartDefaults), chartAxesDefaults), { series: {
                    bar: __assign$4({}, seriesLabelDefaults),
                    column: __assign$4({}, seriesLabelDefaults),
                    histogram: __assign$4({}, seriesLabelDefaults)
                } }),
            groupedCategory: __assign$4(__assign$4(__assign$4({}, chartDefaults), chartAxesDefaults), { series: {
                    bar: __assign$4({}, seriesLabelDefaults),
                    column: __assign$4({}, seriesLabelDefaults),
                    histogram: __assign$4({}, seriesLabelDefaults)
                } }),
            polar: __assign$4(__assign$4({}, chartDefaults), { series: {
                    pie: __assign$4(__assign$4({}, seriesLabelDefaults), { title: {
                            color: fontColor
                        } })
                } }),
            hierarchy: __assign$4(__assign$4({}, chartDefaults), { series: {
                    treemap: {
                        title: {
                            color: fontColor,
                        },
                        subtitle: {
                            color: mutedFontColor,
                        },
                        labels: {
                            large: {
                                color: fontColor,
                            },
                            medium: {
                                color: fontColor,
                            },
                            small: {
                                color: fontColor,
                            },
                            color: {
                                color: fontColor,
                            },
                        },
                    },
                } }),
        });
    };
    return DarkTheme;
}(ChartTheme));

var __extends$S = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$1 = {
    fills: [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722'
    ],
    strokes: [
        '#ab2f26',
        '#a31545',
        '#6d1b7b',
        '#482980',
        '#2c397f',
        '#1769aa',
        '#0276ab',
        '#008494',
        '#00695f',
        '#357a38',
        '#618834',
        '#909a28',
        '#b3a429',
        '#b38705',
        '#b36a00',
        '#b33d18'
    ]
};
var MaterialLight = /** @class */ (function (_super) {
    __extends$S(MaterialLight, _super);
    function MaterialLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialLight.prototype.getPalette = function () {
        return palette$1;
    };
    return MaterialLight;
}(ChartTheme));

var __extends$T = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$2 = {
    fills: [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#673ab7',
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#009688',
        '#4caf50',
        '#8bc34a',
        '#cddc39',
        '#ffeb3b',
        '#ffc107',
        '#ff9800',
        '#ff5722'
    ],
    strokes: [
        '#ab2f26',
        '#a31545',
        '#6d1b7b',
        '#482980',
        '#2c397f',
        '#1769aa',
        '#0276ab',
        '#008494',
        '#00695f',
        '#357a38',
        '#618834',
        '#909a28',
        '#b3a429',
        '#b38705',
        '#b36a00',
        '#b33d18'
    ]
};
var MaterialDark = /** @class */ (function (_super) {
    __extends$T(MaterialDark, _super);
    function MaterialDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaterialDark.prototype.getPalette = function () {
        return palette$2;
    };
    return MaterialDark;
}(DarkTheme));

var __extends$U = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$3 = {
    fills: [
        '#c16068',
        '#a2bf8a',
        '#ebcc87',
        '#80a0c3',
        '#b58dae',
        '#85c0d1'
    ],
    strokes: [
        '#874349',
        '#718661',
        '#a48f5f',
        '#5a7088',
        '#7f637a',
        '#5d8692'
    ]
};
var PastelLight = /** @class */ (function (_super) {
    __extends$U(PastelLight, _super);
    function PastelLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PastelLight.prototype.getPalette = function () {
        return palette$3;
    };
    return PastelLight;
}(ChartTheme));

var __extends$V = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$4 = {
    fills: [
        '#c16068',
        '#a2bf8a',
        '#ebcc87',
        '#80a0c3',
        '#b58dae',
        '#85c0d1'
    ],
    strokes: [
        '#874349',
        '#718661',
        '#a48f5f',
        '#5a7088',
        '#7f637a',
        '#5d8692'
    ]
};
var PastelDark = /** @class */ (function (_super) {
    __extends$V(PastelDark, _super);
    function PastelDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PastelDark.prototype.getPalette = function () {
        return palette$4;
    };
    return PastelDark;
}(DarkTheme));

var __extends$W = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$5 = {
    fills: [
        '#febe76',
        '#ff7979',
        '#badc58',
        '#f9ca23',
        '#f0932b',
        '#eb4c4b',
        '#6ab04c',
        '#7ed6df',
        '#e056fd',
        '#686de0'
    ],
    strokes: [
        '#b28553',
        '#b35555',
        '#829a3e',
        '#ae8d19',
        '#a8671e',
        '#a43535',
        '#4a7b35',
        '#58969c',
        '#9d3cb1',
        '#494c9d'
    ]
};
var SolarLight = /** @class */ (function (_super) {
    __extends$W(SolarLight, _super);
    function SolarLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SolarLight.prototype.getPalette = function () {
        return palette$5;
    };
    return SolarLight;
}(ChartTheme));

var __extends$X = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$6 = {
    fills: [
        '#febe76',
        '#ff7979',
        '#badc58',
        '#f9ca23',
        '#f0932b',
        '#eb4c4b',
        '#6ab04c',
        '#7ed6df',
        '#e056fd',
        '#686de0'
    ],
    strokes: [
        '#b28553',
        '#b35555',
        '#829a3e',
        '#ae8d19',
        '#a8671e',
        '#a43535',
        '#4a7b35',
        '#58969c',
        '#9d3cb1',
        '#494c9d'
    ]
};
var SolarDark = /** @class */ (function (_super) {
    __extends$X(SolarDark, _super);
    function SolarDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SolarDark.prototype.getPalette = function () {
        return palette$6;
    };
    return SolarDark;
}(DarkTheme));

var __extends$Y = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$7 = {
    fills: [
        '#5BC0EB',
        '#FDE74C',
        '#9BC53D',
        '#E55934',
        '#FA7921',
        '#fa3081'
    ],
    strokes: [
        '#4086a4',
        '#b1a235',
        '#6c8a2b',
        '#a03e24',
        '#af5517',
        '#af225a'
    ]
};
var VividLight = /** @class */ (function (_super) {
    __extends$Y(VividLight, _super);
    function VividLight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VividLight.prototype.getPalette = function () {
        return palette$7;
    };
    return VividLight;
}(ChartTheme));

var __extends$Z = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var palette$8 = {
    fills: [
        '#5BC0EB',
        '#FDE74C',
        '#9BC53D',
        '#E55934',
        '#FA7921',
        '#fa3081'
    ],
    strokes: [
        '#4086a4',
        '#b1a235',
        '#6c8a2b',
        '#a03e24',
        '#af5517',
        '#af225a'
    ]
};
var VividDark = /** @class */ (function (_super) {
    __extends$Z(VividDark, _super);
    function VividDark() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VividDark.prototype.getPalette = function () {
        return palette$8;
    };
    return VividDark;
}(DarkTheme));

var __assign$5 = (undefined && undefined.__assign) || function () {
    __assign$5 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$5.apply(this, arguments);
};
var lightTheme = new ChartTheme();
var darkTheme = new DarkTheme();
var lightThemes = {
    'undefined': lightTheme,
    'null': lightTheme,
    'ag-default': lightTheme,
    'ag-material': new MaterialLight(),
    'ag-pastel': new PastelLight(),
    'ag-solar': new SolarLight(),
    'ag-vivid': new VividLight(),
};
var darkThemes = {
    'undefined': darkTheme,
    'null': darkTheme,
    'ag-default-dark': darkTheme,
    'ag-material-dark': new MaterialDark(),
    'ag-pastel-dark': new PastelDark(),
    'ag-solar-dark': new SolarDark(),
    'ag-vivid-dark': new VividDark(),
};
var themes = __assign$5(__assign$5({}, darkThemes), lightThemes);
function getChartTheme(value) {
    if (value instanceof ChartTheme) {
        return value;
    }
    var stockTheme = themes[value];
    if (stockTheme) {
        return stockTheme;
    }
    value = value;
    if (value.baseTheme || value.overrides || value.palette) {
        var baseTheme = getChartTheme(value.baseTheme);
        return new baseTheme.constructor(value);
    }
    return lightTheme;
}

var __extends$_ = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read$i = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var identity$3 = function (x) { return x; };
var LogScale = /** @class */ (function (_super) {
    __extends$_(LogScale, _super);
    function LogScale() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'log';
        _this._domain = [1, 10];
        _this.baseLog = identity$3; // takes a log with base `base` of `x`
        _this.basePow = identity$3; // raises `base` to the power of `x`
        _this._base = 10;
        return _this;
    }
    LogScale.prototype.setDomain = function (values) {
        var df = values[0];
        var dl = values[values.length - 1];
        if (df === 0 || dl === 0 || df < 0 && dl > 0 || df > 0 && dl < 0) {
            console.warn('Log scale domain should not start at, end at or cross zero.');
            if (df === 0 && dl > 0) {
                df = Number.EPSILON;
            }
            else if (dl === 0 && df < 0) {
                dl = -Number.EPSILON;
            }
            else if (df < 0 && dl > 0) {
                if (Math.abs(dl) >= Math.abs(df)) {
                    df = Number.EPSILON;
                }
                else {
                    dl = -Number.EPSILON;
                }
            }
            else if (df > 0 && dl < 0) {
                if (Math.abs(dl) >= Math.abs(df)) {
                    df = -Number.EPSILON;
                }
                else {
                    dl = Number.EPSILON;
                }
            }
            values = values.slice();
            values[0] = df;
            values[values.length - 1] = dl;
        }
        _super.prototype.setDomain.call(this, values);
    };
    LogScale.prototype.getDomain = function () {
        return _super.prototype.getDomain.call(this);
    };
    Object.defineProperty(LogScale.prototype, "base", {
        get: function () {
            return this._base;
        },
        set: function (value) {
            if (this._base !== value) {
                this._base = value;
                this.rescale();
            }
        },
        enumerable: true,
        configurable: true
    });
    LogScale.prototype.rescale = function () {
        var base = this.base;
        var baseLog = LogScale.makeLogFn(base);
        var basePow = LogScale.makePowFn(base);
        if (this.domain[0] < 0) {
            baseLog = this.reflect(baseLog);
            basePow = this.reflect(basePow);
            this.transform = function (x) { return -Math.log(-x); };
            this.untransform = function (x) { return -Math.exp(-x); };
        }
        else {
            this.transform = function (x) { return Math.log(x); };
            this.untransform = function (x) { return Math.exp(x); };
        }
        this.baseLog = baseLog;
        this.basePow = basePow;
        _super.prototype.rescale.call(this);
    };
    /**
     * For example, if `f` is `Math.log10`, we have
     *
     *     f(100) == 2
     *     f(-100) == NaN
     *     rf = reflect(f)
     *     rf(-100) == -2
     *
     * @param f
     */
    LogScale.prototype.reflect = function (f) {
        return function (x) { return -f(-x); };
    };
    LogScale.prototype.nice = function () {
        var _a, _b;
        var domain = this.domain;
        var i0 = 0;
        var i1 = domain.length - 1;
        var x0 = domain[i0];
        var x1 = domain[i1];
        if (x1 < x0) {
            _a = __read$i([i1, i0], 2), i0 = _a[0], i1 = _a[1];
            _b = __read$i([x1, x0], 2), x0 = _b[0], x1 = _b[1];
        }
        // For example, for base == 10:
        // [ 50, 900] becomes [ 10, 1000 ]
        domain[i0] = this.basePow(Math.floor(this.baseLog(x0)));
        domain[i1] = this.basePow(Math.ceil(this.baseLog(x1)));
        this.domain = domain;
    };
    LogScale.pow10 = function (x) {
        return isFinite(x)
            ? +('1e' + x) // to avoid precision issues, e.g. Math.pow(10, -4) is not 0.0001
            : x < 0
                ? 0
                : x;
    };
    LogScale.makePowFn = function (base) {
        if (base === 10) {
            return LogScale.pow10;
        }
        if (base === Math.E) {
            return Math.exp;
        }
        return function (x) { return Math.pow(base, x); };
    };
    // Make a log function witn an arbitrary base or return a native function if exists.
    LogScale.makeLogFn = function (base) {
        if (base === Math.E) {
            return Math.log;
        }
        if (base === 10) {
            return Math.log10;
        }
        if (base === 2) {
            return Math.log2;
        }
        var logBase = Math.log(base);
        return function (x) { return Math.log(x) / logBase; };
    };
    LogScale.prototype.ticks = function (count) {
        var _a;
        if (count === void 0) { count = 10; }
        var n = count == null ? 10 : +count;
        var base = this.base;
        var domain = this.domain;
        var d0 = domain[0];
        var d1 = domain[domain.length - 1];
        var isReversed = d1 < d0;
        if (isReversed) {
            _a = __read$i([d1, d0], 2), d0 = _a[0], d1 = _a[1];
        }
        var p0 = this.baseLog(d0);
        var p1 = this.baseLog(d1);
        var z = [];
        // if `base` is an integer and delta in order of magnitudes is less than n
        if (!(base % 1) && p1 - p0 < n) {
            // For example, if n == 10, base == 10 and domain == [10^2, 10^6]
            // then p1 - p0 < n == true.
            p0 = Math.round(p0) - 1;
            p1 = Math.round(p1) + 1;
            if (d0 > 0) {
                for (; p0 < p1; ++p0) {
                    for (var k = 1, p = this.basePow(p0); k < base; ++k) {
                        var t = p * k;
                        // The `t` checks are needed because we expanded the [p0, p1] by 1 in each direction.
                        if (t < d0)
                            continue;
                        if (t > d1)
                            break;
                        z.push(t);
                    }
                }
            }
            else {
                for (; p0 < p1; ++p0) {
                    for (var k = base - 1, p = this.basePow(p0); k >= 1; --k) {
                        var t = p * k;
                        if (t < d0)
                            continue;
                        if (t > d1)
                            break;
                        z.push(t);
                    }
                }
            }
            if (z.length * 2 < n) {
                z = ticks(d0, d1, n);
            }
        }
        else {
            // For example, if n == 4, base == 10 and domain == [10^2, 10^6]
            // then p1 - p0 < n == false.
            // `ticks` return [2, 3, 4, 5, 6], then mapped to [10^2, 10^3, 10^4, 10^5, 10^6].
            z = ticks(p0, p1, Math.min(p1 - p0, n)).map(this.basePow);
        }
        return isReversed ? z.reverse() : z;
    };
    LogScale.prototype.tickFormat = function (count, specifier) {
        var _this = this;
        var base = this.base;
        if (specifier == null) {
            specifier = (base === 10 ? '.0e' : ',');
        }
        if (typeof specifier !== 'function') {
            specifier = format(specifier);
        }
        if (count === Infinity) {
            return specifier;
        }
        if (count == null) {
            count = 10;
        }
        var k = Math.max(1, base * count / this.ticks().length);
        return function (d) {
            var i = d / _this.basePow(Math.round(_this.baseLog(d)));
            if (i * base < base - 0.5) {
                i *= base;
            }
            return i <= k ? specifier(d) : '';
        };
    };
    return LogScale;
}(ContinuousScale));

var __extends$$ = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LogAxis = /** @class */ (function (_super) {
    __extends$$(LogAxis, _super);
    function LogAxis() {
        var _this = _super.call(this) || this;
        _this.scale = new LogScale();
        _this.scale.clamper = clamper$1;
        return _this;
    }
    Object.defineProperty(LogAxis.prototype, "base", {
        get: function () {
            return this.scale.base;
        },
        set: function (value) {
            this.scale.base = value;
        },
        enumerable: true,
        configurable: true
    });
    LogAxis.className = 'LogAxis';
    LogAxis.type = 'log';
    return LogAxis;
}(NumberAxis));

var __assign$6 = (undefined && undefined.__assign) || function () {
    __assign$6 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$6.apply(this, arguments);
};
var __read$j = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$7 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$j(arguments[i]));
    return ar;
};
var __values$6 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
/**
 * Performs a JSON-diff between a source and target JSON structure.
 *
 * On a per property basis, takes the target property value where:
 * - types are different.
 * - type is primitive.
 * - type is array and length or content have changed.
 *
 * Recurses for object types.
 *
 * @param source starting point for diff
 * @param target target for diff vs. source
 * @param opts.stringify properties to stringify for comparison purposes
 *
 * @returns `null` if no differences, or an object with the subset of properties that have changed.
 */
function jsonDiff(source, target, opts) {
    var e_1, _a;
    var _b = (opts || {}).stringify, stringify = _b === void 0 ? [] : _b;
    var sourceType = classify(source);
    var targetType = classify(target);
    if (targetType === 'array') {
        if (sourceType !== 'array' || source.length !== target.length) {
            return __spread$7(target);
        }
        if (target.some(function (targetElement, i) { var _a; return jsonDiff((_a = source) === null || _a === void 0 ? void 0 : _a[i], targetElement) != null; })) {
            return __spread$7(target);
        }
        return null;
    }
    var lhs = source || {};
    var rhs = target || {};
    var allProps = new Set(__spread$7(Object.keys(lhs), Object.keys(rhs)));
    var propsChangedCount = 0;
    var result = {};
    var _loop_1 = function (prop) {
        // Cheap-and-easy equality check.
        if (lhs[prop] === rhs[prop]) {
            return "continue";
        }
        var take = function (v) {
            result[prop] = v;
            propsChangedCount++;
        };
        if (stringify.includes(prop)) {
            if (JSON.stringify(lhs[prop] !== JSON.stringify(rhs[prop]))) {
                take(rhs[prop]);
            }
            return "continue";
        }
        var lhsType = classify(lhs[prop]);
        var rhsType = classify(rhs[prop]);
        if (lhsType !== rhsType) {
            // Types changed, just take RHS.
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'primitive' || rhsType === null) {
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'array' && lhs[prop].length !== rhs[prop].length) {
            // Arrays are different sizes, so just take target array.
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'class-instance') {
            // Don't try to do anything tricky with array diffs!
            take(rhs[prop]);
            return "continue";
        }
        if (rhsType === 'function' && lhs[prop] !== rhs[prop]) {
            take(rhs[prop]);
            return "continue";
        }
        var diff = jsonDiff(lhs[prop], rhs[prop], { stringify: stringify });
        if (diff !== null) {
            take(diff);
        }
    };
    try {
        for (var allProps_1 = __values$6(allProps), allProps_1_1 = allProps_1.next(); !allProps_1_1.done; allProps_1_1 = allProps_1.next()) {
            var prop = allProps_1_1.value;
            _loop_1(prop);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allProps_1_1 && !allProps_1_1.done && (_a = allProps_1.return)) _a.call(allProps_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return propsChangedCount === 0 ? null : result;
}
/**
 * Special value used by `jsonMerge` to signal that a property should be removed from the merged
 * output.
 */
var DELETE = Symbol('<delete-property>');
var NOT_SPECIFIED = Symbol('<unspecified-property>');
/**
 * Merge together the provide JSON object structures, with the precedence of application running
 * from higher indexes to lower indexes.
 *
 * Deep-clones all objects to avoid mutation of the inputs changing the output object. For arrays,
 * just performs a deep-clone of the entire array, no merging of elements attempted.
 *
 * @param json all json objects to merge
 *
 * @returns the combination of all of the json inputs
 */
function jsonMerge() {
    var e_2, _a;
    var json = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        json[_i] = arguments[_i];
    }
    var jsonTypes = json.map(function (v) { return classify(v); });
    if (jsonTypes.some(function (v) { return v === 'array'; })) {
        // Clone final array.
        var finalValue = json[json.length - 1];
        if (finalValue instanceof Array) {
            return finalValue.map(function (v) {
                var type = classify(v);
                return type === 'array' ? jsonMerge([], v) :
                    type === 'object' ? jsonMerge({}, v) :
                        v;
            });
        }
        return finalValue;
    }
    var result = {};
    var props = new Set(json.map(function (v) { return v != null ? Object.keys(v) : []; })
        .reduce(function (r, n) { return r.concat(n); }, []));
    var _loop_2 = function (nextProp) {
        var values = json.map(function (j) { return j != null && nextProp in j ? j[nextProp] : NOT_SPECIFIED; })
            .filter(function (v) { return v !== NOT_SPECIFIED; });
        if (values.length === 0) {
            return "continue";
        }
        var lastValue = values[values.length - 1];
        if (lastValue === DELETE) {
            return "continue";
        }
        var types = values.map(function (v) { return classify(v); });
        var type = types[0];
        if (types.some(function (t) { return t !== type && t !== null; })) {
            // Short-circuit if mismatching types.
            result[nextProp] = lastValue;
            return "continue";
        }
        if (type === 'array' || type === 'object') {
            result[nextProp] = jsonMerge.apply(void 0, __spread$7(values));
        }
        else {
            // Just directly assign/overwrite.
            result[nextProp] = lastValue;
        }
    };
    try {
        for (var props_1 = __values$6(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
            var nextProp = props_1_1.value;
            _loop_2(nextProp);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
/**
 * Recursively apply a JSON object into a class-hierarchy, optionally instantiating certain classes
 * by property name.
 *
 * @param target to apply source JSON properties into
 * @param source to be applied
 * @param params.path path for logging/error purposes, to aid with pinpointing problems
 * @param params.matcherPath path for pattern matching, to lookup allowedTypes override.
 * @param params.skip property names to skip from the source
 * @param params.constructors dictionary of property name to class constructors for properties that
 *                            require object construction
 * @param params.allowedTypes overrides by path for allowed property types
 */
function jsonApply(target, source, params) {
    if (params === void 0) { params = {}; }
    var _a, _b, _c;
    var _d = params.path, path = _d === void 0 ? undefined : _d, _e = params.matcherPath, matcherPath = _e === void 0 ? path ? path.replace(/(\[[0-9+]{1,}\])/i, '[]') : undefined : _e, _f = params.skip, skip = _f === void 0 ? [] : _f, _g = params.constructors, constructors = _g === void 0 ? {} : _g, _h = params.allowedTypes, allowedTypes = _h === void 0 ? {} : _h;
    if (target == null) {
        throw new Error("AG Charts - target is uninitialised: " + (path || '<root>'));
    }
    if (source == null) {
        return target;
    }
    var targetType = classify(target);
    for (var property in source) {
        if (skip.indexOf(property) >= 0) {
            continue;
        }
        var newValue = source[property];
        var propertyPath = "" + (path ? path + '.' : '') + property;
        var propertyMatcherPath = "" + (matcherPath ? matcherPath + '.' : '') + property;
        var targetAny = target;
        var targetClass = targetAny.constructor;
        var currentValue = targetAny[property];
        var ctr = constructors[property];
        try {
            var currentValueType = classify(currentValue);
            var newValueType = classify(newValue);
            if (targetType === 'class-instance' && !(property in target || targetAny.hasOwnProperty(property))) {
                console.warn("AG Charts - unable to set [" + propertyPath + "] in " + ((_a = targetClass) === null || _a === void 0 ? void 0 : _a.name) + " - property is unknown");
                continue;
            }
            var allowableTypes = allowedTypes[propertyMatcherPath] || [currentValueType];
            if (currentValueType === 'class-instance' && newValueType === 'object') {
                // Allowed, this is the common case! - do not error.
            }
            else if (currentValueType != null && newValueType != null && !allowableTypes.includes(newValueType)) {
                console.warn("AG Charts - unable to set [" + propertyPath + "] in " + ((_b = targetClass) === null || _b === void 0 ? void 0 : _b.name) + " - can't apply type of [" + newValueType + "], allowed types are: [" + allowableTypes + "]");
                continue;
            }
            if (newValueType === 'array') {
                targetAny[property] = newValue;
            }
            else if (newValueType === 'class-instance') {
                targetAny[property] = newValue;
            }
            else if (newValueType === 'object') {
                if (currentValue != null) {
                    jsonApply(currentValue, newValue, __assign$6(__assign$6({}, params), { path: propertyPath, matcherPath: propertyMatcherPath }));
                }
                else if (ctr != null) {
                    targetAny[property] = jsonApply(new ctr(), newValue, __assign$6(__assign$6({}, params), { path: propertyPath, matcherPath: propertyMatcherPath }));
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else {
                targetAny[property] = newValue;
            }
        }
        catch (error) {
            console.warn("AG Charts - unable to set [" + propertyPath + "] in [" + ((_c = targetClass) === null || _c === void 0 ? void 0 : _c.name) + "]; nested error is: " + error.message);
            continue;
        }
    }
    return target;
}
/**
 * Walk the given JSON object graphs, invoking the visit() callback for every object encountered.
 * Arrays are descended into without a callback, however their elements will have the visit()
 * callback invoked if they are objects.
 *
 * @param json to traverse
 * @param visit callback for each non-primitive and non-array object found
 * @param opts.skip property names to skip when walking
 * @param jsons to traverse in parallel
 */
function jsonWalk(json, visit, opts) {
    var jsons = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        jsons[_i - 3] = arguments[_i];
    }
    var _a;
    var jsonType = classify(json);
    var skip = opts.skip || [];
    if (jsonType === 'array') {
        json.forEach(function (element, index) {
            var _a;
            jsonWalk.apply(void 0, __spread$7([element, visit, opts], (_a = jsons) === null || _a === void 0 ? void 0 : _a.map(function (o) { var _a; return (_a = o) === null || _a === void 0 ? void 0 : _a[index]; })));
        });
        return;
    }
    else if (jsonType !== 'object') {
        return;
    }
    visit.apply(void 0, __spread$7([jsonType, json], jsons));
    var _loop_3 = function (property) {
        if (skip.indexOf(property) >= 0) {
            return "continue";
        }
        var value = json[property];
        var otherValues = (_a = jsons) === null || _a === void 0 ? void 0 : _a.map(function (o) { var _a; return (_a = o) === null || _a === void 0 ? void 0 : _a[property]; });
        var valueType = classify(value);
        if (valueType === 'object' || valueType === 'array') {
            jsonWalk.apply(void 0, __spread$7([value, visit, opts], otherValues));
        }
    };
    for (var property in json) {
        _loop_3(property);
    }
}
/**
 * Classify the type of a value to assist with handling for merge purposes.
 */
function classify(value) {
    if (value == null) {
        return null;
    }
    else if (value instanceof HTMLElement) {
        return 'primitive';
    }
    else if (value instanceof Array) {
        return 'array';
    }
    else if (value instanceof Date) {
        return 'primitive';
    }
    else if (typeof value === 'object' && value.constructor === Object) {
        return 'object';
    }
    else if (typeof value === 'function') {
        return 'function';
    }
    else if (typeof value === 'object' && value.constructor != null) {
        return 'class-instance';
    }
    return 'primitive';
}

var DEFAULT_CARTESIAN_CHART_OVERRIDES = {
    type: 'cartesian',
    axes: [{
            type: NumberAxis.type,
            position: exports.ChartAxisPosition.Left,
        }, {
            type: CategoryAxis.type,
            position: exports.ChartAxisPosition.Bottom,
        }],
};
var DEFAULT_BAR_CHART_OVERRIDES = {
    axes: [{
            type: 'number',
            position: exports.ChartAxisPosition.Bottom,
        }, {
            type: 'category',
            position: exports.ChartAxisPosition.Left,
        }],
};
var DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES = {
    axes: [{
            type: 'number',
            position: exports.ChartAxisPosition.Bottom,
        }, {
            type: 'number',
            position: exports.ChartAxisPosition.Left,
        }],
};

var __assign$7 = (undefined && undefined.__assign) || function () {
    __assign$7 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$7.apply(this, arguments);
};
function transform(input, transforms) {
    var result = {};
    for (var p in input) {
        var t = transforms[p] || (function (x) { return x; });
        result[p] = t(input[p], input);
    }
    return result;
}
function is2dArray$1(input) {
    return input != null && input instanceof Array && input[0] instanceof Array;
}
function yNamesMapping(p, src) {
    if (p == null) {
        return {};
    }
    if (!(p instanceof Array)) {
        return p;
    }
    var yKeys = src.yKeys;
    if (yKeys == null || is2dArray$1(yKeys)) {
        throw new Error('AG Charts - yNames and yKeys mismatching configuration.');
    }
    var result = {};
    yKeys.forEach(function (k, i) {
        result[k] = p[i];
    });
    return result;
}
function yKeysMapping(p, src) {
    if (p == null) {
        return [[]];
    }
    if (is2dArray$1(p)) {
        return p;
    }
    return src.grouped ? p.map(function (v) { return [v]; }) : [p];
}
function labelMapping(p) {
    if (p == null) {
        return undefined;
    }
    var placement = p.placement;
    return __assign$7(__assign$7({}, p), { placement: placement === 'inside' ? exports.BarLabelPlacement.Inside :
            placement === 'outside' ? exports.BarLabelPlacement.Outside :
                undefined });
}
function barSeriesTransform(options) {
    var result = __assign$7(__assign$7({}, options), { yKeys: options.yKeys || [options.yKey] });
    delete result['yKey'];
    return transform(result, {
        yNames: yNamesMapping,
        yKeys: yKeysMapping,
        label: labelMapping,
    });
}
function identityTransform(input) { return input; }
var SERIES_TRANSFORMS = {
    area: identityTransform,
    bar: barSeriesTransform,
    column: barSeriesTransform,
    histogram: identityTransform,
    line: identityTransform,
    pie: identityTransform,
    scatter: identityTransform,
    treemap: identityTransform,
};
function applySeriesTransform(options) {
    var type = options.type;
    var transform = SERIES_TRANSFORMS[type || 'line'];
    return transform(options);
}

var __assign$8 = (undefined && undefined.__assign) || function () {
    __assign$8 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$8.apply(this, arguments);
};
var __values$7 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$k = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$8 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$k(arguments[i]));
    return ar;
};
/**
 * Groups the series options objects if they are of type `column` or `bar` and places them in an array at the index where the first instance of this series type was found.
 * Returns an array of arrays containing the ordered and grouped series options objects.
 */
function groupSeriesByType(seriesOptions) {
    var e_1, _a;
    var indexMap = {};
    var result = [];
    try {
        for (var seriesOptions_1 = __values$7(seriesOptions), seriesOptions_1_1 = seriesOptions_1.next(); !seriesOptions_1_1.done; seriesOptions_1_1 = seriesOptions_1.next()) {
            var s = seriesOptions_1_1.value;
            if (s.type !== 'column' && s.type !== 'bar' && (s.type !== 'area' || s.stacked !== true)) {
                // No need to use index for these cases.
                result.push([s]);
                continue;
            }
            var seriesType = s.type || 'line';
            var groupingKey = s.stacked ? 'stacked' :
                s.grouped ? 'grouped' :
                    s.yKeys ? 'stacked' :
                        'grouped';
            var indexKey = seriesType + "-" + s.xKey + "-" + groupingKey;
            if (indexMap[indexKey] == null) {
                // Add indexed array to result on first addition.
                indexMap[indexKey] = [];
                result.push(indexMap[indexKey]);
            }
            indexMap[indexKey].push(s);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (seriesOptions_1_1 && !seriesOptions_1_1.done && (_a = seriesOptions_1.return)) _a.call(seriesOptions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
/**
 * Takes an array of bar or area series options objects and returns a single object with the combined area series options.
 */
function reduceSeries(series, enableBarSeriesSpecialCases) {
    var e_2, _a;
    var options = {};
    var arrayValueProperties = ['yKeys', 'fills', 'strokes', 'yNames', 'hideInChart', 'hideInLegend'];
    var stringValueProperties = ['yKey', 'fill', 'stroke', 'yName'];
    try {
        for (var series_1 = __values$7(series), series_1_1 = series_1.next(); !series_1_1.done; series_1_1 = series_1.next()) {
            var s = series_1_1.value;
            for (var property in s) {
                var arrayValueProperty = arrayValueProperties.indexOf(property) > -1;
                var stringValueProperty = stringValueProperties.indexOf(property) > -1;
                if (arrayValueProperty && s[property].length > 0) {
                    options[property] = __spread$8((options[property] || []), s[property]);
                }
                else if (stringValueProperty) {
                    options[property + "s"] = __spread$8((options[property + "s"] || []), [s[property]]);
                }
                else if (enableBarSeriesSpecialCases && property === 'showInLegend') {
                    if (s[property] === false) {
                        options.hideInLegend = __spread$8((options.hideInLegend || []), (s.yKey ? [s.yKey] : s.yKeys));
                    }
                }
                else if (enableBarSeriesSpecialCases && property === 'grouped') {
                    if (s[property] === true) {
                        options[property] = s[property];
                    }
                }
                else {
                    options[property] = s[property];
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (series_1_1 && !series_1_1.done && (_a = series_1.return)) _a.call(series_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return options;
}
/**
 * Transforms provided series options array into an array containing series options which are compatible with standalone charts series options.
 */
function processSeriesOptions(seriesOptions) {
    var e_3, _a;
    var result = [];
    var preprocessed = seriesOptions.map(function (series) {
        // Change the default for bar/columns when yKey is used to be grouped rather than stacked.
        if ((series.type === 'bar' || series.type === 'column') && series.yKey != null && !series.stacked) {
            return __assign$8(__assign$8({}, series), { grouped: series.grouped != null ? series.grouped : true });
        }
        return series;
    });
    try {
        for (var _b = __values$7(groupSeriesByType(preprocessed)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var series = _c.value;
            switch (series[0].type) {
                case 'column':
                case 'bar':
                    result.push(reduceSeries(series, true));
                    break;
                case 'area':
                    result.push(reduceSeries(series, false));
                    break;
                case 'line':
                default:
                    if (series.length > 1) {
                        console.warn('AG Charts - unexpected grouping of series type: ' + series[0].type);
                    }
                    result.push(series[0]);
                    break;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}

var __assign$9 = (undefined && undefined.__assign) || function () {
    __assign$9 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$9.apply(this, arguments);
};
var __values$8 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$l = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$9 = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$l(arguments[i]));
    return ar;
};
function optionsType(input) {
    var _a, _b;
    return input.type || ((_b = (_a = input.series) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) || 'cartesian';
}
function isAgCartesianChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return true;
    }
    switch (specifiedType) {
        case 'cartesian':
        case 'area':
        case 'bar':
        case 'column':
        case 'groupedCategory':
        case 'histogram':
        case 'line':
        case 'scatter':
            return true;
        default:
            return false;
    }
}
function isAgHierarchyChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'hierarchy':
        case 'treemap':
            return true;
        default:
            return false;
    }
}
function isAgPolarChartOptions(input) {
    var specifiedType = optionsType(input);
    if (specifiedType == null) {
        return false;
    }
    switch (input.type) {
        case 'polar':
        case 'pie':
            return true;
        default:
            return false;
    }
}
function isSeriesOptionType(input) {
    if (input == null) {
        return false;
    }
    return ['line', 'bar', 'column', 'histogram', 'scatter', 'area', 'pie', 'treemap'].indexOf(input) >= 0;
}
function countArrayElements(input) {
    var e_1, _a;
    var count = 0;
    try {
        for (var input_1 = __values$8(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
            var next = input_1_1.value;
            if (next instanceof Array) {
                count += countArrayElements(next);
            }
            if (next != null) {
                count++;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return count;
}
function takeColours(context, colours, maxCount) {
    var result = [];
    for (var count = 0; count < maxCount; count++) {
        result.push(colours[(count + context.colourIndex) % colours.length]);
    }
    return result;
}
function prepareOptions(newOptions, fallbackOptions) {
    var options = fallbackOptions == null ? newOptions : jsonMerge(fallbackOptions, newOptions);
    sanityCheckOptions(options);
    // Determine type and ensure it's explicit in the options config.
    var userSuppliedOptionsType = options.type;
    var type = optionsType(options);
    options = __assign$9(__assign$9({}, options), { type: type });
    var defaultSeriesType = isAgCartesianChartOptions(options) ? 'line' :
        isAgHierarchyChartOptions(options) ? 'treemap' :
            isAgPolarChartOptions(options) ? 'pie' :
                'line';
    var defaultOverrides = type === 'bar' ? DEFAULT_BAR_CHART_OVERRIDES :
        type === 'scatter' ? DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES :
            type === 'histogram' ? DEFAULT_SCATTER_HISTOGRAM_CHART_OVERRIDES :
                isAgCartesianChartOptions(options) ? DEFAULT_CARTESIAN_CHART_OVERRIDES :
                    {};
    var _a = prepareMainOptions(defaultOverrides, options), context = _a.context, mergedOptions = _a.mergedOptions, axesThemes = _a.axesThemes, seriesThemes = _a.seriesThemes;
    // Special cases where we have arrays of elements which need their own defaults.
    mergedOptions.series = processSeriesOptions(mergedOptions.series || [])
        .map(function (s) {
        var type = s.type ? s.type :
            isSeriesOptionType(userSuppliedOptionsType) ? userSuppliedOptionsType :
                defaultSeriesType;
        var series = __assign$9(__assign$9({}, s), { type: type });
        return prepareSeries(context, series, seriesThemes[type] || {});
    });
    if (isAgCartesianChartOptions(mergedOptions)) {
        (mergedOptions.axes || []).forEach(function (a, i) {
            var type = a.type || 'number';
            var axis = __assign$9(__assign$9({}, a), { type: type });
            var axesTheme = jsonMerge(axesThemes[type], axesThemes[type][a.position || 'unknown'] || {});
            mergedOptions.axes[i] = prepareAxis(axis, axesTheme);
        });
    }
    prepareEnabledOptions(options, mergedOptions);
    return mergedOptions;
}
function sanityCheckOptions(options) {
    var _a, _b;
    if ((_a = options.series) === null || _a === void 0 ? void 0 : _a.some(function (s) { return s.yKeys != null && s.yKey != null; })) {
        console.warn('AG Charts - series options yKeys and yKey are mutually exclusive, please only use yKey for future compatibility.');
    }
    if ((_b = options.series) === null || _b === void 0 ? void 0 : _b.some(function (s) { return s.yNames != null && s.yName != null; })) {
        console.warn('AG Charts - series options yNames and yName are mutually exclusive, please only use yName for future compatibility.');
    }
}
function prepareMainOptions(defaultOverrides, options) {
    var _a = prepareTheme(options), theme = _a.theme, cleanedTheme = _a.cleanedTheme, axesThemes = _a.axesThemes, seriesThemes = _a.seriesThemes;
    var context = { colourIndex: 0, palette: theme.palette };
    var mergedOptions = jsonMerge(defaultOverrides, cleanedTheme, options);
    return { context: context, mergedOptions: mergedOptions, axesThemes: axesThemes, seriesThemes: seriesThemes };
}
function prepareTheme(options) {
    var theme = getChartTheme(options.theme);
    var themeConfig = theme.getConfig(optionsType(options) || 'cartesian');
    return {
        theme: theme,
        axesThemes: themeConfig['axes'] || {},
        seriesThemes: themeConfig['series'] || {},
        cleanedTheme: jsonMerge(themeConfig, { axes: DELETE, series: DELETE }),
    };
}
function prepareSeries(context, input) {
    var defaults = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        defaults[_i - 2] = arguments[_i];
    }
    var paletteOptions = calculateSeriesPalette(context, input);
    // Part of the options interface, but not directly consumed by the series implementations.
    var removeOptions = { stacked: DELETE };
    var mergedResult = jsonMerge.apply(void 0, __spread$9(defaults, [paletteOptions, input, removeOptions]));
    return applySeriesTransform(mergedResult);
}
function calculateSeriesPalette(context, input) {
    var paletteOptions = {};
    var _a = context.palette, fills = _a.fills, strokes = _a.strokes;
    var inputAny = input;
    var colourCount = countArrayElements(inputAny['yKeys'] || []) || 1; // Defaults to 1 if no yKeys.
    switch (input.type) {
        case 'pie':
            colourCount = Math.max(fills.length, strokes.length);
        case 'area':
        case 'bar':
        case 'column':
            paletteOptions.fills = takeColours(context, fills, colourCount);
            paletteOptions.strokes = takeColours(context, strokes, colourCount);
            break;
        case 'histogram':
            paletteOptions.fill = takeColours(context, fills, 1)[0];
            paletteOptions.stroke = takeColours(context, strokes, 1)[0];
            break;
        case 'scatter':
            paletteOptions.fill = takeColours(context, fills, 1)[0];
        case 'line':
            paletteOptions.stroke = takeColours(context, fills, 1)[0];
            paletteOptions.marker = {
                stroke: takeColours(context, strokes, 1)[0],
                fill: takeColours(context, fills, 1)[0],
            };
            break;
        case 'treemap':
            break;
        default:
            throw new Error('AG Charts - unknown series type: ' + input.type);
    }
    context.colourIndex += colourCount;
    return paletteOptions;
}
function prepareAxis(input) {
    var defaults = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        defaults[_i - 1] = arguments[_i];
    }
    // Remove redundant theme overload keys.
    var removeOptions = { top: DELETE, bottom: DELETE, left: DELETE, right: DELETE };
    return jsonMerge.apply(void 0, __spread$9(defaults, [input, removeOptions]));
}
function prepareEnabledOptions(options, mergedOptions) {
    // Set `enabled: true` for all option objects where the user has provided values.
    jsonWalk(options, function (_, userOpts, mergedOpts) {
        if (!mergedOpts) {
            return;
        }
        if ('enabled' in mergedOpts && userOpts.enabled == null) {
            mergedOpts.enabled = true;
        }
    }, { skip: ['data'] }, mergedOptions);
}

var __assign$a = (undefined && undefined.__assign) || function () {
    __assign$a = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$a.apply(this, arguments);
};
var __read$m = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread$a = (undefined && undefined.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read$m(arguments[i]));
    return ar;
};
var __values$9 = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function chartType(options) {
    if (isAgCartesianChartOptions(options)) {
        return 'cartesian';
    }
    else if (isAgPolarChartOptions(options)) {
        return 'polar';
    }
    else if (isAgHierarchyChartOptions(options)) {
        return 'hierarchy';
    }
    throw new Error('AG Chart - unknown type of chart for options with type: ' + options.type);
}
// Backwards-compatibility layer.
var AgChart = /** @class */ (function () {
    function AgChart() {
    }
    /** @deprecated use AgChart.create() or AgChart.update() instead. */
    AgChart.createComponent = function (options, type) {
        // console.warn('AG Charts - createComponent should no longer be used, use AgChart.update() instead.')
        if (type.indexOf('.series') >= 0) {
            var optionsWithType = __assign$a(__assign$a({}, options), { type: options.type || type.split('.')[0] });
            return createSeries([optionsWithType])[0];
        }
        return null;
    };
    AgChart.create = function (options, container, data) {
        return AgChartV2.create(options);
    };
    AgChart.update = function (chart, options, container, data) {
        return AgChartV2.update(chart, options);
    };
    return AgChart;
}());
var AgChartV2 = /** @class */ (function () {
    function AgChartV2() {
    }
    AgChartV2.create = function (userOptions) {
        debug('user options', userOptions);
        var mergedOptions = prepareOptions(userOptions);
        var chart = isAgCartesianChartOptions(mergedOptions) ? (mergedOptions.type === 'groupedCategory' ? new GroupedCategoryChart(document) : new CartesianChart(document)) :
            isAgHierarchyChartOptions(mergedOptions) ? new HierarchyChart(document) :
                isAgPolarChartOptions(mergedOptions) ? new PolarChart(document) :
                    undefined;
        if (!chart) {
            throw new Error("AG Charts - couldn't apply configuration, check type of options: " + mergedOptions['type']);
        }
        AgChartV2.updateDelta(chart, mergedOptions, userOptions);
        return chart;
    };
    AgChartV2.update = function (chart, userOptions) {
        debug('user options', userOptions);
        var mergedOptions = prepareOptions(userOptions, chart.userOptions);
        if (chartType(mergedOptions) !== chartType(chart.options)) {
            chart.destroy();
            console.warn('AG Charts - options supplied require a different type of chart, please recreate the chart.');
            return;
        }
        var deltaOptions = jsonDiff(chart.options, mergedOptions, { stringify: ['data'] });
        if (deltaOptions == null) {
            return;
        }
        AgChartV2.updateDelta(chart, deltaOptions, userOptions);
    };
    AgChartV2.updateDelta = function (chart, update, userOptions) {
        if (update.type == null) {
            update = __assign$a(__assign$a({}, update), { type: chart.options.type || optionsType(update) });
        }
        debug('delta update', update);
        applyChartOptions(chart, update, userOptions);
    };
    AgChartV2.DEBUG = false;
    return AgChartV2;
}());
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (AgChartV2.DEBUG) {
        console.log.apply(console, __spread$a([message], optionalParams));
    }
}
function applyChartOptions(chart, options, userOptions) {
    if (isAgCartesianChartOptions(options)) {
        applyOptionValues(chart, options, { skip: ['type', 'data', 'series', 'axes', 'autoSize', 'listeners', 'theme'] });
    }
    else if (isAgPolarChartOptions(options)) {
        applyOptionValues(chart, options, { skip: ['type', 'data', 'series', 'autoSize', 'listeners', 'theme'] });
    }
    else if (isAgHierarchyChartOptions(options)) {
        applyOptionValues(chart, options, { skip: ['type', 'data', 'series', 'autoSize', 'listeners', 'theme'] });
    }
    else {
        throw new Error("AG Charts - couldn't apply configuration, check type of options and chart: " + options['type']);
    }
    var performProcessData = false;
    if (options.series && options.series.length > 0) {
        applySeries(chart, options);
    }
    if (isAgCartesianChartOptions(options) && options.axes) {
        performProcessData = applyAxes(chart, options);
    }
    if (options.data) {
        chart.data = options.data;
        performProcessData = true;
    }
    // Needs to be done last to avoid overrides by width/height properties.
    if (options.autoSize != null) {
        chart.autoSize = options.autoSize;
    }
    if (options.listeners) {
        registerListeners(chart, options.listeners);
    }
    chart.layoutPending = true;
    if (performProcessData) {
        chart.processData();
    }
    chart.performLayout();
    chart.options = jsonMerge(chart.options || {}, options);
    chart.userOptions = jsonMerge(chart.userOptions || {}, userOptions);
}
function applySeries(chart, options) {
    var optSeries = options.series;
    if (!optSeries) {
        return;
    }
    var matchingTypes = chart.series.length === optSeries.length &&
        chart.series.every(function (s, i) { var _a; return s.type === ((_a = optSeries[i]) === null || _a === void 0 ? void 0 : _a.type); });
    // Try to optimise series updates if series count and types didn't change.
    if (matchingTypes) {
        chart.series.forEach(function (s, i) {
            var _a, _b;
            var previousOpts = ((_b = (_a = chart.options) === null || _a === void 0 ? void 0 : _a.series) === null || _b === void 0 ? void 0 : _b[i]) || {};
            var seriesDiff = jsonDiff(previousOpts, optSeries[i] || {});
            debug("applying series diff idx " + i, seriesDiff);
            jsonApply(s, seriesDiff);
        });
        return;
    }
    chart.series = createSeries(optSeries);
}
function applyAxes(chart, options) {
    var optAxes = options.axes;
    if (!optAxes) {
        return false;
    }
    var matchingTypes = chart.axes.length === optAxes.length &&
        chart.axes.every(function (a, i) { return a.type === optAxes[i].type; });
    // Try to optimise series updates if series count and types didn't change.
    if (matchingTypes) {
        var oldOpts_1 = chart.options;
        if (isAgCartesianChartOptions(oldOpts_1)) {
            chart.axes.forEach(function (a, i) {
                var _a;
                var previousOpts = ((_a = oldOpts_1.axes) === null || _a === void 0 ? void 0 : _a[i]) || {};
                var axisDiff = jsonDiff(previousOpts, optAxes[i]);
                debug("applying axis diff idx " + i, axisDiff);
                jsonApply(a, axisDiff);
            });
            return true;
        }
    }
    chart.axes = createAxis(optAxes);
    return true;
}
function createSeries(options) {
    var e_1, _a;
    var series = [];
    var skip = ['listeners'];
    var index = 0;
    try {
        for (var _b = __values$9(options || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var seriesOptions = _c.value;
            var path = "series[" + index++ + "]";
            switch (seriesOptions.type) {
                case 'area':
                    series.push(applySeriesValues(new AreaSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'bar':
                case 'column':
                    series.push(applySeriesValues(new BarSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'histogram':
                    series.push(applySeriesValues(new HistogramSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'line':
                    series.push(applySeriesValues(new LineSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'scatter':
                    series.push(applySeriesValues(new ScatterSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'pie':
                    series.push(applySeriesValues(new PieSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                case 'treemap':
                    series.push(applySeriesValues(new TreemapSeries(), seriesOptions, { path: path, skip: skip }));
                    break;
                default:
                    throw new Error('AG Charts - unknown series type: ' + seriesOptions.type);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    series.forEach(function (next, index) {
        var _a, _b;
        var listeners = (_b = (_a = options) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.listeners;
        if (listeners == null) {
            return;
        }
        registerListeners(next, listeners);
    });
    return series;
}
function createAxis(options) {
    var e_2, _a;
    var axes = [];
    var index = 0;
    try {
        for (var _b = __values$9(options || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var axisOptions = _c.value;
            var path = "axis[" + index++ + "]";
            switch (axisOptions.type) {
                case 'number':
                    axes.push(applyAxisValues(new NumberAxis(), axisOptions, { path: path }));
                    break;
                case LogAxis.type:
                    axes.push(applyAxisValues(new LogAxis(), axisOptions, { path: path }));
                    break;
                case CategoryAxis.type:
                    axes.push(applyAxisValues(new CategoryAxis(), axisOptions, { path: path }));
                    break;
                case GroupedCategoryAxis.type:
                    axes.push(applyAxisValues(new GroupedCategoryAxis(), axisOptions, { path: path }));
                    break;
                case TimeAxis.type:
                    axes.push(applyAxisValues(new TimeAxis(), axisOptions, { path: path }));
                    break;
                default:
                    throw new Error('AG Charts - unknown axis type: ' + axisOptions['type']);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return axes;
}
function registerListeners(source, listeners) {
    for (var property in listeners) {
        source.addEventListener(property, listeners[property]);
    }
}
var JSON_APPLY_OPTIONS = {
    constructors: {
        'title': Caption,
        'subtitle': Caption,
        'shadow': DropShadow,
    },
    allowedTypes: {
        'series[].marker.shape': ['primitive', 'function'],
        'axis[].tick.count': ['primitive', 'class-instance'],
    },
};
function applyOptionValues(target, options, _a) {
    var _b = _a === void 0 ? {} : _a, skip = _b.skip, path = _b.path;
    var applyOpts = __assign$a(__assign$a(__assign$a({}, JSON_APPLY_OPTIONS), { skip: __spread$a(['type'], (skip || [])) }), (path ? { path: path } : {}));
    return jsonApply(target, options, applyOpts);
}
function applySeriesValues(target, options, _a) {
    var _b = _a === void 0 ? {} : _a, skip = _b.skip, path = _b.path;
    var _c;
    var ctrs = ((_c = JSON_APPLY_OPTIONS) === null || _c === void 0 ? void 0 : _c.constructors) || {};
    var seriesTypeOverrides = {
        constructors: __assign$a(__assign$a({}, ctrs), { 'title': target.type === 'pie' ? PieTitle : ctrs['title'] }),
    };
    var applyOpts = __assign$a(__assign$a(__assign$a(__assign$a({}, JSON_APPLY_OPTIONS), seriesTypeOverrides), { skip: __spread$a(['type'], (skip || [])) }), (path ? { path: path } : {}));
    return jsonApply(target, options, applyOpts);
}
function applyAxisValues(target, options, _a) {
    var _b = _a === void 0 ? {} : _a, skip = _b.skip, path = _b.path;
    var applyOpts = __assign$a(__assign$a(__assign$a({}, JSON_APPLY_OPTIONS), { skip: __spread$a(['type'], (skip || [])) }), (path ? { path: path } : {}));
    return jsonApply(target, options, applyOpts);
}

var time = {
    millisecond: millisecond,
    second: second,
    minute: minute,
    hour: hour,
    day: day,
    sunday: sunday, monday: monday, tuesday: tuesday, wednesday: wednesday, thursday: thursday, friday: friday, saturday: saturday,
    month: month,
    year: year,
    utcMinute: utcMinute,
    utcHour: utcHour,
    utcDay: utcDay,
    utcMonth: utcMonth,
    utcYear: utcYear
};

exports.AgChart = AgChart;
exports.AgChartV2 = AgChartV2;
exports.Arc = Arc;
exports.AreaSeries = AreaSeries;
exports.AreaSeriesTooltip = AreaSeriesTooltip;
exports.BandScale = BandScale;
exports.BarSeries = BarSeries;
exports.BarSeriesLabel = BarSeriesLabel;
exports.BarSeriesTooltip = BarSeriesTooltip;
exports.Caption = Caption;
exports.CartesianChart = CartesianChart;
exports.CategoryAxis = CategoryAxis;
exports.Chart = Chart;
exports.ChartAxis = ChartAxis;
exports.ChartTheme = ChartTheme;
exports.ChartTooltip = ChartTooltip;
exports.ClipRect = ClipRect;
exports.DropShadow = DropShadow;
exports.Group = Group;
exports.GroupedCategoryAxis = GroupedCategoryAxis;
exports.GroupedCategoryChart = GroupedCategoryChart;
exports.HierarchyChart = HierarchyChart;
exports.HistogramBin = HistogramBin;
exports.HistogramSeries = HistogramSeries;
exports.HistogramSeriesTooltip = HistogramSeriesTooltip;
exports.Legend = Legend;
exports.LegendItem = LegendItem;
exports.LegendLabel = LegendLabel;
exports.LegendMarker = LegendMarker;
exports.Line = Line;
exports.LineSeries = LineSeries;
exports.LineSeriesTooltip = LineSeriesTooltip;
exports.LinearScale = LinearScale;
exports.Marker = Marker;
exports.NumberAxis = NumberAxis;
exports.Padding = Padding;
exports.Path = Path;
exports.PieSeries = PieSeries;
exports.PieSeriesTooltip = PieSeriesTooltip;
exports.PieTitle = PieTitle;
exports.PolarChart = PolarChart;
exports.Rect = Rect;
exports.ScatterSeries = ScatterSeries;
exports.ScatterSeriesTooltip = ScatterSeriesTooltip;
exports.Scene = Scene;
exports.Sector = Sector;
exports.Shape = Shape;
exports.TimeAxis = TimeAxis;
exports.TreemapSeries = TreemapSeries;
exports.TreemapSeriesLabel = TreemapSeriesLabel;
exports.TreemapSeriesTooltip = TreemapSeriesTooltip;
exports.clamper = clamper$1;
exports.copy = copy;
exports.extent = extent;
exports.find = find;
exports.findIndex = findIndex;
exports.findMinMax = findMinMax;
exports.flipChartAxisDirection = flipChartAxisDirection;
exports.getChartTheme = getChartTheme;
exports.mergeOptions = mergeOptions;
exports.normalizeAngle180 = normalizeAngle180;
exports.normalizeAngle360 = normalizeAngle360;
exports.normalizeAngle360Inclusive = normalizeAngle360Inclusive;
exports.themes = themes;
exports.time = time;
exports.toDegrees = toDegrees;
exports.toRadians = toRadians;
exports.toTooltipHtml = toTooltipHtml;