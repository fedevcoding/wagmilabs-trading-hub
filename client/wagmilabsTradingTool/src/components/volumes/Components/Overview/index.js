import { BarChart, Col, Row } from "../../../utility-components";
import "./style.css";

export const Overview = ({ marketplaces }) => {
  const values = [4561, 1276, 1007, 746, 42];

  return (
    <div className="overview">
      <Row>
        <Col>
          <BarChart
            title="Trading Size"
            subTitle="The ranking of top marketplaces by the volume over the selected time range."
            yAxisText="Quantity"
            tooltipSuffix=" ETH"
            values={{
              labels: marketplaces,
              values,
            }}
          />
        </Col>
        <Col>
          <BarChart
            title="Traders"
            subTitle="The ranking of top marketplaces by the number of traders, buyers and sellers over the selected time range."
            yAxisText="Quantity"
            tooltipSuffix=" ETH"
            values={{
              labels: marketplaces,
              values,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
