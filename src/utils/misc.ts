import EmptyView from "@/views/EmptyView.vue"
import type { Component } from "vue"
import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router"

export function makeRoute(
  path: string,
  name: string,
  component: Component = EmptyView,
  children?: RouteRecordRaw[],
  beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[],
): RouteRecordRaw {
  return {
    path,
    name,
    component,
    children,
    beforeEnter,
  }
}
