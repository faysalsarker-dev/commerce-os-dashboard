// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getComponentName(WrappedComponent: React.ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component"
}