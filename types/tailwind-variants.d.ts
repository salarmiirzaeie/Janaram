// @gluestack-ui/nativewind-utils ships TypeScript sources that import this path,
// but tailwind-variants is only a transitive dependency without that subpath's types.
declare module "tailwind-variants/dist/config" {
  export type TVConfig = Record<string, unknown>;
}
