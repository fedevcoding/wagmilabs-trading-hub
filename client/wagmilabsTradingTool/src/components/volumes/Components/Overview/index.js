import { Col, Row } from "../../../utility-components";
import { Volumes, Traders } from "./Components";
import "./style.css";

export const Overview = ({ marketplaces }) => {
  return (
    <div className="overview">
      <Row>
        <Col>
          <Volumes marketplaces={marketplaces} />
        </Col>
        <Col>
          <Traders marketplaces={marketplaces} />
        </Col>
      </Row>
    </div>
  );
};
