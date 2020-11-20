import React from "react";
import OrderSuccess from "../components/OrderSuccess";
import LinkSuccess from "../components/LinkSuccess";

export default function Success({ route }) {
  console.log("sucess props received", route.params);
  return route.params.feature == "order" ? (
    <OrderSuccess success={route.params.data} />
  ) : (
    <LinkSuccess success={route.params.data} />
  );
}
