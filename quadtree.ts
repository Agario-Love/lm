/**
 * Point QuadTree Implementation
 * Optimized for spatial indexing of points
 */

// Basic interface for any object with coordinates
interface Point {
  x: number;
  y: number;
}

// Interface for the bounding box used in searches
interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Global constant for tree depth growth factor
const GROWTH = 1.1;

class Node {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public points: Point[] | null; // Null if not a leaf node
  public children: Node[] | null; // Null if a leaf node

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.points = [];
    this.children = null;
  }

  // Check if this node spatially contains a specific point
  containsPoint(point: Point): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.w &&
      point.y >= this.y &&
      point.y <= this.y + this.h
    );
  }

  // Check if this node overlaps with a search area (AABB)
  overlaps(aabb: AABB): boolean {
    return (
      aabb.x < this.x + this.w &&
      aabb.x + aabb.w > this.x &&
      aabb.y < this.y + this.h &&
      aabb.y + aabb.h > this.y
    );
  }

  insert(point: Point, maxPoints: number): void {
    // If we have children, push down to them
    if (this.children != null) {
      const col = point.x > this.x + this.w / 2 ? 1 : 0;
      const row = point.y > this.y + this.h / 2 ? 1 : 0;
      this.children[col + row * 2].insert(point, maxPoints * GROWTH);
    } else {
      // We are a leaf, add to local points
      this.points!.push(point);

      // Split if we exceed capacity and aren't too small
      if (this.points!.length > maxPoints && this.w > 1) {
        this.split(maxPoints);
      }
    }
  }

  some(aabb: AABB, test: (point: Point) => boolean): boolean {
    if (this.children != null) {
      // Recursive search through children
      for (let i = 0; i < this.children.length; ++i) {
        const child = this.children[i];
        if (child.overlaps(aabb) && child.some(aabb, test)) {
          return true;
        }
      }
    } else {
      // Leaf search
      // The original code used `Node.prototype.containsPoint.call(aabb, point)`
      // effectively checking if the point is inside the AABB. We write that explicitly here.
      for (let i = 0; i < this.points!.length; ++i) {
        const point = this.points![i];
        // Check if point is inside the search box (aabb)
        const inSearchBox = point.x >= aabb.x &&
          point.x <= aabb.x + aabb.w &&
          point.y >= aabb.y &&
          point.y <= aabb.y + aabb.h;

        if (inSearchBox && test(point)) {
          return true;
        }
      }
    }
    return false;
  }

  split(maxPoints: number): void {
    this.children = [];
    const halfW = this.w / 2;
    const halfH = this.h / 2;

    // Create 4 children
    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 2; ++x) {
        const px = this.x + x * halfW;
        const py = this.y + y * halfH;
        this.children.push(new Node(px, py, halfW, halfH));
      }
    }

    // Redistribute existing points to new children
    const oldPoints = this.points!;
    this.points = null; // Mark as non-leaf (points array gone)

    const midX = this.x + halfW;
    const midY = this.y + halfH;

    for (let i = 0; i < oldPoints.length; ++i) {
      const point = oldPoints[i];
      const col = point.x > midX ? 1 : 0;
      const row = point.y > midY ? 1 : 0;
      this.children[col + row * 2].insert(point, maxPoints * GROWTH);
    }
  }

  clear(): void {
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
  public root: Node;
  public maxPoints: number;

  constructor(x: number, y: number, w: number, h: number, maxPoints: number) {
    this.root = new Node(x, y, w, h);
    this.maxPoints = maxPoints;
  }

  clear(): void {
    // Original implementation effectively destroyed the tree structure.
    // To allow reuse, we reset the root to a fresh empty node with same dimensions.
    const { x, y, w, h } = this.root;
    this.root.clear();
    this.root = new Node(x, y, w, h);
  }

  insert(point: Point): void {
    if (!this.root.containsPoint(point)) return;
    this.root.insert(point, this.maxPoints);
  }

  some(aabb: AABB, test: (point: Point) => boolean): boolean {
    return this.root.some(aabb, test);
  }
}