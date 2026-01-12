var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const GROWTH = 1.1;
class Node {
  // Null if a leaf node
  constructor(x, y, w, h) {
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "w");
    __publicField(this, "h");
    __publicField(this, "points");
    // Null if not a leaf node
    __publicField(this, "children");
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.points = [];
    this.children = null;
  }
  // Check if this node spatially contains a specific point
  containsPoint(point) {
    return point.x >= this.x && point.x <= this.x + this.w && point.y >= this.y && point.y <= this.y + this.h;
  }
  // Check if this node overlaps with a search area (AABB)
  overlaps(aabb) {
    return aabb.x < this.x + this.w && aabb.x + aabb.w > this.x && aabb.y < this.y + this.h && aabb.y + aabb.h > this.y;
  }
  insert(point, maxPoints) {
    if (this.children != null) {
      const col = point.x > this.x + this.w / 2 ? 1 : 0;
      const row = point.y > this.y + this.h / 2 ? 1 : 0;
      this.children[col + row * 2].insert(point, maxPoints * GROWTH);
    } else {
      this.points.push(point);
      if (this.points.length > maxPoints && this.w > 1) {
        this.split(maxPoints);
      }
    }
  }
  some(aabb, test) {
    if (this.children != null) {
      for (let i = 0; i < this.children.length; ++i) {
        const child = this.children[i];
        if (child.overlaps(aabb) && child.some(aabb, test)) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this.points.length; ++i) {
        const point = this.points[i];
        const inSearchBox = point.x >= aabb.x && point.x <= aabb.x + aabb.w && point.y >= aabb.y && point.y <= aabb.y + aabb.h;
        if (inSearchBox && test(point)) {
          return true;
        }
      }
    }
    return false;
  }
  split(maxPoints) {
    this.children = [];
    const halfW = this.w / 2;
    const halfH = this.h / 2;
    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 2; ++x) {
        const px = this.x + x * halfW;
        const py = this.y + y * halfH;
        this.children.push(new Node(px, py, halfW, halfH));
      }
    }
    const oldPoints = this.points;
    this.points = null;
    const midX = this.x + halfW;
    const midY = this.y + halfH;
    for (let i = 0; i < oldPoints.length; ++i) {
      const point = oldPoints[i];
      const col = point.x > midX ? 1 : 0;
      const row = point.y > midY ? 1 : 0;
      this.children[col + row * 2].insert(point, maxPoints * GROWTH);
    }
  }
  clear() {
    if (this.children != null) {
      for (let i = 0; i < 4; ++i) {
        this.children[i].clear();
      }
      this.children.length = 0;
      this.children = null;
    }
    if (this.points) {
      this.points.length = 0;
      this.points = null;
    }
  }
}
export class PointQuadTree {
  constructor(x, y, w, h, maxPoints) {
    __publicField(this, "root");
    __publicField(this, "maxPoints");
    this.root = new Node(x, y, w, h);
    this.maxPoints = maxPoints;
  }
  clear() {
    const { x, y, w, h } = this.root;
    this.root.clear();
    this.root = new Node(x, y, w, h);
  }
  insert(point) {
    if (!this.root.containsPoint(point)) return;
    this.root.insert(point, this.maxPoints);
  }
  some(aabb, test) {
    return this.root.some(aabb, test);
  }
}
