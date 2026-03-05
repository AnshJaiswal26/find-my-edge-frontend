import { PAGE_CONFIG } from "./pageConfig";

export function getPageByRoute(pathname) {
  return Object.values(PAGE_CONFIG).find((page) => page.route === pathname);
}
