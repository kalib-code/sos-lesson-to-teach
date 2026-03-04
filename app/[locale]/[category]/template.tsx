import DirectionalTransition from "@/components/layout/DirectionalTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <DirectionalTransition>{children}</DirectionalTransition>;
}
