import { Container } from "@shared/components/layout";

export function ChartContainer({ chartId, children }) {
  return (
    <Container
      id={`${chartId}-container`}
      className="group flex-col !h-full !min-w-0 select-none !py-2"
      childClassName="!gap-1 !h-full min-w-0"
    >
      <div className="grid-item-drag invisible group-hover:visible absolute cursor-move bg-inherit text-(--text) p-1 text-xs top-0 left-1/2 rotate-90 box-border">
        ⠿
      </div>

      {children}
    </Container>
  );
}
