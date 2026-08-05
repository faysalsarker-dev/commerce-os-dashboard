import { Link, useLocation } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Inventory",
  products: "Products",
  orders: "Orders",
  customers: "Customers",
  settings: "Settings",
  users: "Users",
  analytics: "Analytics",
};

export function HeaderBreadcrumbs() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          const label =
            routeLabels[segment] ??
            segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={href}/>}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}