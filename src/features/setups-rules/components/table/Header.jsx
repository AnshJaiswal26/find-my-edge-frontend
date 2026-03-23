import { RowWrapper } from "../layout";
import { HeaderCell } from "./HeaderCell";

export function Header({ id, tableRef }) {
  return (
    <RowWrapper className="sticky top-0 z-25" header={true}>
      {["Field", "Rule", "Expected", "Tag"].map((text, i) => (
        <HeaderCell
          key={i}
          text={text}
          index={i}
          setupId={id}
          tableRef={tableRef}
        />
      ))}
    </RowWrapper>
  );
}
