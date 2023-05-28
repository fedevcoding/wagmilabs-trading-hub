import moment from "moment";
import React from "react";

export const OrderInfo = ({ order }) => (
  <>
    <p className="label">
      <b>Market:</b> {order.source.name}
    </p>
    <p className="label">
      <b>Maker:</b> <small>{order.maker}</small>
    </p>
    <p className="label">
      <b>Valid until:</b>{" "}
      {`${moment(order.validUntil * 1000)
        .utc()
        .format("MMM DD, YYYY HH:mm")} GMT`}
    </p>
    <p className="label">
      <b>Price:</b>
      {" " + order.price.amount.native + " " + order.price.currency.symbol}
      {` (${order.price.amount.usd.toLocaleString("EN-us", {
        maximumFractionDigits: 2,
      })}$)`}
    </p>
    <p className="label">
      <b>Net price:</b>
      {" " + order.price.netAmount.native + " " + order.price.currency.symbol}
      {` (${order.price.netAmount.usd.toLocaleString("EN-us", {
        maximumFractionDigits: 2,
      })}$)`}
    </p>
  </>
);
