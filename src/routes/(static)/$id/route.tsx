import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(static)/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
