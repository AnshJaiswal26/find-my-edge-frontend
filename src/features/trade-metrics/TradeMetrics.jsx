import { tradeData } from "@data";
import { Container } from "@layout";
import { Table } from "./table/Table";

export default function TradeMetrics() {
  const data = tradeData.map(Object.values);
  // return (
  //   <Container>
  //     <Table tableHead={Object.keys(tradeData[0])} tableBody={data} />
  //   </Container>
  // );

  return <Table />;
}
