import type { MetaFunction } from "@remix-run/node";
import "~/styles/root.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Xinyu Feng" },
    { name: "description", content: "Welcome to my page!" },
  ];
};

export default function Index() {
  return (
    <div className="container">
      <h1>Beautiful Home</h1>
    </div>
  );
}
