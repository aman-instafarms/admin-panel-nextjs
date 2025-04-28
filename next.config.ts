import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
};

export default withFlowbiteReact(nextConfig);
