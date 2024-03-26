import { AdminHeader } from "~/components/Header/AdminHeader";
import { BRAND_NAME } from "../../lib/constants";

export const metadata = {
  title: {
    template: "%s | gestion",
    default: "gestion",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <main>{children}</main>
    </>
  );
}
