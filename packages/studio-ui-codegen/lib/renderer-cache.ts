/**
 * This is used to cache previously rendered components.
 * If we have already compiled a component by its id, we
 * want to reuse that rather than render it again.
 */
export class RendererCache {
  #renderCache: Map<string, any> = new Map();

  addToCache(id: string, componentInfo: any) {
    this.#renderCache.set(id, componentInfo);
  }

  getIfExists(id: string): any {
    return this.#renderCache.get(id);
  }
}
